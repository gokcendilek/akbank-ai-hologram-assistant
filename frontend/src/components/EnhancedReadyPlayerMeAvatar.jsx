import React, { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { MixamoAnimationManager } from '../utils/mixamoAnimations'


function EnhancedReadyPlayerMeAvatar({ isSpeaking, mouthAmplitude = 0, avatarUrl, onLoad }) {
  const groupRef = useRef()
  const { scene } = useGLTF(avatarUrl, true)
  const [loaded, setLoaded] = useState(false)
  const mixamoRef = useRef(null)

  
  const faceRef = useRef(null)
  const primaryMouthIdx = useRef(-1)
  const headMeshRef = useRef(null)
  const eyeLeftRef = useRef(null)
  const eyeRightRef = useRef(null)
  const jawBoneRef = useRef(null)

  const blinkTimer = useRef(0)
  const blinking = useRef(false)
  const smoothAmp = useRef(0)

  useEffect(() => {
    if (!scene || loaded) return

    
    scene.traverse((child) => {
      if (child.isMesh) {
        if (child.material) {
          child.material.morphTargets = true
          child.material.morphNormals = true
          if ('roughness' in child.material) child.material.roughness = 0.4
          if ('metalness' in child.material) child.material.metalness = 0.1
          if ('transparent' in child.material) child.material.transparent = true
          if ('opacity' in child.material) child.material.opacity = 0.97
        }
        child.castShadow = true
        child.receiveShadow = true

        const nm = (child.name || '').toLowerCase()
        if (!headMeshRef.current && (nm.includes('head') || child.name === 'Wolf3D_Head')) headMeshRef.current = child
        if (!eyeLeftRef.current && nm.includes('eye') && nm.includes('left')) eyeLeftRef.current = child
        if (!eyeRightRef.current && nm.includes('eye') && nm.includes('right')) eyeRightRef.current = child
      }
      if (child.isBone) {
        const nm = (child.name || '').toLowerCase()
        if (!jawBoneRef.current && (nm.includes('jaw') || nm === 'jaw')) jawBoneRef.current = child
      }
    })

  
    let foundFace = null
    scene.traverse((c) => {
      if ((c.isSkinnedMesh || c.isMesh) && c.morphTargetDictionary && c.morphTargetInfluences) {
        if (!foundFace) foundFace = c
      }
    })

    if (foundFace) {
      faceRef.current = foundFace
      const dict = foundFace.morphTargetDictionary
      const keys = Object.keys(dict || {})
      console.log('🧩 MorphTarget keys:', keys)

      const pick = (cands) => {
        for (const c of cands) {
          const exact = keys.find(k => k.toLowerCase() === c.toLowerCase())
          if (exact) return dict[exact]
          const contains = keys.find(k => k.toLowerCase().includes(c.toLowerCase()))
          if (contains) return dict[contains]
        }
        return -1
      }
      let idx = pick(['mouthOpen', 'viseme_aa', 'aa', 'jawOpen'])
      if (idx < 0) idx = pick(['mouthSmile','smile'])
      primaryMouthIdx.current = idx
      console.log('📌 primaryMouthIdx:', primaryMouthIdx.current)
    } else {
      console.warn('⚠️ Morph target mesh yok; bone/procedürel fallback kullanılacak.')
    }

    // Boyut/pozisyon
    if (groupRef.current) {
      groupRef.current.scale.set(1.06, 1.06, 1.06)
      groupRef.current.position.set(0, -0.95, 0)
    }

    // MIXAMO: mixer + klipleri yükle
    const mgr = new MixamoAnimationManager(scene)
    mixamoRef.current = mgr
    mgr.loadDefaultAnimations().then(() => {
      
      mgr.goIdle()
    })

    setLoaded(true)
    onLoad && onLoad()
  }, [scene, loaded, onLoad])

  // konuşma/dinleme durumuna göre Mixamo aksiyonu
  useEffect(() => {
    const mgr = mixamoRef.current
    if (!mgr) return
    if (isSpeaking) mgr.startSpeaking()
    else mgr.goIdle()
  }, [isSpeaking])

  useFrame((state, delta) => {
    if (!loaded || !groupRef.current) return
    const t = state.clock.elapsedTime

    
    if (mixamoRef.current) mixamoRef.current.update(delta)

    
    const baseY = -0.95 + Math.sin(t * 0.7) * 0.02
    groupRef.current.position.y = baseY
    if (isSpeaking) {
      groupRef.current.rotation.y = Math.sin(t * 0.6) * 0.12
      groupRef.current.rotation.x = Math.sin(t * 0.4) * 0.06
    } else {
      groupRef.current.rotation.y = Math.sin(t * 0.15) * 0.04
      groupRef.current.rotation.x = 0
    }

    // lipsync amp yumuşatma
    const boosted = Math.min(1, mouthAmplitude * 3.5 + 0.2)
    smoothAmp.current = THREE.MathUtils.lerp(smoothAmp.current, boosted, 0.25)
    const amp = smoothAmp.current

    // Blink
    blinkTimer.current += delta
    if (!blinking.current && blinkTimer.current > 2 + Math.random() * 2) {
      blinking.current = true
      blinkTimer.current = 0
      setTimeout(() => (blinking.current = false), 120)
    }
    const blinkScale = blinking.current ? 0.06 : 1

    // Ağız
    if (faceRef.current && primaryMouthIdx.current >= 0) {
      const infl = faceRef.current.morphTargetInfluences
      infl[primaryMouthIdx.current] = isSpeaking ? amp : Math.max(0, infl[primaryMouthIdx.current] - delta * 3)
    } else if (jawBoneRef.current) {
      const target = isSpeaking ? amp * 0.45 : 0
      jawBoneRef.current.rotation.x = THREE.MathUtils.lerp(jawBoneRef.current.rotation.x, target, 0.35)
    } else if (headMeshRef.current) {
      if (isSpeaking) {
        headMeshRef.current.position.y = THREE.MathUtils.lerp(headMeshRef.current.position.y, -amp * 0.07, 0.35)
        headMeshRef.current.scale.y = THREE.MathUtils.lerp(headMeshRef.current.scale.y, 1 - amp * 0.28, 0.35)
        headMeshRef.current.rotation.x = THREE.MathUtils.lerp(headMeshRef.current.rotation.x, amp * 0.12, 0.35)
      } else {
        headMeshRef.current.position.y = THREE.MathUtils.lerp(headMeshRef.current.position.y, 0, 0.35)
        headMeshRef.current.scale.y = THREE.MathUtils.lerp(headMeshRef.current.scale.y, 1, 0.35)
        headMeshRef.current.rotation.x = THREE.MathUtils.lerp(headMeshRef.current.rotation.x, 0, 0.35)
      }
    }

    // Blink fallback
    if (eyeLeftRef.current)  eyeLeftRef.current.scale.y  = THREE.MathUtils.lerp(eyeLeftRef.current.scale.y,  blinkScale, 0.6)
    if (eyeRightRef.current) eyeRightRef.current.scale.y = THREE.MathUtils.lerp(eyeRightRef.current.scale.y, blinkScale, 0.6)
  })

  if (!loaded) {
    return (
      <group ref={groupRef}>
        <mesh>
          <boxGeometry args={[0.5, 1.2, 0.3]} />
          <meshStandardMaterial color="#00ffaa" transparent opacity={0.5} />
        </mesh>
      </group>
    )
  }

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
      <spotLight position={[2, 3, 2]} angle={0.4} penumbra={0.5} intensity={0.7} color="#00ffaa" castShadow />
      <pointLight position={[-2, 1, -1]} intensity={0.35} color="#0088ff" />
    </group>
  )
}

export default EnhancedReadyPlayerMeAvatar
