import os
from dotenv import load_dotenv
from langchain.agents import Tool
from langchain.agents import initialize_agent
from langchain.memory import ConversationBufferWindowMemory
from langchain_openai import ChatOpenAI


load_dotenv()

class SmartBankingAgent:
    def __init__(self, rag_system):
        
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        self.debug = os.getenv("DEBUG", "False").lower() == "true"
        
        if not self.openai_api_key:
            raise ValueError("OPENAI_API_KEY environment variable bulunamadı!")
        
        self.llm = ChatOpenAI(
            model="gpt-3.5-turbo",
            temperature=0.3,
            openai_api_key=self.openai_api_key
        )
        
        self.rag = rag_system
        
        
        self.memory = ConversationBufferWindowMemory(
            memory_key="chat_history",
            k=5,
            return_messages=True
        )
        
        self.tools = self._setup_tools()
        self.agent = self._create_simple_agent()  
        
        if self.debug:
            print("✅ Smart Banking Agent başlatıldı")
    
    def _setup_tools(self):
        """Araçları kur"""
        return [
            Tool(
                name="rag_knowledge_base",
                func=self._query_rag_system,
                description="Akbank ürün ve kampanya bilgileri için kullan"
            ),
            Tool(
                name="banking_services_expert", 
                func=self._expert_banking_advice,
                description="Bankacılık prosedürleri ve nasıl yapılır soruları için kullan"
            )
        ]
    
    def _query_rag_system(self, query: str) -> str:
        """RAG sistemini sorgula"""
        try:
            if self.debug:
                print(f"🔍 RAG Sorgusu: {query}")
            
            context, docs = self.rag.query_rag(query, k=4)
            
            if not docs:
                return "Bu konuda yeterli bilgi bulunamadı."
            
            prompt = f"""
            SORU: {query}

            BİLGİLER:
            {context}

            Bu bilgilere dayanarak net ve spesifik cevap ver:
            """
            
            response = self.llm.invoke(prompt)
            return response.content
            
        except Exception as e:
            return f"RAG sorgu hatası: {str(e)}"
    
    def _expert_banking_advice(self, query: str) -> str:
        """Bankacılık uzmanı tavsiyesi"""
        prompt = f"""
        Kullanıcı sorusu: {query}
        
        Akbank bankacılık uzmanı olarak cevap ver:
        - Kart şifresi için: 444 25 25'ı ara veya şubeye git
        - Kredi başvurusu için: internet/mobil bankacılık veya şube
        - Diğer işlemler için: kimlikle şubeye git
        """
        
        response = self.llm.invoke(prompt)
        return response.content
    
    def _create_simple_agent(self):
        """Basit ve güvenilir agent oluştur"""
        from langchain.agents import AgentType
        
        agent = initialize_agent(
            tools=self.tools,
            llm=self.llm,
            agent=AgentType.STRUCTURED_CHAT_ZERO_SHOT_REACT_DESCRIPTION,  
            verbose=self.debug,
            handle_parsing_errors=True,
            max_iterations=3,
            early_stopping_method="generate",
        )
        
        return agent
    
    async def process_query(self, query: str, session_id: str) -> str:
        """Sorguyu işle"""
        try:
            if self.debug:
                print(f"🔧 Agent işlemi: {query}")
            
            
            response = self._query_rag_system(query)
            
            
            if "yeterli bilgi bulunamadı" in response.lower():
                response = await self.agent.arun(input=query)
            
            return response
            
        except Exception as e:
            print(f"❌ Agent hatası: {e}")
            
            return self._query_rag_system(query)