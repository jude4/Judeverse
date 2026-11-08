'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { RoundedBox, Text, Line, Stars, useCursor } from '@react-three/drei';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { useStudioStore, type Section } from '@/store/useStudioStore';

type Props = { onError: () => void; reducedMotion: boolean };
const wood = '#4d3026';

const views: Record<Section, { position: [number,number,number]; look: [number,number,number] }> = {
  home:       { position: [8.4, 4.35, 10.0], look: [-0.6, 1.55, -0.6] },
  about:      { position: [1.0, 2.68, 3.85], look: [-0.65, 1.95, 0.1] },
  projects:   { position: [-2.1, 2.75, 5.7], look: [-5.2, 2.05, -3.0] },
  lab:        { position: [5.8, 3.1, 5.65], look: [3.5, 2.45, -1.35] },
  experience: { position: [6.0, 2.92, 6.7], look: [4.68, 2.3, 2.1] },
  skills:     { position: [-0.2, 3.3, 5.2], look: [-0.5, 1.85, -0.1] },
  contact:    { position: [-2.2, 2.8, 5.5], look: [-5.28, 1.6, 2.25] }
};

function CameraDirector({ reducedMotion }: { reducedMotion: boolean }) {
  const camera = useThree(s => s.camera);
  const section = useStudioStore(s => s.section);
  const entered = useStudioStore(s => s.entered);
  const anchor = useRef({ x: 9.5, y: 4.9, z: 12.5 });
  const focus = useRef({ x: -0.6, y: 1.6, z: -0.6 });
  const mouse = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: PointerEvent) => { mouse.current.x = (e.clientX/window.innerWidth - .5) * 2; mouse.current.y = (e.clientY/window.innerHeight - .5) * 2; };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);
  useEffect(() => {
    const target = views[section];
    const duration = reducedMotion ? 0 : entered ? 1.8 : 3.6;
    const a = gsap.to(anchor.current, { x: target.position[0], y: target.position[1], z: target.position[2], duration, ease: 'power3.inOut' });
    const b = gsap.to(focus.current, { x: target.look[0], y: target.look[1], z: target.look[2], duration, ease: 'power3.inOut' });
    return () => { a.kill(); b.kill(); };
  }, [section, entered, reducedMotion]);
  useFrame(() => {
    const factor = section === 'home' && !reducedMotion ? .15 : 0;
    camera.position.set(anchor.current.x + mouse.current.x*factor, anchor.current.y - mouse.current.y*factor*.5, anchor.current.z);
    camera.lookAt(focus.current.x, focus.current.y, focus.current.z);
  });
  return null;
}

function Hotspot({ at, name, onClick, color = '#e6c69c' }: { at: [number,number,number]; name: string; onClick: () => void; color?: string }) {
  const hover = useStudioStore(s=>s.hovered);
  const active = hover === name;
  const setHovered = useStudioStore(s=>s.setHovered);
  const ring = useRef<THREE.Mesh>(null);
  useCursor(active);
  useFrame((state, dt) => { if (ring.current) {ring.current.rotation.z += dt*.22; const s = (1 + Math.sin(state.clock.elapsedTime*2)*.065) * (active ? 1.25 : 1); ring.current.scale.setScalar(s);} });
  return <group position={at} onPointerOver={e => {e.stopPropagation();setHovered(name);}} onPointerOut={e=>{e.stopPropagation();setHovered(null);}} onClick={e=>{e.stopPropagation();onClick();}}>
    <mesh ref={ring} rotation={[Math.PI/2,0,0]}><torusGeometry args={[.19,.008,4,48]}/><meshBasicMaterial color={color} toneMapped={false} transparent opacity={active ? 1 : .65}/></mesh>
    <mesh><sphereGeometry args={[.065,16,16]}/><meshBasicMaterial color={color} toneMapped={false}/></mesh>
    <pointLight color={color} intensity={active ? 1.2 : .3} distance={1.2}/>
    {active && <Text fontSize={.13} color="#f7f1e7" anchorX="center" position={[0,.31,0]} outlineWidth={.004} outlineColor="#131820">{name.toUpperCase()}</Text>}
    <mesh visible={false}><sphereGeometry args={[.32,12,12]}/><meshBasicMaterial transparent opacity={0}/></mesh>
  </group>;
}

