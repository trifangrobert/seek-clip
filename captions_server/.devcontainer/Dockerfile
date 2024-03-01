# FROM pytorch/pytorch:1.8.1-cuda11.1-cudnn8-runtime
FROM python:3.8-slim

WORKDIR /app

COPY ./requirements.txt /app/requirements.txt

RUN pip install --no-cache-dir -r requirements.txt

COPY . /app

EXPOSE 5000

ENV USE_GPU=true

# CMD ["flask", "run", "--host=0.0.0.0"] # looks like this is recommended for development
CMD ["python", "run.py"] # this is recommended for production