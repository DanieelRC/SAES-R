FROM python:3.10-slim

WORKDIR /app

# Instalar dependencias del sistema mínimas necesarias
# build-essential se mantiene por si alguna librería de python requiere compilación
RUN apt-get update && apt-get install -y build-essential && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --upgrade pip && pip install --default-timeout=1000 --no-cache-dir -r requirements.txt

# Descargar modelo de spaCy necesario
RUN python -m spacy download es_core_news_sm

COPY . .

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]