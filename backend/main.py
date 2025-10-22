
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, Form, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import uvicorn
import json
import asyncio
import time
from typing import Dict, List
import os
from dotenv import load_dotenv
from ai_controller import AIController
from speech_processor import SpeechProcessor

load_dotenv()

app = FastAPI(title="Akbank AI Hologram API")

# CORS ayarları
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


ai_controller = AIController()
speech_processor = SpeechProcessor()


user_sessions: Dict[str, Dict] = {}

class ChatRequest(BaseModel):
    message: str
    session_id: str

class ChatResponse(BaseModel):
    response: str
    session_id: str
    audio_url: str = None


@app.post("/process_audio")
async def process_audio_endpoint(file: UploadFile = File(...), session_id: str = Form(...)):
    try:
        print(f"🔊 Ses işleniyor, session: {session_id}, dosya: {file.filename}")
        
       
        contents = await file.read()
        print(f"📁 Dosya boyutu: {len(contents)} bytes")
        
        if len(contents) == 0:
            return {"transcript": "", "error": "Boş ses dosyası"}
        
        
        text = speech_processor.speech_to_text(contents)
        print(f"📝 Transkript: {text}")
        
        if text in ["Ses anlaşılamadı", "Ses tanıma servisi hatası"]:
            return {"transcript": "", "error": text}
        
        
        if session_id not in user_sessions:
            user_sessions[session_id] = {
                "conversation_history": [],
                "user_preferences": {}
            }
        
        ai_response = await ai_controller.process_message(
            text, 
            session_id,
            user_sessions[session_id]["conversation_history"]
        )
        print(f"🤖 AI Yanıt: {ai_response}")
        
        
        user_sessions[session_id]["conversation_history"].extend([
            {"role": "user", "content": text},
            {"role": "assistant", "content": ai_response}
        ])
        
        
        audio_filename = f"audio_{session_id}_{int(time.time())}.wav"
        audio_path = f"./static/audio/{audio_filename}"
        speech_processor.text_to_speech(ai_response, audio_path)
        
        print(f"🔊 Ses dosyası oluşturuldu: {audio_filename}")
        
        return {
            "transcript": text,
            "ai_response": ai_response,
            "audio_url": f"/static/audio/{audio_filename}"
        }
        
    except Exception as e:
        print(f"❌ Ses işleme hatası: {e}")
        return {"transcript": "", "error": str(e)}
    

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
       
        if request.session_id not in user_sessions:
            user_sessions[request.session_id] = {
                "conversation_history": [],
                "user_preferences": {}
            }
        
        
        ai_response = await ai_controller.process_message(
            request.message, 
            request.session_id,
            user_sessions[request.session_id]["conversation_history"]
        )
        
        
        user_sessions[request.session_id]["conversation_history"].extend([
            {"role": "user", "content": request.message},
            {"role": "assistant", "content": ai_response}
        ])
        
        
        audio_filename = f"audio_{request.session_id}_{len(user_sessions[request.session_id]['conversation_history'])}.mp3"
        audio_path = f"./static/audio/{audio_filename}"
        speech_processor.text_to_speech(ai_response, audio_path)
        
        return ChatResponse(
            response=ai_response,
            session_id=request.session_id,
            audio_url=f"/static/audio/{audio_filename}"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.websocket("/ws/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str):
    await websocket.accept()
    try:
        while True:
            # Ses verisini al
            data = await websocket.receive_bytes()
            
            # Ses'i text'e çevir
            text = await asyncio.get_event_loop().run_in_executor(
                None, speech_processor.speech_to_text, data
            )
            
            if text and text not in ["Ses anlaşılamadı", "Ses tanıma servisi hatası"]:
                
                await websocket.send_text(json.dumps({
                    "type": "user_speech",
                    "text": text
                }))
                
                if session_id not in user_sessions:
                    user_sessions[session_id] = {
                        "conversation_history": [],
                        "user_preferences": {}
                    }
                
                ai_response = await ai_controller.process_message(
                    text, 
                    session_id,
                    user_sessions[session_id]["conversation_history"]
                )
                
                # Konuşma geçmişini güncelle
                user_sessions[session_id]["conversation_history"].extend([
                    {"role": "user", "content": text},
                    {"role": "assistant", "content": ai_response}
                ])
                
                # Yanıtı ses dosyasına çevir
                audio_filename = f"ws_audio_{session_id}_{int(time.time())}.wav"
                audio_path = f"./static/audio/{audio_filename}"
                
                await asyncio.get_event_loop().run_in_executor(
                    None, speech_processor.text_to_speech, ai_response, audio_path
                )
                
                
                await websocket.send_text(json.dumps({
                    "type": "ai_response",
                    "text_response": ai_response,
                    "audio_url": f"/static/audio/{audio_filename}"
                }))
                
    except WebSocketDisconnect:
        print(f"Client {session_id} disconnected")


os.makedirs("./static/audio", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)