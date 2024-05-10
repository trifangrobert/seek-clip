
FROM python:3.5

RUN apt-get update

RUN apt-get install git

COPY . /tmp/connector

RUN pip install -r /tmp/connector/requirements.txt

CMD ["bash", "/tmp/connector/run-connector.sh"]

# # Use an official Python runtime as a parent image
# FROM python:3.8-slim

# # Set the working directory
# WORKDIR /usr/src/app

# RUN apt-get update && apt-get install -y \
#     git \
#     && rm -rf /var/lib/apt/lists/*  

# # Install mongo-connector and the Elasticsearch doc manager
# # RUN pip install 'mongo-connector[elastic5]'
# RUN pip install 'mongo-connector[elastic7]'
# RUN pip install 'elastic2-doc-manager[elastic5]'
# # RUN pip install git+https://github.com/tmpaul06/elastic7-doc-manager.git


# # Copy the configuration file from the local directory to the container
# COPY config.json /usr/src/app/config.json

# # Run mongo-connector when the container launches
# CMD ["mongo-connector", "-c", "config.json"]
