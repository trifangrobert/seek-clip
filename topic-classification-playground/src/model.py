from transformers import BertModel
import torch.nn as nn

from dataset import TopicDataset

class BertClassifier(nn.Module):
    def __init__(self, num_classes: int, bert_model_name: str = 'bert-base-uncased'):
        super(BertClassifier, self).__init__()
        self.bert = BertModel.from_pretrained(bert_model_name)
        self.classifier = nn.Linear(self.bert.config.hidden_size, num_classes)
        
    def forward(self, input_ids, attention_mask):
        outputs = self.bert(input_ids=input_ids, attention_mask=attention_mask)
        last_hidden_state = outputs.last_hidden_state
        cls_output = last_hidden_state[:, 0, :]
        output = self.classifier(cls_output)
        
        return output
    
if __name__ == "__main__":
    model = BertClassifier(5)
    print(model)
    
    # dummy_input_ids = torch.randint(0, 1000, (1, 512))
    # dummy_attention_mask = torch.randint(0, 2, (1, 512))
    
    # output = model(dummy_input_ids, dummy_attention_mask)
    # print(output)
    
    dataset = TopicDataset("../data/bbc/", 1)
    sample = dataset[0]
    input_ids, attention_mask, label = sample
    input_ids = input_ids.unsqueeze(0)
    attention_mask = attention_mask.unsqueeze(0)
    
    output = model(input_ids, attention_mask)
    print(output)
    