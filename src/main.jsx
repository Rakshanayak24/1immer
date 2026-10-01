import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { ArrowDownToLine, ArrowRight, Box, Check, ChevronDown, CircleHelp, Command, Cuboid, Github, Info, LoaderCircle, Maximize2, MousePointer2, Plus, RotateCcw, Sparkles, WandSparkles, X } from 'lucide-react';
import './style.css';

const palette = { violet: 0xa38aff, mint: 0x9bd8bf, coral: 0xff956e, blue: 0x87b9ff, gold: 0xeac878, pink: 0xf2a1c4, cream: 0xe9e1d3 };
const examples = ['A little robot gardener with a flower in its hand', 'A sleek retro rocket ship with round windows', 'A cozy modern house with a slanted roof', 'A sculptural vase with a wavy silhouette'];

function buildModel(prompt) {
  const text = prompt.toLowerCase();
  const group = new THREE.Group(); group.name = prompt.slice(0, 60);
  const material = (color, roughness = .48, metalness = .08) => new THREE.MeshStandardMaterial({ color, roughness, metalness });
  const main = material(/pink|rose/.test(text) ? palette.pink : /green|forest|plant|garden/.test(text) ? palette.mint : /blue|ocean|space/.test(text) ? palette.blue : /gold|yellow|sun/.test(text) ? palette.gold : /orange|coral|red/.test(text) ? palette.coral : palette.violet);
  const light = material(palette.cream), dark = material(0x282730, .3, .5), leaf = material(palette.mint), accent = material(palette.coral);
  const add = (geo, mat, pos, rot) => { const m = new THREE.Mesh(geo, mat); m.position.set(...pos); if (rot) m.rotation.set(...rot); m.castShadow = true; m.receiveShadow = true; group.add(m); return m; };
  const box = (s, mat, p, r) => add(new THREE.BoxGeometry(...s), mat, p, r);
  const sphere = (s, mat, p) => add(new THREE.SphereGeometry(1, 32, 24), mat, p).scale.set(...s);
  const cyl = (rt, rb, h, mat, p, n=32) => add(new THREE.CylinderGeometry(rt, rb, h, n), mat, p);
  const torus = (r, t, mat, p, rot=[Math.PI/2,0,0]) => add(new THREE.TorusGeometry(r,t,12,36),mat,p,rot);
  const ground = material(0x5c554c);
  const robot = /robot|android|bot|droid/.test(text), plant = /plant|flower|cactus|tree|garden/.test(text), house = /house|cabin|home|building/.test(text), rocket = /rocket|spaceship|ship|spacecraft/.test(text), vase = /vase|vessel|pot|bottle/.test(text), car = /car|vehicle|truck|van/.test(text), sword = /sword|blade|dagger/.test(text);
  if (robot) {
    box([1.12,1.13,.72],main,[0,.05,0]); box([.95,.24,.78],light,[0,.5,.02]);
    box([.9,.66,.62],main,[0,1.04,0]); box([.68,.3,.12],dark,[0,1.07,.33]); sphere([.075,.075,.045],light,[-.19,1.07,.41]); sphere([.075,.075,.045],light,[.19,1.07,.41]); box([.26,.08,.08],accent,[0,.87,.4]);
    box([.25,.8,.3],light,[-.73,.07,0],[0,0,-.08]);box([.25,.8,.3],light,[.73,.07,0],[0,0,.08]);box([.3,.67,.38],main,[-.74,-.55,0]);box([.3,.67,.38],main,[.74,-.55,0]);
    cyl(.1,.1,.18,dark,[0,1.53,0]);sphere([.12,.12,.12],accent,[0,1.65,0]);
    if (plant || /flower/.test(text)) { cyl(.035,.045,.48,leaf,[1.02,.45,0]); sphere([.18,.2,.08],accent,[1.02,.73,0]);for(let i=0;i<5;i++){let a=i*Math.PI*2/5;sphere([.1,.13,.07],material(palette.pink),[1.02+Math.cos(a)*.16,.73+Math.sin(a)*.16,0]);} }
  } else if (plant) {
    cyl(.58,.42,.7,accent,[0,-.7,0]);torus(.48,.045,light,[0,-.34,0]);cyl(.035,.05,1,leaf,[0,.47,0]);
    for(let i=0;i<7;i++){let a=i*2.4, h=.06+(i%3)*.2;let l=sphere([.3,.1,.11],leaf,[Math.cos(a)*.35,h,Math.sin(a)*.35]);l.rotation.z=-Math.cos(a)*.35;l.rotation.y=a;}
    sphere([.17,.17,.17],accent,[0,1.05,0]);for(let i=0;i<5;i++){let a=i*Math.PI*2/5;sphere([.12,.17,.12],light,[Math.cos(a)*.22,1.05+Math.sin(a)*.22,0]);}
  } else if (house) {
    box([1.6,1.1,1.25],light,[0,.05,0]);
    const roofMat=main; const roofL=add(new THREE.BoxGeometry(1.02,.16,1.5),roofMat,[-.39,.86,0],[0,0,-.55]);const roofR=add(new THREE.BoxGeometry(1.02,.16,1.5),roofMat,[.39,.86,0],[0,0,.55]);
    box([.42,.73,.08],accent,[0,-.13,.65]); for(let x of [-.52,.52]){box([.28,.34,.08],palette.blue?material(palette.blue):main,[x,.19,.66]);}
  } else if (rocket) {
    cyl(.48,.48,1.8,light,[0,0,0]);add(new THREE.ConeGeometry(.48,.82,32),main,[0,1.31,0]);add(new THREE.ConeGeometry(.38,.65,3),accent,[0,-.98,0],[0,0,Math.PI]);
    for(let z of [-.44,.44]){let fin=add(new THREE.BoxGeometry(.18,.8,.14),main,[0,-.57,z],[0,0,.42]);}
    torus(.19,.055,accent,[0,.35,.44]); sphere([.09,.09,.06],dark,[0,.35,.46]);
  } else if (vase) {
    const profile=[[.18,-1],[.5,-.8],[.62,-.2],[.46,.35],[.26,.73],[.3,1],[.43,1]];
    const geo=new THREE.LatheGeometry(profile.map(([x,y])=>new THREE.Vector2(x,y)),64);add(geo,main,[0,0,0]);torus(.39,.04,light,[0,1,0],[0,0,0]);
  } else if (car) {
    box([1.7,.44,.8],main,[0,-.14,0]);box([.95,.44,.68],light,[-.12,.3,0],[0,0,-.04]);
    for(let x of [-.56,.57])for(let z of [-.43,.43]){cyl(.22,.22,.12,dark,[x,-.38,z],32).rotation.x=Math.PI/2;torus(.13,.035,light,[x,-.38,z],[Math.PI/2,0,0]);}
  } else if (sword) {
    add(new THREE.ConeGeometry(.2,1.8,4),light,[0,.67,0],[0,0,0]);box([.72,.11,.13],accent,[0,-.33,0]);cyl(.11,.12,.55,main,[0,-.69,0]);sphere([.16,.16,.16],goldMesh(),[0,-1,0]);
    function goldMesh(){return material(palette.gold)}
  } else {
    // A prompt-shaped collectible: a sculpted core, orbit, and characteristic fins.
    sphere([.73,.8,.67],main,[0,.18,0]);box([.85,.24,.6],light,[0,-.18,0],[0,0,.12]);sphere([.2,.2,.2],accent,[0,.94,0]);
    for(let i=0;i<3;i++){let a=i*2*Math.PI/3;box([.18,.65,.18],main,[Math.cos(a)*.72,.05,Math.sin(a)*.72],[0,-a,.3]);}
    torus(.98,.025,light,[0,.16,0],[.25,.4,0]);
  }
  // A small presentation plinth anchors every generated object in the studio.
  cyl(.9,.9,.13,ground,[0,-1.24,0],64);cyl(.82,.82,.06,material(0x787166),[0,-1.15,0],64);
  group.userData.category = robot?'ROBOT':plant?'BOTANICAL':house?'ARCHITECTURE':rocket?'VEHICLE':vase?'SCULPTURE':car?'VEHICLE':sword?'OBJECT':'CONCEPT';
  return group;
}

