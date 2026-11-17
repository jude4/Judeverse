"use client";

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

type Motion = { reducedMotion?: boolean };

/** Original screen artwork, generated locally; no remote fonts or product screenshots. */
function useLaptopScreen() {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 640;
    const c = canvas.getContext("2d")!;
    const background = c.createLinearGradient(0, 0, 1024, 640);
    background.addColorStop(0, "#182e35");
    background.addColorStop(1, "#0b171c");
    c.fillStyle = background;
    c.fillRect(0, 0, 1024, 640);
    c.fillStyle = "#c7b28e";
    c.font = "16px sans-serif";
    c.fillText("U.J.O.  /  DIGITAL WORKSPACE", 52, 55);
    c.fillStyle = "#f4eee1";
    c.font = "54px sans-serif";
    c.fillText("Selected work", 52, 145);
    c.fillStyle = "#a8bdb8";
    c.font = "20px sans-serif";
    c.fillText("Thoughtful engineering. Useful products.", 54, 190);
    const colors = ["#a9c5b3", "#c6b58d", "#a9b7cf"];
    for (let i = 0; i < 3; i++) {
      const x = 52 + i * 313;
      c.fillStyle = "#233b40";
      c.fillRect(x, 250, 290, 263);
      c.fillStyle = colors[i];
      c.fillRect(x + 20, 273, 38, 3);
      c.font = "20px sans-serif";
      c.fillText(["Products", "Systems", "Experiments"][i], x + 20, 323);
      c.strokeStyle = colors[i];
      c.lineWidth = 2;
      c.beginPath();
      c.arc(x + 145, 414, 43, 0, Math.PI * 2);
      c.stroke();
      c.beginPath();
      c.moveTo(x + 125, 434);
      c.lineTo(x + 165, 394);
      c.moveTo(x + 138, 394);
      c.lineTo(x + 165, 394);
      c.lineTo(x + 165, 421);
      c.stroke();
    }
    c.fillStyle = "#7c9795";
    c.font = "15px sans-serif";
    c.fillText("EXPLORE THE WORKSPACE", 52, 583);
    c.fillStyle = "#b8c9b7";
    c.beginPath();
    c.arc(958, 579, 5, 0, Math.PI * 2);
    c.fill();
    const result = new THREE.CanvasTexture(canvas);
    result.colorSpace = THREE.SRGBColorSpace;
    return result;
  }, []);
  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
}

function Keyboard() {
  const keys = useRef<THREE.InstancedMesh>(null);
  const positions = useMemo(() => {
    const result: { x: number; z: number; width: number; depth: number }[] = [];
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 13; col++) {
        result.push({
          x: -0.563 + col * 0.094,
          z: -0.335 + row * 0.093,
          width: 0.079,
          depth: row === 0 ? 0.045 : 0.074,
        });
      }
    }
    result.push({ x: 0, z: 0.139, width: 0.48, depth: 0.072 });
    for (const x of [-0.56, -0.46, -0.36, 0.36, 0.46, 0.56])
      result.push({ x, z: 0.139, width: 0.079, depth: 0.072 });
    return result;
  }, []);
  useLayoutEffect(() => {
    if (!keys.current) return;
    const transform = new THREE.Object3D();
    positions.forEach((key, i) => {
      transform.position.set(key.x, 0.079, key.z);
      transform.scale.set(key.width, 0.011, key.depth);
      transform.updateMatrix();
      keys.current!.setMatrixAt(i, transform.matrix);
    });
    keys.current.instanceMatrix.needsUpdate = true;
    keys.current.computeBoundingSphere();
  }, [positions]);
  return (
    <instancedMesh ref={keys} args={[undefined, undefined, positions.length]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#172025" roughness={0.73} metalness={0.1} />
    </instancedMesh>
  );
}