function useSkylineTexture(variant: number) {
  const tex = useMemo(() => {
    const canvas = document.createElement('canvas'); canvas.width=128; canvas.height=256;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = ['#142337','#18283a','#1d2937'][variant]; ctx.fillRect(0,0,128,256);
    for(let r=0;r<21;r++) for(let c=0;c<7;c++) {
      const v = (r*11+c*23+variant*37)%13;
      ctx.fillStyle = v<3 ? '#b7c7b5' : v<6 ? '#6c8391' : '#202f3f';
      if(v !== 11) ctx.fillRect(10+c*16, 9+r*12, 5, 7);
    }
    const t = new THREE.CanvasTexture(canvas); t.colorSpace = THREE.SRGBColorSpace; return t;
  },[variant]);
  useEffect(()=>()=>tex.dispose(),[tex]);
  return tex;
}
function CityBuildings({ variant, texture }: { variant: number; texture: THREE.Texture }) {
  const buildings = useMemo(() => Array.from({length: 20}, (_, i) => {
    const n = i + variant*21;
    return { x: -19+i*1.94 + (n%3)*.18, h: 3.1+((n*37)%13)*.56, z: -17.5-variant*7-(n%4)*1.3, w: 1.14+(n%5)*.19 };
  }), [variant]);
  return <group>{buildings.map((b,i) => <mesh key={i} position={[b.x,b.h/2-.65,b.z]}><boxGeometry args={[b.w,b.h,1.2]}/><meshStandardMaterial map={texture} emissiveMap={texture} emissive="#657f9c" emissiveIntensity={.31} roughness={1}/></mesh>)}</group>;
}
function Skyline() {
  const tex0=useSkylineTexture(0);
  const tex1=useSkylineTexture(1);
  const tex2=useSkylineTexture(2);
  return <group><CityBuildings variant={0} texture={tex0}/><CityBuildings variant={1} texture={tex1}/><CityBuildings variant={2} texture={tex2}/>
    <mesh position={[0,-.5,-26]}><planeGeometry args={[90,30]}/><meshBasicMaterial color="#101b2b"/></mesh>
  </group>;
}

