import asyncio
import sys
import os

sys.path.append(os.path.dirname(__file__))

from ai_controller import AIController

async def quick_test():
    print("🚀 BASİT TEST BAŞLATILIYOR...")
    
    try:
        controller = AIController()
        
        
        test_questions = [
            "Axess kartı nedir?",
            "Kredi faiz oranları",
            "Şube nasıl bulunur?"
        ]
        
        for question in test_questions:
            print(f"\n🧪 Soru: {question}")
            response = await controller.process_message(question, "test_session")
            print(f"🤖 Cevap: {response}")
            print("-" * 50)
            
    except Exception as e:
        print(f"❌ Test hatası: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(quick_test())