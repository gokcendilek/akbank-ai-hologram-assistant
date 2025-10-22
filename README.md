# 💫 Akbank AI Hologram Asistan (3D Sesli & Yazılı Chatbot)

Bu proje, Akbank için geliştirilen yapay zekâ tabanlı 3D hologram asistan uygulamasıdır.
Kullanıcılar, asistanla görsel (3D karakter) ve sesli (TTS/STT) olarak etkileşime geçebilir.
Sistem, FastAPI (Backend) ve React + Three.js (Frontend) teknolojilerini kullanır.

##  Özellikler

- 🎙️ **Sesli Komutlar** – Kullanıcı mikrofonuyla konuşarak soru sorabilir.
- 💬 **Yazılı Chat** – Aynı anda metin üzerinden sohbet desteği.
- 🧍‍♀️ **3D Hologram Avatar** – Gerçekçi Mixamo animasyonlarıyla konuşma ve dinleme hareketleri.
- 🧩 **RAG (LangChain + Chroma)** – Bilgi tabanına dayalı akıllı cevaplama sistemi.
- 🔊 **TTS/STT Entegrasyonu** – Ses tanıma ve sesli yanıt üretimi.
- ⚡ **Gerçek Zamanlı WebSocket Akışı** – Anlık konuşma ve animasyon senkronizasyonu.

## 🏗️ Mimari
```
akbank-ai-hologram-assistant/
├── backend/               # FastAPI, LangChain, TTS/STT, WebSocket
│   ├── ai_controller.py
│   ├── advanced_rag.py
│   ├── websocket_manager.py
│   ├── requirements.txt
│   └── README.md
│
├── frontend/              # React + Three.js (3D Avatar)
│   ├── public/
│   │   └── animations/    # (idle.fbx, speaking.fbx, listening.fbx)
│   ├── src/
│   │   ├── components/
│   │   ├── utils/
│   │   └── App.jsx
│   └── README.md
│
└── .gitignore
```

## 🚀 Kurulum ve Çalıştırma

### 🖥️ Backend (FastAPI)
```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows için: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 💻 Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```

## ⚙️ Teknolojiler

| Katman | Teknolojiler |
|--------|-------------|
| **Frontend** | React, Vite, Three.js, Mixamo Animations |
| **Backend** | FastAPI, LangChain, ChromaDB, SpeechRecognition, pyttsx3, gTTS |
| **Veri Tabanı** | Chroma (vektör tabanlı arama) |
| **İletişim** | WebSocket + REST API |
| **Ses Motoru** | Google TTS / pyttsx3 |
| **3D Model Formatı** | FBX (Mixamo'dan türetilmiş) |

## 🧩 Örnek Görünüm

Aşağıdaki görselde, kullanıcıyla konuşan hologram asistan arayüzü görülmektedir.
<img width="1910" height="1034" alt="Ekran Resmi 2025-10-22 01 15 24" src="https://github.com/user-attachments/assets/66496fb4-435c-4d64-882c-5ac5c33ebbf1" />

## 🎥 Uygulama Videosu

Uygulamanın çalıştığı demo videosunu izlemek için aşağıdaki bağlantıya tıklayın:  
🎬 [Uygulamayı İzle (Google Drive)](https://drive.google.com/file/d/16XHbT5dyo7possvoQxCp6ksuimXlfj1w/view?usp=sharing)



## 🧪 Testler

Backend testlerini çalıştırmak için:
```bash
cd backend
pytest -q
```

## 📦 Dağıtım (Opsiyonel)

Docker veya bulut ortamına deploy etmek için:
```bash
docker build -t akbank-ai-hologram .
docker run -p 8000:8000 akbank-ai-hologram
```

## 👩‍💻 Geliştirici

**Gökçen Dilek Alak**  
📍 Türkiye  
🔗 [GitHub](https://github.com/gokcendilek)  
🔗 [LinkedIn](www.linkedin.com/in/gökçen-dilek-alak-a8449b245)

## 🛡️ Notlar

- `.venv` ve büyük model dosyaları (`.fbx`, `.wav`, `.mp3`) `.gitignore` ile hariç tutulmuştur.
- 3D animasyonlar (`idle.fbx`, `speaking.fbx`, `listening.fbx`) `public/animations` klasöründe yer almaktadır.
- Bilgi tabanı (ChromaDB) otomatik oluşturulur; repo içinde dahil edilmemiştir.

---

✨ *"Sesli ve görsel etkileşimle geleceğin bankacılık deneyimi."*
