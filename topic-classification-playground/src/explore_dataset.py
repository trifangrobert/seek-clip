import os
import matplotlib.pyplot as plt

def calculate_article_stats(base_path):
    # Dicționar pentru a stoca numărul de articole și media numărului de caractere per categorie
    categories_count = {}
    categories_avg_length = {}
    
    # Iterăm prin fiecare folder din directorul de bază
    for category in os.listdir(base_path):
        category_path = os.path.join(base_path, category)
        if os.path.isdir(category_path):
            # Colectăm toate fișierele txt din fiecare categorie
            files = [name for name in os.listdir(category_path) if name.endswith('.txt')]
            num_files = len(files)
            total_chars = sum(len(open(os.path.join(category_path, f), 'r', encoding='utf-8').read()) for f in files)
            average_length = total_chars / num_files if num_files else 0
            categories_count[category] = num_files
            categories_avg_length[category] = average_length
    
    return categories_count, categories_avg_length

def plot_data(categories_count, categories_avg_length):
    translate_category = {
        "business": "afaceri",
        "entertainment": "divertisment",
        "politics": "politica",
        "sport": "sport",
        "tech": "tehnologie"
    }
    categories = list(categories_count.keys())
    num_articles = list(categories_count.values())
    avg_lengths = list(categories_avg_length.values())
    translated_categories = [translate_category[category] for category in categories]
    
    plt.rcParams.update({'font.size': 14})
    fig, ax1 = plt.subplots(figsize=(12, 6))
    
    # Bar plot for the number of articles
    color = 'tab:red'
    ax1.set_xlabel('Categorii')
    ax1.set_ylabel('Numărul de articole', color=color)
    ax1.bar(translated_categories, num_articles, color=color, alpha=0.6)
    ax1.tick_params(axis='y', labelcolor=color)
    
    # Create a second y-axis for the average length of articles
    ax2 = ax1.twinx()
    color = 'tab:blue'
    ax2.set_ylabel('Lungimea medie a articolelor', color=color)
    ax2.plot(translated_categories, avg_lengths, color=color, marker='o')
    ax2.tick_params(axis='y', labelcolor=color)
    
    plt.title('Numărul de articole și lungimea medie a textului după categorie în setul de date BBC News')
    plt.xticks(rotation=45)
    fig.tight_layout()
    plt.savefig('bbc_stats_ro.png')
    plt.show()

# Base directory path
base_path = '../data/bbc'

# Calculate article counts and average lengths
category_counts, category_avg_lengths = calculate_article_stats(base_path)

# Plot the data
plot_data(category_counts, category_avg_lengths)
