# Akbank AI Hologram – Frontend (React + Three.js)

Bu proje, Akbank AI Hologram sisteminin frontend kısmıdır.
3D hologram bir avatarın, kullanıcıyla sesli ve görsel olarak etkileşime girmesini sağlar.
React, Vite, Three.js, ve Ready Player Me tabanlı avatar teknolojileriyle geliştirilmiştir.

---

## ✨ Özellikler

- 🎭 **3D Hologram Avatar**: Ready Player Me modeliyle oluşturulan etkileşimli karakter
- 🗣️ **Konuşma Senkronizasyonu**: Gerçek zamanlı ağız hareketi (Lip-sync)
- 👀 **Göz kırpma & baş hareketi**: Doğal insan benzeri mimikler
- 🔊 **Sesli Yanıt**: Backend'den gelen TTS sesleriyle konuşma
- 🌐 **WebSocket entegrasyonu**: Gerçek zamanlı ses akışı
- 🎥 **Mixamo animasyon desteği**: Konuşma, dinleme ve bekleme (idle) animasyonları

---

## ⚙️ Gereksinimler

- Node.js 18 veya üzeri
- npm veya yarn paket yöneticisi

---

## 🧩 Kurulum
```bash
# Projeyi klonla
git clone https://github.com/gokcendilek/akbank-ai-hologram-assistant.git
cd akbank-ai-hologram-assistant/frontend

# Bağımlılıkları yükle
npm install
```

`.env` dosyasını oluşturun ve gerekli backend URL'sini belirtin:
```env
VITE_API_URL=http://localhost:8000
```

## 🚀 Çalıştırma
```bash
# Geliştirme modu
npm run dev
```

Ardından tarayıcıda şu adrese gidin:
👉 **http://localhost:3000**

## 📂 Klasör Yapısı
```
frontend/
├── public/
│   ├── animations/           # Mixamo animasyonları (idle.fbx, speaking.fbx, listening.fbx)
│   ├── vite.svg
│   └── assets/
│
├── src/
│   ├── components/
│   │   ├── HologramAvatar.jsx
│   │   ├── EnhancedReadyPlayerMeAvatar.jsx
│   │   ├── VoiceRecorder.jsx
│   │   └── ChatInterface.jsx
│   │
│   ├── utils/
│   │   ├── mixamoAnimations.js
│   │   ├── advancedAnimations.js
│   │   ├── findMorphTargets.js
│   │   └── lipsync.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── .env
├── .gitignore
├── package.json
└── vite.config.js
```

## 🎬 Animasyon Dosyaları

`public/animations/` klasörü içinde şu dosyalar olmalıdır:

- `idle.fbx`
- `speaking.fbx`
- `listening.fbx`

> 💡 **Not:** Eğer bu dosyalar yoksa, [Mixamo](https://www.mixamo.com/)'dan indirip bu klasöre eklemeniz gerekir.
> `.gitignore` içinde sadece bu klasör açık tutulur, diğer `.fbx`/`.glb` dosyaları izlenmez.

## 🧪 Test

Frontend testleri şu anda manuel olarak yürütülmektedir.
Tüm bileşenler `npm run dev` ortamında test edilir.
Opsiyonel olarak Jest veya Cypress testleri entegre edilebilir.

## 🧰 Kullanılan Teknolojiler

| Kütüphane / Araç | Açıklama |
|------------------|----------|
| **React + Vite** | Modern frontend altyapısı |
| **Three.js** | 3D render ve animasyon |
| **drei + three-stdlib** | Three.js yardımcı bileşenleri |
| **Ready Player Me** | 3D avatar modelleri |
| **Mixamo** | Animasyon kaynakları |
| **WebSocket / fetch** | Backend iletişimi |
| **TailwindCSS** (opsiyonel) | UI düzeni |

## 💬 Notlar

- Avatar konuşma animasyonları **Mixamo + Procedural blendshape** kombinasyonuyla yapılır.
- Ses senkronizasyonu için `lipsync.js` modülü **Web Audio API** kullanır.
- `HologramAvatar` bileşeni, `isSpeaking` ve `isListening` durumlarını otomatik yönetir.

---

✨ *"3D hologram teknolojisiyle gerçekçi müşteri deneyimi."*
