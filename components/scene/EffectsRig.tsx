'use client';

import { BlendFunction } from 'postprocessing';
import { useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { Bloom, EffectComposer, Noise, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';

export default function EffectsRig({ quality }: { quality: 'high' | 'low' }) {
  return (
    <EffectComposer multisampling={quality === 'high' ? 4 : 0}>
      <Bloom
        key="bloom"
        blendFunction={BlendFunction.SCREEN}
        intensity={quality === 'high' ? 1.9 : 1.35}
        luminanceThreshold={0.18}
        luminanceSmoothing={0.42}
        radius={quality === 'high' ? 0.55 : 0.42}
        mipmapBlur={quality === 'high'}
        levels={9}
      />
      <Vignette
        key="vignette"
        offset={0.32}
        darkness={0.55}
        blendFunction={BlendFunction.NORMAL}
      />
      <Noise
        key="noise"
        opacity={quality === 'high' ? 0.035 : 0.02}
        blendFunction={BlendFunction.SCREEN}
      />
    </EffectComposer>
  );
}