# 📌 Horizon 電商網站（重構專案）

由既有 Vue 2 多頁式電商網站出發，重構為現代化前端架構，導入 Nuxt、型別系統與 API 串接流程，建立具備實務開發流程的電商應用。

---

## 🔗 線上展示

- 🌐 Vercel
  https://horizon-v3.vercel.app/

- 📦 GitHub   
  https://github.com/xcia4899/Horizon-V2

---

## 🧪 測試帳號

- admin  
  帳號：horizon@aaa.com  
  密碼：00000000  

- 或可自行註冊新帳號

---

## 🚀 專案介紹

**Horizon V2 電商網站（重構升級）｜個人專案（開發中）**  
📅 2026/01 ~ 進行中  

此專案從 0 規劃設計，並將既有 Vue 2 架構重構為 Nuxt 3，導入 TypeScript 與 Supabase，建立具備型別安全與可維護性的應用架構。

專案涵蓋完整電商流程，包含商品展示、搜尋篩選、購物車、會員系統與後台 CRUD 管理，並透過 RESTful API 建立前後端資料流。

---

## 🛠 技術架構

- Nuxt 3（Vue 3）
- TypeScript
- Pinia（狀態管理）
- Element Plus（UI 元件）
- Supabase（Auth + Database）
- Vercel（部署）

---

## 核心功能

### 商品系統
- 商品列表展示
- 商品詳細頁（動態路由）
- 商品搜尋與分類篩選

### 購物流程
- 購物車功能（localStorage）
- 商品加入 / 移除 / 數量調整

###  會員系統
- 註冊 / 登入 / 登出
- 會員資料管理
- 登入狀態全站同步

### 權限控管
- 路由中介（middleware）
- 未登入導向登入頁
- 使用者權限驗證

###  後台管理（Admin）
- 商品 CRUD（新增 / 編輯 / 刪除）
- 表單驗證與錯誤處理
- API 串接資料操作

---

##  架構設計重點

- 採用 RESTful API 設計（/api/*）
- 前後端資料分離（Nuxt Server Routes）
- composables 封裝 API 邏輯（useApi / useProductsApi）
- Pinia 統一管理資料狀態
- 型別定義（TypeScript + Supabase types）

---

## 重構重點

- 將 Vue 2 重構為 Nuxt 3 架構
- 導入 TypeScript 提升型別安全
- 建立完整 API 資料流
- 使用 Pinia 統一狀態管理
- 整合 Supabase（Auth + DB）
- 優化專案結構與可維護性

---

##  UI / UX 優化

- 使用 Element Plus 建立一致 UI 系統
- 表單驗證與錯誤提示機制
- 提升操作流暢度與使用體驗

---

##  專案啟動

### 安裝套件
```bash
npm install
```

### 開發模式
```bash
npm run dev
```

### 建置
```bash
npm run build
```

### 預覽
```bash
npm run preview
```

---

##  部署

本專案部署於 Vercel：

- 自動連動 GitHub
- 支援 CI/CD 自動部署
- 環境變數管理（Supabase）

---

##  舊版專案

### Horizon（Vue 2）
技術：
- Vue 2（CDN）
- HTML / CSS / JavaScript  

內容：
- 商品展示
- 購物流程
- 購物車（localStorage）
- RWD 響應式設計

---

##  專案特色總結

- 從 0 規劃完整電商架構
- 實作前後端資料流（API + DB）
- 導入現代前端技術（Nuxt + TS）
- 具備實務開發流程（Auth / CRUD / Middleware）
- 強調可維護性與擴展性
