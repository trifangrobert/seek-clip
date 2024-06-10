from diagrams import Diagram, Cluster, Edge
from diagrams.onprem.client import User
from diagrams.onprem.database import MongoDB
from diagrams.elastic.elasticsearch import Elasticsearch
from diagrams.programming.language import TypeScript, Python, NodeJS
from diagrams.programming.framework import Flask, React
from diagrams.elastic.elasticsearch import Kibana

with Diagram("Arhitectura proiectului", show=True):
    # Client side on the left
    with Cluster("Client"):
        user = User("Utilizator")
        react = React("React.js\n(TypeScript)")
        user >> react

    with Cluster("Server"):
        node_server = NodeJS("Node.js\n(TypeScript)")
        
        with Cluster("\nModele de învățare automată"):
            # Set direction to "LR" for left-to-right. Default is "TB" (top-to-bottom)
            direction = "LR"
            flask_speech = Flask("\nRecunoașterea\nvorbirii")
            flask_text = Flask("\nClasificarea\nvideoclipurilor")
            flask_qa = Flask("\nÎntrebări despre\nvideoclipuri")
            
            flask_speech >> Edge(style="invis") >> flask_text >> Edge(style="invis") >> flask_qa
            flask_speech >> node_server
            flask_text >> node_server
            flask_qa >> node_server
        
        react >> node_server

    with Cluster("Baze de date"):
        mongodb = MongoDB("MongoDB")
        elasticsearch = Elasticsearch("Elasticsearch")
        
        node_server >> mongodb
        node_server >> elasticsearch

    with Cluster("Monitorizare"):
        kibana = Kibana("Kibana")
        elasticsearch >> kibana
