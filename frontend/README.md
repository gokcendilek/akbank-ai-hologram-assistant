Akbank AI Hologram – Frontend (React + Three.js)

Bu proje, Akbank AI Hologram sisteminin frontend kısmıdır.
3D hologram bir avatarın, kullanıcıyla sesli ve görsel olarak etkileşime girmesini sağlar.
React, Vite, Three.js, ve Ready Player Me tabanlı avatar teknolojileriyle geliştirilmiştir.

 Özellikler

🎭 3D Hologram Avatar: Ready Player Me modeliyle oluşturulan etkileşimli karakter

🗣️ Konuşma Senkronizasyonu: Gerçek zamanlı ağız hareketi (Lip-sync)

👀 Göz kırpma & baş hareketi: Doğal insan benzeri mimikler

🔊 Sesli Yanıt: Backend’den gelen TTS sesleriyle konuşma

🌐 WebSocket entegrasyonu: Gerçek zamanlı ses akışı

🎥 Mixamo animasyon desteği: Konuşma, dinleme ve bekleme (idle) animasyonları

⚙️ Gereksinimler

Node.js 18 veya üzeri

npm veya yarn paket yöneticisi

🧩 Kurulum
# Projeyi klonla
git clone https://github.com/<gokcendilek>/akbank-ai-hologram.git
cd akbank-ai-hologram/frontend

# Bağımlılıkları yükle
npm install

# Ortam değişkenlerini oluştur
cp .env.example .env


.env dosyasında gerekli backend URL’sini belirt:

VITE_API_URL=http://localhost:8000

 Çalıştırma
# Geliştirme modu
npm run dev


Ardından tarayıcıda şu adrese git:
👉 http://localhost:5173

📂 Klasör Yapısı
frontend/
├─ public/
│  ├─ animations/           # Mixamo animasyonları (idle.fbx, speaking.fbx, listening.fbx)
│  ├─ vite.svg
│  └─ assets/
│
├─ src/
│  ├─ components/
│  │  ├─ HologramAvatar.jsx
│  │  ├─ EnhancedReadyPlayerMeAvatar.jsx
│  │  ├─ VoiceRecorder.jsx
│  │  └─ ChatInterface.jsx
│  │
│  ├─ utils/
│  │  ├─ mixamoAnimations.js
│  │  ├─ advancedAnimations.js
│  │  ├─ findMorphTargets.js
│  │  └─ lipsync.js
│  │
│  ├─ App.jsx
│  ├─ main.jsx
│  └─ index.css
│
├─ .env
├─ .gitignore
├─ package.json
└─ vite.config.js

🧩 Animasyon Dosyaları

public/animations/ klasörü içinde olmalı:

idle.fbx
speaking.fbx
listening.fbx


Eğer bu dosyalar yoksa, Mixamo’dan indirip bu klasöre eklemen gerekir.
.gitignore içinde sadece bu klasör açık tutulur, diğer .fbx/.glb dosyaları izlenmez.

🧪 Test

Frontend testleri şu anda manuel olarak yürütülmektedir.
Tüm bileşenler npm run dev ortamında test edilir.
Opsiyonel olarak Jest veya Cypress testleri entegre edilebilir.

🧰 Kullanılan Teknolojiler
Kütüphane / Araç	Açıklama
React + Vite	Modern frontend altyapısı
Three.js	3D render ve animasyon
drei + three-stdlib	Three.js yardımcı bileşenleri
Ready Player Me	3D avatar modelleri
Mixamo	Animasyon kaynakları
WebSocket / fetch	Backend iletişimi
TailwindCSS (opsiyonel)	UI düzeni



💬 Notlar

Avatar konuşma animasyonları Mixamo + Procedural blendshape kombinasyonuyla yapılır.

Ses senkronizasyonu için lipsync.js modülü Web Audio API kullanır.

HologramAvatar bileşeni, isSpeaking ve isListening durumlarını otomatik yönetir.