function Viewer({ prompt, version, onReady }) {
  const host=useRef(null), api=useRef(null);
  useEffect(()=>{
    const el=host.current, scene=new THREE.Scene();scene.background=new THREE.Color('#191a18');scene.fog=new THREE.Fog('#191a18',8,18);
    const camera=new THREE.PerspectiveCamera(36,1,.1,100);camera.position.set(4.2,3.2,5.3);
    const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,preserveDrawingBuffer:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;el.appendChild(renderer.domElement);
    const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.055;controls.minDistance=2.4;controls.maxDistance=11;controls.maxPolarAngle=Math.PI*.84;
    scene.add(new THREE.HemisphereLight(0xc9d9f1,0x342d27,2.2));const key=new THREE.DirectionalLight(0xffe8cb,3.5);key.position.set(3,6,4);key.castShadow=true;scene.add(key);const fill=new THREE.PointLight(0x9b84ff,18,9);fill.position.set(-3,1,2);scene.add(fill);
    const floor=new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.MeshStandardMaterial({color:0x191a18,roughness:.92}));floor.rotation.x=-Math.PI/2;floor.position.y=-1.32;floor.receiveShadow=true;scene.add(floor);
    const grid=new THREE.GridHelper(10,22,0x43413d,0x302f2c);grid.position.y=-1.315;grid.material.transparent=true;grid.material.opacity=.35;scene.add(grid);
    const resize=()=>{const w=el.clientWidth,h=el.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/Math.max(h,1);camera.updateProjectionMatrix();};const ro=new ResizeObserver(resize);ro.observe(el);resize();
    let anim;const loop=()=>{anim=requestAnimationFrame(loop);controls.update();renderer.render(scene,camera)};loop();
    api.current={scene,camera,controls,renderer};onReady?.(api);
    return()=>{cancelAnimationFrame(anim);ro.disconnect();controls.dispose();renderer.dispose();el.removeChild(renderer.domElement);api.current=null;};
  },[]);
  useEffect(()=>{const a=api.current;if(!a||!prompt)return;const old=a.scene.getObjectByName('__model__');if(old){a.scene.remove(old);old.traverse(o=>{o.geometry?.dispose();if(o.material){(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m.dispose())}})}const m=buildModel(prompt);m.name='__model__';a.scene.add(m);a.controls.target.set(0,0,0);a.controls.update();},[prompt,version]);
  return <div className="viewer" ref={host}/>;
}

