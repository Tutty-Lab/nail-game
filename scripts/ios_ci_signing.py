"""CI-only Apple signing for Nail Play. Never prints credentials.

Imports the team's Apple Distribution identity into a throwaway keychain, then uses the
App Store Connect API to register the bundle ID and create a fresh App Store profile.
"""
import base64
import hashlib
import json
import os
import plistlib
import secrets
import shlex
import shutil
import subprocess
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(os.environ['RUNNER_TEMP']) / 'nailplay-signing'
BUNDLE = 'com.tuttylab.nailplay'
NAME = 'Nail Play'
TEAM = '5MNN7PQYBD'
PROFILE = 'Nail Play App Store CI'
API = 'https://api.appstoreconnect.apple.com/v1'


def command(*args, output=False):
    result = subprocess.run(args, capture_output=True)
    if result.returncode:
        # Commands can contain passwords; do not include argv/stdout in errors.
        raise RuntimeError(f'{args[0]} failed (exit {result.returncode})')
    return result.stdout if output else None


def token():
    import jwt  # PyJWT, installed by the workflow
    now = int(time.time())
    claims = {'iss': os.environ['ASC_ISSUER_ID'], 'iat': now, 'exp': now + 900, 'aud': 'appstoreconnect-v1'}
    return jwt.encode(claims, os.environ['ASC_API_KEY_P8'], algorithm='ES256', headers={'kid': os.environ['ASC_KEY_ID']})


def api(method, path, auth, body=None):
    request = urllib.request.Request(API + path, method=method, data=json.dumps(body).encode() if body else None,
                                     headers={'Authorization': 'Bearer ' + auth, 'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(request) as response:
            raw = response.read()
            return json.loads(raw) if raw else {}
    except urllib.error.HTTPError as error:
        detail = json.loads(error.read() or b'{}').get('errors', [{}])[0].get('detail', '')
        raise RuntimeError(f'App Store Connect {method} {path.split("?")[0]} failed ({error.code}): {detail}') from None


def ensure_profile(fingerprint):
    auth = token()
    found = api('GET', f'/bundleIds?filter[identifier]={BUNDLE}&filter[platform]=IOS', auth)['data']
    found = [b for b in found if b['attributes']['identifier'] == BUNDLE]
    if found:
        bundle_id = found[0]['id']
    else:
        body = {'data': {'type': 'bundleIds', 'attributes': {'identifier': BUNDLE, 'name': NAME, 'platform': 'IOS'}}}
        bundle_id = api('POST', '/bundleIds', auth, body)['data']['id']
        print('Registered bundle ID ' + BUNDLE)
    certificates = api('GET', '/certificates?filter[certificateType]=DISTRIBUTION,IOS_DISTRIBUTION&limit=200', auth)['data']
    match = [c for c in certificates
             if hashlib.sha1(base64.b64decode(c['attributes']['certificateContent'])).hexdigest().upper() == fingerprint]
    if not match:
        raise RuntimeError('The imported distribution certificate is not registered for this team')
    # Recreate the CI profile so it always carries the current certificate.
    for profile in api('GET', f'/profiles?filter[name]={urllib.parse.quote(PROFILE)}&limit=50', auth)['data']:
        api('DELETE', '/profiles/' + profile['id'], auth)
    body = {'data': {'type': 'profiles', 'attributes': {'name': PROFILE, 'profileType': 'IOS_APP_STORE'},
                     'relationships': {'bundleId': {'data': {'type': 'bundleIds', 'id': bundle_id}},
                                       'certificates': {'data': [{'type': 'certificates', 'id': match[0]['id']}]}}}}
    return base64.b64decode(api('POST', '/profiles', auth, body)['data']['attributes']['profileContent'])


def install():
    os.umask(0o077)
    ROOT.mkdir(mode=0o700)
    keychain = ROOT / 'build.keychain-db'
    p12 = ROOT / 'distribution.p12'
    p12.write_bytes(base64.b64decode(os.environ['IOS_DISTRIBUTION_P12_BASE64'], validate=True))
    original = shlex.split(command('security', 'list-keychains', '-d', 'user', output=True).decode())
    (ROOT / 'original-keychains.json').write_text(json.dumps(original))
    password = secrets.token_urlsafe(32)
    command('security', 'create-keychain', '-p', password, str(keychain))
    command('security', 'set-keychain-settings', '-lut', '21600', str(keychain))
    command('security', 'unlock-keychain', '-p', password, str(keychain))
    command('security', 'import', str(p12), '-P', os.environ['IOS_P12_PASSWORD'], '-A', '-t', 'cert', '-f', 'pkcs12', '-k', str(keychain))
    command('security', 'set-key-partition-list', '-S', 'apple-tool:,apple:,codesign:', '-s', '-k', password, str(keychain))
    command('security', 'list-keychains', '-d', 'user', '-s', str(keychain), *original)
    identities = command('security', 'find-identity', '-v', '-p', 'codesigning', str(keychain), output=True).decode()
    fingerprint = next((line.split()[1] for line in identities.splitlines()
                        if 'Apple Distribution' in line or 'iPhone Distribution' in line), None)
    if not fingerprint:
        raise RuntimeError('No distribution identity in the provided .p12')

    profile_path = ROOT / 'NailPlay.mobileprovision'
    profile_path.write_bytes(ensure_profile(fingerprint.upper()))
    data = plistlib.loads(command('security', 'cms', '-D', '-i', str(profile_path), output=True))
    if data['TeamIdentifier'] != [TEAM] or data['Entitlements']['application-identifier'] != TEAM + '.' + BUNDLE:
        raise RuntimeError('Provisioning profile belongs to another team/application')
    installed = []
    for directory in [Path.home() / 'Library/MobileDevice/Provisioning Profiles',
                      Path.home() / 'Library/Developer/Xcode/UserData/Provisioning Profiles']:
        directory.mkdir(parents=True, exist_ok=True)
        target = directory / (data['UUID'] + '.mobileprovision')
        shutil.copyfile(profile_path, target)
        installed.append(str(target))
    (ROOT / 'installed-profiles.json').write_text(json.dumps(installed))
    (ROOT / 'profile.json').write_text(json.dumps({'name': data['Name'], 'team': TEAM, 'uuid': data['UUID']}))
    keys = ROOT / 'private_keys'
    keys.mkdir(mode=0o700)
    (keys / ('AuthKey_' + os.environ['ASC_KEY_ID'] + '.p8')).write_text(os.environ['ASC_API_KEY_P8'])
    export = {'method': 'app-store-connect', 'teamID': TEAM, 'signingStyle': 'manual', 'signingCertificate': 'Apple Distribution',
              'provisioningProfiles': {BUNDLE: data['Name']}, 'uploadSymbols': True, 'manageAppVersionAndBuildNumber': False}
    (ROOT / 'ExportOptions.plist').write_bytes(plistlib.dumps(export))
    print('Installed isolated distribution identity and App Store profile for ' + BUNDLE)


def cleanup():
    original = ROOT / 'original-keychains.json'
    if original.exists():
        command('security', 'list-keychains', '-d', 'user', '-s', *json.loads(original.read_text()))
    keychain = ROOT / 'build.keychain-db'
    if keychain.exists():
        command('security', 'delete-keychain', str(keychain))
    profiles = ROOT / 'installed-profiles.json'
    if profiles.exists():
        for path in json.loads(profiles.read_text()):
            Path(path).unlink(missing_ok=True)
    if ROOT.exists():
        shutil.rmtree(ROOT)


if __name__ == '__main__':
    {'install': install, 'cleanup': cleanup}[sys.argv[1]]()