/** Dimensions: 1.6 × 1.05. Origin is the underside, hinge is at z=-.48. */
export function Laptop({
  open,
  reducedMotion = false,
}: { open: boolean } & Motion) {
  const lid = useRef<THREE.Group>(null);
  const invalidate = useThree((s) => s.invalidate);
  const screen = useLaptopScreen();
  const target = open ? -0.16 : Math.PI / 2;
  const initialAngle = useRef(target);
  useEffect(() => {
    invalidate();
  }, [open, reducedMotion, invalidate]);
  useFrame((_, dt) => {
    if (!lid.current) return;
    const current = lid.current.rotation.x;
    if (Math.abs(current - target) > 0.0005) {
      lid.current.rotation.x = reducedMotion
        ? target
        : THREE.MathUtils.damp(current, target, 8, Math.min(dt, 0.1));
      invalidate();
    } else lid.current.rotation.x = target;
  });
  return (
    <group>
      <RoundedBox
        position={[0, 0.037, 0]}
        args={[1.6, 0.074, 1.05]}
        radius={0.028}
        smoothness={3}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color="#aab0b5"
          metalness={0.82}
          roughness={0.27}
        />
      </RoundedBox>
      <RoundedBox
        position={[0, 0.073, -0.095]}
        args={[1.28, 0.06, 0.68]}
        scale={[1, 0.008 / 0.06, 1]}
        radius={0.026}
        smoothness={2}
      >
        <meshStandardMaterial
          color="#616a70"
          metalness={0.55}
          roughness={0.4}
        />
      </RoundedBox>
      <Keyboard />
      {/* Glass trackpad, cut line and front opening notch. */}
      <RoundedBox
        position={[0, 0.076, 0.344]}
        args={[0.52, 0.04, 0.267]}
        scale={[1, 0.1, 1]}
        radius={0.018}
        smoothness={2}
      >
        <meshStandardMaterial
          color="#8e989f"
          metalness={0.45}
          roughness={0.31}
        />
      </RoundedBox>
      <mesh position={[0, 0.049, 0.526]}>
        <boxGeometry args={[0.19, 0.015, 0.002]} />
        <meshStandardMaterial
          color="#646e75"
          metalness={0.7}
          roughness={0.35}
        />
      </mesh>
      {/* Short inset perforation strips suggest the stereo speaker grilles. */}
      {[-0.713, 0.713].map((x) => (
        <group key={x} position={[x, 0.077, -0.09]}>
          {Array.from({ length: 8 }, (_, i) => (
            <mesh key={i} position={[0, 0, -0.27 + i * 0.075]}>
              <boxGeometry args={[0.037, 0.002, 0.032]} />
              <meshStandardMaterial color="#596269" roughness={0.9} />
            </mesh>
          ))}
        </group>
      ))}
      {/* USB-C slots and audio jack, on the actual side faces. */}
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 0.801, 0.041, -0.28]}>
          <mesh>
            <boxGeometry args={[0.003, 0.014, 0.065]} />
            <meshStandardMaterial color="#20282d" roughness={0.7} />
          </mesh>
          <mesh position={[0, 0, 0.12]}>
            <boxGeometry args={[0.003, 0.014, 0.065]} />
            <meshStandardMaterial color="#20282d" roughness={0.7} />
          </mesh>
        </group>
      ))}
      <mesh position={[-0.802, 0.041, 0.13]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.011, 0.011, 0.004, 10]} />
        <meshStandardMaterial color="#1c2429" />
      </mesh>
      <mesh position={[0, 0.076, -0.48]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.028, 0.028, 1.34, 16]} />
        <meshStandardMaterial
          color="#687279"
          metalness={0.75}
          roughness={0.3}
        />
      </mesh>
      <group
        ref={lid}
        position={[0, 0.077, -0.48]}
        rotation={[initialAngle.current, 0, 0]}
      >
        <RoundedBox
          position={[0, 0.49, 0]}
          args={[1.6, 0.98, 0.06]}
          scale={[1, 1, 0.037 / 0.06]}
          radius={0.027}
          smoothness={3}
          castShadow
        >
          <meshStandardMaterial
            color="#aab0b5"
            metalness={0.82}
            roughness={0.27}
          />
        </RoundedBox>
        {/* An original engraved orbit mark on the outside of the lid. */}
        <group position={[0, 0.53, -0.0195]} rotation={[0, Math.PI, 0]}>
          <mesh>
            <ringGeometry args={[0.067, 0.071, 40]} />
            <meshStandardMaterial
              color="#818b92"
              metalness={0.86}
              roughness={0.35}
            />
          </mesh>
          <mesh position={[0.048, 0.047, 0.0005]}>
            <circleGeometry args={[0.012, 12]} />
            <meshStandardMaterial
              color="#818b92"
              metalness={0.86}
              roughness={0.35}
            />
          </mesh>
        </group>
        <RoundedBox
          position={[0, 0.49, 0.021]}
          args={[1.548, 0.92, 0.06]}
          scale={[1, 1, 1 / 6]}
          radius={0.025}
          smoothness={2}
        >
          <meshStandardMaterial
            color="#11191d"
            roughness={0.24}
            metalness={0.25}
          />
        </RoundedBox>
        <mesh position={[0, 0.49, 0.027]}>
          <planeGeometry args={[1.476, 0.839]} />
          <meshBasicMaterial map={screen} toneMapped={false} />
        </mesh>
        <RoundedBox
          position={[0, 0.92, 0.029]}
          args={[0.13, 0.043, 0.03]}
          scale={[1, 1, 1 / 6]}
          radius={0.011}
          smoothness={2}
        >
          <meshStandardMaterial color="#10171c" />
        </RoundedBox>
        <mesh position={[0, 0.926, 0.033]}>
          <circleGeometry args={[0.006, 12]} />
          <meshStandardMaterial
            color="#263b4b"
            metalness={0.5}
            roughness={0.17}
          />
        </mesh>
      </group>
    </group>
  );
}

