# CareLink - 高齡陪伴APP

CareLink 是一個旨在幫助長者與社區互相照顧、分享生活、發起邀約與尋求協助的 PWA (Progressive Web App) 應用。

## 主要功能

- **分享牆**：分享生活點滴與照片。
- **相助**：發布求助需求或幫助鄰里。
- **邀約**：發起公園散步、聚餐等社交活動。
- **長輩圖**：快速生成與分享充滿溫度的問候圖片。
- **離線支持**：支持 PWA，可在離線狀態下查看基本內容。

## 如何在 GitHub 上部署

1. 將所有檔案上傳至您的 GitHub 倉庫。
2. 前往倉庫的 **Settings** > **Pages**。
3. 在 **Build and deployment** 下，選擇 `main` 分支並點擊 **Save**。
4. 幾分鐘後，您的應用將在 `https://<您的用戶名>.github.io/<倉庫名>/` 上線。

## 檔案結構

- `index.html`: 主頁面
- `app.js`: 應用邏輯
- `styles_unified.css`: 樣式表
- `sw.js`: Service Worker (提供離線功能)
- `manifest.json`: PWA 配置文件
- `assets/`: 圖片與圖標資源

---
*專案開發：CareLink Team*
