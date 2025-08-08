# AI-Enhanced E-Commerce App

This is a simple e-commerce frontend enhanced with an AI-powered smart search feature. The app allows users to search for products with natural language queries like "jewelry under $20" or "electronics above 300", and intelligently matches the intent using semantic similarity.


# 🤖 AI Feature Chosen
🔍 Smart Product Search (NLP): Option A

- Implemented a smart product search feature that:

- Understands fuzzy category names (e.g., "men" → "men's clothing")

- Detects price modifiers (e.g., "under 50", "no more than 100", "approximately 300")

- Supports natural language search with synonyms and typos

- Uses semantic similarity (Dice coefficient + string similarity) to match input

# 🧰 Tools & Libraries Used

- React – Frontend framework

- string-similarity – For fuzzy matching categories

- Custom Dice Coefficient – For word-level semantic comparison

- JavaScript Regex – For numeric and modifier parsing

- GitHub + GitHub Desktop – Version control

# Bonus
This AI-powered smart search can be integrated with blockchain by enabling token-gated pricing, where users holding specific tokens gain access to exclusive discounts or products. Additionally, on-chain user preferences can personalize recommendations while ensuring data privacy and transparency. Loyalty rewards can be managed through smart contracts, automatically granting tokens or benefits based on user interactions and purchases.
---

## 🛠 How to Run the App

1. **Install Dependencies**  
   Make sure you have Node.js installed. Then run:
## Run Locally
Clone the project

```bash
  git clone https://github.com/ufukozkul/ecommerce.git
```

Go to the project directory

```bash
  cd ecommerce
```

Install dependencies

```bash
  npm install

  or 

  npm install react-material-ui-carousel --save --legacy-peer-deps
```

Start the server

```bash
  npm start
```

The server should now be running. You can access the application by opening a web browser and entering the following URL:

```bash
  http://localhost:3000
```
