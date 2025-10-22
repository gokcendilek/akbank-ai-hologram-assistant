import asyncio
from ai_controller import AIController

async def test_enhanced_system():
    print("🧪 Gelişmiş sistem testi başlatılıyor...")
    
    controller = AIController()
    
    test_cases = [
        "Axess kartının güncel kampanyaları neler?",
        "Bireysel ihtiyaç kredisi faiz oranları nedir?",
        "Kart şifremi unuttum ne yapmalıyım?",
        "Dijital bankacılıkta para transferi nasıl yapılır?",
        "Öğrencilere özel kredi kartı var mı?",
        "Konut kredisi başvurusu için gerekli belgeler neler?",
        "Mobil uygulamadan kredi başvurusu yapabilir miyim?"
    ]
    
    for i, question in enumerate(test_cases, 1):
        print(f"\n{'='*60}")
        print(f"🧪 TEST {i}: {question}")
        print(f"{'='*60}")
        
        response = await controller.process_message(question, f"test_session_{i}")
        print(f"🤖 YANIT: {response}")
        
        await asyncio.sleep(2) 

if __name__ == "__main__":
    asyncio.run(test_enhanced_system())