'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useRobotStore } from '@/store/robotStore'

// Industrial colors
const COLORS = {
  base: '#3a3a3a',
  link1: '#e8530e',
  link2: '#d4a017',
  link3: '#c0c0c0',
  gripper: '#555555',
  joint: '#1a1a2e',
  accent: '#00b4d8',
}

function JointSphere({ position, size = 0.18 }: { position: [number, number, number]; size?: number }) {
  return (
    <mesh position={position} castShadow>
      <sphereGeometry args={[size, 24, 24]} />
      <meshStandardMaterial color={COLORS.joint} metalness={0.8} roughness={0.2} />
    </mesh>
  )
}

function BasePlatform() {
  return (
    <group>
      {/* Main base cylinder */}
      <mesh position={[0, 0.12, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.6, 0.24, 32]} />
        <meshStandardMaterial color={COLORS.base} metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Base ring accent */}
      <mesh position={[0, 0.25, 0]} castShadow>
        <torusGeometry args={[0.45, 0.03, 12, 32]} />
        <meshStandardMaterial color={COLORS.accent} metalness={0.9} roughness={0.1} emissive={COLORS.accent} emissiveIntensity={0.3} />
      </mesh>
      {/* Base top plate */}
      <mesh position={[0, 0.26, 0]} castShadow>
        <cylinderGeometry args={[0.38, 0.38, 0.04, 32]} />
        <meshStandardMaterial color={COLORS.base} metalness={0.6} roughness={0.4} />
      </mesh>
    </group>
  )
}

function Gripper({ gripperOpen }: { gripperOpen: number }) {
  const openness = gripperOpen / 100
  const fingerOffset = 0.05 + openness * 0.12

  return (
    <group>
      {/* Wrist connector */}
      <mesh position={[0, 0.04, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.08, 0.08, 16]} />
        <meshStandardMaterial color={COLORS.link3} metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Left finger */}
      <mesh position={[-fingerOffset, -0.1, 0]} castShadow>
        <boxGeometry args={[0.03, 0.2, 0.06]} />
        <meshStandardMaterial color={COLORS.gripper} metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Right finger */}
      <mesh position={[fingerOffset, -0.1, 0]} castShadow>
        <boxGeometry args={[0.03, 0.2, 0.06]} />
        <meshStandardMaterial color={COLORS.gripper} metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Finger tips - left */}
      <mesh position={[-fingerOffset, -0.21, 0]} castShadow>
        <boxGeometry args={[0.05, 0.02, 0.08]} />
        <meshStandardMaterial color={COLORS.accent} metalness={0.9} roughness={0.1} emissive={COLORS.accent} emissiveIntensity={0.2} />
      </mesh>
      {/* Finger tips - right */}
      <mesh position={[fingerOffset, -0.21, 0]} castShadow>
        <boxGeometry args={[0.05, 0.02, 0.08]} />
        <meshStandardMaterial color={COLORS.accent} metalness={0.9} roughness={0.1} emissive={COLORS.accent} emissiveIntensity={0.2} />
      </mesh>
    </group>
  )
}

export default function RobotArm() {
  const groupRef = useRef<THREE.Group>(null)
  const joints = useRobotStore((s) => s.joints)
  const targetJoints = useRobotStore((s) => s.targetJoints)
  const speed = useRobotStore((s) => s.speed)
  const setIsAnimating = useRobotStore((s) => s.setIsAnimating)

  // Convert degrees to radians
  const rad = useMemo(() => ({
    baseRotation: THREE.MathUtils.degToRad(joints.baseRotation),
    shoulderPitch: THREE.MathUtils.degToRad(joints.shoulderPitch),
    elbowPitch: THREE.MathUtils.degToRad(joints.elbowPitch),
    wristPitch: THREE.MathUtils.degToRad(joints.wristPitch),
    wristRoll: THREE.MathUtils.degToRad(joints.wristRoll),
  }), [joints])

  // Smooth animation towards target
  useFrame(() => {
    if (!targetJoints) return

    const current = useRobotStore.getState().joints
    const lerpFactor = 0.02 * speed
    let allReached = true

    const newJoints = { ...current }
    for (const key of Object.keys(targetJoints) as (keyof typeof targetJoints)[]) {
      const diff = targetJoints[key] - current[key]
      if (Math.abs(diff) > 0.5) {
        newJoints[key] = current[key] + diff * lerpFactor
        allReached = false
      } else {
        newJoints[key] = targetJoints[key]
      }
    }

    useRobotStore.getState().setJoints(newJoints)

    if (allReached) {
      useRobotStore.getState().setTargetJoints(null)
      setIsAnimating(false)
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Base Platform */}
      <BasePlatform />

      {/* Base rotation */}
      <group rotation={[0, rad.baseRotation, 0]} position={[0, 0.28, 0]}>
        {/* Shoulder joint */}
        <JointSphere position={[0, 0, 0]} size={0.16} />

        {/* Link 1 - Upper arm */}
        <group rotation={[0, 0, rad.shoulderPitch]}>
          <mesh position={[0, 0.45, 0]} castShadow>
            <boxGeometry args={[0.14, 0.9, 0.14]} />
            <meshStandardMaterial color={COLORS.link1} metalness={0.5} roughness={0.4} />
          </mesh>
          {/* Accent stripe on link 1 */}
          <mesh position={[0, 0.45, 0.071]} castShadow>
            <boxGeometry args={[0.1, 0.15, 0.001]} />
            <meshStandardMaterial color={COLORS.accent} metalness={0.9} roughness={0.1} emissive={COLORS.accent} emissiveIntensity={0.3} />
          </mesh>

          {/* Elbow joint */}
          <group position={[0, 0.9, 0]}>
            <JointSphere position={[0, 0, 0]} size={0.14} />

            {/* Link 2 - Forearm */}
            <group rotation={[0, 0, rad.elbowPitch]}>
              <mesh position={[0, 0.38, 0]} castShadow>
                <boxGeometry args={[0.11, 0.76, 0.11]} />
                <meshStandardMaterial color={COLORS.link2} metalness={0.5} roughness={0.4} />
              </mesh>
              {/* Accent stripe on link 2 */}
              <mesh position={[0, 0.38, 0.056]} castShadow>
                <boxGeometry args={[0.08, 0.12, 0.001]} />
                <meshStandardMaterial color={COLORS.accent} metalness={0.9} roughness={0.1} emissive={COLORS.accent} emissiveIntensity={0.3} />
              </mesh>

              {/* Wrist joint */}
              <group position={[0, 0.76, 0]}>
                <JointSphere position={[0, 0, 0]} size={0.1} />

                {/* Link 3 - Wrist */}
                <group rotation={[0, rad.wristRoll, rad.wristPitch]}>
                  <mesh position={[0, 0.15, 0]} castShadow>
                    <cylinderGeometry args={[0.05, 0.07, 0.3, 16]} />
                    <meshStandardMaterial color={COLORS.link3} metalness={0.7} roughness={0.3} />
                  </mesh>

                  {/* Gripper */}
                  <group position={[0, 0.3, 0]}>
                    <Gripper gripperOpen={joints.gripperOpen} />
                  </group>
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
  </group>
  )
}
