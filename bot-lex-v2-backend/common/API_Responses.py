import json

class Responses:
    @staticmethod
    def _define_response(status_code=502, data={}):
        return {
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            'statusCode': status_code,
            'body': json.dumps(data)
        }

    @staticmethod
    def _200(data={}):
        return Responses._define_response(200, data)

    @staticmethod
    def _204(data={}):
        return Responses._define_response(204, data)

    @staticmethod
    def _400(data={}):
        return Responses._define_response(400, data)

    @staticmethod
    def _404(data={}):
        return Responses._define_response(404, data)
