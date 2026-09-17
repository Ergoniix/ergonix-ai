"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere, Stars } from "@react-three/drei";
import * as THREE from "three";

function FloatingSphere({ position, scale, speed, distort, color }: { position:[number,number,number]; scale:number; speed:number; distort:number; color:string }) {
  return <Float speed={speed} rotationIntensity={0.45} floatIntensity={1.35}>
    <Sphere args={[1, 48, 48]} position={position} scale={scale}>
      <MeshDistortMaterial color={color} distort={distort} speed={1.35} roughness={0.12} metalness={0.9} transparent opacity={0.18} />
    </Sphere>
  </Float>;
}

function ParticleField() {
  const mesh = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const data = new Float32Array(360 * 3);
    for (let i = 0; i < 360; i++) {
      data[i*3] = (Math.random() - .5) * 20;
      data[i*3+1] = (Math.random() - .5) * 20;
      data[i*3+2] = (Math.random() - .5) * 10;
    }
    return data;
  }, []);
  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.getElapsedTime();
    mesh.current.rotation.y = t * .018;
    mesh.current.rotation.x = t * .009;
  });
  return <points ref={mesh}>
    <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry>
    <pointsMaterial size={0.03} color="#6f96ff" transparent opacity={0.58} depthWrite={false} />
  </points>;
}

function Ring({ radius, speed, color }: { radius:number; speed:number; color:string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.x = t * speed;
    ref.current.rotation.z = t * speed * .55;
  });
  return <mesh ref={ref} rotation={[1.1,0,.25]}>
    <torusGeometry args={[radius, .008, 12, 180]} />
    <meshBasicMaterial color={color} transparent opacity={.46} />
  </mesh>;
}

function Core() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.getElapsedTime() * .12;
    ref.current.rotation.x = .35 + Math.sin(state.clock.getElapsedTime()*.35) * .12;
  });
  return <mesh ref={ref}>
    <icosahedronGeometry args={[1.55, 2]} />
    <meshStandardMaterial color="#18275f" emissive="#2947bb" emissiveIntensity={.62} roughness={.1} metalness={.92} wireframe transparent opacity={.72} />
  </mesh>;
}

export default function Scene3D() {
  return <Canvas camera={{position:[0,0,8], fov:56}} dpr={[1,1.8]} gl={{antialias:true, alpha:true}}>
    <Suspense fallback={null}>
      <ambientLight intensity={.3} />
      <pointLight position={[7,8,8]} intensity={18} color="#507dff" />
      <pointLight position={[-8,-4,2]} intensity={10} color="#7d4dff" />
      <Stars radius={80} depth={45} count={1500} factor={3} saturation={0} fade speed={.35} />
      <ParticleField />
      <Core />
      <Ring radius={2.5} speed={.12} color="#527aff" />
      <Ring radius={3.35} speed={-.075} color="#8a5cff" />
      <FloatingSphere position={[-4,2,-4]} scale={1.8} speed={1.2} distort={.45} color="#2445b4" />
      <FloatingSphere position={[3.8,-1.6,-4]} scale={1.35} speed={1.7} distort={.34} color="#512ca2" />
    </Suspense>
  </Canvas>;
}
