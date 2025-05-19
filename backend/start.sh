#!/bin/bash

echo "Starting virtual environment..."
python3 -m venv venv
source venv/bin/activate

echo "Installing requirements..."
pip install --upgrade pip
pip install -r requirements.txt

echo "Starting FastAPI app with Uvicorn..."
uvicorn main:app --host 0.0.0.0 --port 8000
