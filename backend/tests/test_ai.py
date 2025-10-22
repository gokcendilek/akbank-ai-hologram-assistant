import asyncio
from ai_controller import AIController

async def test_ai():
    controller = AIController()
    
    test_messages = [
        "Akbank'ta bireysel kredi faiz oranları nedir?",
        "Dijital bankacılık hizmetleriniz neler?",
        "En yakın ATM nerede?",
        "Kredi kartı başvurusu nasıl yapabilirim?"
    ]
    
    for message in test_messages:
        print(f"\n👤 Kullanıcı: {message}")
        response = await controller.process_message(message, "test_session")
        print(f"🤖 Asistan: {response}")
        print("-" * 50)

if __name__ == "__main__":
    asyncio.run(test_ai())