import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import EnhancedReadyPlayerMeAvatar from './EnhancedReadyPlayerMeAvatar'

function HologramEffects() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[2, 4, 3]} intensity={1.1} color="#ffffff" castShadow />
      <pointLight position={[-2, 3, 2]} intensity={0.5} color="#00ffaa" />
      <pointLight position={[2, 2, -1]} intensity={0.3} color="#0088ff" />
      <spotLight position={[0, 5, 0]} angle={0.5} intensity={0.8} color="#ffffff" castShadow />
    </>
  )
}

function HologramAvatar({ isSpeaking, isListening, onAvatarLoad, mouthAmplitude }) {
  const avatarUrl = 'https://models.readyplayer.me/68f3afadc8049dcd189e7cdc.glb'

  return (
    <div className="hologram-container">
      <Canvas camera={{ position: [0, 0.2, 3.2], fov: 45 }}>
        <HologramEffects />
        <Suspense fallback={
          <mesh>
            <boxGeometry args={[0.4, 0.8, 0.3]} />
            <meshStandardMaterial color="#00ffaa" />
          </mesh>
        }>
          <EnhancedReadyPlayerMeAvatar
            isSpeaking={isSpeaking}
            mouthAmplitude={mouthAmplitude}
            avatarUrl={avatarUrl}
            onLoad={onAvatarLoad}
          />
        </Suspense>
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={2.6}
          maxDistance={4.0}
          enableDamping={true}
          dampingFactor={0.08}

          
        />
        <Environment preset="city" />
      </Canvas>

      <div className="hologram-info">
        <h3>Akbank AI Asistan</h3>
        <p>{isSpeaking ? 'Size yardımcı oluyorum...' : isListening ? 'Sizi dinliyorum...' : 'Size nasıl yardımcı olabilirim?'}</p>
        <div className="expression-status">
          {isSpeaking && <span className="speaking-indicator">🗣️ Konuşuyor</span>}
          {isListening && <span className="listening-indicator">👂 Dinliyor</span>}
          {!isSpeaking && !isListening && <span className="idle-indicator">😊 Hazır</span>}
        </div>
      </div>
    </div>
  )
}

export default HologramAvatar
