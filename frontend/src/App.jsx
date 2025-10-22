import React, { useState, useEffect } from 'react'
import HologramAvatar from './components/HologramAvatar'
import ChatInterface from './components/ChatInterface'
import VoiceRecorder from './components/VoiceRecorder'
import './App.css'
import { stopLipsync } from './utils/lipsync'

function App() {
  const [messages, setMessages] = useState([])
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isAvatarSpeaking, setIsAvatarSpeaking] = useState(false)
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)
  const [avatarReady, setAvatarReady] = useState(false)
  const [avatarError, setAvatarError] = useState(null)
  const [mouthAmp, setMouthAmp] = useState(0)

  useEffect(() => {
    return () => {
      stopLipsync()
    }
  }, [])

  const addUserMessage = (text) =>
    setMessages((p) => [...p, { text, isUser: true, timestamp: new Date() }])
  const addAiMessage = (text) =>
    setMessages((p) => [...p, { text, isUser: false, timestamp: new Date() }])

  const handleAvatarSpeaking = (speaking) => {
    console.log(`🎤 Avatar konuşma durumu: ${speaking}`)
    setIsAvatarSpeaking(speaking)
  }

  const handleAvatarLoad = () => {
    console.log('Avatar başarıyla yüklendi!')
    setAvatarReady(true)
    setAvatarError(null)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Akbank AI Hologram Asistanı</h1>
        <p>Sesli ve görsel bankacılık deneyimi</p>
        <div style={{ fontSize: '12px', color: '#00ffaa', marginTop: '10px', background: 'rgba(0,0,0,0.3)', padding: '5px 10px', borderRadius: '5px' }}>
          🔍 DEBUG: {isListening ? '🎤 Dinliyor' : ''} {isProcessing ? '🔄 İşliyor' : ''} {isAvatarSpeaking ? '🗣️ Konuşuyor (Çene Hareketli)' : '⏸️ Bekliyor'}
        </div>

        {isProcessing && (
          <div className="global-processing">
            <div className="loading-spinner"></div>
            <span>AI cevap hazırlıyor...</span>
          </div>
        )}
        {!avatarReady && !avatarError && (
          <div className="global-loading">
            <div className="loading-spinner"></div>
            <span>Hologram asistan hazırlanıyor...</span>
          </div>
        )}
        {avatarError && <div className="error-message">⚠️ {avatarError}</div>}
      </header>

      <div className="app-content">
        <div className="hologram-section">
          <HologramAvatar
            isSpeaking={isAvatarSpeaking}
            isListening={isListening}
            onAvatarLoad={handleAvatarLoad}
            mouthAmplitude={mouthAmp}
          />
        </div>

        <div className="interface-section">
          <ChatInterface
  messages={messages}
  onUserMessage={(t)=>setMessages(p=>[...p,{text:t,isUser:true,timestamp:new Date()}])}
  onAiMessage={(t)=>setMessages(p=>[...p,{text:t,isUser:false,timestamp:new Date()}])}
  sessionId={sessionId}
  onAvatarSpeaking={handleAvatarSpeaking}
  onMouthAmplitude={setMouthAmp}
/>

          <VoiceRecorder
            onUserTranscript={addUserMessage}
            onAiResponse={addAiMessage}
            onListeningChange={setIsListening}
            onProcessingChange={setIsProcessing}
            onAvatarSpeaking={handleAvatarSpeaking}
            onMouthAmplitude={setMouthAmp}
            sessionId={sessionId}
          />
        </div>
      </div>
    </div>
  )
}

export default App
