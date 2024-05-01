import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, random_split
from torch.optim.lr_scheduler import ReduceLROnPlateau, StepLR
from transformers import BertForSequenceClassification

from dataset import TopicDataset
from model import BertClassifier

from tqdm import tqdm
import argparse
import yaml
import os
import wandb


device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

class Trainer:
    def __init__(self, dataset_path, hparams):
        self.hparams = hparams
        # self.model = BertClassifier(hparams["num_classes"])
        self.model = BertForSequenceClassification.from_pretrained("bert-base-uncased", num_labels=hparams["num_classes"])
        print("Model initialized")
        
        self.dataset = TopicDataset(dataset_path=dataset_path)
        split_ratio = 0.8
        split_index = int(split_ratio * len(self.dataset))
        self.train_dataset, self.eval_dataset = random_split(self.dataset, [split_index, len(self.dataset) - split_index])
        print(f"Train dataset size: {len(self.train_dataset)}, Eval dataset size: {len(self.eval_dataset)}")
        print("Dataset initialized")
        
        self.save_path = "../experiments/"
        self.experiment_path = None
        save_index = 0
        for file in os.listdir(self.save_path):
            file_path = os.path.join(self.save_path, file)
            if os.path.isdir(file_path):
                save_index = max(save_index, int(file))
        save_index += 1
        self.experiment_path = os.path.join(self.save_path, str(save_index))
        os.makedirs(self.experiment_path, exist_ok=True)
        print(f"Experiment will be saved at {self.experiment_path}")
                
        self.train_loader = DataLoader(self.train_dataset, batch_size=hparams["batch_size"], shuffle=True)
        self.eval_loader = DataLoader(self.eval_dataset, batch_size=hparams["batch_size"], shuffle=False)
        
        wandb.init(project="topic-classification", config=hparams)
        
        self.best_accuracy = 0.0
        self.best_loss = float("inf")
        
    
    def train(self):
        print(f"Training on {device}")
        self.model.to(device)
        
        self.criterion = nn.CrossEntropyLoss()
        self.optimizer = optim.Adam(self.model.parameters(), lr=self.hparams["learning_rate"])
        # self.scheduler = ReduceLROnPlateau(self.optimizer, mode='min', factor=0.1, patience=hparams["patience"], verbose=True)
        # self.scheduler = StepLR(self.optimizer, step_size=self.hparams["patience"], gamma=0.1)
        self.scheduler = None
        
        for epoch in range(self.hparams["epochs"]):
            train_loss, train_acc = self.train_epoch(epoch)
            eval_loss, eval_acc = self.eval_epoch(epoch)
            
            if self.scheduler is not None:
                self.scheduler.step(eval_loss)
            print(f"Epoch {epoch + 1}: Train Loss: {train_loss:.4f}, Train Acc: {train_acc:.4f}, Eval Loss: {eval_loss:.4f}, Eval Acc: {eval_acc:.4f}")
            
        wandb.finish()

    def train_epoch(self, epoch):
        self.model.train()
        total_loss = 0.0
        total_correct = 0
        total_count = 0
        
        
        for batch in tqdm(self.train_loader,  desc=f"Training on epoch {epoch + 1}"):
            input_ids, attention_mask, labels = batch
            input_ids, attention_mask, labels = input_ids.to(device), attention_mask.to(device), labels.to(device, dtype=torch.long)
            
            self.optimizer.zero_grad()
            outputs = self.model(input_ids, attention_mask)
            outputs = outputs.logits
            
            loss = self.criterion(outputs, labels)
            loss.backward()
            self.optimizer.step()
            
            total_loss += loss.item()
            total_count += labels.size(0)
            total_correct += (outputs.argmax(1) == labels).sum().item()
            
            
        avg_loss = total_loss / total_count
        avg_acc = total_correct / total_count 
        wandb.log({"train_loss": avg_loss, "train_accuracy": avg_acc}, step=epoch)
            
        return avg_loss, avg_acc
        
        
    def eval_epoch(self, epoch):
        self.model.eval()
        total_loss = 0.0
        total_correct = 0
        total_count = 0
        
        with torch.no_grad():
            for batch in tqdm(self.eval_loader, desc=f"Validating on epoch {epoch + 1}"):
                input_ids, attention_mask, labels = batch
                input_ids, attention_mask, labels = input_ids.to(device), attention_mask.to(device), labels.to(device, dtype=torch.long)
                
                outputs = self.model(input_ids, attention_mask)
                outputs = outputs.logits
                loss = self.criterion(outputs, labels)
                
                total_loss += loss.item()
                total_count += labels.size(0)
                total_correct += (outputs.argmax(1) == labels).sum().item()
                
        avg_loss = total_loss / total_count
        avg_acc = total_correct / total_count
        
        if avg_acc > self.best_accuracy:
            self.best_accuracy = avg_acc
            torch.save(self.model.state_dict(), os.path.join(self.experiment_path, f"{avg_acc:.4f}_model.pth"))
            hparams["best_accuracy"] = avg_acc
            hparams["best_loss"] = avg_loss
            with open(os.path.join(self.experiment_path, f"hparams.yaml"), "w") as f:
                yaml.dump(self.hparams, f)
            print(f"Model saved with accuracy {avg_acc:.4f}")
        
        wandb.log({"eval_loss": avg_loss, "eval_accuracy": avg_acc}, step=epoch)
        return avg_loss, avg_acc
            

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--hparams_path", type=str)
    args = parser.parse_args()
    
    with open(args.hparams_path, "r") as f:
        hparams = yaml.safe_load(f)
    print(hparams)
    
    trainer = Trainer("../data/bbc/", hparams)
    trainer.train()
    
    
    