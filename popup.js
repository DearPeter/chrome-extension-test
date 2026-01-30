// popup.js - 弹窗逻辑

document.addEventListener('DOMContentLoaded', () => {
  const apiKeyInput = document.getElementById('apiKey');
  const isEnabledInput = document.getElementById('isEnabled');
  const saveBtn = document.getElementById('saveBtn');
  const statusDiv = document.getElementById('status');
  
  // 加载保存的设置
  chrome.storage.local.get(['apiKey', 'isEnabled'], (result) => {
    if (result.apiKey) {
      apiKeyInput.value = result.apiKey;
    }
    if (result.isEnabled !== undefined) {
      isEnabledInput.checked = result.isEnabled;
    }
    updateStatus();
  });
  
  function updateStatus() {
    const hasKey = apiKeyInput.value.trim().length > 0;
    const enabled = isEnabledInput.checked;
    
    if (!hasKey) {
      statusDiv.innerHTML = '⚠️ 请设置 API Key';
      statusDiv.className = 'status warning';
    } else if (!enabled) {
      statusDiv.innerHTML = '⏸️ 已禁用';
      statusDiv.className = 'status disabled';
    } else {
      statusDiv.innerHTML = '✅ 已启用';
      statusDiv.className = 'status active';
    }
  }
  
  apiKeyInput.addEventListener('input', updateStatus);
  isEnabledInput.addEventListener('change', updateStatus);
  
  saveBtn.addEventListener('click', () => {
    const apiKey = apiKeyInput.value.trim();
    const isEnabled = isEnabledInput.checked;
    
    chrome.storage.local.set({ apiKey, isEnabled }, () => {
      // 通知 background 更新配置
      chrome.runtime.sendMessage({
        type: 'UPDATE_CONFIG',
        apiKey: apiKey,
        isEnabled: isEnabled
      });
      
      statusDiv.innerHTML = '💾 已保存';
      statusDiv.className = 'status saved';
      
      setTimeout(updateStatus, 1500);
    });
  });
});
