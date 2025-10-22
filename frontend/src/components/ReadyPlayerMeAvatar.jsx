import React, { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

function ReadyPlayerMeAvatar({ isSpeaking, isListening, avatarUrl, onError, animationManager }) {
  const groupRef = useRef()
  const [modelLoaded, setModelLoaded] = useState(false)
  const [mixer, setMixer] = useState(null)
  const mouthRef = useRef()
  const eyeRefs = useRef([])

  const { scene, animations } = useGLTF(avatarUrl, true)

 
  useEffect(() => {
    if (animationManager) {
      animationManager.setSpeaking(isSpeaking)
      animationManager.setListening(isListening)
    }
  }, [isSpeaking, isListening, animationManager])

  useEffect(() => {
    if (scene && groupRef.current) {
      console.log('✅ Avatar yüklendi, animasyonlar:', animations?.length)
      
      try {
     
        if (animations && animations.length > 0) {
          const newMixer = new THREE.AnimationMixer(scene)
          setMixer(newMixer)
          
          
          animations.forEach((clip) => {
            const action = newMixer.clipAction(clip)
            action.play()
            console.log(`🎬 Animasyon yüklendi: ${clip.name}`)
          })
        }

      
        scene.traverse((child) => {
          if (child.isMesh) {
           
            if (child.name.toLowerCase().includes('mouth') || 
                child.name.toLowerCase().includes('lip')) {
              mouthRef.current = child
            }
            
            if (child.name.toLowerCase().includes('eye') || 
                child.name.toLowerCase().includes('eyeball')) {
              eyeRefs.current.push(child)
            }

            
            child.material = new THREE.MeshStandardMaterial({
              map: child.material.map, 
              color: new THREE.Color(0.95, 0.92, 0.88), 
              roughness: 0.4,
              metalness: 0.1,
              transparent: false,
              opacity: 1.0,
            })

            child.castShadow = true
            child.receiveShadow = true
          }
        })

        
        groupRef.current.scale.set(1.8, 1.8, 1.8)
        groupRef.current.position.set(0, -1.2, 0)
        
        setModelLoaded(true)
        
      } catch (error) {
        console.error('❌ Avatar işleme hatası:', error)
        if (onError) onError(error)
      }
    }
  }, [scene, animations, avatarUrl, onError])

  
  useFrame((state, delta) => {
   
    if (mixer) {
      mixer.update(delta)
    }

    
    if (animationManager) {
      animationManager.update(delta)
    }

    if (groupRef.current && modelLoaded && animationManager) {
      const time = state.clock.elapsedTime

     
      if (mouthRef.current) {
        const mouthMovement = animationManager.getMouthMovement()
        mouthRef.current.scale.y = 1 + mouthMovement * 0.5
        mouthRef.current.position.y = mouthMovement * 0.02
      }

    
      if (animationManager.shouldBlink() && eyeRefs.current.length > 0) {
        eyeRefs.current.forEach(eye => {
          eye.scale.y = 0.1 // Gözleri kapat
        })
      } else if (eyeRefs.current.length > 0) {
        eyeRefs.current.forEach(eye => {
          eye.scale.y = 1 // Gözleri aç
        })
      }

      
      const headMovement = animationManager.getHeadMovement()
      groupRef.current.rotation.x = headMovement.y
      groupRef.current.rotation.y = headMovement.x

      
      const breath = Math.sin(time * 0.6) * 0.015
      groupRef.current.position.y = -1.2 + breath
    }
  })

  if (!modelLoaded) {
    return (
      <group ref={groupRef}>
        <mesh>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial color="#cccccc" />
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

export default ReadyPlayerMeAvatar