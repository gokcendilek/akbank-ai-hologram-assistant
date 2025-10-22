import time
from typing import Dict, Any
import json

class SessionManager:
    def __init__(self):
        self.sessions: Dict[str, Dict[str, Any]] = {}
        
    def create_session(self, session_id: str):
        self.sessions[session_id] = {
            "created_at": time.time(),
            "last_activity": time.time(),
            "conversation_history": [],
            "user_preferences": {},
            "context": {}
        }
        return self.sessions[session_id]
    
    def get_session(self, session_id: str):
        if session_id not in self.sessions:
            return self.create_session(session_id)
        
        
        self.sessions[session_id]["last_activity"] = time.time()
        return self.sessions[session_id]
    
    def update_session(self, session_id: str, updates: Dict[str, Any]):
        session = self.get_session(session_id)
        session.update(updates)
        
    def cleanup_old_sessions(self, max_age_hours: int = 24):
        current_time = time.time()
        expired_sessions = []
        
        for session_id, session_data in self.sessions.items():
            if current_time - session_data["last_activity"] > max_age_hours * 3600:
                expired_sessions.append(session_id)
        
        for session_id in expired_sessions:
            del self.sessions[session_id]

session_manager = SessionManager()