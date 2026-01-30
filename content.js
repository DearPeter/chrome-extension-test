// content.js - 核心翻译逻辑
let apiKey = '';
let isEnabled = true;

// 监听来自 background 的配置更新
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'CONFIG_UPDATE') {
    apiKey = request.apiKey;
    isEnabled = request.isEnabled;
  }
});

// 检测语言（简单判断是否包含中文）
function containsChinese(text) {
  return /[\u4e00-\u9fa5]/.test(text);
}

// 获取鼠标位置的文本节点
function getTextAtPoint(x, y) {
  const element = document.elementFromPoint(x, y);
  if (!element) return null;
  
  // 获取可点击元素内的文本
  const text = element.innerText || element.textContent;
  return text ? text.trim() : null;
}

// 显示翻译浮动框
function showTranslationBox(x, y, original, translated) {
  hideTranslationBox();
  
  const box = document.createElement('div');
  box.id = 'gemini-translation-box';
  box.innerHTML = `
    <div class="gemini-original">${escapeHtml(original)}</div>
    <div class="gemini-translated">${escapeHtml(translated)}</div>
  `;
  
  document.body.appendChild(box);
  
  // 定位
  box.style.left = `${x + 15}px`;
  box.style.top = `${y + 15}px`;
}

function hideTranslationBox() {
  const box = document.getElementById('gemini-translation-box');
  if (box) box.remove();
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// 鼠标悬停事件
let hoverTimeout = null;
document.addEventListener('mouseover', (e) => {
  if (!isEnabled || !apiKey) return;
  
  const target = e.target;
  const text = target.innerText?.trim();
  
  if (!text || text.length < 2 || containsChinese(text)) return;
  
  // 防抖：300ms 后触发翻译
  clearTimeout(hoverTimeout);
  hoverTimeout = setTimeout(() => {
    translateText(text, target);
  }, 300);
});

document.addEventListener('mouseout', (e) => {
  clearTimeout(hoverTimeout);
  hideTranslationBox();
});

async function translateText(text, element) {
  try {
    const response = await chrome.runtime.sendMessage({
      type: 'TRANSLATE',
      text: text
    });
    
    if (response && response.translated) {
      const rect = element.getBoundingClientRect();
      showTranslationBox(rect.left, rect.top, text, response.translated);
    }
  } catch (error) {
    console.error('Translation error:', error);
  }
}
