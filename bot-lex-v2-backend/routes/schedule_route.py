from controllers.schedule_controller import update_schedule
import json


def handler(event, context):
    if event.get('httpMethod') == 'POST':
        schedule_json = update_schedule(event)
        return schedule_json