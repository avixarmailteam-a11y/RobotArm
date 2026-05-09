'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, Grid, ContactShadows, Float, Text } from '@react-three/drei'
import RobotArm from './RobotArm'

function SceneFloor() {
  return (
    <>
      <Grid
        position={[0, -0.01, 0]}
        args={[20, 20]}
        cellSize={0.5}
        cellThickness={0.5}
        cellColor="#444444"
        sectionSize={2}
        sectionThickness={1}
        sectionColor="#666666"
        fadeDistance={15}
        fadeStrength={1}
        infiniteGrid
      />
      <ContactShadows
        position={[0, 0, 0]}
        opacity={0.5}
        scale={10}
        blur={2}
        far={4}
      />
    </>
  )
}

function AxisHelper() {
  return (
    <group position={[0, 0.01, 0]}>
      {/* X axis - Red */}
      <mesh position={[0.5, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <cylinderGeometry args={[0.005, 0.005, 1, 8]} />
        <meshStandardMaterial color="#ff3333" emissive="#ff3333" emissiveIntensity={0.5} />
      </mesh>
      {/* Y axis - Green */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.005, 0.005, 1, 8]} />
        <meshStandardMaterial color="#33ff33" emissive="#33ff33" emissiveIntensity={0.5} />
      </mesh>
      {/* Z axis - Blue */}
      <mesh position={[0, 0, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.005, 0.005, 1, 8]} />
        <meshStandardMaterial color="#3366ff" emissive="#3366ff" emissiveIntensity={0.5} />
      </mesh>
    </group>
  )
}

function SceneLabel() {
  return (
    <Float speed={1} rotationIntensity={0} floatIntensity={0.5}>
      <Text
        position={[0, 3.2, 0]}
        fontSize={0.2}
        color="#00b4d8"
        anchorX="center"
        anchorY="middle"
      >
        {'AI Robot Kol v1.0'}
      </Text>
    </Float>
  )
}

function TargetObject() {
  return (
    <group position={[1.5, 0.3, 1]}>
      <mesh castShadow>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshStandardMaterial color="#ff6b35" metalness={0.3} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.22, 0]}>
        <boxGeometry args={[0.25, 0.04, 0.25]} />
        <meshStandardMaterial color="#ff9f1c" metalness={0.3} roughness={0.5} />
      </mesh>
    </group>
  )
}

export default function RobotScene() {
  return (
    <Canvas
      shadows
      camera={{ position: [3, 3, 3], fov: 50 }}
      gl={{ antialias: true, alpha: false }}
      style={{ background: 'linear-gradient(180deg, #0a0a1a 0%, #1a1a2e 50%, #16213e 100%)' }}
    >
      <Suspense fallback={null}>
        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <directionalLight
          position={[5, 8, 5]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        <directionalLight position={[-3, 5, -3]} intensity={0.4} />
        <pointLight position={[0, 4, 0]} intensity={0.5} color="#00b4d8" />
        <spotLight
          position={[0, 6, 0]}
          angle={0.5}
          penumbra={0.8}
          intensity={0.8}
          castShadow
          color="#ffffff"
        />

        {/* Environment for reflections */}
        <Environment preset="city" />

        {/* Scene elements */}
        <SceneFloor />
        <AxisHelper />
        <RobotArm />
        <TargetObject />
        <SceneLabel />

        {/* Camera Controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={1.5}
          maxDistance={12}
          target={[0, 1, 0]}
          maxPolarAngle={Math.PI * 0.85}
        />
      </Suspense>
    </Canvas>
  )
}
