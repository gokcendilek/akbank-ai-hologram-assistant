import React, { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { findFaceBlendshapes } from '../utils/findMorphTargets'

function SimpleAnimatedAvatar({ isSpeaking, isListening, avatarUrl, mouthAmplitude = 0 }) {
  const groupRef = useRef()
  const { scene } = useGLTF(avatarUrl, true)
  const [loaded, setLoaded] = useState(false)
  const faceRef = useRef(null)
  const morphIdx = useRef({ jawOpen: -1, mouthOpen: -1, eyeBlinkLeft: -1, eyeBlinkRight: -1 })
  const blinkTimer = useRef(0)
  const blinking = useRef(false)

  useEffect(() => {
    if (!scene || !groupRef.current) return

    scene.traverse((child) => {
      if (child.isMesh) {
        if (child.material) {
          child.material.morphTargets = true
          child.material.morphNormals = true
          child.material.roughness = 0.4
          child.material.metalness = 0.1
        }
        child.castShadow = true
        child.receiveShadow = true
      }
    })

    
    const found = findFaceBlendshapes(scene)
    faceRef.current = found.faceMesh
    morphIdx.current = found.idx

    
    groupRef.current.scale.set(1.3, 1.3, 1.3)
    groupRef.current.position.set(0, -0.6, 0)

    setLoaded(true)
  }, [scene])

  useFrame((state, delta) => {
    if (!loaded || !groupRef.current) return

    const time = state.clock.elapsedTime

    
    const baseY = -0.6 + Math.sin(time * 0.8) * 0.02
    groupRef.current.position.y = baseY

    if (isSpeaking) {
      groupRef.current.rotation.y = Math.sin(time * 0.6) * 0.15
      groupRef.current.rotation.x = Math.sin(time * 0.4) * 0.08
    } else if (isListening) {
      groupRef.current.rotation.y = Math.sin(time * 0.3) * 0.08
      groupRef.current.rotation.x = 0.04
    } else {
      groupRef.current.rotation.y = Math.sin(time * 0.15) * 0.05
      groupRef.current.rotation.x = 0
    }

    
    if (faceRef.current && faceRef.current.morphTargetInfluences) {
      const infl = faceRef.current.morphTargetInfluences
      const { jawOpen, mouthOpen, eyeBlinkLeft, eyeBlinkRight } = morphIdx.current

      
      const amt = THREE.MathUtils.clamp(mouthAmplitude, 0, 1)

      if (jawOpen >= 0) infl[jawOpen] = amt
      if (mouthOpen >= 0) infl[mouthOpen] = Math.max(0, amt * 0.8)

      
      blinkTimer.current += delta
      if (!blinking.current && blinkTimer.current > 2 + Math.random() * 2) {
        blinking.current = true
        blinkTimer.current = 0
        
        setTimeout(() => { blinking.current = false }, 120)
      }

      const blinkVal = blinking.current ? 1.0 : 0.0
      if (eyeBlinkLeft >= 0) infl[eyeBlinkLeft] = blinkVal
      if (eyeBlinkRight >= 0) infl[eyeBlinkRight] = blinkVal
    }
  })

  if (!loaded) {
    return (
      <group ref={groupRef}>
        <mesh>
          <boxGeometry args={[0.3, 0.6, 0.2]} />
          <meshStandardMaterial color="#00ffaa" />
        </mesh>
      </group>
    )
  }

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  )
}

export default SimpleAnimatedAvatar
