import requests
from bs4 import BeautifulSoup
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings  # Düzeltildi
from langchain_chroma import Chroma  # Düzeltildi
from langchain.schema import Document
import os
from urllib.parse import urljoin, urlparse
import time
from typing import List, Dict, Tuple
import hashlib
from dotenv import load_dotenv


load_dotenv()

class AdvancedAkbankRAG:
    def __init__(self):
        self.base_url = "https://www.akbank.com"
        
        
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        if not self.openai_api_key:
            raise ValueError("OPENAI_API_KEY environment variable bulunamadı!")
        
       
        self.embeddings = OpenAIEmbeddings(
            openai_api_key=self.openai_api_key,
            model="text-embedding-3-small"
        )
        
        self.vector_store = None
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len,
        )
        
        print("✅ Advanced RAG sistemi başlatıldı")
        
    def crawl_akbank_comprehensively(self) -> List[Document]:
        """Kapsamlı web crawler"""
        print("🕸️ Kapsamlı Akbank taraması başlatılıyor...")
        
       
        priority_urls = [
            "https://www.akbank.com",
            "https://www.akbank.com/kampanyalar",
            "https://www.akbank.com/krediler",
            "https://www.akbank.com/kartlar/kredi-kartlari",
            "https://www.akbank.com/sigorta-emeklilik",
            "https://www.akbank.com/mevduat-yatirim",
            "https://www.akbank.com/hizmetler",
            "https://www.akbank.com/bankamiz/hakkimizda",
            "https://www.akbank.com/urun-ve-hizmet-ucretleri",
            "https://www.akbank.com/mevduat-yatirim/yatirim/tahvil-bono",
            "https://www.akbank.com/mevduat-yatirim/yatirim#yatirimfonlari",
            "https://www.akbank.com/mevduat-yatirim/yatirim/hisse-senedi",
            "https://www.akbank.com/mevduat-yatirim/yatirim/hisse-senedi/hisse-senedi-hesabi",
            "https://www.akbank.com/bankamiz/destek-merkezi",
            "https://www.akbank.com/sigorta-emeklilik/sigortalar/saglik-sigortalari/tamamlayici-saglik-sigortasi",
            "https://www.akbank.com/blog/mersis-no-nedir",
            "https://www.akbank.com/mevduat-yatirim/mevduat/vadesiz-mevduat-hesaplari",
            "https://www.akbank.com/mevduat-yatirim/mevduat/altin-mevduat-hesaplari/altin-mevduat-hesabi",
            "https://www.akbank.com/mevduat-yatirim/mevduat/vadeli-mevduat-hesaplari/vadeli-mevduat-hesabi",
            "https://www.akbank.com/mevduat-yatirim/yatirim/temel-yatirim-urun-ve-hizmetleri/anlik-doviz",
            "https://www.akbank.com/sigorta-emeklilik/sigortalar/saglik-sigortalari",
            "https://www.akbank.com/sigorta-emeklilik/sigortalar/arac-sigortalari",
            "https://www.akbank.com/sigorta-emeklilik/sigortalar#KonutSigortalari",
            "https://www.akbank.com/sigorta-emeklilik/sigortalar#HayatVeFerdiKazaSigortalari",
            "https://www.akbank.com/hizmetler/sgk-emekli-maas-odemeleri",
            "https://www.akbank.com/odeme-para-transferi/yasal-odemeler",
            "https://www.akbank.com/odeme-para-transferi/para-transferleri",
            "https://www.akbank.com/basvurular#BireyselBasvurular",
            "https://www.akbank.com/basvurular#KobiBasvurulari",
            "https://www.akbank.com/kartlar/banka-kartlari",
            "https://www.akbank.com/kartlar/nakit-ihtiyaclar"
        

        ]
        
        all_documents = []
        visited_urls = set()
        
        for url in priority_urls:
            try:
                documents = self._scrape_and_process_page(url, visited_urls)
                all_documents.extend(documents)
                time.sleep(2)  
                print(f"✅ {url} işlendi")
            except Exception as e:
                print(f"❌ {url} hatası: {e}")
                continue
        
        print(f"✅ Tarama tamamlandı: {len(all_documents)} doküman")
        return all_documents
    
    def _scrape_and_process_page(self, url: str, visited_urls: set) -> List[Document]:
        """Sayfayı scrape et ve işle"""
        if url in visited_urls:
            return []
            
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
                'Connection': 'keep-alive',
            }
            
            response = requests.get(url, headers=headers, timeout=15)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Gereksiz elementleri temizle
            for element in soup(['script', 'style', 'nav', 'footer', 'header']):
                element.decompose()
            
            # Başlık ve içerik çıkar
            title = soup.find('title')
            page_title = title.get_text().strip() if title else "Akbank"
            
            # Ana içerik bölümlerini bul
            main_content = self._extract_meaningful_content(soup)
            
            if not main_content or len(main_content) < 100:  # Minimum uzunluk
                return []
            
            # Doküman oluştur
            doc = Document(
                page_content=main_content,
                metadata={
                    "source": url,
                    "title": page_title,
                    "url": url,
                    "crawled_at": time.time()
                }
            )
            
            visited_urls.add(url)
            
            # Sayfayı böl
            chunks = self.text_splitter.split_documents([doc])
            return chunks
            
        except Exception as e:
            print(f"❌ Sayfa işleme hatası {url}: {e}")
            return []
    
    def _extract_meaningful_content(self, soup) -> str:
        """Anlamlı içeriği çıkar"""
        content_parts = []
        
        # Başlıklar
        for heading in soup.find_all(['h1', 'h2', 'h3', 'h4']):
            text = heading.get_text().strip()
            if text and len(text) > 5 and len(text) < 200:
                content_parts.append(f"## {text}")
        
        # Paragraflar
        for paragraph in soup.find_all('p'):
            text = paragraph.get_text().strip()
            if len(text) > 30 and len(text) < 500:
                content_parts.append(text)
        
        # Listeler
        for list_item in soup.find_all('li'):
            text = list_item.get_text().strip()
            if len(text) > 15 and len(text) < 300:
                content_parts.append(f"• {text}")
        
        # Tablo hücreleri
        for cell in soup.find_all(['td', 'th']):
            text = cell.get_text().strip()
            if len(text) > 10 and len(text) < 200:
                content_parts.append(text)
        
        # Div'lerden içerik (özellikle Akbank için)
        for div in soup.find_all('div', class_=True):
            text = div.get_text().strip()
            if len(text) > 50 and len(text) < 400:
                
                text = ' '.join(text.split())
                content_parts.append(text)
        
        
        unique_content = list(set(content_parts))
        return "\n".join(unique_content[:20])  
    
    def build_vector_store(self):
        """Vector store oluştur"""
        print("🔨 Vector store oluşturuluyor...")
        
        documents = self.crawl_akbank_comprehensively()
        
        if not documents:
            print("❌ Hiç doküman bulunamadı! Fallback bilgiler kullanılacak.")
            
            documents = self._create_fallback_documents()
        
        self.vector_store = Chroma.from_documents(
            documents=documents,
            embedding=self.embeddings,
            persist_directory="./akbank_rag_db"
        )
        
        print(f"✅ Vector store oluşturuldu: {len(documents)} chunk")
    
    def _create_fallback_documents(self) -> List[Document]:
        """Fallback dokümanlar oluştur"""
        fallback_content = """
        Akbank Bankacılık Hizmetleri:
        
        Bireysel Bankacılık:
        • Kredi Kartları: Axess, Wings, Param, Free kartlar
        • Krediler: İhtiyaç kredisi, konut kredisi, taşıt kredisi
        • Hesaplar: Vadesiz hesap, vadeli hesap, birikim hesapları
        • Yatırım: Döviz, altın, yatırım fonları
        
        Dijital Bankacılık:
        • Akbank Digital: İnternet bankacılığı
        • Akbank Mobile: Mobil uygulama
        • 7/24 bankacılık hizmetleri
        
        Müşteri Hizmetleri:
        • Telefon: 444 25 25
        • Şubeler: Türkiye geneli
        • Online destek
        
        Kampanyalar:
        • Güncel kampanyalar için web sitesini ziyaret edin
        • Kredi kartı kampanyaları
        • Özel müşteri avantajları
        """
        
        doc = Document(
            page_content=fallback_content,
            metadata={
                "source": "fallback",
                "title": "Akbank Genel Bilgiler",
                "url": "https://www.akbank.com",
                "crawled_at": time.time()
            }
        )
        
        return [doc]
    
    def query_rag(self, question: str, k: int = 4) -> Tuple[str, List[Dict]]:
        """RAG sistemiyle sorgu yap"""
        if not self.vector_store:
            return "RAG sistemi hazır değil", []
        
        try:
            
            docs = self.vector_store.similarity_search(question, k=k)
            
            
            context = "\n\n".join([
                f"Kaynak: {doc.metadata.get('title', 'Bilinmeyen')}\n"
                f"URL: {doc.metadata.get('url', 'Bilinmeyen')}\n"
                f"İçerik: {doc.page_content}\n"
                f"{'-'*50}"
                for doc in docs
            ])
            
            return context, docs
            
        except Exception as e:
            print(f"❌ RAG sorgu hatası: {e}")
            return f"RAG sorgu hatası: {str(e)}", []


rag_system = AdvancedAkbankRAG()