function App(){
  const [prompt,setPrompt]=useState('A little robot gardener with a flower in its hand'),[draft,setDraft]=useState('A little robot gardener with a flower in its hand'),[generating,setGenerating]=useState(false),[version,setVersion]=useState(0),[toast,setToast]=useState('');const [apiRef,setApiRef]=useState(null);
  const notify=(s)=>{setToast(s);setTimeout(()=>setToast(''),2600)};
  const generate=()=>{const p=draft.trim();if(!p||generating)return;setGenerating(true);setTimeout(()=>{setPrompt(p);setVersion(v=>v+1);setGenerating(false)},700)};
  const download=()=>{if(!apiRef?.current){notify('Your model is still loading');return}new GLTFExporter().parse(apiRef.current.scene.getObjectByName('__model__'),(data)=>{const blob=new Blob([data],{type:'model/gltf-binary'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`${prompt.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'').slice(0,36)||'formforge-model'}.glb`;a.click();URL.revokeObjectURL(url);notify('Your 3D model is ready')},(err)=>notify('Could not export this model'),{binary:true});};
  return <div className="app-shell">
    <header className="topbar"><a className="brand" href="#"><span className="brand-mark"><Cuboid size={20}/></span><span>formforge<span className="brand-dot">.</span></span><span className="beta">BETA</span></a><div className="top-center"><span className="status-dot"/>ALL SYSTEMS OPERATIONAL</div><div className="top-actions"><button className="icon-button help" onClick={()=>notify('Describe a shape, then orbit the preview to explore it.')} aria-label="Help"><CircleHelp size={17}/></button><a className="github-link" href="https://github.com" target="_blank" rel="noreferrer"><Github size={17}/><span>Source</span></a><button className="avatar">R</button></div></header>
    <main className="workspace"><aside className="sidebar"><div className="eyebrow"><span className="eyebrow-line"/>YOUR CREATIVE STUDIO</div><h1>Make the<br/>imaginary <span>real.</span></h1><p className="intro">A thought is all it takes. Describe what you see, and we'll shape it into a 3D form.</p>
      <div className="field-label"><span>01</span> DESCRIBE YOUR MODEL <span className="optional">BE SPECIFIC</span></div><div className="prompt-wrap"><textarea value={draft} onChange={e=>setDraft(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&(e.ctrlKey||e.metaKey)){e.preventDefault();generate()}}} maxLength={240} placeholder="A tiny house on the moon..."/><div className="textarea-foot"><span><WandSparkles size={13}/> Let your imagination wander</span><span>{draft.length}/240</span></div></div>
      <div className="suggest-head"><span>NEED A SPARK?</span><button onClick={()=>setDraft(examples[Math.floor(Math.random()*examples.length)])}><RotateCcw size={12}/> SURPRISE ME</button></div><div className="suggestions">{examples.slice(0,3).map((s,i)=><button key={s} className="suggestion" onClick={()=>setDraft(s)}><span className="suggest-index">0{i+1}</span><span>{s}</span><ArrowRight size={14}/></button>)}</div>
      <button className="generate-button" disabled={!draft.trim()||generating} onClick={generate}>{generating?<><LoaderCircle className="spin" size={17}/> SHAPING YOUR IDEA...</>:<><Sparkles size={16} fill="currentColor"/> GENERATE MODEL <span className="shortcut"><Command size={12}/> ↵</span></>}</button><div className="generate-note"><span className="spark-mini">✳</span> Your model is created right here, in your browser.</div>
      <div className="sidebar-bottom"><div className="tip-card"><div className="tip-icon"><Info size={15}/></div><div><strong>A little detail goes a long way</strong><p>Try a material, a mood, or a tiny detail to make it yours.</p></div></div><div className="credit">MADE FOR CURIOUS MINDS <span>✳</span></div></div>
    </aside>
    <section className="stage"><div className="stage-top"><div><div className="stage-label"><span className="live-dot"/> LIVE PREVIEW <span className="stage-sep">/</span> <span className="muted">SCENE 01</span></div><div className="model-name">{prompt}</div></div><button className="more-button" onClick={()=>notify('Orbit: drag · Zoom: scroll · Pan: right-drag')}><MousePointer2 size={14}/> CONTROLS <ChevronDown size={13}/></button></div>
      <div className="viewport"><Viewer prompt={prompt} version={version} onReady={setApiRef}/><div className="viewport-vignette"/><div className="scene-tag"><span className="scene-cube"><Box size={13}/></span><span><b>01</b><small>{prompt.length>24?prompt.slice(0,24)+'…':prompt}</small></span></div><div className="view-tools"><button title="Reset camera" onClick={()=>{const c=apiRef?.current;if(c){c.camera.position.set(4.2,3.2,5.3);c.controls.target.set(0,0,0);c.controls.update()}}}><RotateCcw size={16}/></button><span className="tool-divider"/><button title="Interaction guide" onClick={()=>notify('Drag to rotate · scroll to zoom · right-drag to pan')}><MousePointer2 size={16}/></button><span className="tool-divider"/><button title="Expand preview" onClick={()=>document.querySelector('.viewport').requestFullscreen?.()}><Maximize2 size={16}/></button></div><div className="axis-widget"><span className="axis-y">Y</span><span className="axis-x">X</span><span className="axis-z">Z</span><i/></div><div className="drag-hint"><span className="drag-icon"><RotateCcw size={12}/></span> DRAG TO EXPLORE <span>·</span> SCROLL TO ZOOM</div></div>
      <div className="stage-bottom"><div className="model-meta"><div className="meta-icon"><Cuboid size={18}/></div><div><span>GENERATED FORM</span><strong>{prompt.split(/\s+/).slice(0,5).join(' ')}{prompt.split(/\s+/).length>5?'…':''}</strong></div><span className="category">{buildModel(prompt).userData.category}</span></div><button className="download-button" onClick={download}><ArrowDownToLine size={16}/> EXPORT MODEL <span>.GLB</span></button></div>
    </section></main>
    <footer className="footer"><span>© 2025 FORG EWORKS STUDIO</span><span className="footer-center">A SMALL TOOL FOR BIG IDEAS <span>✳</span></span><span className="footer-right">BUILT WITH <b>♥</b> & A LITTLE BIT OF CODE</span></footer>
    {toast&&<div className="toast"><Check size={15}/>{toast}</div>}
  </div>
}
createRoot(document.getElementById('root')).render(<App/>);
