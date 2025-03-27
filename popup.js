document.getElementById('exportButton').addEventListener('click', async () => {
  const statusDiv = document.getElementById('status');
  statusDiv.textContent = 'Processing...';

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab.url.includes('foodsdictionary.co.il')) {
      statusDiv.textContent = 'Please open a FoodsDictionary diary page first.';
      return;
    }

    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: extractDiaryData,
    });

    const data = results[0].result;
    
    // Create and download JSON file
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'foodsdictionary_diary.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    statusDiv.textContent = 'Export completed!';
  } catch (error) {
    statusDiv.textContent = `Error: ${error.message}`;
  }
});

function extractDiaryData() {
  const meals = {};
  let currentMeal = null;

  // Helper function to clean text
  const cleanText = (text) => {
    return text.trim()
      .replace(/\s+/g, ' ')
      .replace(/\u200E/g, '') // Remove LTR mark
      .replace(/\u200F/g, ''); // Remove RTL mark
  };

  // Process auto-save content if available
  const autoSaveElements = document.querySelectorAll('[class^="auto-c-"]');
  if (autoSaveElements.length > 0) {
    autoSaveElements.forEach(element => {
      const className = element.className;
      
      // Check if this is a meal header
      if (className.includes('menu-c-')) {
        currentMeal = cleanText(element.textContent);
        meals[currentMeal] = [];
      }
      // Check if this is a food item
      else if (className.includes('item-') && currentMeal) {
        const foodItem = cleanText(element.textContent);
        if (foodItem) {
          meals[currentMeal].push(foodItem);
        }
      }
    });
  } else {
    // Fallback to HTML structure if auto-save content is not available
    document.querySelectorAll('h3, .meal-items').forEach(element => {
      if (element.tagName === 'H3') {
        currentMeal = cleanText(element.textContent);
        meals[currentMeal] = [];
      } else if (element.classList.contains('meal-items') && currentMeal) {
        element.querySelectorAll('.food-item').forEach(item => {
          const foodItem = cleanText(item.textContent);
          if (foodItem) {
            meals[currentMeal].push(foodItem);
          }
        });
      }
    });
  }

  // Add metadata
  const metadata = {
    date: document.querySelector('.auto-c-date')?.textContent.trim() || 
          document.querySelector('.diary-date')?.textContent.trim() || '',
    title: document.querySelector('.auto-c-h1')?.textContent.trim() || 
           document.querySelector('h1')?.textContent.trim() || '',
    clientInfo: document.querySelector('.auto-c-client-info')?.textContent.trim() || ''
  };

  return {
    metadata,
    meals
  };
}