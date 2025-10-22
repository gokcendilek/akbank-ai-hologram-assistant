import asyncio
import sys
import os

sys.path.append(os.path.dirname(__file__))

from ai_controller import AIController

async def complex_test():
    print("🚀 KOMPLEKS TEST BAŞLATILIYOR...")
    
    controller = AIController()
    
    complex_questions = [
        "Axess kartıyla yurt dışında alışveriş yapabilir miyim?",
        "İhtiyaç kredisi için hangi belgeler gerekli?",
        "Dijital bankacılıkta para transferi ücreti ne kadar?",
        "Öğrencilere özel kredi kartı var mı?",
        "Konut kredisi başvurusu nasıl yapılır?"
    ]
    
    for question in complex_questions:
        print(f"\n🧠 Kompleks Soru: {question}")
        response = await controller.process_message(question, "complex_test")
        print(f"🤖 Cevap: {response}")
        print("=" * 80)

if __name__ == "__main__":
    asyncio.run(complex_test())
    