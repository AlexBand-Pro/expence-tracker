# 💰 Expense Tracker

A simple, browser-based expense tracker that helps you log, filter, and visualize your spending. Built with vanilla JavaScript and Chart.js, it stores data locally in the browser — no accounts or servers required.

---

## 🌟 Features

- ✅ Add, view, and delete expenses  
- 📊 Visualize spending by category with a pie chart  
- 🔍 Filter expenses by category and date  
- 💾 Persistent data using `localStorage`  
- 🚫 Monthly spending cap with warning system  
- 🌙 Light & Dark mode toggle  
- 📁 Export data to CSV  
- ♿️ Improved accessibility (ARIA labels, color contrast, keyboard navigation)  

---

## 📷 Demo

> ![expense-tracker-project](https://github.com/user-attachments/assets/b803275d-febb-4c84-afb8-7491112c81e9)


---
## Usage

### Add an Expense
- Fill in **Item**, **Amount**, **Category** and **Date**  
- Click **Add**

### View & Delete
- All entries appear in the list below  
- Click **Delete** on any entry to remove it

### Filter
- Select a **Category** or **Period** from the dropdowns  
- The view and chart will update automatically

### Set Monthly Cap
- Click the ⚙️ **Settings** button  
- Enter a cap amount and save  
- If adding an expense exceeds the cap, you’ll be prompted to confirm

### Toggle Theme
- Click **Dark / Light** button to switch themes

### Export to CSV
- Click the 📥 **Export** button to download `expenses.csv`

## Set Monthly Cap

All data and preferences are stored in browser LocalStorage:

- `expenses` — array of expense objects  
- `cap` — numeric monthly cap  
- `theme` — boolean for dark mode

## Built With

- JavaScript — core logic
- HTML5 & CSS3 — markup and styling
- Chart.js — pie chart visualization  
- uuid — unique IDs for each expense  