function useFabricTexture() {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 32;
    const c = canvas.getContext("2d")!;
    c.fillStyle = "#969696";
    c.fillRect(0, 0, 32, 32);
    c.fillStyle = "#676767";
    for (let i = 0; i < 32; i += 4) {
      c.fillRect(i, 0, 1, 32);
      c.fillRect(0, i, 32, 1);
    }
    const result = new THREE.CanvasTexture(canvas);
    result.wrapS = result.wrapT = THREE.RepeatWrapping;
    return result;
  }, []);
  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
}

function useBackGeometry() {
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const vertices: number[] = [],
      uv: number[] = [],
      indices: number[] = [];
    const columns = 16,
      rows = 14;
    for (let y = 0; y <= rows; y++)
      for (let x = 0; x <= columns; x++) {
        const u = x / columns,
          v = y / rows;
        const width = 0.63 - 0.055 * Math.sin(v * Math.PI);
        vertices.push(
          (u - 0.5) * width,
          0.76 + v * 0.72,
          -0.29 -
            v * 0.14 +
            0.064 * Math.sin(v * Math.PI) +
            0.075 * (2 * u - 1) ** 2,
        );
        uv.push(u * 4, v * 5);
        if (x < columns && y < rows) {
          const a = y * (columns + 1) + x,
            b = a + columns + 1;
          indices.push(a, a + 1, b, a + 1, b + 1, b);
        }
      }
    g.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
    g.setIndex(indices);
    g.computeVertexNormals();
    return g;
  }, []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return geometry;
}

function Tube({
  points,
  radius = 0.017,
  color = "#3a4448",
}: {
  points: [number, number, number][];
  radius?: number;
  color?: string;
}) {
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p))),
    [points],
  );
  return (
    <mesh castShadow>
      <tubeGeometry args={[curve, 16, radius, 6, false]} />
      <meshStandardMaterial color={color} metalness={0.65} roughness={0.37} />
    </mesh>
  );
}

