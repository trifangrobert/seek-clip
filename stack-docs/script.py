from diagrams import Diagram, Cluster
from diagrams.onprem.client import User
from diagrams.onprem.database import MongoDB
from diagrams.elastic.elasticsearch import Elasticsearch
from diagrams.programming.language import TypeScript, Python, NodeJS
from diagrams.programming.framework import Flask, React
from diagrams.elastic.elasticsearch import Kibana

with Diagram("Project Architecture", show=True):
    # move the client side to the left
    with Cluster("Client Side"):
        user = User("User")
        react = React("React.js\n(TypeScript)")
        user >> react

    with Cluster("Server Side"):
        node_server = NodeJS("Node.js\n(TypeScript)")
        
        with Cluster("Machine Learning"):
            flask_speech = Flask("\nSpeech-to-Text")
            flask_text = Flask("\nText Classification")
            
            flask_speech >> node_server
            flask_text >> node_server
        
        react >> node_server
        
        
    with Cluster("Databases"):
        mongodb = MongoDB("MongoDB")
        elasticsearch = Elasticsearch("Elasticsearch")
        
        node_server >> mongodb
        node_server >> elasticsearch

    with Cluster("Monitoring"):
        kibana = Kibana("Kibana")
        elasticsearch >> kibana