function Architecture() {
  const night = useStudioStore(s=>s.nightMode);
  return <group>
    <mesh position={[0,-.14,0]} receiveShadow><boxGeometry args={[15.5,.28,10.8]}/><meshStandardMaterial color="#211d1d" roughness={.76}/></mesh>
    {Array.from({length:32},(_,i)=><mesh key={i} position={[-7.25+i*.47,.007,0]} receiveShadow><boxGeometry args={[.452,.022,10.7]}/><meshStandardMaterial color={i%4===0?'#49352d':i%3===0?'#4f3930':'#45332c'} roughness={.67} metalness={.04}/></mesh>)}
    <mesh position={[-7.72,2.6,0]} receiveShadow><boxGeometry args={[.22,5.2,11]}/><meshStandardMaterial color="#24292e" roughness={.94}/></mesh>
    <mesh position={[-4.83,2.62,-5.32]} receiveShadow><boxGeometry args={[6.0,5.25,.25]}/><meshStandardMaterial color="#283038" roughness={.94}/></mesh>
    <mesh position={[7.63,2.6,-1]}><boxGeometry args={[.18,5.2,8.8]}/><meshStandardMaterial color="#242d33" roughness={.78}/></mesh>
    <mesh position={[0,5.25,-.1]}><boxGeometry args={[15.5,.18,10.8]}/><meshStandardMaterial color="#263039" roughness={1}/></mesh>
    {/* Full-height framed panoramic glass */}
    <mesh position={[3.72,2.5,-5.31]}><planeGeometry args={[9.06,4.92]}/><meshPhysicalMaterial color="#9bb6c4" transparent opacity={.085} roughness={.06} metalness={.07} depthWrite={false}/></mesh>
    {[ -1.86, 1.2,4.3,7.45].map(x=><mesh key={x} position={[x,2.6,-5.16]}><boxGeometry args={[.085,5.2,.14]}/><meshStandardMaterial color="#13191f" metalness={.7} roughness={.35}/></mesh>)}
    {[.24,5.06].map(y=><mesh key={y} position={[2.85,y,-5.15]}><boxGeometry args={[9.3,.1,.13]}/><meshStandardMaterial color="#151d25" metalness={.65} roughness={.45}/></mesh>)}
    <mesh position={[2.85,2.68,-5.16]}><boxGeometry args={[9.3,.065,.13]}/><meshStandardMaterial color="#151d25" metalness={.6} roughness={.45}/></mesh>
    {/* warm lit wall strips */}
    <mesh position={[-1.8,2.65,-5.15]}><boxGeometry args={[.05,4.9,.05]}/><meshBasicMaterial color={night ? '#b27b48':'#ffbc70'}/></mesh>
    <mesh position={[-7.57,2.7,-1]}><boxGeometry args={[.04,4.7,.05]}/><meshBasicMaterial color="#725f51"/></mesh>
    {/* columns and ceiling slats */}
    {[ -6.9,-3.7,-.5,2.7,5.9].map(x=><mesh key={x} position={[x,5.12,0]}><boxGeometry args={[.13,.12,10.4]}/><meshStandardMaterial color="#363632" roughness={.75}/></mesh>)}
    <group position={[-.7,.03,1.65]}>
      <mesh receiveShadow><boxGeometry args={[5.3,.025,3.0]}/><meshStandardMaterial color="#343538" roughness={.98}/></mesh>
      {Array.from({length:15},(_,i)=><mesh key={i} position={[-2.5+i*.35,.016,0]}><boxGeometry args={[.018,.01,2.9]}/><meshStandardMaterial color="#454342" roughness={1}/></mesh>)}
    </group>
    <mesh position={[-4.3,.17,3.6]} receiveShadow><boxGeometry args={[2.3,.25,1.65]}/><meshStandardMaterial color="#343d39" roughness={1}/></mesh>
    <mesh position={[-4.3,.38,3.6]}><boxGeometry args={[2.16,.15,1.48]}/><meshStandardMaterial color="#555e52" roughness={1}/></mesh>
  </group>;
}
function Desk() {
  const navigate=useStudioStore(s=>s.navigate);
  return <group position={[-.65,0,.3]}>
    {/* slab top + legs */}
    <RoundedBox position={[0,1.18,0]} args={[4.45,.13,1.85]} radius={.055} smoothness={3} castShadow receiveShadow><meshStandardMaterial color={wood} roughness={.43} metalness={.05}/></RoundedBox>
    {[[-1.95,-.73],[1.95,-.73],[-1.95,.73],[1.95,.73]].map(([x,z],i)=><mesh key={i} position={[x,.56,z]} castShadow><boxGeometry args={[.092,1.1,.09]}/><meshStandardMaterial color="#191d20" metalness={.65} roughness={.36}/></mesh>)}
    {/* Main monitor */}
    <group position={[-.45,2.06,-.53]} onClick={e=>{e.stopPropagation();navigate('about')}} onPointerOver={e=>{e.stopPropagation();document.body.style.cursor='pointer'}} onPointerOut={()=>{document.body.style.cursor='auto'}}>
      <RoundedBox args={[2.23,1.30,.105]} radius={.055} smoothness={3} castShadow><meshStandardMaterial color="#11161c" metalness={.64} roughness={.24}/></RoundedBox>
      <mesh position={[0,0,.061]}><planeGeometry args={[2.08,1.16]}/><meshBasicMaterial color="#07131a"/></mesh>
      <mesh position={[-.6,.26,.068]}><planeGeometry args={[.65,.007]}/><meshBasicMaterial color="#5fcea6"/></mesh>
      <Text fontSize={.092} color="#bce4d1" position={[-.86,.4,.071]} anchorX="left">ARCHITECT / DEV</Text>
      <Text fontSize={.21} color="#e3efeb" position={[-.86,.035,.071]} anchorX="left">BUILDING</Text>
      <Text fontSize={.21} color="#e3efeb" position={[-.86,-.23,.071]} anchorX="left">WHAT&apos;S NEXT_</Text>
      {[0,1,2,3,4].map(i=><mesh key={i} position={[.60,.30-i*.14,.068]}><planeGeometry args={[.36+(i%2)*.18,.017]}/><meshBasicMaterial color={i===0?'#74cdae':'#355e60'}/></mesh>)}
      <mesh position={[0,-.80,-.04]}><boxGeometry args={[.12,.35,.11]}/><meshStandardMaterial color="#252b2d" metalness={.7} roughness={.3}/></mesh>
      <mesh position={[0,-.99,-.02]}><boxGeometry args={[.67,.055,.48]}/><meshStandardMaterial color="#24282b" metalness={.7} roughness={.36}/></mesh>
    </group>
    <Hotspot at={[-.45,2.84,-.45]} name="About me" onClick={()=>navigate('about')} color="#d7e1bd"/>
    {/* Secondary portrait screen */}
    <group position={[1.33,1.98,-.56]} rotation={[0,-.18,0]} onClick={e=>{e.stopPropagation();navigate('skills')}}>
      <RoundedBox args={[1.03,1.13,.08]} radius={.038} smoothness={3}><meshStandardMaterial color="#13181e" metalness={.55} roughness={.35}/></RoundedBox>
      <mesh position={[0,0,.046]}><planeGeometry args={[.92,1.01]}/><meshBasicMaterial color="#101d23"/></mesh>
      {[0,1,2,3,4,5,6].map((i)=><mesh key={i} position={[-.26+i*.09,-.24+(i%3)*.06,.05]}><boxGeometry args={[.05,.17+(i*3%5)*.085,.005]}/><meshBasicMaterial color={i%2===0?'#649c8a':'#ceaf77'}/></mesh>)}
      <Text fontSize={.075} color="#83c4ab" position={[-.33,.34,.06]} anchorX="left">SYSTEM STATUS</Text>
      <mesh position={[0,-.72,-.02]}><boxGeometry args={[.10,.30,.11]}/><meshStandardMaterial color="#22282d" metalness={.65}/></mesh>
      <mesh position={[0,-.9,-.01]}><boxGeometry args={[.5,.05,.3]}/><meshStandardMaterial color="#22282d" metalness={.65}/></mesh>
    </group>
    {/* Mouse and keyboard */}
    <RoundedBox position={[-.53,1.29,.53]} args={[1.36,.057,.39]} radius={.035} smoothness={2}><meshStandardMaterial color="#252829" roughness={.52}/></RoundedBox>
    {Array.from({length:50},(_,i)=><mesh key={i} position={[-1.12+(i%10)*.127,1.325,.39+Math.floor(i/10)*.065]}><boxGeometry args={[.1,.012,.045]}/><meshStandardMaterial color={i===48?'#6e6454':'#555b5a'} roughness={.65}/></mesh>)}
    <RoundedBox position={[.54,1.285,.57]} args={[.19,.078,.3]} radius={.065} smoothness={3}><meshStandardMaterial color="#292d2e" roughness={.57}/></RoundedBox>
    {/* Books, coaster, mug */}
    {[0,1,2].map(i=><mesh key={i} position={[-1.83,1.3+i*.08,-.40]} rotation={[0,.2+i*.08,0]}><boxGeometry args={[.43,.07,.36]}/><meshStandardMaterial color={['#a9977d','#2f504c','#3b3f4c'][i]} roughness={.8}/></mesh>)}
    <mesh position={[1.80,1.29,.48]}><cylinderGeometry args={[.12,.11,.21,24]}/><meshStandardMaterial color="#c8b5a0" roughness={.5}/></mesh>
    <mesh position={[1.80,1.40,.48]} rotation={[-Math.PI/2,0,0]}><torusGeometry args={[.07,.012,10,24]}/><meshStandardMaterial color="#826957"/></mesh>
    {/* Lamp */}
    <mesh position={[-2.06,1.28,-.56]}><cylinderGeometry args={[.19,.21,.075,24]}/><meshStandardMaterial color="#a09176" metalness={.75} roughness={.35}/></mesh>
    <mesh position={[-2.06,1.66,-.56]} rotation={[0,0,.2]}><cylinderGeometry args={[.017,.017,.7,12]}/><meshStandardMaterial color="#b59e80" metalness={.8}/></mesh>
    <mesh position={[-1.92,1.98,-.56]} rotation={[0,0,Math.PI]}><coneGeometry args={[.29,.34,24,1,true]}/><meshStandardMaterial color="#c2a37a" metalness={.3} roughness={.55} side={THREE.DoubleSide}/></mesh>
    <pointLight position={[-1.89,1.86,-.54]} color="#ffd4a0" distance={2.8} intensity={.9}/>
  </group>;
}
function Chair() {
  return <group position={[-1.0,0,2.12]} rotation={[0,-.17,0]}>
    <RoundedBox position={[0,.92,0]} args={[.86,.17,.78]} radius={.11} castShadow><meshStandardMaterial color="#252b2b" roughness={.83}/></RoundedBox>
    <RoundedBox position={[0,1.63,-.37]} rotation={[-.10,0,0]} args={[.9,1.22,.20]} radius={.10} castShadow><meshStandardMaterial color="#2c3232" roughness={.93}/></RoundedBox>
    <mesh position={[0,.5,0]}><cylinderGeometry args={[.055,.075,.7,16]}/><meshStandardMaterial color="#181c1e" metalness={.63}/></mesh>
    {[0,1,2,3,4].map(i=><group key={i} rotation={[0,(i/5)*Math.PI*2,0]}><mesh position={[0,.17,.35]}><boxGeometry args={[.07,.08,.76]}/><meshStandardMaterial color="#1f2224" metalness={.42}/></mesh><mesh position={[0,.10,.68]}><cylinderGeometry args={[.09,.09,.09,12]}/><meshStandardMaterial color="#121619"/></mesh></group>)}
    {[-.48,.48].map(x=><group key={x}><mesh position={[x,1.12,0]}><boxGeometry args={[.075,.36,.07]}/><meshStandardMaterial color="#2b3032"/></mesh><RoundedBox position={[x,1.32,.10]} args={[.13,.06,.45]} radius={.022}><meshStandardMaterial color="#33393a"/></RoundedBox></group>)}
  </group>;
}

