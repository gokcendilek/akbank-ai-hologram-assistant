# Akbank AI Hologram – Backend (FastAPI)

FastAPI tabanlı API. RAG (LangChain + Chroma) ile bilgi tabanı, konuşma analizi (SpeechRecognition/pydub), TTS (gTTS/pyttsx3) ve WebSocket akışını içerir.

---

## Gereksinimler

- Python 3.11+
- `ffmpeg` (pydub için zorunlu)
- (Bazı sistemlerde) `portaudio` veya uygun ses sürücüleri

---

## Kurulum
```bash
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

Ardından `.env` dosyasını oluşturun ve aşağıdaki değişkenleri doldurun:

## Ortam Değişkenleri (.env)
```env
OPENAI_API_KEY=...
LANGCHAIN_API_KEY=...
LANGCHAIN_TRACING_V2=true
LANGCHAIN_PROJECT=HologramAiAssistant
AKBANK_RAG_DB_PATH=./akbank_rag_db
DEBUG=False
```

## Çalıştırma
```bash
uvicorn main:app --reload --port 8000
```

## Klasör Yapısı
```
backend/
├── akbank_rag_db/        # Chroma DB (üretilir; genelde commit edilmez)
├── static/
│   └── audio/            # TTS çıktıları (gitignore)
├── tests/                # pytest scriptleri
├── advanced_rag.py
├── ai_controller.py
├── smart_agent.py
├── speech_processor.py
├── session_manager.py
├── websocket_manager.py
├── main.py               # FastAPI entrypoint
├── requirements.txt
└── README.md
```

## Endpointler

- **POST /chat** – metin tabanlı sohbet + TTS mp3 URL döner
- **POST /process_audio** – webm/wav ses yükle, STT + yanıt + TTS
- **WS /ws/{session_id}** – canlı ses/yanıt akışı

## Testler
```bash
pytest -q
# veya tek seferlik scriptler için:
python -m backend.tests.quick_test
```

---

> 💡 **Not:** RAG veritabanı (`akbank_rag_db/`) çalışma sırasında otomatik oluşturulur.  
> Kaynak dokümanlar `data/` klasöründe yer almaktadır.  
> Uygulama ilk başlatıldığında embeddings bu dokümanlardan yeniden üretilir.
