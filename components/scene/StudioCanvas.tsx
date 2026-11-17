"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, RoundedBox } from "@react-three/drei";
import { memo, Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useStudioStore } from "@/store/useStudioStore";
import { Laptop, Chair } from "./WorkspaceObjects";

type Props = { onError: () => void; reducedMotion: boolean };

/** Invalidate only while the camera is moving. The resting scene consumes no animation loop. */
function CameraDirector({ reducedMotion }: { reducedMotion: boolean }) {
  const { camera, invalidate, size } = useThree();
  const station = useStudioStore((s) => s.station);
  const section = useStudioStore((s) => s.section);
  const focus = useRef(new THREE.Vector3(0, 1, 0));
  const goal = useMemo(() => {
    const mobile = size.width < 700;
    const position =
      station === "laptop"
        ? [1.5, 2.8, 3.5]
        : station === "chair"
          ? [3.8, 2.15, 4.4]
          : [5.0, 3.65, 6.2];
    const look =
      station === "laptop"
        ? [-0.3, 1.45, -0.15]
        : station === "chair"
          ? [0.65, 0.9, 1.65]
          : [-0.6, 0.95, 0.1];
    if (mobile) {
      position[0] *= 1.8;
      position[1] *= 1.5;
      position[2] *= 1.8;
      look[1] = station === "laptop" ? 2.05 : 1.7;
    }
    if (section !== "home" && !mobile) look[0] += 1.2;
    return {
      position: new THREE.Vector3(...position),
      look: new THREE.Vector3(...look),
    };
  }, [station, section, size.width]);
  useEffect(() => {
    invalidate();
  }, [goal, invalidate]);
  useFrame((_, delta) => {
    const alpha = reducedMotion ? 1 : 1 - Math.exp(-Math.min(delta, 0.05) * 5);
    camera.position.lerp(goal.position, alpha);
    focus.current.lerp(goal.look, alpha);
    camera.lookAt(focus.current);
    if (
      camera.position.distanceTo(goal.position) > 0.001 ||
      focus.current.distanceTo(goal.look) > 0.001
    )
      invalidate();
  });
  return null;
}

