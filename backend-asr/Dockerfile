FROM python:3.8-slim

RUN apt-get update && apt-get install build-essential -y

WORKDIR /app

COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

COPY . .

EXPOSE 5001

CMD ["python", "app.py"]
