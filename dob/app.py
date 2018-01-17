from flask import Flask, request, jsonify
import requests
import sys

app = Flask(__name__)

EVENT_STORE_URL = 'http://event-store:3000/events'


@app.route('/')
def hello_world():
    return 'Hello World!'


@app.route('/add_dob', methods=['POST'])
def add_dob():
    username = request.form['username']
    dob = request.form['date_of_birth']
    payload = dict(eventType="add_dob", username=username, date_of_birth=dob)
    r = requests.post(EVENT_STORE_URL, data=payload)
    return r.text, r.status_code
