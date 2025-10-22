import React, { useState, useRef } from 'react'
import { Mic, Square, Loader } from 'lucide-react'
import { startLipsyncForAudioElement, stopLipsync } from '../utils/lipsync'

function VoiceRecorder({
  onUserTranscript,     
  onAiResponse,         
  onListeningChange,
  onProcessingChange,
  onAvatarSpeaking,
  onMouthAmplitude,
  sessionId
}) {
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { sampleRate: 16000, channelCount: 1, echoCancellation: true, noiseSuppression: true }
      })
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' })
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data) }

      mediaRecorder.onstop = async () => {
        setIsProcessing(true); onProcessingChange?.(true)
        try {
          const blob = new Blob(chunksRef.current, { type: 'audio/webm;codecs=opus' })
          await sendAudioToBackend(blob)
        } catch (err) {
          console.error('❌ Kayıt işleme hatası:', err)
        } finally {
          setIsProcessing(false); onProcessingChange?.(false)
          stream.getTracks().forEach(t => t.stop())
        }
      }

      mediaRecorder.start(1000)
      setIsRecording(true); onListeningChange?.(true)
    } catch (error) {
      console.error('❌ Mikrofon hatası:', error)
      alert('Mikrofon izni gerekli.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false); onListeningChange?.(false)
    }
  }

  const sendAudioToBackend = async (blob) => {
    const formData = new FormData()
    formData.append('file', blob, 'recording.webm')
    formData.append('session_id', sessionId)

    const res = await fetch('http://localhost:8000/process_audio', { method: 'POST', body: formData })
    if (!res.ok) {
      onUserTranscript?.('Backend hatası: ' + res.status)
      return
    }
    const data = await res.json()

    if (data.transcript) onUserTranscript?.(data.transcript)
    if (data.ai_response) onAiResponse?.(data.ai_response)

    if (data.audio_url) await playAudioResponse(data.audio_url)
  }

  const playAudioResponse = async (audioUrl) => {
    try {
      const full = `http://localhost:8000${audioUrl}`
      const audio = new Audio()
      audio.crossOrigin = 'anonymous'
      audio.src = full

      audio.onplay = () => {
        onAvatarSpeaking?.(true)
        startLipsyncForAudioElement(audio, (amp) => onMouthAmplitude?.(amp))
      }
      audio.onended = () => { stopLipsync(); onMouthAmplitude?.(0); onAvatarSpeaking?.(false) }
      audio.onerror = () => { stopLipsync(); onMouthAmplitude?.(0); onAvatarSpeaking?.(false) }

      await audio.play()
    } catch (e) {
      console.error('❌ Ses oynatma hatası:', e)
      stopLipsync(); onMouthAmplitude?.(0); onAvatarSpeaking?.(false)
    }
  }

  return (
    <div className="voice-recorder">
      <div className="recorder-controls">
        {!isRecording ? (
          <button onClick={startRecording} className="record-button" disabled={isProcessing}>
            {isProcessing ? <Loader size={24} className="spinner" /> : <Mic size={24} />}
            {isProcessing ? 'İşleniyor...' : 'Konuşmaya Başla'}
          </button>
        ) : (
          <button onClick={stopRecording} className="stop-button">
            <Square size={24} /> Durdur
          </button>
        )}
      </div>

      {isRecording && (
        <div className="recording-indicator">
          <div className="pulse-animation"></div><span>Dinliyorum...</span>
        </div>
      )}
      {isProcessing && (
        <div className="processing-indicator">
          <Loader size={16} className="spinner" /><span>Sesiniz işleniyor...</span>
        </div>
      )}
    </div>
  )
}

export default VoiceRecorder
