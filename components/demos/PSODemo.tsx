'use client';

import '@/components/studio.css';
import { useEffect, useState } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';

type Particle = { x:number; y:number; vx:number; vy:number; bx:number; by:number; best:number };
type Simulation = { particles: Particle[]; gx:number; gy:number; best:number; iteration:number };
const fitness=(x:number,y:number)=>(x-.8)**2+1.6*(y+.4)**2;
const seeded=(n:number)=>((Math.sin(n*92.71+12.91)*43758.5453)%1+1)%1;
function createSim():Simulation {
  const particles=Array.from({length:14},(_,i)=>{
    const x=-3.5+7*seeded(i+1),y=-3.5+7*seeded(i+41);
    return {x,y,vx:0,vy:0,bx:x,by:y,best:fitness(x,y)};
  });
  const min=particles.reduce((a,b)=>a.best<b.best?a:b);
  return {particles,gx:min.bx,gy:min.by,best:min.best,iteration:0};
}
const constrain=(v:number,min:number,max:number)=>Math.max(min,Math.min(max,v));
function advance(sim:Simulation):Simulation {
  let best=sim.best,gx=sim.gx,gy=sim.gy;
  const particles=sim.particles.map((p,i)=>{
    const it=sim.iteration;
    const r1=seeded(i*127+it*7+3),r2=seeded(i*17+it*19+5);
    const vx=constrain(.67*p.vx+1.55*r1*(p.bx-p.x)+1.55*r2*(sim.gx-p.x),-.75,.75);
    const vy=constrain(.67*p.vy+1.55*r2*(p.by-p.y)+1.55*r1*(sim.gy-p.y),-.75,.75);
    const x=constrain(p.x+vx,-4,4),y=constrain(p.y+vy,-4,4);
    const fit=fitness(x,y);
    const improved=fit<p.best;
    const next={x,y,vx,vy,bx:improved?x:p.bx,by:improved?y:p.by,best:improved?fit:p.best};
    if(next.best<best){best=next.best;gx=next.bx;gy=next.by;}
    return next;
  });
  return {particles,gx,gy,best,iteration:sim.iteration+1};
}
const mapX=(x:number)=>22+(x+4)/8*324;
const mapY=(y:number)=>250-(y+4)/8*224;
export default function PSODemo() {
  const [sim,setSim]=useState(createSim);
  const [playing,setPlaying]=useState(false);
  useEffect(()=>{
    if(!playing||sim.iteration>=100)return;
    const id=window.setInterval(()=>setSim(old=>old.iteration>=100?old:advance(old)),125);
    return ()=>window.clearInterval(id);
  },[playing,sim.iteration]);
  return <div className="demo-wrap">
    <div className="demo-topline"><span>SWARM OPTIMIZATION</span><span>ITERATION {String(sim.iteration).padStart(3,'0')}</span></div>
    <svg className="pso-svg" viewBox="0 0 368 274" role="img" aria-label={`Particle swarm optimization illustration, iteration ${sim.iteration}, best objective ${sim.best.toFixed(4)}`}>
      <defs><radialGradient id="heat"><stop offset="0%" stopColor="#9bc9ad" stopOpacity=".18"/><stop offset="100%" stopColor="#102a30" stopOpacity="0"/></radialGradient></defs>
      <rect x="0" y="0" width="368" height="274" fill="#102028"/>
      {Array.from({length:7},(_,i)=><g key={i}><line x1={22+i*54} x2={22+i*54} y1="26" y2="250" stroke="#536b69" strokeOpacity=".2"/><line x1="22" x2="346" y1={26+i*37.3} y2={26+i*37.3} stroke="#536b69" strokeOpacity=".2"/></g>)}
      <ellipse cx={mapX(.8)} cy={mapY(-.4)} rx="108" ry="81" fill="url(#heat)"/>
      {[.7,1.6,2.8].map((r,i)=><ellipse key={r} cx={mapX(.8)} cy={mapY(-.4)} rx={r*40} ry={r*31} fill="none" stroke="#86c6ae" strokeOpacity={.28-i*.07} strokeWidth="1"/>)}
      <line x1={mapX(.8)-8} x2={mapX(.8)+8} y1={mapY(-.4)} y2={mapY(-.4)} stroke="#d3c08b"/>
      <line x1={mapX(.8)} x2={mapX(.8)} y1={mapY(-.4)-8} y2={mapY(-.4)+8} stroke="#d3c08b"/>
      {sim.particles.map((p,i)=><g key={i}><line x1={mapX(p.x)} y1={mapY(p.y)} x2={mapX(p.x-p.vx*2.5)} y2={mapY(p.y-p.vy*2.5)} stroke="#86bcae" strokeWidth=".8" strokeOpacity=".55"/><circle cx={mapX(p.x)} cy={mapY(p.y)} r="4.5" fill={i%3===0?'#e4d49f':'#91ceb8'}/></g>)}
      <circle cx={mapX(sim.gx)} cy={mapY(sim.gy)} r="11" fill="none" stroke="#f6cf9e" strokeDasharray="2 3"/>
      <text x="20" y="17" className="svg-caption">MINIMIZE f(x,y) = (x-0.8)² + 1.6(y+0.4)²</text>
      <text x="20" y="266" className="svg-caption">GLOBAL BEST • GOLD RING</text>
    </svg>
    <div className="sim-bottom"><div><small>BEST FITNESS</small><strong>{sim.best.toFixed(4)}</strong></div><div className="sim-actions"><button onClick={()=>{setSim(createSim());setPlaying(false)}} title="Reset simulation" aria-label="Reset simulation"><RotateCcw size={16}/></button><button onClick={()=>setPlaying(p=>!p)} className="sim-play" disabled={sim.iteration>=100}>{playing?<><Pause size={15}/> PAUSE</>:<><Play size={15}/> {sim.iteration>=100?'FINISHED':'RUN'}</>}</button></div></div>
    <p className="demo-disclaimer">A working gBest PSO demonstration: particles update velocity from inertia, personal best, and social best. Data is simulated for learning.</p>
  </div>;
}
