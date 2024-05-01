from transformers import BertModel, BertTokenizer, BertConfig, BertForSequenceClassification
import torch

if __name__ == "__main__":
    id2label = {0: 'sport', 1: 'entertainment', 2: 'tech', 3: 'business', 4: 'politics'}
    label2id = {v: k for k, v in id2label.items()}
    
    # model_path = "../experiments/9/0.9910_model.pth"
    model_path = "../experiments/12/0.9888_model.pth"
    model_save_directory = "../huggingface"
    config = BertConfig.from_pretrained("bert-base-uncased", num_labels=5, id2label=id2label, label2id=label2id)
    model = BertForSequenceClassification(config)
    model.load_state_dict(torch.load(model_path))
    tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")
    
    # save model
    model.save_pretrained(model_save_directory)
    tokenizer.save_pretrained(model_save_directory)
    
    # text = "The UK government has announced a new plan to tackle climate change."
    # text = "The football match was a disaster. The team lost 3-0."
    # text = "The stock market is booming. The economy is doing well."
    # text = "The new iPhone is expected to be released next month."
    text = "The new movie is a hit. It has received great reviews."
    text = tokenizer(text, padding='max_length', truncation=True, max_length=512, return_tensors='pt')
    
    input_ids = text['input_ids'].squeeze()
    attention_mask = text['attention_mask'].squeeze()
    
    output = model(input_ids.unsqueeze(0), attention_mask.unsqueeze(0))
    output = output.logits
    output = torch.nn.functional.softmax(output, dim=1)
    res = output.argmax(1)
    print(output)
    print(id2label[res.item()])
    