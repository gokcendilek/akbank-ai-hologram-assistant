import * as THREE from 'three'

export class AdvancedAvatarAnimations {
  constructor() {
    this.mouthAmplitude = 0
    this.blinkTimer = 0
    this.expression = 'neutral'
  }

  setSpeaking(speaking) {
    this.isSpeaking = speaking
    if (!speaking) {
      this.mouthAmplitude = 0
    }
  }

  setListening(listening) {
    this.isListening = listening
  }

  update(delta) {
    // Konuşma animasyonu
    if (this.isSpeaking) {
      this.mouthAmplitude = Math.sin(Date.now() * 0.01) * 0.3 + 0.3
    } else {
      this.mouthAmplitude = Math.max(0, this.mouthAmplitude - delta * 2)
    }

    // Göz kırpma
    this.blinkTimer += delta
  }

  getMouthMovement() {
    return this.mouthAmplitude
  }

  getHeadMovement() {
    if (this.isSpeaking) {
      return {
        x: Math.sin(Date.now() * 0.002) * 0.05,
        y: Math.sin(Date.now() * 0.001) * 0.03
      }
    }
    return { x: 0, y: 0 }
  }

  shouldBlink() {
    return this.blinkTimer < 0.2
  }
}