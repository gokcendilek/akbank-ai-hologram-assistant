import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function FallbackAvatar({ isSpeaking }) {
  const groupRef = useRef()
  const meshRef = useRef()

  useFrame((state, delta) => {
    if (groupRef.current) {
      if (isSpeaking) {
        groupRef.current.rotation.y += delta
        meshRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 5) * 0.1
      } else {
        groupRef.current.rotation.y += delta * 0.2
      }
    }
  })

  return (
    <group ref={groupRef}>
      {/* İnsan silüeti */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <capsuleGeometry args={[0.5, 1.5, 4, 8]} />
        <meshPhongMaterial 
          color="#00ffaa" 
          emissive="#008855"
          transparent
          opacity={0.8}
          shininess={100}
        />
      </mesh>
      
      {/* Baş */}
      <mesh position={[0, 1.1, 0]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshPhongMaterial 
          color="#00ffaa" 
          emissive="#008855"
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Hologram efekti */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.8, 1.2, 32]} />
        <meshBasicMaterial color="#00ffaa" transparent opacity={0.4} />
      </mesh>
    </group>
  )
}

export default FallbackAvatar