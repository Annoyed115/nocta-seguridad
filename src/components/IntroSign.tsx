"use client";

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { type RefObject, useMemo, useRef } from "react";
import * as THREE from "three";
import { FLY_MS, HOLD_MS, RISE_MS } from "./intro-timing";

const R = 1; // circumradius of the octagon
const DEPTH = 0.14;
const BEVEL = 0.035;
const FACE_Z = DEPTH / 2 + BEVEL + 0.002;
const LOGO_FILL = 0.976; // the octagon spans 97.6% of the logo PNG's width
const TURNS = 2; // during the rise; they end exactly as the sign arrives

function octagon() {
  const shape = new THREE.Shape();
  for (let i = 0; i < 8; i++) {
    const a = Math.PI / 8 + (i * Math.PI) / 4; // first vertex at 22.5° gives a flat top edge, like the logo
    if (i === 0) shape.moveTo(R * Math.cos(a), R * Math.sin(a));
    else shape.lineTo(R * Math.cos(a), R * Math.sin(a));
  }
  shape.closePath();
  return shape;
}

/** Octagon face whose UVs map the square logo texture onto it. */
function face(shape: THREE.Shape) {
  const geometry = new THREE.ShapeGeometry(shape);
  const pos = geometry.attributes.position;
  const half = R * Math.cos(Math.PI / 8);
  for (let i = 0; i < pos.count; i++) {
    geometry.attributes.uv.setXY(i, 0.5 + (pos.getX(i) / half) * 0.5 * LOGO_FILL, 0.5 + (pos.getY(i) / half) * 0.5 * LOGO_FILL);
  }
  return geometry;
}

type Props = { clock: RefObject<Animation | null>; onPainted: () => void };

function Sign({ clock, onPainted }: Props) {
  const frames = useRef(0);
  const group = useRef<THREE.Group>(null!);
  const loaded = useLoader(THREE.TextureLoader, "/brand/logo-1024.png"); // the flat logo's file, already in the cache
  const map = useMemo(() => {
    const texture = loaded.clone();
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    return texture;
  }, [loaded]);

  const { body, front } = useMemo(() => {
    const shape = octagon();
    const body = new THREE.ExtrudeGeometry(shape, { depth: DEPTH, bevelEnabled: true, bevelThickness: BEVEL, bevelSize: BEVEL, bevelSegments: 4, curveSegments: 1 });
    body.translate(0, 0, -DEPTH / 2);
    return { body, front: face(shape) };
  }, []);

  useFrame(() => {
    // The opening starts once a frame has been drawn (shaders compiled), so the first visible turn is never skipped.
    if (++frames.current === 2) onPainted();
    // Read the sign's own animation clock (Intro.tsx), so turn, rise and flight stay in step.
    const t = Number(clock.current?.currentTime ?? 0);
    // Rise: fast at first, slowing to a stop face-on in the centre, with a slight tilt that settles too.
    const left = 1 - Math.min(t / RISE_MS, 1);
    // Flight: the sign banks into the turn like a carried object and lands face-on again.
    const bank = Math.sin(Math.PI * Math.min(Math.max((t - RISE_MS - HOLD_MS) / FLY_MS, 0), 1));
    group.current.rotation.y = -2 * Math.PI * TURNS * left ** 3 + 0.45 * bank;
    group.current.rotation.x = 0.35 * left ** 2;
    group.current.rotation.z = 0.12 * bank;
  });

  return (
    <group ref={group}>
      <mesh geometry={body}>
        <meshStandardMaterial color="#eb5e22" roughness={0.45} metalness={0.15} />
      </mesh>
      <mesh geometry={front} position-z={FACE_Z}>
        <meshBasicMaterial map={map} transparent />
      </mesh>
      <mesh geometry={front} position-z={-FACE_Z} rotation-y={Math.PI}>
        <meshBasicMaterial map={map} transparent />
      </mesh>
    </group>
  );
}

/** The 3D NOCTA sign of the opening. Camera distance set so its face matches the flat logo, on a canvas 1.3× the logo. */
export default function IntroSign({ clock, onPainted }: Props) {
  return (
    <Canvas flat dpr={[1, 2]} camera={{ position: [0, 0, 4.7], fov: 30 }} gl={{ alpha: true, antialias: true }}>
      <ambientLight intensity={1.4} />
      <directionalLight position={[2.5, 3, 4]} intensity={2.2} />
      <Sign clock={clock} onPainted={onPainted} />
    </Canvas>
  );
}
