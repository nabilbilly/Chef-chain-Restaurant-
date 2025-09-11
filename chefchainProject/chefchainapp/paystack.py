# from django.conf import settings
# import requests

# class Paystack:
#     PAYSTACK_SK = settings.PAYSTACK_SECRET_KEY
#     base_url = "https://api.paystack.co/"

#     def verify_payment(self, ref, *args, **kwargs):
#         path = f'transaction/verify/{ref}'
#         headers = {
#             "Authorization": f"Bearer {self.PAYSTACK_SK}",
#             "Content-Type": "application/json",
#         }
#         url = self.base_url + path
#         response = requests.get(url, headers=headers)

#         if response.status_code == 200:
#             response_data = response.json()
#             return response_data['status'], response_data['data']

#         response_data = response.json()

#         return response_data['status'], response_data['message']


# paystack.py
import requests
from django.conf import settings

class Paystack:
    PAYSTACK_SECRET_KEY = settings.PAYSTACK_SECRET_KEY
    base_url = "https://api.paystack.co"
    
    def verify_payment(self, reference, *args, **kwargs):
        path = f"/transaction/verify/{reference}"
        
        headers = {
            "Authorization": f"Bearer {self.PAYSTACK_SECRET_KEY}",
            "Content-Type": "application/json",
        }
        url = self.base_url + path
        response = requests.get(url, headers=headers)
        
        if response.status_code == 200:
            response_data = response.json()
            return response_data['status'], response_data['data']
        
        response_data = response.json()
        return False, response_data['message']
    
    def initialize_payment(self, email, amount, reference, callback_url=None):
        path = "/transaction/initialize"
        
        headers = {
            "Authorization": f"Bearer {self.PAYSTACK_SECRET_KEY}",
            "Content-Type": "application/json",
        }
        
        payload = {
            "email": email,
            "amount": int(amount * 100),  # Convert to kobo
            "reference": reference,
            "callback_url": callback_url,
        }
        
        url = self.base_url + path
        response = requests.post(url, headers=headers, json=payload)
        
        if response.status_code == 200:
            response_data = response.json()
            return response_data['status'], response_data['data']
        
        response_data = response.json()
        return False, response_data['message']