/** Compact ergonomic chair. Upper assembly swivels; base stays planted. */
export function Chair({
  turned,
  reducedMotion = false,
}: { turned: boolean } & Motion) {
  const swivel = useRef<THREE.Group>(null);
  const invalidate = useThree((s) => s.invalidate);
  const back = useBackGeometry();
  const fabric = useFabricTexture();
  const target = turned ? -0.85 : 0.13;
  const initialAngle = useRef(target);
  useEffect(() => {
    invalidate();
  }, [turned, reducedMotion, invalidate]);
  useFrame((_, dt) => {
    if (!swivel.current) return;
    const current = swivel.current.rotation.y;
    if (Math.abs(current - target) > 0.0005) {
      swivel.current.rotation.y = reducedMotion
        ? target
        : THREE.MathUtils.damp(current, target, 6, Math.min(dt, 0.1));
      invalidate();
    } else swivel.current.rotation.y = target;
  });
  return (
    <group>
      <mesh position={[0, 0.315, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.048, 0.39, 16]} />
        <meshStandardMaterial
          color="#68747a"
          metalness={0.9}
          roughness={0.22}
        />
      </mesh>
      <mesh position={[0, 0.19, 0]}>
        <cylinderGeometry args={[0.063, 0.075, 0.18, 16]} />
        <meshStandardMaterial
          color="#232e32"
          roughness={0.55}
          metalness={0.3}
        />
      </mesh>
      {Array.from({ length: 5 }, (_, i) => (
        <group key={i} rotation={[0, (i * Math.PI * 2) / 5, 0]}>
          <Tube
            points={[
              [0, 0.18, 0],
              [0, 0.155, 0.2],
              [0, 0.13, 0.43],
            ]}
            radius={0.032}
            color="#6f7b80"
          />
          <mesh position={[0, 0.112, 0.43]}>
            <boxGeometry args={[0.07, 0.07, 0.065]} />
            <meshStandardMaterial color="#263035" roughness={0.55} />
          </mesh>
          {[-0.037, 0.037].map((x) => (
            <mesh
              key={x}
              position={[x, 0.06, 0.43]}
              rotation={[0, 0, Math.PI / 2]}
              castShadow
            >
              <cylinderGeometry args={[0.059, 0.059, 0.034, 12]} />
              <meshStandardMaterial color="#172126" roughness={0.88} />
            </mesh>
          ))}
        </group>
      ))}
      <group ref={swivel} rotation={[0, initialAngle.current, 0]}>
        <RoundedBox
          position={[0, 0.62, 0]}
          args={[0.68, 0.13, 0.65]}
          radius={0.055}
          smoothness={3}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial
            color="#344448"
            roughness={0.94}
            bumpMap={fabric}
            bumpScale={0.002}
          />
        </RoundedBox>
        <RoundedBox
          position={[0, 0.544, -0.014]}
          args={[0.59, 0.08, 0.54]}
          scale={[1, 0.033 / 0.08, 1]}
          radius={0.035}
          smoothness={2}
        >
          <meshStandardMaterial color="#202b30" roughness={0.57} />
        </RoundedBox>
        <mesh position={[0, 0.49, -0.05]}>
          <boxGeometry args={[0.25, 0.075, 0.24]} />
          <meshStandardMaterial color="#202b30" roughness={0.57} />
        </mesh>
        <mesh geometry={back} castShadow receiveShadow>
          <meshStandardMaterial
            color="#405357"
            roughness={0.96}
            bumpMap={fabric}
            bumpScale={0.002}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Tailored edge piping follows the curved upholstery. */}
        <Tube
          points={[
            [-0.315, 0.76, -0.215],
            [-0.29, 1.08, -0.25],
            [-0.315, 1.48, -0.355],
            [0, 1.495, -0.43],
            [0.315, 1.48, -0.355],
            [0.29, 1.08, -0.25],
            [0.315, 0.76, -0.215],
          ]}
          radius={0.019}
        />
        <Tube
          points={[
            [-0.315, 0.76, -0.215],
            [0, 0.75, -0.29],
            [0.315, 0.76, -0.215],
          ]}
          radius={0.018}
        />
        <Tube
          points={[
            [0, 0.51, -0.2],
            [0, 0.8, -0.37],
            [0, 1.15, -0.425],
            [0, 1.43, -0.46],
          ]}
          radius={0.024}
        />
        <RoundedBox
          position={[0, 0.94, -0.343]}
          args={[0.42, 0.084, 0.06]}
          scale={[1, 1, 0.75]}
          radius={0.025}
          smoothness={2}
        >
          <meshStandardMaterial color="#29373c" roughness={0.8} />
        </RoundedBox>
        {[-1, 1].map((side) => (
          <group key={side}>
            <Tube
              points={[
                [side * 0.29, 0.55, -0.17],
                [side * 0.4, 0.69, -0.17],
                [side * 0.4, 0.85, 0.04],
              ]}
              radius={0.019}
            />
            <RoundedBox
              position={[side * 0.4, 0.874, 0.045]}
              args={[0.105, 0.047, 0.36]}
              radius={0.022}
              smoothness={2}
              castShadow
            >
              <meshStandardMaterial color="#263439" roughness={0.84} />
            </RoundedBox>
          </group>
        ))}
        <mesh position={[0.21, 0.505, 0.04]} rotation={[0, 0, -0.2]}>
          <boxGeometry args={[0.18, 0.025, 0.045]} />
          <meshStandardMaterial color="#263237" roughness={0.7} />
        </mesh>
      </group>
    </group>
  );
}
