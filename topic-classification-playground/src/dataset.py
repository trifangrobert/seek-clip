from torch.utils.data import Dataset
import os
import torch

from transformers import BertTokenizer

class TopicDataset(Dataset):
    def __init__(self, dataset_path: str, tokenizer_name: str = "bert-base-uncased", limit: int = None):
        self.limit = limit if limit is not None else 100000
        self.dataset_path = dataset_path
        self.label_values = [file for file in os.listdir(dataset_path)]
        self.label_count = { label: min(self.limit, len(os.listdir(os.path.join(dataset_path, label)))) for label in self.label_values }
        self.value_to_label = { i: label for i, label in enumerate(self.label_values) }
        print(self.label_values)
        print(self.label_count)
        print(self.value_to_label)
        
        self.tokenizer = BertTokenizer.from_pretrained(tokenizer_name)
        self.label_dict = { label: i for i, label in enumerate(self.label_values) }
        
    def _get_index(self, idx: int):
        ret_idx, ret_label = idx, self.label_values[0]
        
        for i, label in enumerate(self.label_values):
            label_cnt = min(self.limit, self.label_count[label])
            if ret_idx >= label_cnt:
                ret_idx -= label_cnt
                ret_label = self.label_values[i + 1]
            else:
                break
            
        return ret_idx, ret_label
        
    def __len__(self):
        return sum(self.label_count.values())
    
    def __getitem__(self, idx: int):
        idx, label = self._get_index(idx)
        idx += 1
        file_name = f"{str(idx).zfill(3)}.txt"
                
        sample_path = os.path.join(self.dataset_path, label, file_name)
        with open(sample_path, "r") as f:
            text = f.read()
            
        label = self.label_dict[label]
        label = torch.tensor(label, dtype=torch.long)
        text = self.tokenizer(text, padding='max_length', truncation=True, max_length=512, return_tensors='pt')
        
        input_ids = text['input_ids'].squeeze()
        attention_mask = text['attention_mask'].squeeze()

        return input_ids, attention_mask, label
        
            
if __name__ == "__main__":
    dataset = TopicDataset("../data/bbc/")
    print('dataset length:', len(dataset))
    # for i in range(0, len(dataset), 1):
        # x, y, z = dataset[i]
                
                
    # with open("../data/bbc/sport/199.txt", "rb") as f:
    #     text = f.read()
    #     text = text.decode("utf-8")
    #     print(text)