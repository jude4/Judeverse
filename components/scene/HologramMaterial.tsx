'use client';

import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * A holographic projection shader: a faceted core with a rippling data ring
 * and a fading base. Use as a child of a mesh: <mesh><HologramMaterial/></mesh>.
 */
export function HologramMaterial({ color = '#98e3d1', speed = 1 }: { color?: string; speed?: number } = {}) {
  const material = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(color) },
      uTime: { value: 0 },
      uSpeed: { value: speed }
    },
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
    vertexShader: /* glsl */`
      varying vec3 vNormal;
      varying vec3 vViewDir;
      varying vec3 vWorldPos;
      void main() {
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vWorldPos = wp.xyz;
        vNormal = normalize(normalMatrix * normal);
        vec4 viewPos = viewMatrix * wp;
        vViewDir = normalize(-viewPos.xyz);
        gl_Position = projectionMatrix * viewPos;
      }
    `,
    fragmentShader: /* glsl */`
      precision highp float;
      uniform vec3 uColor;
      uniform float uTime;
      uniform float uSpeed;
      varying vec3 vNormal;
      varying vec3 vViewDir;
      varying vec3 vWorldPos;

      float noise(vec3 p) {
        vec3 i = floor(p);
        vec3 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        float n = mix(
          mix(mix(fract(sin(dot(i, vec2(12.9898,78.233))) * 43758.5453),
                  fract(sin(dot(i + vec3(1.0,0.0,0.0), vec2(12.9898,78.233))) * 43758.5453), f.x),
              mix(fract(sin(dot(i + vec3(0.0,1.0,0.0), vec2(12.9898,78.233))) * 43758.5453),
                  fract(sin(dot(i + vec3(1.0,1.0,0.0), vec2(12.9898,78.233))) * 43758.5453), f.x), f.y),
          mix(mix(fract(sin(dot(i + vec3(0.0,0.0,1.0), vec2(12.9898,78.233))) * 43758.5453),
                  fract(sin(dot(i + vec3(1.0,0.0,1.0), vec2(12.9898,78.233))) * 43758.5453), f.x),
              mix(fract(sin(dot(i + vec3(0.0,1.0,1.0), vec2(12.9898,78.233))) * 43758.5453),
                  fract(sin(dot(i + vec3(1.0,1.0,1.0), vec2(12.9898,78.233))) * 43758.5453), f.x), f.y), f.z);
        return n;
      }

      void main() {
        vec3 N = normalize(vNormal);
        vec3 V = normalize(vViewDir);
        float ndv = max(dot(N, V), 0.0);
        float fresnel = pow(1.0 - ndv, 2.5);
        float t = uTime * uSpeed;
        float ripple = noise(vWorldPos * 1.6 + t * 0.5);
        float scan = 0.5 + 0.5 * sin(vWorldPos.y * 4.0 - t * 2.0);
        vec3 core = uColor * (0.55 + 0.45 * ripple) * (0.6 + 0.4 * scan);
        vec3 rim = uColor * fresnel * 1.4;
        vec3 col = core + rim;
        gl_FragColor = vec4(col, (0.55 + 0.45 * ripple) * (0.5 + 0.5 * fresnel));
      }
    `
  }), [color, speed]);

  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return <primitive attach="material" object={material} />;
}