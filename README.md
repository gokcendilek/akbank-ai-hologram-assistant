# 💫 Akbank AI Hologram Asistan (3D Sesli & Yazılı Chatbot)

Bu proje, Akbank için geliştirilen yapay zekâ tabanlı 3D hologram asistan uygulamasıdır.
Kullanıcılar, asistanla görsel (3D karakter) ve sesli (TTS/STT) olarak etkileşime geçebilir.
Sistem, FastAPI (Backend) ve React + Three.js (Frontend) teknolojilerini kullanır.

## ✨ Özellikler

- 🎙️ **Sesli Komutlar** – Kullanıcı mikrofonuyla konuşarak soru sorabilir.
- 💬 **Yazılı Chat** – Aynı anda metin üzerinden sohbet desteği.
- 🧍‍♀️ **3D Hologram Avatar** – Gerçekçi Mixamo animasyonlarıyla konuşma ve dinleme hareketleri.
- 🧩 **RAG (LangChain + Chroma)** – Bilgi tabanına dayalı akıllı cevaplama sistemi.
- 🔊 **TTS/STT Entegrasyonu** – Ses tanıma ve sesli yanıt üretimi.
- ⚡ **Gerçek Zamanlı WebSocket Akışı** – Anlık konuşma ve animasyon senkronizasyonu.

## 🏗️ Mimari
```
akbank-ai-hologram-assistant/
├── backend/                      # FastAPI, LangChain, TTS/STT, WebSocket
│   ├── akbank_rag_db/           # Chroma DB (üretilir; genelde commit edilmez)
│   ├── static/
│   │   └── audio/               # TTS çıktıları (gitignore)
│   ├── tests/                   # pytest scriptleri
│   ├── advanced_rag.py
│   ├── ai_controller.py
│   ├── smart_agent.py
│   ├── speech_processor.py
│   ├── session_manager.py
│   ├── websocket_manager.py
│   ├── main.py                  # FastAPI entrypoint
│   ├── requirements.txt
│   └── README.md
│
├── frontend/                     # React + Three.js (3D Avatar)
│   ├── public/
│   │   └── animations/          # (idle.fbx, speaking.fbx, listening.fbx)
│   ├── src/
│   │   ├── components/
│   │   ├── utils/
│   │   └── App.jsx
│   └── README.md
│
└── .gitignore
```

## 📥 Projeyi İndirme
```bash
# HTTPS ile clone
git clone https://github.com/gokcendilek/akbank-ai-hologram-assistant.git

# GitHub CLI ile clone
gh repo clone gokcendilek/akbank-ai-hologram-assistant

# Proje dizinine geçiş
cd akbank-ai-hologram-assistant
```

## 🚀 Kurulum ve Çalıştırma

### 🖥️ Backend (FastAPI)
```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows için: .venv\Scripts\activate
pip install -r requirements.txt
```

`.env` dosyasını oluşturun ve aşağıdaki değişkenleri doldurun:
```env
OPENAI_API_KEY=...
LANGCHAIN_API_KEY=...
LANGCHAIN_TRACING_V2=true
LANGCHAIN_PROJECT=HologramAiAssistant
AKBANK_RAG_DB_PATH=./akbank_rag_db
DEBUG=False
```

Backend'i başlatın:
```bash
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
Farklı açıdan ekran videosu: https://drive.google.com/file/d/1QzlYlOKjtGZ1n4oIM-c0--fEtY8Dn3k8/view

## 🧪 Testler

Backend testlerini çalıştırmak için:
```bash
cd backend
pytest -q
# veya tek seferlik scriptler için:
python -m backend.tests.quick_test
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
🔗 [LinkedIn](https://www.linkedin.com/in/gökçen-dilek-alak-a8449b245)

## 🛡️ Notlar

- `.venv` ve büyük model dosyaları (`.fbx`, `.wav`, `.mp3`) `.gitignore` ile hariç tutulmuştur.
- 3D animasyonlar (`idle.fbx`, `speaking.fbx`, `listening.fbx`) `public/animations` klasöründe yer almaktadır.
- RAG veritabanı (`akbank_rag_db/`) çalışma sırasında otomatik oluşturulur; kaynak dokümanlar `data/` klasöründe yer almaktadır.
- Bilgi tabanı embeddings ilk başlatmada dokümanlardan yeniden üretilir.

---

✨ *"Sesli ve görsel etkileşimle geleceğin bankacılık deneyimi."*
