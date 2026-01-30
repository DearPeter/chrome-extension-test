// background.js - 处理 API 调用

let config = {
  apiKey: '',
  isEnabled: true
};

// 从存储加载配置
chrome.storage.local.get(['apiKey', 'isEnabled'], (result) => {
  if (result.apiKey) config.apiKey = result.apiKey;
  if (result.isEnabled !== undefined) config.isEnabled = result.isEnabled;
});

// 监听配置更新
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'TRANSLATE') {
    translateWithGemini(request.text)
      .then(translated => {
        sendResponse({ translated });
      })
      .catch(error => {
        console.error('Translation error:', error);
        sendResponse({ error: error.message });
      });
    return true; // 异步响应
  }
  
  if (request.type === 'UPDATE_CONFIG') {
    config.apiKey = request.apiKey || config.apiKey;
    config.isEnabled = request.isEnabled;
    chrome.storage.local.set({
      apiKey: config.apiKey,
      isEnabled: config.isEnabled
    });
    
    // 通知所有标签页更新配置
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, {
          type: 'CONFIG_UPDATE',
          apiKey: config.apiKey,
          isEnabled: config.isEnabled
        }).catch(() => {});
      });
    });
  }
});

async function translateWithGemini(text) {
  if (!config.apiKey) {
    throw new Error('请先设置 Gemini API Key');
  }
  
  const prompt = `Translate the following text to Chinese. Only output the translation, no explanations.\n\nText: "${text}"`;
  
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${config.apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    }
  );
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  const data = await response.json();
  
  if (data.candidates && data.candidates[0].content) {
    return data.candidates[0].content.parts[0].text.replace(/"/g, '').trim();
  }
  
  throw new Error('Invalid API response');
}
