from core.config import settings
import json

def atomic_bomb_project():
    return json.dumps({settings.MSG: "BOOM"})