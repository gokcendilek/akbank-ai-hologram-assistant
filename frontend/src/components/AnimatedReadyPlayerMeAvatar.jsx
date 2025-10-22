import React, { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

function AnimatedReadyPlayerMeAvatar({ 
  isSpeaking, 
  isListening, 
  avatarUrl, 
  onError
}) {
  const groupRef = useRef()
  const { scene } = useGLTF(avatarUrl, true)
  const [modelLoaded, setModelLoaded] = useState(false)
  
 
  const mouthRef = useRef()
  const blinkTimerRef = useRef(0)
  const headMovementRef = useRef({ x: 0, y: 0 })

 
  useEffect(() => {
    if (scene && groupRef.current) {
      console.log('✅ Avatar yüklendi, mesh\'leri hazırlanıyor...')

      try {
        let mouthMeshFound = false
        
        
        scene.traverse((child) => {
          if (child.isMesh) {
            
            if (child.material) {
              
              child.material.roughness = 0.4
              child.material.metalness = 0.1
              
              
              if (child.name === 'Wolf3D_Head' || child.name.includes('Head')) {
                mouthRef.current = child
                mouthMeshFound = true
                console.log('✅ Ağız için head mesh bulundu:', child.name)
              }
            }
            
            child.castShadow = true
            child.receiveShadow = true
          }
        })

        if (!mouthMeshFound) {
          console.warn('⚠️ Ağız mesh\'i bulunamadı, tüm mesh\'ler kontrol edilecek')
          
          scene.traverse((child) => {
            if (child.isMesh && !mouthRef.current) {
              mouthRef.current = child
              console.log('🔄 Varsayılan mesh ağız olarak kullanılıyor:', child.name)
            }
          })
        }

        
        groupRef.current.scale.set(2.2, 2.2, 2.2)
        groupRef.current.position.set(0, -1.4, 0)

        setModelLoaded(true)
        console.log('🎭 Avatar hazır! Manuel animasyonlar aktif.')

      } catch (error) {
        console.error('❌ Avatar işleme hatası:', error)
        if (onError) onError(error)
      }
    }
  }, [scene, onError])

  
  useFrame((state, delta) => {
    if (groupRef.current && modelLoaded) {
      const time = state.clock.elapsedTime

      
      if (isSpeaking && mouthRef.current) {
        const mouthOpen = Math.sin(time * 10) * 0.5 + 0.6 
        
        mouthRef.current.scale.y = 1 + mouthOpen * 0.4
        mouthRef.current.position.y = mouthOpen * 0.08
        console.log('🗣️ Ağız hareket ediyor:', mouthOpen)
      } else if (mouthRef.current) {
        
        mouthRef.current.scale.y = 1
        mouthRef.current.position.y = 0
      }

      // 2. GÖZ KIRPMA - Her 2-4 saniyede bir
      blinkTimerRef.current += delta
      if (blinkTimerRef.current > 2 + Math.random() * 2) {
        blinkTimerRef.current = 0
        // Göz kırpma efekti
        scene.traverse(child => {
          if (child.isMesh && (child.name.toLowerCase().includes('eye') || child.name.includes('Eye'))) {
            // Gözleri kapat
            child.scale.y = 0.05
            // 150ms sonra aç
            setTimeout(() => {
              if (child.scale) child.scale.y = 1
            }, 150)
          }
        })
      }

      // 3. BAŞ HAREKETLERİ - DAHA BELİRGİN
      if (isSpeaking) {
        // Konuşurken doğal baş hareketleri
        headMovementRef.current.x = Math.sin(time * 0.8) * 0.15
        headMovementRef.current.y = Math.sin(time * 0.5) * 0.08
      } else if (isListening) {
        // Dinlerken hafif eğim
        headMovementRef.current.x = Math.sin(time * 0.3) * 0.08
        headMovementRef.current.y = 0.05
      } else {
        // Dinlenme - hafif sallanma
        headMovementRef.current.x = Math.sin(time * 0.2) * 0.05
        headMovementRef.current.y = Math.sin(time * 0.1) * 0.03
      }

      // Baş hareketlerini uygula
      groupRef.current.rotation.x = headMovementRef.current.y
      groupRef.current.rotation.y = headMovementRef.current.x

      // 4. NEFES ALMA - Her zaman
      const breath = Math.sin(time * 0.8) * 0.025
      groupRef.current.position.y = -1.4 + breath

      // 5. VÜCUT HAREKETİ - DAHA DOĞAL
      if (isSpeaking) {
        groupRef.current.rotation.z = Math.sin(time * 0.3) * 0.02
      }
    }
  })

  // Loading durumu
  if (!modelLoaded) {
    return (
      <group ref={groupRef}>
        <mesh>
          <boxGeometry args={[0.6, 1.2, 0.4]} />
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

export default AnimatedReadyPlayerMeAvatar