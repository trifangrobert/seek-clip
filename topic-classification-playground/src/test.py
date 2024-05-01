from transformers import pipeline

if __name__ == "__main__":
    pipe = pipeline("text-classification", model="3funnn/bert-topic-classification")
    
    text = "The UK government has announced a new plan to tackle climate change."
    res = pipe(text)
    print(res)

