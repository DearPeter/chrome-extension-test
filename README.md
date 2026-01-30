# Chrome Extension Test

🔮 **Gemini 翻译助手** - 使用 Gemini AI 翻译鼠标悬停处的外语文本

## 功能

- 🖱️ 鼠标悬停自动翻译
- 🤖 使用 Gemini AI 进行翻译
- 🌐 支持所有非中文网页
- ⚙️ 可在扩展图标处配置 API Key

## 安装方法

1. 打开 Chrome，访问 `chrome://extensions/`
2. 开启右上角的「开发者模式」
3. 点击「加载已解压的扩展程序」
4. 选择本文件夹 `chrome-extension-test`

## 配置

1. 点击扩展图标
2. 输入你的 [Gemini API Key](https://aistudio.google.com/app/apikey)
3. 开启翻译功能
4. 保存设置

## 使用

在非中文网页上，将鼠标悬停在任意文本上，即可看到中文翻译。

## 项目结构

```
chrome-extension-test/
├── manifest.json      # 扩展配置
├── background.js      # 后台脚本（处理 API）
├── content.js         # 内容脚本（监听鼠标）
├── popup.html/js      # 弹窗设置界面
├── styles.css         # 样式文件
├── icons/             # 图标
└── README.md          # 说明文档
```

## 技术栈

- Chrome Extension Manifest V3
- Google Gemini API
- 原生 JavaScript

## License

MIT
