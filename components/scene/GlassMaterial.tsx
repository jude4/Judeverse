'use client';

import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Architectural glass with a real Fresnel response and a soft internal
 * transmission tint. Built on a custom ShaderMaterial so the pane reads as
 * physical glass instead of a flat transparent plane. Use it as a child of
 * a mesh: <mesh><GlassMaterial/></mesh>.
 */
export function GlassMaterial({ color = '#9bb6c4', tint = '#bfe3ee', roughness = 0.04, metalness = 0.06, transmission = 0.55, opacity = 0.14, iridescence = 0.35 }: {
  color?: string;
  tint?: string;
  roughness?: number;
  metalness?: number;
  transmission?: number;
  opacity?: number;
  iridescence?: number;
} = {}) {
  const uniforms = useMemo(() => ({
    uColor: { value: new THREE.Color(color) },
    uTint: { value: new THREE.Color(tint) },
    uTime: { value: 0 }
  }), [color, tint]);

  const material = useMemo(() => new THREE.ShaderMaterial({
    uniforms,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    vertexShader: /* glsl */`
      varying vec3 vNormal;
      varying vec3 vViewDir;
      varying vec3 vWorldPos;
      void main() {
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vWorldPos = worldPos.xyz;
        vNormal = normalize(normalMatrix * normal);
        vec4 viewPos = viewMatrix * worldPos;
        vViewDir = normalize(-viewPos.xyz);
        gl_Position = projectionMatrix * viewPos;
      }
    `,
    fragmentShader: /* glsl */`
      precision highp float;
      uniform vec3 uColor;
      uniform vec3 uTint;
      uniform float uTime;
      varying vec3 vNormal;
      varying vec3 vViewDir;
      varying vec3 vWorldPos;

      float fresnel(float ndv) {
        return pow(1.0 - clamp(ndv, 0.0, 1.0), 2.4);
      }

      float caustic(vec2 p, float t) {
        vec2 a = sin(p * 2.3 + t * 0.5);
        vec2 b = cos(p * 1.7 - t * 0.4);
        return 0.5 + 0.5 * sin(dot(a, b) * 1.6 + t * 0.25);
      }

      void main() {
        vec3 N = normalize(vNormal);
        vec3 V = normalize(vViewDir);
        float ndv = max(dot(N, V), 0.0);
        float F = fresnel(ndv);
        vec2 uv = vWorldPos.xz * 0.18;
        float c = caustic(uv, uTime);
        vec3 causticColor = mix(uTint, uColor, 0.55) * (0.18 + 0.42 * c);
        vec3 base = uColor * (0.35 + 0.30 * c);
        vec3 reflection = uColor * 0.55 * F;
        vec3 transmissionTint = uTint * (0.55 * (1.0 - F));
        vec3 outCol = base + reflection + transmissionTint + causticColor * 0.35;
        gl_FragColor = vec4(outCol, opacity * (0.55 + 0.45 * F));
      }
    `
  }), [uniforms]);

  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return <primitive attach="material" object={material} />;
}