// Ambient 3D salon backdrop. Three.js is bundled in vendor/ so the app runs offline.
export const themes={
  menu:{sky:['#ffe4ef','#f4e6fd'],items:['#f26ba2','#9868c9','#53bbaa','#f5bf58'],light:'#fff4f8'},
  morning:{sky:['#fff3e6','#ffe1ec'],items:['#f7a1b9','#ffd28a','#ffb5a1','#f26ba2'],light:'#fff8ec'},
  pastel:{sky:['#e9f8f3','#f3e9fd'],items:['#7fd6c4','#c7a4ec','#ffc2d9','#9fd0f5'],light:'#f6fffc'},
  sunset:{sky:['#ffd9c2','#f7c4dc'],items:['#ea8265','#f26ba2','#f5bf58','#a73561'],light:'#ffe9dc'},
  evening:{sky:['#e7dcf7','#cfc3ee'],items:['#9868c9','#69a7df','#f26ba2','#e0c7ff'],light:'#efe8ff'},
  neon:{sky:['#3b2450','#1f1836'],items:['#ff4fa3','#45e3d2','#ffe066','#b06bff'],light:'#ffb3e0'}
};
let api={setTheme(){}};
export const setTheme=name=>api.setTheme(name);
export async function installBackdrop(){
  const canvas=document.createElement('canvas');canvas.className='backdrop';canvas.setAttribute('aria-hidden','true');
  document.body.prepend(canvas);
  let THREE;
  try{THREE=await import('./vendor/three.module.min.js');}catch{canvas.remove();return;}
  let renderer;
  try{renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'low-power'});}catch{canvas.remove();return;}
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(40,1,.1,100);camera.position.set(0,0,18);
  scene.add(new THREE.HemisphereLight('#ffffff','#e7b8cc',2.2));
  const key=new THREE.DirectionalLight('#ffffff',2.4);key.position.set(4,8,10);scene.add(key);
  const glass=color=>new THREE.MeshPhysicalMaterial({color,roughness:.18,metalness:0,clearcoat:1,clearcoatRoughness:.08,sheen:.4});
  const capMaterial=new THREE.MeshStandardMaterial({color:'#5b3d58',roughness:.35,metalness:.3});
  const gold=new THREE.MeshStandardMaterial({color:'#f2c46a',roughness:.25,metalness:.8});
  const bottle=material=>{
    const group=new THREE.Group();
    const body=new THREE.Mesh(new THREE.CapsuleGeometry(.62,.7,6,16),material);group.add(body);
    const neck=new THREE.Mesh(new THREE.CylinderGeometry(.22,.26,.25,16),gold);neck.position.y=.82;group.add(neck);
    const cap=new THREE.Mesh(new THREE.CylinderGeometry(.24,.3,.9,16),capMaterial);cap.position.y=1.38;group.add(cap);
    return group;
  };
  const shapes=[
    material=>bottle(material),
    material=>new THREE.Mesh(new THREE.OctahedronGeometry(.62),material),
    material=>new THREE.Mesh(new THREE.TorusKnotGeometry(.4,.14,64,10),material),
    material=>new THREE.Mesh(new THREE.IcosahedronGeometry(.55,0),material)
  ];
  const materials=[0,1,2,3].map(()=>glass('#ffffff'));
  const floaters=[];
  for(let i=0;i<14;i++){
    const mesh=shapes[i%shapes.length](materials[i%4]);
    const scale=.6+Math.random()*.7;mesh.scale.setScalar(scale);
    mesh.userData={x:(Math.random()-.5)*20,y:(Math.random()-.5)*14,z:-2-Math.random()*8,speed:.15+Math.random()*.3,phase:Math.random()*6.28,spin:(Math.random()-.5)*.6};
    scene.add(mesh);floaters.push(mesh);
  }
  const sparkleGeometry=new THREE.BufferGeometry(),points=new Float32Array(240*3);
  for(let i=0;i<points.length;i+=3){points[i]=(Math.random()-.5)*26;points[i+1]=(Math.random()-.5)*18;points[i+2]=-Math.random()*10;}
  sparkleGeometry.setAttribute('position',new THREE.BufferAttribute(points,3));
  const sparkles=new THREE.Points(sparkleGeometry,new THREE.PointsMaterial({color:'#ffffff',size:.09,transparent:true,opacity:.85}));scene.add(sparkles);
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let target=themes.menu,current='';
  api.setTheme=name=>{
    if(name===current||!themes[name])return;current=name;target=themes[name];
    document.documentElement.style.setProperty('--sky-a',target.sky[0]);document.documentElement.style.setProperty('--sky-b',target.sky[1]);
    document.body.dataset.theme=name;
    materials.forEach((m,i)=>m.color.set(target.items[i]));sparkles.material.color.set(target.light);
    if(reduced)draw(0);
  };
  const resize=()=>{const w=innerWidth,h=innerHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();if(reduced)draw(0);};
  addEventListener('resize',resize);
  const draw=t=>{
    floaters.forEach(m=>{const d=m.userData;m.position.set(d.x+Math.sin(t*d.speed+d.phase)*.8,d.y+Math.cos(t*d.speed*.8+d.phase)*.9,d.z);m.rotation.set(t*d.spin*.5,t*d.spin+d.phase,Math.sin(t*.3+d.phase)*.4);});
    sparkles.rotation.z=t*.01;sparkles.material.opacity=.55+Math.sin(t*1.7)*.3;
    renderer.render(scene,camera);
  };
  api.setTheme('menu');resize();
  if(reduced)return;
  let frame=0;
  const tick=now=>{frame=requestAnimationFrame(tick);if(!document.hidden)draw(now/1000);};
  frame=requestAnimationFrame(tick);
  document.addEventListener('visibilitychange',()=>{cancelAnimationFrame(frame);if(!document.hidden)frame=requestAnimationFrame(tick);});
}