function useSurface(kind: "wood" | "shadow") {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = kind === "wood" ? 256 : 64;
    const ctx = canvas.getContext("2d")!;
    if (kind === "wood") {
      ctx.fillStyle = "#9b724a";
      ctx.fillRect(0, 0, 256, 256);
      for (let i = 0; i < 180; i++) {
        ctx.strokeStyle = `rgba(${i % 2 ? "62,35,17" : "231,194,145"},${0.035 + (i % 5) * 0.012})`;
        ctx.lineWidth = 0.5 + (i % 3) * 0.35;
        ctx.beginPath();
        for (let x = 0; x <= 256; x += 8) {
          const y = i * 1.5 + Math.sin(x * 0.025 + i * 0.7) * 1.6;
          if (!x) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    } else {
      const gradient = ctx.createRadialGradient(32, 32, 2, 32, 32, 32);
      gradient.addColorStop(0, "rgba(30,23,17,.45)");
      gradient.addColorStop(0.5, "rgba(30,23,17,.22)");
      gradient.addColorStop(1, "rgba(30,23,17,0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 64);
    }
    const map = new THREE.CanvasTexture(canvas);
    map.colorSpace = THREE.SRGBColorSpace;
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    return map;
  }, [kind]);
  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
}

function Desk() {
  const wood = useSurface("wood");
  return (
    <group>
      <RoundedBox
        args={[3.55, 0.12, 1.65]}
        radius={0.045}
        smoothness={3}
        position={[0, 1.08, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial map={wood} roughness={0.56} />
      </RoundedBox>
      {[-1.45, 1.45].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          {[-0.6, 0.6].map((z) => (
            <mesh key={z} position={[0, 0.5, z]} castShadow>
              <cylinderGeometry args={[0.035, 0.052, 1, 12]} />
              <meshStandardMaterial
                color="#353936"
                metalness={0.7}
                roughness={0.4}
              />
            </mesh>
          ))}
          <mesh position={[0, 0.15, 0]}>
            <boxGeometry args={[0.045, 0.045, 1.22]} />
            <meshStandardMaterial
              color="#353936"
              metalness={0.7}
              roughness={0.4}
            />
          </mesh>
        </group>
      ))}
      <RoundedBox
        args={[1.8, 0.16, 1.15]}
        scale={[1, 0.09375, 1]}
        position={[-0.3, 1.151, 0.03]}
        radius={0.07}
        smoothness={3}
      >
        <meshStandardMaterial color="#5c6258" roughness={0.96} />
      </RoundedBox>
      <group position={[1.12, 1.15, 0.42]}>
        <mesh position={[0, 0.09, 0]} castShadow>
          <cylinderGeometry args={[0.085, 0.072, 0.18, 24, 1, true]} />
          <meshStandardMaterial
            color="#ded5c3"
            roughness={0.35}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh position={[0, 0.166, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.073, 24]} />
          <meshStandardMaterial color="#34241a" roughness={0.25} />
        </mesh>
        <mesh position={[0.097, 0.1, 0]}>
          <torusGeometry args={[0.057, 0.014, 8, 16]} />
          <meshStandardMaterial color="#ded5c3" roughness={0.35} />
        </mesh>
      </group>
      {[0, 1].map((i) => (
        <RoundedBox
          key={i}
          position={[-1.3, 1.18 + i * 0.065, -0.4]}
          rotation={[0, -0.13 + i * 0.2, 0]}
          args={[0.46, 0.06, 0.36]}
          radius={0.008}
          smoothness={1}
        >
          <meshStandardMaterial
            color={i ? "#b5ae91" : "#3d514c"}
            roughness={0.9}
          />
        </RoundedBox>
      ))}
    </group>
  );
}

function Lamp() {
  const night = useStudioStore((s) => s.nightMode);
  const toggle = useStudioStore((s) => s.toggleMood);
  return (
    <group
      position={[1.25, 1.16, -0.42]}
      onClick={(e) => {
        e.stopPropagation();
        toggle();
      }}
      onPointerOver={() => {
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "";
      }}
    >
      <mesh castShadow>
        <cylinderGeometry args={[0.15, 0.16, 0.035, 24]} />
        <meshStandardMaterial
          color="#34443d"
          metalness={0.35}
          roughness={0.45}
        />
      </mesh>
      <mesh position={[0, 0.26, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.5, 12]} />
        <meshStandardMaterial
          color="#aa9270"
          metalness={0.75}
          roughness={0.25}
        />
      </mesh>
      <mesh position={[0, 0.54, 0]} castShadow>
        <sphereGeometry args={[0.23, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color="#3d5144"
          roughness={0.35}
          metalness={0.35}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0, 0.536, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.215, 24]} />
        <meshStandardMaterial
          color="#f6e5b9"
          emissive="#ffc37b"
          emissiveIntensity={night ? 1.5 : 0.15}
        />
      </mesh>
      {night && (
        <pointLight
          position={[0, 0.4, 0]}
          color="#ffd49e"
          intensity={0.9}
          distance={2.5}
          decay={2}
        />
      )}
    </group>
  );
}

function Room() {
  const night = useStudioStore((s) => s.nightMode);
  const shadow = useSurface("shadow");
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial
          color={night ? "#62675c" : "#d7d0c1"}
          roughness={1}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.1, 0.003, 0.6]}>
        <planeGeometry args={[6.5, 5]} />
        <meshBasicMaterial map={shadow} transparent depthWrite={false} />
      </mesh>
      <RoundedBox
        position={[0.1, 0.018, 0.8]}
        args={[4.8, 0.24, 3.65]}
        scale={[1, 0.025 / 0.24, 1]}
        radius={0.1}
        smoothness={2}
        receiveShadow
      >
        <meshStandardMaterial
          color={night ? "#6d7567" : "#b4af9d"}
          roughness={1}
        />
      </RoundedBox>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.1, 0.034, 0.6]}>
        <planeGeometry args={[4, 3.2]} />
        <meshBasicMaterial map={shadow} transparent depthWrite={false} />
      </mesh>
      {/* Architectural slats frame the room without a downloaded backdrop. */}
      {Array.from({ length: 12 }, (_, i) => (
        <mesh key={i} position={[-3.4 + i * 0.22, 1.9, -2.6]} castShadow>
          <boxGeometry args={[0.055, 3.8, 0.09]} />
          <meshStandardMaterial color="#b5a086" roughness={0.8} />
        </mesh>
      ))}
      <group position={[2.1, 0, -1.55]}>
        <mesh position={[0, 0.25, 0]} castShadow>
          <cylinderGeometry args={[0.23, 0.18, 0.5, 24]} />
          <meshStandardMaterial color="#b89579" roughness={0.95} />
        </mesh>
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <group key={i} rotation={[0, i * 2.4, 0]}>
            <mesh
              position={[0.1, 0.7 + (i % 3) * 0.12, 0]}
              rotation={[0, 0, -0.18 - (i % 3) * 0.1]}
            >
              <cylinderGeometry args={[0.008, 0.012, 0.9, 6]} />
              <meshStandardMaterial color="#475a36" />
            </mesh>
            <mesh
              position={[0.22, 1.1 + (i % 3) * 0.12, 0]}
              rotation={[0, 0, -0.55]}
              scale={[0.11, 0.32, 0.04]}
              castShadow
            >
              <sphereGeometry args={[1, 12, 8]} />
              <meshStandardMaterial
                color={i % 2 ? "#526d44" : "#698357"}
                roughness={0.85}
              />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

