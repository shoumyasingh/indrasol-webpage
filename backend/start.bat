@echo off
echo Starting virtual environment...
python -m venv venv
call venv\Scripts\activate

echo Installing requirements...
pip install --upgrade pip
pip install -r requirements.txt

echo Starting FastAPI app with Uvicorn...
uvicorn main:app --host 0.0.0.0 --port 8000
echo FastAPI app is running at http://localhost:8000
echo To stop the server, press Ctrl+C