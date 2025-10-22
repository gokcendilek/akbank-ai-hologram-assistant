import os
from dotenv import load_dotenv
from typing import List, Dict
import asyncio


load_dotenv()

class AIController:
    def __init__(self):
        
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        if not self.openai_api_key:
            raise ValueError("❌ OPENAI_API_KEY bulunamadı! .env dosyasını kontrol edin.")
        
        self.rag_db_path = os.getenv("AKBANK_RAG_DB_PATH", "./akbank_rag_db")
        self.debug = os.getenv("DEBUG", "False").lower() == "true"
        
        print(f"🔑 API Key durumu: {'✅ Mevcut' if self.openai_api_key else '❌ Eksik'}")
        
       
        self._initialize_rag_system()
        
    def _initialize_rag_system(self):
        """RAG sistemini başlat"""
        try:
            from advanced_rag import rag_system
            
            
            print("🔄 RAG sistemi hazırlanıyor...")
            rag_system.build_vector_store()
                
            self.rag_system = rag_system
            self.rag_initialized = True
            print("✅ RAG sistemi hazır")
            
        except Exception as e:
            print(f"❌ RAG başlatma hatası: {e}")
            self.rag_initialized = False
    
    async def process_message(self, message: str, session_id: str, history: List[Dict] = None):
        """Gelişmiş mesaj işleme"""
        if not self.rag_initialized:
            return "⚠️ Sistem şu anda hazırlanıyor. Lütfen birkaç saniye sonra tekrar deneyin."
        
        try:
            from smart_agent import SmartBankingAgent
            
            # Agent oluştur
            agent = SmartBankingAgent(self.rag_system)
            
            # Sorguyu işle
            response = await agent.process_query(message, session_id)
            
            if self.debug:
                print(f"🔧 DEBUG - Session: {session_id}, Soru: {message}")
                print(f"🔧 DEBUG - Cevap: {response[:200]}...")
            
            return response
            
        except Exception as e:
            error_msg = f"Üzgünüm, bir hata oluştu: {str(e)}"
            print(f"❌ AI işleme hatası: {e}")
            
            if self.debug:
                import traceback
                traceback.print_exc()
                
            return error_msg
    
    def _is_weak_response(self, response: str) -> bool:
        """Zayıf cevap kontrolü"""
        weak_indicators = [
            "bulunamadı",
            "yeterli bilgi",
            "web sitesini ziyaret",
            "444 25 25",
            "müşteri hizmetleri"
        ]
        
        response_lower = response.lower()
        return any(indicator in response_lower for indicator in weak_indicators)
    
    
    def scrape_akbank_website(self, query: str) -> str:
        """Mevcut web scraping fonksiyonu"""
        
        from ai_controller import AIController as OldController
        old_controller = OldController()
        return old_controller.scrape_akbank_website(query)