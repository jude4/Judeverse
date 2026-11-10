'use client';

import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * A procedural neon sign: a thin emissive tube with a soft additive halo.
 * The tube geometry is a low-poly cylinder ring, and the glow is driven by
 * a custom ShaderMaterial so the halo breathes instead of sitting flat.
 */
export function NeonSign({ text = 'JUDE', position = [0, 0, 0] as [number, number, number], color = '#e9c98a', size = 0.5 }: {
  text?: string;
  position?: [number, number, number];
  color?: string;
  size?: number;
}) {
  const chars = text.split('');
  const spacing = size * 0.62;
  const startX = -((chars.length - 1) * spacing) / 2;

  const tube = useMemo(() => {
    const seg = 24;
    const geo = new THREE.BufferGeometry();
    const verts: number[] = [];
    const uvs: number[] = [];
    for (let i = 0; i < chars.length; i++) {
      const x = startX + i * spacing;
      for (let s = 0; s < seg; s++) {
        const a = (s / seg) * Math.PI * 2;
        verts.push(x + Math.cos(a) * 0.018, size + Math.sin(a) * 0.018, 0);
        uvs.push(s / seg, i / chars.length);
      }
    }
    geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geo.computeVertexNormals();
    return geo;
  }, [chars.length, startX, size]);

  const material = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(color) },
      uTime: { value: 0 }
    },
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
    vertexShader: /* glsl */`
      varying vec2 vUv;
      varying vec3 vNormal;
      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */`
      precision highp float;
      uniform vec3 uColor;
      uniform float uTime;
      varying vec2 vUv;
      varying vec3 vNormal;

      void main() {
        // Soft pulsing core.
        float pulse = 0.78 + 0.22 * sin(uTime * 3.1 + vUv.y * 12.0);
        vec3 core = uColor * pulse;
        // Fresnel rim glow.
        float rim = pow(1.0 - clamp(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0, 1.0), 3.0);
        vec3 glow = uColor * rim * 1.6;
        gl_FragColor = vec4(core + glow, 0.9 + 0.1 * rim);
      }
    `
  }), [color]);

  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <group position={position}>
      <mesh geometry={tube} material={material} />
      <mesh geometry={tube}>
        <meshBasicMaterial color={color} transparent opacity={0.18} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

export default NeonSign;