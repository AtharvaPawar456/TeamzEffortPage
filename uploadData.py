import requests

url = "https://script.google.com/macros/s/AKfycbwu3Y2ywmz70sECdwPbskQkAse4qGaJ8-35CS_ox24T3qZEsgBhq4hdsSlR549VLxIRZg/exec"

payload = {
    "name": "Atharva Pawar",
    "phone": "9876543210",
    "email": "atharva@gmail.com",
    "city": "Mumbai",
    "country": "India"
}

response = requests.post(url, json=payload)

print(response.status_code)
print(response.text)