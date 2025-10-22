import * as THREE from 'three'
import { FBXLoader } from 'three-stdlib'   // npm i three-stdlib


export class MixamoAnimationManager {
  constructor(avatarRoot /* THREE.Object3D */) {
    this.avatar = avatarRoot
    this.mixer = new THREE.AnimationMixer(avatarRoot) 
    this.animations = new Map()
    this.currentAction = null
    this.loader = new FBXLoader()
  }

  getDefaultAnimations() {
    
    return {
      idle: '/animations/idle.fbx',
      speaking: '/animations/speaking.fbx',
      listening: '/animations/listening.fbx',
    }
  }


  async loadOne(name, url) {
    try {
      const fbx = await this.loader.loadAsync(url)
      const clips = fbx.animations || []
      if (!clips.length) {
        console.warn(`[mixamo] FBX içinde animasyon track bulunamadı: ${url}`)
        return
      }

     
      const clip = clips[0]

      
      clip.optimize()

      
      if (!this.mixer) {
        console.warn('[mixamo] mixer yok; action oluşturulamadı.')
        return
      }

      const action = this.mixer.clipAction(clip)
      this.animations.set(name, action)
    } catch (err) {
      console.error(`[mixamo] ${name} yüklenemedi: ${url}`, err)
    }
  }

 
  async loadDefaultAnimations() {
    const urls = this.getDefaultAnimations()
    await Promise.all([
      this.loadOne('idle', urls.idle),
      this.loadOne('speaking', urls.speaking),
      this.loadOne('listening', urls.listening),
    ])

    
    if (this.animations.has('idle')) {
      this.playAnimation('idle', 0.2)
    }
  }

  playAnimation(name, fade = 0.25) {
    if (!this.mixer || !this.animations.has(name)) return
    const next = this.animations.get(name)
    if (this.currentAction === next) return

    if (this.currentAction) this.currentAction.fadeOut(fade)
    next.reset().fadeIn(fade).play()
    this.currentAction = next
  }

  startSpeaking() { this.playAnimation('speaking', 0.15) }
  startListening() { this.playAnimation('listening', 0.15) }
  goIdle() { this.playAnimation('idle', 0.25) }

  update(dt) {
    if (this.mixer) this.mixer.update(dt)
  }
}