// Local reflection cards are captured once and reused across station changes.
const StudioEnvironment = memo(function StudioEnvironment() {
  return (
    <Environment resolution={128} frames={1}>
      <Lightformer
        position={[-3, 4, 2]}
        rotation={[0, Math.PI / 4, 0]}
        scale={[4, 5, 1]}
        intensity={3}
        color="#fff0d9"
      />
      <Lightformer
        position={[3, 2, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        scale={[3, 3, 1]}
        intensity={1.5}
        color="#e3edff"
      />
      <Lightformer
        position={[0, 5, -1]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[4, 2, 1]}
        intensity={2}
      />
    </Environment>
  );
});

function Scene({ reducedMotion }: { reducedMotion: boolean }) {
  const night = useStudioStore((s) => s.nightMode);
  const quality = useStudioStore((s) => s.quality);
  const station = useStudioStore((s) => s.station);
  const focus = useStudioStore((s) => s.focusStation);
  const navigate = useStudioStore((s) => s.navigate);
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    invalidate();
    return () => {
      document.body.style.cursor = "";
    };
  }, [night, quality, station, invalidate]);
  return (
    <>
      <color attach="background" args={[night ? "#4c514b" : "#e6e0d5"]} />
      <fog attach="fog" args={[night ? "#4c514b" : "#e6e0d5", 12, 32]} />
      <CameraDirector reducedMotion={reducedMotion} />
      <ambientLight intensity={night ? 0.25 : 0.65} />
      <hemisphereLight args={["#d8e6e8", "#9b7855", night ? 0.35 : 0.8]} />
      <directionalLight
        position={[-3, 6, 4]}
        color={night ? "#b9c9e1" : "#fff1d8"}
        intensity={night ? 0.9 : 2.8}
        castShadow={quality === "high"}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
        shadow-normalBias={0.035}
        shadow-bias={-0.0003}
      />
      <StudioEnvironment />
      <Room />
      <Desk />
      <group
        position={[-0.3, 1.165, -0.06]}
        onClick={(e) => {
          e.stopPropagation();
          if (station === "laptop") navigate("projects");
          else focus("laptop");
        }}
        onPointerOver={() => {
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "";
        }}
      >
        <Laptop open={station === "laptop"} reducedMotion={reducedMotion} />
      </group>
      <group
        position={[0.55, 0.035, 1.55]}
        rotation={[0, Math.PI - 0.3, 0]}
        onClick={(e) => {
          e.stopPropagation();
          focus("chair");
        }}
        onPointerOver={() => {
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "";
        }}
      >
        <Chair turned={station === "chair"} reducedMotion={reducedMotion} />
      </group>
      <Lamp />
    </>
  );
}

function ContextWatch({ onError }: { onError: () => void }) {
  const gl = useThree((s) => s.gl);
  useEffect(() => {
    const canvas = gl.domElement;
    const lost = (event: Event) => {
      event.preventDefault();
      onError();
    };
    canvas.addEventListener("webglcontextlost", lost);
    return () => canvas.removeEventListener("webglcontextlost", lost);
  }, [gl, onError]);
  return null;
}

export default function StudioCanvas({ onError, reducedMotion }: Props) {
  const quality = useStudioStore((s) => s.quality);
  return (
    <Canvas
      frameloop="demand"
      shadows={quality === "high"}
      dpr={quality === "high" ? [1, 1.5] : [1, 1.1]}
      camera={{ position: [5, 3.65, 6.2], fov: 38, near: 0.1, far: 80 }}
      gl={{ antialias: true, alpha: false, powerPreference: "low-power" }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.1;
      }}
      fallback={
        <div className="canvas-fallback">
          3D unavailable. Use the workspace controls to explore.
        </div>
      }
    >
      <Suspense fallback={null}>
        <Scene reducedMotion={reducedMotion} />
      </Suspense>
      <ContextWatch onError={onError} />
    </Canvas>
  );
}
