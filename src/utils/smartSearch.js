import stringSimilarity from "string-similarity";

// Expanded price-related keywords
const priceKeywordMap = {
  under: [
    'under', 'below', 'less than', 'less', 'cheaper than', 
    'lower than', 'max', 'maximum', 'upto', 'up to',
    'within', 'at most'
  ],
  above: [
    'above', 'over', 'more than', 'more', 'greater than', 
    'higher than', 'min', 'minimum', 'from', 'at least'
  ],
  around: [
    'around', 'approximately', 'approx', 'near',
    'close to', 'roughly', '~', 'circa'
  ],
};

function diceCoefficient(str1, str2) {
  const bigrams = (s) => {
    let pairs = [];
    for (let i = 0; i < s.length - 1; i++) {
      pairs.push(s.substring(i, i + 2));
    }
    return pairs;
  };

  const pairs1 = bigrams(str1.toLowerCase());
  const pairs2 = bigrams(str2.toLowerCase());
  let intersection = 0;

  for (const x of pairs1) {
    const index = pairs2.indexOf(x);
    if (index !== -1) {
      intersection++;
      pairs2.splice(index, 1);
    }
  }

  return (2.0 * intersection) / (pairs1.length + pairs2.length);
}

function findBestMatch(inputWord, keywordMap, threshold = 0.2) {
  let bestGroup = null;
  let bestScore = 0;

  for (const [group, keywords] of Object.entries(keywordMap)) {
    for (const keyword of keywords) {
      const score = diceCoefficient(inputWord, keyword);
      if (score > bestScore) {
        bestScore = score;
        bestGroup = group;
      }
    }
  }

  return bestScore >= threshold ? bestGroup : null;
}

/**
 * @param {string} query - user search query
 * @param {Array} products - product list
 * @param {number} scanRange - how many words after keyword to scan for price (default 3)
 */
export function smartSearch(query, products, scanRange = 3) {
    const lower = query.toLowerCase();
    const queryWords = lower.split(/\s+/);
  
    let priceIndicator = null;
    let priceValue = null;
    let invertPriceFilter = false;
  
    for (let i = 0; i < queryWords.length; i++) {
      const group = findBestMatch(queryWords[i], priceKeywordMap, 0.3);
      if (group) {
        // Check if 'no' is immediately before this keyword to invert filter
        if (i > 0 && queryWords[i - 1] === "no") {
          invertPriceFilter = true;
        }
  
        for (let j = i + 1; j <= i + scanRange && j < queryWords.length; j++) {
          const numMatch = queryWords[j].match(/\$?(\d+(\.\d+)?)/);
          if (numMatch) {
            priceIndicator = group;
            priceValue = parseFloat(numMatch[1]);
            break;
          }
        }
        if (priceIndicator) break;
      }
    }
  
    let minPrice = 0;
    let maxPrice = Infinity;
  
    if (priceIndicator === "under") {
      if (!invertPriceFilter) maxPrice = priceValue;
      else minPrice = priceValue + 0.01;  // invert: price > value
    } else if (priceIndicator === "above") {
      if (!invertPriceFilter) minPrice = priceValue;
      else maxPrice = priceValue - 0.01;  // invert: price < value
    } else if (priceIndicator === "around") {
      const lowerBound = priceValue * 0.6;
      const upperBound = priceValue * 1.4;
      if (!invertPriceFilter) {
        minPrice = lowerBound;
        maxPrice = upperBound;
      } else {
        // invert: price < lowerBound OR price > upperBound
        // We'll handle this logic later in filtering
        minPrice = -Infinity;
        maxPrice = Infinity; 
      }
    }
  
    const categories = ["men's clothing", "women's clothing", "jewelery", "electronics"];
  
    let bestMatch = { category: "", rating: 0 };
    categories.forEach((cat) => {
      const similarity = stringSimilarity.compareTwoStrings(lower, cat.toLowerCase());
      if (similarity > bestMatch.rating) {
        bestMatch = { category: cat, rating: similarity };
      }
    });
  
    const threshold = 0.1;
    const matchedCategory = bestMatch.rating >= threshold ? bestMatch.category : "";
  
    return products.filter((p) => {
      const price = parseFloat(p.price);
  
      // For "around" inverted case: outside the range
      let priceMatch;
      if (priceIndicator === "around" && invertPriceFilter) {
        priceMatch = price < priceValue * 0.6 || price > priceValue * 1.4;
      } else {
        priceMatch = price >= minPrice && price <= maxPrice;
      }
  
      const titleMatch = p.title.toLowerCase().includes(lower);
      const categoryMatch = matchedCategory ? p.category.toLowerCase() === matchedCategory.toLowerCase() : true;
  
      return (titleMatch || categoryMatch) && priceMatch;
    });
  }
  