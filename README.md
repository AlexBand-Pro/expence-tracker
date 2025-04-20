# 💰 Expense Tracker

A browser-based application for tracking and visualizing personal expenses.

This app allows users to add and remove expense entries — each showing item name, amount, category, and date. It calculates total expenses in real-time and automatically updates a visual chart using Chart.js. All data is stored locally using `localStorage`.

Built with vanilla JavaScript, HTML, CSS, and Chart.js, it features a clean, responsive layout, optimized performance, and improved accessibility (a11y). The app also allows users to filter expenses by category and date, set a monthly spending cap, toggle light/dark themes, and export their data as a CSV file.

---

## 🌟 Features

- ✅ Add, view, and delete expenses  
- 🔍 Filter expenses by category and date  
- 📊 Real-time chart updates via Chart.js  
- 💾 Persistent storage using `localStorage`  
- 🚫 Monthly spending cap with warning system  
- 📁 Export data to CSV  
- 🌙 Light & Dark mode toggle  
- ♿️ Improved accessibility (ARIA labels, color contrast, keyboard navigation)  
- ⚡ Optimized performance with virtual scrolling  
- 📱 Fully responsive design

---

## 📷 Demo

> ![expense-tracker-project](https://github.com/user-attachments/assets/b803275d-febb-4c84-afb8-7491112c81e9)

---

## 🛠 Usage

### ➕ Add an Expense

- Fill in **Item**, **Amount**, **Category**, and **Date**
- Click **Add**

### 📋 View & Delete

- Expenses appear in a scrollable table
- Click **Delete** to remove an entry

### 🔎 Filter Expenses

- Use the **Category** and **Date** dropdowns to filter entries
- The list and chart update automatically

### ⚙️ Set Monthly Cap

- Click the **Monthly Cap** button
- Enter your monthly cap and save
- If new expenses exceed the cap for the current month, a warning will be shown

### 🎨 Toggle Theme

- Switch between **Dark / Light** mode

### 📥 Export to CSV

- Click the **Export** button to download your expense list as `expenses.csv`

---

## 💾 Data Storage

All data and preferences are stored locally in the browser:

- `expenses` — array of expense objects  
- `cap` — numeric monthly cap  
- `theme` — current theme preference

---

## 🧰 Built With

- **JavaScript** — core logic  
- **HTML5 & CSS3** — markup and styling  
- **Chart.js** — data visualization  
- **uuid** — unique IDs for each entry
