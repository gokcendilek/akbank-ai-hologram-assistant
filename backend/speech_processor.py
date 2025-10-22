import speech_recognition as sr
import pyttsx3
import io
import wave
import numpy as np
from typing import Optional
from pydub import AudioSegment
from gtts import gTTS
import os

class SpeechProcessor:
    def __init__(self):
        self.recognizer = sr.Recognizer()
        self.tts_engine = pyttsx3.init()
        
        
        self.tts_engine.setProperty('rate', 150)  
        self.tts_engine.setProperty('volume', 0.8)  
        
        
        voices = self.tts_engine.getProperty('voices')
        for voice in voices:
            if 'turkish' in voice.name.lower() or 'türkçe' in voice.name.lower():
                self.tts_engine.setProperty('voice', voice.id)
                break
    
    def speech_to_text(self, audio_data: bytes) -> Optional[str]:
        """Ses verisini metne çevir"""
        try:
            print(f"🔊 Ses tanıma başlıyor, veri boyutu: {len(audio_data)} bytes")
            
            
            try:
                
                audio = AudioSegment.from_file(io.BytesIO(audio_data), format="webm")
                audio = audio.set_frame_rate(16000).set_channels(1)
                
                audio = audio.normalize()
                
                # WAV formatına çevirme
                wav_buffer = io.BytesIO()
                audio.export(wav_buffer, format="wav", parameters=["-ac", "1", "-ar", "16000"])
                wav_data = wav_buffer.getvalue()
                
                print(f"✅ WEBM -> WAV dönüşümü tamamlandı: {len(wav_data)} bytes")
                
            except Exception as e:
                print(f"❌ Format dönüşüm hatası: {e}")
                
                return "Ses anlaşılamadı"

            # Bytes'dan AudioData 
            audio_file = sr.AudioData(wav_data, sample_rate=16000, sample_width=2)
            
            
            text = self.recognizer.recognize_google(audio_file, language='tr-TR')
            print(f"✅ Ses tanıma başarılı: {text}")
            return text.strip() if text else "Ses anlaşılamadı"
            
        except sr.UnknownValueError:
            print("❌ Ses anlaşılamadı - Google anlayamadı")
            return "Ses anlaşılamadı"
        except sr.RequestError as e:
            print(f"❌ Ses tanıma servisi hatası: {e}")
            return f"Ses tanıma servisi hatası: {e}"
        except Exception as e:
            print(f"❌ Beklenmeyen hata: {e}")
            return f"Beklenmeyen hata: {e}"
    
    def text_to_speech(self, text: str, output_path: str):
        """Metni sese çevir ve dosyaya kaydet"""
        try:
            
            tts = gTTS(text=text, lang='tr', slow=False)
            tts.save(output_path)
            print(f"✅ TTS tamamlandı (MP3): {output_path}")
            
        except Exception as e:
            print(f"❌ TTS hatası: {e}")
            try:
                self.tts_engine.save_to_file(text, output_path)
                self.tts_engine.runAndWait()
                print(f"✅ TTS tamamlandı (Fallback): {output_path}")
            except Exception as fallback_error:
                print(f"❌ Fallback TTS hatası: {fallback_error}")