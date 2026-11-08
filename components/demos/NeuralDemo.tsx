'use client';
import { useMemo, useState } from 'react';

const weights = [[2.1,-1.4],[-1.2,2.4],[1.5,1.7]];
const biases = [-.4,.2,-.7];
const outputWeights = [1.15,-.6,1.4];
const sigmoid = (x:number)=>1/(1+Math.exp(-x));

export default function NeuralDemo() {
  const [inputA,setInputA]=useState(.75);
  const [inputB,setInputB]=useState(.35);
  const calc=useMemo(()=>{
    const hidden=weights.map((w,i)=>sigmoid(inputA*w[0]+inputB*w[1]+biases[i]));
    const output=sigmoid(hidden.reduce((s,h,i)=>s+h*outputWeights[i],-.8));
    return {hidden,output};
  },[inputA,inputB]);
  const coords=[[{x:42,y:74},{x:42,y:176}],[{x:184,y:44},{x:184,y:125},{x:184,y:206}],[{x:326,y:125}]];
  const values=[[inputA,inputB],calc.hidden,[calc.output]];
  return <div className="demo-wrap">
    <div className="demo-topline"><span>LIVE FORWARD PASS</span><span className="live-indicator"><i/> RUNNING LOCALLY</span></div>
    <svg className="network-svg" viewBox="0 0 368 248" role="img" aria-label={`Two inputs propagate through three sigmoid hidden neurons to an output of ${calc.output.toFixed(3)}`}>
      {coords.slice(0,2).flatMap((layer,k)=>layer.flatMap((p,i)=>coords[k+1].map((q,j)=>{
        const opacity=.12+.50*(values[k][i]+values[k+1][j])/2;
        return <line key={`${k}-${i}-${j}`} x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke="#9acdbb" strokeWidth={.75+opacity*2} opacity={opacity}/>;
      })))}
      {coords.flatMap((layer,k)=>layer.map((p,i)=><g key={`${k}-${i}`}>
        <circle cx={p.x} cy={p.y} r={18} fill="#162b31" stroke="#6d9889" strokeWidth="1" />
        <circle cx={p.x} cy={p.y} r={13*values[k][i]} fill="#76d1ab" opacity={.25+.55*values[k][i]}/>
        <text x={p.x} y={p.y+3} fontSize="9" textAnchor="middle" fill="#e5f2ed" fontFamily="monospace">{values[k][i].toFixed(2)}</text>
      </g>))}
      <text x="42" y="238" textAnchor="middle" className="svg-caption">INPUT</text>
      <text x="184" y="238" textAnchor="middle" className="svg-caption">HIDDEN</text>
      <text x="326" y="238" textAnchor="middle" className="svg-caption">OUTPUT</text>
    </svg>
    <div className="demo-controls">
      <label>INPUT A <span>{inputA.toFixed(2)}</span><input type="range" min="0" max="1" step="0.01" value={inputA} onChange={e=>setInputA(Number(e.target.value))}/></label>
      <label>INPUT B <span>{inputB.toFixed(2)}</span><input type="range" min="0" max="1" step="0.01" value={inputB} onChange={e=>setInputB(Number(e.target.value))}/></label>
    </div>
    <div className="demo-result"><span>MODEL OUTPUT</span><strong>{(calc.output*100).toFixed(1)}%</strong></div>
    <p className="demo-disclaimer">A mathematically functional illustration using fixed weights and sigmoid activations. It is not a trained model or production prediction.</p>
  </div>;
}