function ProjectWall() {
  const openProject=useStudioStore(s=>s.openProject);
  const projects=[{name:'FLYNT',id:'flynt',color:'#73c5a9'},{name:'UTILIFY',id:'utilify',color:'#c4aa7e'},{name:'THE CAMERA',id:'camera',color:'#8c9dcf'}];
  return <group position={[-5.25,0,-4.88]}>
    <mesh position={[0,2.6,.1]}><boxGeometry args={[4.15,3.72,.13]}/><meshStandardMaterial color="#1b2124" metalness={.14} roughness={.72}/></mesh>
    <Text position={[-1.67,4.05,.18]} anchorX="left" fontSize={.105} color="#bdac91" letterSpacing={.13}>SELECTED WORK / 003</Text>
    {projects.map((p,i)=><group key={p.id} position={[-1.23+i*1.23,2.60,.22]} onClick={e=>{e.stopPropagation();openProject(p.id)}} onPointerOver={e=>{e.stopPropagation();document.body.style.cursor='pointer'}} onPointerOut={()=>{document.body.style.cursor='auto'}}>
      <RoundedBox args={[1.09,1.84,.095]} radius={.018} castShadow><meshStandardMaterial color="#373d42" roughness={.45} metalness={.5}/></RoundedBox>
      <mesh position={[0,0,.051]}><planeGeometry args={[.98,1.73]}/><meshStandardMaterial color="#161e23" emissive={p.color} emissiveIntensity={.10}/></mesh>
      <mesh position={[0,.30,.062]} rotation={[0,0,i===1?-.3:.2]}><torusKnotGeometry args={[.26,.072,100,8,2,3]}/><meshStandardMaterial color={p.color} emissive={p.color} emissiveIntensity={.3} metalness={.55} roughness={.27}/></mesh>
      <Text fontSize={.105} position={[0,-.54,.063]} color="#f0e5d5" anchorX="center">{p.name}</Text>
      <Text fontSize={.063} position={[0,-.70,.063]} color="#8b989b" anchorX="center">OPEN CASE STUDY  ↗</Text>
      <mesh position={[0,0,.08]} visible={false}><boxGeometry args={[1.1,1.85,.10]}/><meshBasicMaterial transparent opacity={0}/></mesh>
    </group>)}
    <mesh position={[0,.86,.42]}><boxGeometry args={[4.08,.08,.43]}/><meshStandardMaterial color="#4a3a32" roughness={.7}/></mesh>
    <Hotspot at={[0,4.7,.40]} name="Featured projects" onClick={()=>useStudioStore.getState().navigate('projects')} color="#cfb48e"/>
  </group>;
}
function AISculpture({ reducedMotion }: { reducedMotion: boolean }) {
  const navigate=useStudioStore(s=>s.navigate);
  const rig=useRef<THREE.Group>(null);
  const orb=useRef<THREE.Group>(null);
  useFrame((state,dt)=>{
    if(rig.current && !reducedMotion) rig.current.position.y=2.40+Math.sin(state.clock.elapsedTime*.72)*.085;
    if(orb.current && !reducedMotion) orb.current.rotation.y+=dt*.10;
  });
  const nodes=useMemo(()=>Array.from({length:17},(_,i)=>{const a=i*2.39996;const y=(i/16)*1.9-.95; const radius=Math.sqrt(1-(y/1.1)**2);return new THREE.Vector3(Math.cos(a)*radius*.85,y,Math.sin(a)*radius*.85);}),[]);
  const lines=useMemo(()=>nodes.flatMap((v,i)=>nodes.slice(i+1).map((w,j)=>({v,w,k:`${i}-${j}`,d:v.distanceTo(w)})).filter(p=>p.d<1.15)),[nodes]);
  return <group position={[3.65,0,-1.33]}>
    <RoundedBox position={[0,.54,0]} args={[2.72,1.08,2.6]} radius={.1} castShadow receiveShadow><meshStandardMaterial color="#252e33" metalness={.38} roughness={.42}/></RoundedBox>
    <mesh position={[0,1.105,0]}><boxGeometry args={[2.35,.07,2.25]}/><meshStandardMaterial color="#546269" metalness={.64} roughness={.26}/></mesh>
    <mesh position={[0,1.17,0]} rotation={[-Math.PI/2,0,0]}><ringGeometry args={[.85,.92,64]}/><meshBasicMaterial color="#629a99" side={THREE.DoubleSide} toneMapped={false}/></mesh>
    <group ref={rig} position={[0,2.40,0]} onClick={e=>{e.stopPropagation();navigate('lab')}} onPointerOver={e=>{e.stopPropagation();document.body.style.cursor='pointer'}} onPointerOut={()=>{document.body.style.cursor='auto'}}>
      <group ref={orb}>
        {[0,1,2].map(i=><mesh key={i} rotation={[(i*1.2)+.2,(i*.9),i*.9]}><torusGeometry args={[1.03,.012,8,96]}/><meshBasicMaterial color={i===0?'#86c8b8':'#527c8c'} transparent opacity={.7} toneMapped={false}/></mesh>)}
        {nodes.map((n,i)=><mesh key={i} position={n}><icosahedronGeometry args={[i%5===0?.085:.046,0]}/><meshBasicMaterial color={i%3===0?'#e4cb99':'#91d8c4'} toneMapped={false}/></mesh>)}
        {lines.map(l=><Line key={l.k} points={[l.v,l.w]} color="#578c89" lineWidth={.6} transparent opacity={.43}/>)}
        <mesh><icosahedronGeometry args={[.25,1]}/><meshStandardMaterial color="#a2c6c1" metalness={.9} roughness={.12} emissive="#438277" emissiveIntensity={.45}/></mesh>
      </group>
      <mesh visible={false}><sphereGeometry args={[1.33,12,12]}/><meshBasicMaterial transparent opacity={0}/></mesh>
    </group>
    <pointLight position={[0,2.1,0]} color="#72aeb0" intensity={2} distance={5}/>
    <Text position={[0,.95,1.39]} fontSize={.115} color="#e3d5bf" anchorX="center">NEURAL SYSTEMS / LAB.01</Text>
    <Hotspot at={[0,3.95,0]} name="AI laboratory" onClick={()=>navigate('lab')} color="#98e3d1"/>
  </group>;
}
function CareerBoard() {
  const nav=useStudioStore(s=>s.navigate);
  return <group position={[5.5,0,2.6]} rotation={[0,-.40,0]}>
    <RoundedBox position={[0,2.17,0]} args={[2.6,2.7,.14]} radius={.035}><meshStandardMaterial color="#1e292d" metalness={.25} roughness={.4}/></RoundedBox>
    <Text position={[-1.02,3.23,.084]} anchorX="left" fontSize={.12} color="#b5c1bc">CAREER / TIMELINE</Text>
    {[0,1,2].map(i=><group key={i} position={[0,2.75-i*.67,.084]}>
      <mesh position={[-.90,0,0]}><circleGeometry args={[.035,14]}/><meshBasicMaterial color="#d7bd91"/></mesh>
      <mesh position={[.17,-.21,0]}><planeGeometry args={[1.85,.009]}/><meshBasicMaterial color="#425358"/></mesh>
      <Text position={[-.77,.04,.002]} anchorX="left" fontSize={.105} color="#f1e5d3">{['BUILD','LEARN','EVOLVE'][i]}</Text>
      <Text position={[-.77,-.10,.003]} anchorX="left" fontSize={.070} color="#93a9a9">{['PRODUCTION SYSTEMS','AI RESEARCH','CREATIVE ENGINEERING'][i]}</Text>
    </group>)}
    <Hotspot at={[0,3.8,.22]} name="Career timeline" onClick={()=>nav('experience')}/>
  </group>;
}
function ContactTerminal() {
  const nav=useStudioStore(s=>s.navigate);
  return <group position={[-5.15,0,2.4]} rotation={[0,.24,0]}>
    <mesh position={[0,.6,0]} castShadow><cylinderGeometry args={[.65,.73,1.2,40]}/><meshStandardMaterial color="#35383a" metalness={.3} roughness={.49}/></mesh>
    <RoundedBox position={[0,1.52,0]} args={[1.1,.78,.37]} radius={.08} castShadow><meshStandardMaterial color="#1b2527" metalness={.4} roughness={.45}/></RoundedBox>
    <mesh position={[0,1.53,.192]}><planeGeometry args={[.89,.58]}/><meshBasicMaterial color="#102b2c"/></mesh>
    <Text position={[0,1.65,.20]} fontSize={.13} color="#b5dec3">LET&apos;S TALK</Text>
    <Text position={[0,1.43,.20]} fontSize={.083} color="#80b6a7">CONNECT / 001</Text>
    <mesh position={[0,2.06,-.08]} rotation={[0,0,-.08]}><boxGeometry args={[.64,.1,.16]}/><meshStandardMaterial color="#bfad8f" metalness={.72}/></mesh>
    <Hotspot at={[0,2.35,0]} name="Get in touch" onClick={()=>nav('contact')} color="#e8c392"/>
  </group>;
}
function Planter() {
  const leaves=useMemo(()=>Array.from({length:16},(_,i)=>({a:i*2.399,y:1.05+(i%5)*.13,r:.33+(i%4)*.12})),[]);
  return <group position={[6.7,0,-3.9]}>
    <mesh position={[0,.43,0]} castShadow><cylinderGeometry args={[.33,.28,.78,12]}/><meshStandardMaterial color="#b2a593" roughness={.91}/></mesh>
    {leaves.map((l,i)=><mesh key={i} position={[Math.cos(l.a)*l.r,l.y,Math.sin(l.a)*l.r]} rotation={[Math.sin(l.a)*.7,l.a,-Math.cos(l.a)*.6]} castShadow><sphereGeometry args={[.13,.40,5,8]}/><meshStandardMaterial color={i%3===0?'#587a64':'#476851'} roughness={.97}/></mesh>)}
  </group>;
}
function Lighting() {
  const night=useStudioStore(s=>s.nightMode);
  return <>
    <ambientLight intensity={night ? .62 : .90} color={night?'#a4b9c8':'#edcfa8'}/>
    <hemisphereLight color="#a1b5c9" groundColor="#4e3326" intensity={night ? .54 : .67}/>
    <directionalLight position={[1.4,7,4.5]} castShadow intensity={night?2.6:3.2} color={night?'#f4d4aa':'#ffd3a4'} shadow-mapSize-width={1024} shadow-mapSize-height={1024} shadow-camera-left={-10} shadow-camera-right={10} shadow-camera-top={9} shadow-camera-bottom={-9} shadow-bias={-.0002}/>
    <pointLight position={[-4.4,3.2,-3.3]} color="#edb376" intensity={night?3:4} distance={8}/>
    <pointLight position={[1.4,3.3,1.3]} color="#82b7bf" intensity={1.8} distance={6}/>
    <mesh position={[-4.6,4.8,-3.0]}><boxGeometry args={[2.0,.045,.26]}/><meshBasicMaterial color="#dfb686"/></mesh>
    <mesh position={[1.6,4.9,1.5]}><boxGeometry args={[2.9,.055,.18]}/><meshBasicMaterial color="#d6a778"/></mesh>
  </>;
}
function Scene({ reducedMotion }: { reducedMotion: boolean }) {
  const quality=useStudioStore(s=>s.quality);
  return <>
    <color attach="background" args={['#0c1724']}/>
    <fog attach="fog" args={['#101b28',18,52]}/>
    <CameraDirector reducedMotion={reducedMotion}/>
    <Lighting/>
    {quality==='high' && <Stars radius={45} depth={17} count={350} factor={2} saturation={0} fade speed={.3}/>} 
    <Skyline/>
    <Architecture/>
    <Desk/>
    <Chair/>
    <ProjectWall/>
    <AISculpture reducedMotion={reducedMotion}/>
    <CareerBoard/>
    <ContactTerminal/>
    <Planter/>
  </>;
}
function WebGLContextWatch({ onError }: { onError: () => void }) {
  const gl=useThree(s=>s.gl);
  useEffect(()=>{
    const el=gl.domElement;
    const handler=(e: Event)=>{e.preventDefault();onError();};
    el.addEventListener('webglcontextlost',handler);
    return ()=>el.removeEventListener('webglcontextlost',handler);
  },[gl,onError]);
  return null;
}
export default function StudioCanvas({ onError, reducedMotion }: Props) {
  const quality=useStudioStore(s=>s.quality);
  const [failed,setFailed]=useState(false);
  useEffect(()=>{if(failed)onError();},[failed,onError]);
  return <Canvas shadows={quality==='high'} dpr={quality==='high'?[1,1.7]:[.8,1.1]} camera={{position:[9.5,4.9,12.5],fov:38,near:.1,far:110}} gl={{antialias:quality==='high',alpha:false,powerPreference:'high-performance'}} onCreated={({gl})=>{gl.toneMapping=THREE.ACESFilmicToneMapping;gl.toneMappingExposure=1.32;}} fallback={<div className="canvas-fallback">WebGL unavailable</div>}>
    <Suspense fallback={null}><Scene reducedMotion={reducedMotion}/></Suspense>
    <WebGLContextWatch onError={()=>setFailed(true)}/>
  </Canvas>;
}
