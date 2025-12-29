import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, PerspectiveCamera, Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import './HologramMaterial';

const NeuralOrb = () => {
  const groupRef = useRef<THREE.Group>(null);
  const shellRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const { mouse } = useThree();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    // Smooth Mouse Tracking with Weight
    if (groupRef.current) {
      const targetX = mouse.y * 0.4;
      const targetY = mouse.x * 0.5;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetX, 0.05);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetY, 0.05);
      
      // Gentle floating
      groupRef.current.position.y = Math.sin(t * 0.5) * 0.15;
    }

    // Animate Inner Core (The "Brain")
    if (coreRef.current) {
      const pulse = 0.8 + Math.sin(t * 2) * 0.1;
      coreRef.current.scale.setScalar(pulse);
      (coreRef.current.material as any).uPulse = pulse;
    }

    // Rotate the Shell slowly
    if (shellRef.current) {
      shellRef.current.rotation.y = t * 0.1;
    }

    // Animate the equatorial ring
    if (ringRef.current) {
      ringRef.current.rotation.z = -t * 0.5;
    }
  });

  return (
    <group ref={groupRef}>
      {/* 1. OUTER CRYSTALLINE SHELL */}
      <mesh ref={shellRef}>
        <icosahedronGeometry args={[1.5, 1]} />
        <hologramMaterialImpl 
          transparent 
          uOpacity={0.25} 
          uEdgeStrength={3.0}
          uScanStrength={0.4}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 2. WIREFRAME OVERLAY (Technical Detail) */}
      <mesh scale={1.51}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color="#FF4D00" wireframe transparent opacity={0.08} />
      </mesh>

      {/* 3. THE NEURAL CORE (The Light) */}
      <mesh ref={coreRef} scale={0.4}>
        <sphereGeometry args={[1, 32, 32]} />
        <hologramMaterialImpl 
          uColorA={new THREE.Color('#FF4D00')}
          uOpacity={0.9}
          uEdgeStrength={6.0}
          transparent 
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 4. THE APERTURE RING (Data Flow) */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.8, 0.015, 16, 100]} />
        <hologramMaterialImpl 
          uColorA={new THREE.Color('#FFFFFF')}
          uOpacity={0.4}
          transparent 
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 5. ATMOSPHERIC HALO */}
      <mesh scale={2.2}>
        <sphereGeometry args={[1, 32, 32]} />
        <hologramMaterialImpl 
          uOpacity={0.05} 
          uEdgeStrength={2.0} 
          transparent 
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};

const Scene = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas alpha dpr={[1, 2]} gl={{ antialias: true }}>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={35} />
        
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color="#FF4D00" />
        <pointLight position={[-10, -10, -5]} color="#FFFFFF" intensity={0.5} />

        <NeuralOrb />
        
        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={0.5} />
        
        <fog attach="fog" args={['#050505', 5, 20]} />
      </Canvas>
    </div>
  );
};

export default Scene;
