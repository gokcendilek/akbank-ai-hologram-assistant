import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { Send, User, Bot } from 'lucide-react'
import { startLipsyncForAudioElement, stopLipsync } from '../utils/lipsync'

function ChatInterface({
  messages,
  onUserMessage,      
  onAiMessage,        
  sessionId,
  onAvatarSpeaking,
  onMouthAmplitude
}) {
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  useEffect(() => { scrollToBottom() }, [messages])

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return
    const userMessage = inputText.trim()
    setInputText('')
    onUserMessage(userMessage)
    setIsLoading(true)

    try {
      const { data } = await axios.post('http://localhost:8000/chat', {
        message: userMessage,
        session_id: sessionId,
      })

      onAiMessage(data.response)

      // Ses çal
      if (data.audio_url) {
        const audioUrl = `http://localhost:8000${data.audio_url}`
        
        const audio = new Audio()
        audio.crossOrigin = 'anonymous'
        audio.src = audioUrl

        audio.oncanplaythrough = () => console.log('✅ Ses hazır (text)')
        audio.onplay = () => {
          onAvatarSpeaking?.(true)
          startLipsyncForAudioElement(audio, (amp) => onMouthAmplitude?.(amp))
        }
        audio.onended = () => {
          stopLipsync(); onMouthAmplitude?.(0); onAvatarSpeaking?.(false)
        }
        audio.onerror = (err) => {
          console.error('❌ Ses hatası:', err)
          stopLipsync(); onMouthAmplitude?.(0); onAvatarSpeaking?.(false)
        }

        try { await audio.play() } catch (e) {
          console.error('❌ Play start hatası:', e)
          stopLipsync(); onMouthAmplitude?.(0); onAvatarSpeaking?.(false)
        }
      }
    } catch (error) {
      console.error('Chat error:', error)
      onAiMessage('Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.')
      stopLipsync(); onMouthAmplitude?.(0); onAvatarSpeaking?.(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="chat-interface">
      <div className="chat-messages">
        {messages.map((m, i) => (
          <div key={i} className={`message ${m.isUser ? 'user-message' : 'ai-message'}`}>
            <div className="message-avatar">
              {m.isUser ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className="message-content">{m.text}</div>
          </div>
        ))}
        {isLoading && (
          <div className="message ai-message">
            <div className="message-avatar"><Bot size={16} /></div>
            <div className="message-content loading">
              <div className="typing-indicator"><span></span><span></span><span></span></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        <textarea
          id="chat-input"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Akbank hizmetleri hakkında soru sorun..."
          disabled={isLoading}
          rows={3}
          aria-label="Sohbet mesajı girişi"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={isLoading || !inputText.trim()}
          className="send-button"
          aria-label="Mesaj gönder"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  )
}

export default ChatInterface
