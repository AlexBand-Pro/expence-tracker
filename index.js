import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

const today = new Date().toLocaleDateString('en-CA');
document.getElementById('date').value = today;

const form = document.querySelector("form")
const categoryFilter = document.getElementById("category-filter")
const periodFilter = document.getElementById("period-filter")

let expensesArray = []
let caterFilter = "All categories"
let periodFilterValue = "1925-04-18"

const stored = localStorage.getItem("expenses")

if (stored) {
  expensesArray = JSON.parse(stored)
}

const saveExpenses = () => {
  localStorage.setItem("expenses", JSON.stringify(expensesArray))
}

const amountInput = document.getElementById("amount");

const darkModeBtn = document.getElementById("dark-mode-btn")

let chartInstance = null

// Dark Mode
let darkMode = false

// Add a message to tell the user there's no data, if theer is none.
//add filters to local storage
//make the chart placeholder appear smoother. Don't remove it from the page, make it unvisible with classes and add transition

// Functions


function exportToCSV(data) {
  if (!data.length) return

  // Remove 'id' from each item
  const cleanedData = data.map(({ id, ...rest }) => rest)

  const headers = Object.keys(cleanedData[0]).join(",")
  const rows = cleanedData.map(obj =>
    Object.values(obj).map(val => `"${val}"`).join(",")
  )
  const csv = [headers, ...rows].join("\n")

  const blob = new Blob([csv], { type: "text/csv" })
  const url = URL.createObjectURL(blob)

  const a = document.createElement("a")
  a.href = url
  a.download = "expenses.csv"
  a.click()

  URL.revokeObjectURL(url)
}

const toggleDarkMode = () => {
  darkModeBtn.textContent = darkMode ? "Light" : "Dark"
  darkModeBtn.classList.toggle("dark-theme-chart")
  document.getElementById("settings").classList.toggle("dark-theme-chart")
  document.getElementById("download-icon").classList.toggle("dark-icon")
  document.querySelector("main").classList.toggle("dark-theme")
  document.getElementById("data-placeholder").classList.toggle("dark-theme-chart")
  document.getElementById("form-btn").classList.toggle("dark-theme-chart")
  document.getElementById("total").classList.toggle("dark-theme-chart")
  document.getElementById("amount").classList.toggle("dark-theme-chart")
  document.getElementById("item").classList.toggle("dark-theme-chart")
  document.getElementById("date").classList.toggle("dark-theme-chart")
  categoryFilter.classList.toggle("dark-theme-chart")
  periodFilter.classList.toggle("dark-theme-chart")
  const details = document.getElementById("expense-details")
  document.querySelector("select").classList.toggle("dark-theme-chart")

  if (details) {
    details.style.backgroundColor = darkMode ? "#000872" : "unset"
  }

  filterItems()

  darkMode = !darkMode
}


const getCategoryBreakdown = (arr) => {
  const totals = {}

  arr.forEach(expense => {
    if (!totals[expense.category]) {
      totals[expense.category] = 0
    }
    totals[expense.category] += expense.amount
  })

  return totals
}

const renderChart = (arr) => {
  const breakdown = getCategoryBreakdown(arr)

  const ctx = document.getElementById('category-chart').getContext('2d')

  const labels = Object.keys(breakdown)
  const data = Object.values(breakdown)

  if (chartInstance) {
    chartInstance.destroy()
  }

  chartInstance = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        label: 'Expenses by Category',
        data: data,
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  })
}


const filterItems = () => {
  const filteredByCategory = expensesArray.filter((expense) => {
    return caterFilter === "All categories" || expense.category === caterFilter
  })

  const filteredByDate = filteredByCategory.filter((expense) => {
    return expense.date >= periodFilterValue
  })

  renderApp(filteredByDate, caterFilter)
}

const addNewExpense = (name, amount, category, date) => {
  expensesArray.push({
    id: uuidv4(),
    item: name,
    amount: amount,
    category: category,
    date: date
  })

  saveExpenses()
  filterItems()
}

const deleteExpense = (expenseId) => {
  const updatedArr = expensesArray.filter((expense) => {
    return expense.id !== expenseId
  })

  expensesArray = updatedArr
  saveExpenses()
  filterItems()
}


const getTotalSpent = (arr) => {
  const totalInCents = arr.reduce((total, current) => {
    return total + Math.round(current.amount * 100)
  }, 0)

  const total = totalInCents / 100

  console.log(total)

  return total
}

const renderExpenses = (itemsArr, categoryText="All categories") => {
  const container = document.getElementById("all-expenses")

  if (itemsArr.length === 0) {
    container.innerHTML = ""
    document.getElementById("data-placeholder").style.display = "flex"
  } else {
    container.innerHTML = `<p>${categoryText}</p>`
    document.getElementById("data-placeholder").style.display = "none"
  }

  itemsArr.forEach((expense) => {
    const expenseDiv = document.createElement("div")
    expenseDiv.classList.add("expense")

    const dateP = document.createElement("p")
    dateP.textContent = expense.date

    const detailsDiv = document.createElement("div")
    detailsDiv.classList.add("expense-details")
    detailsDiv.id = "expense-details"

    const lineOneDiv = document.createElement("div")
    lineOneDiv.classList.add("details-line-one")

    const itemSpan = document.createElement("span")
    itemSpan.textContent = expense.item

    const amountSpan = document.createElement("span")
    amountSpan.classList.add("item-amount")
    amountSpan.textContent = `$${expense.amount}`

    const deleteBtn = document.createElement("button")
    deleteBtn.classList.add("delete-expense-btn")
    deleteBtn.textContent = "Delete"
    deleteBtn.dataset.id = expense.id

    lineOneDiv.append(itemSpan, amountSpan)
    detailsDiv.append(lineOneDiv, deleteBtn)
    expenseDiv.append(dateP, detailsDiv)

    container.appendChild(expenseDiv)
  })
}

const renderTotalSpent = (arr) => {
  const totalSum = getTotalSpent(arr)
  document.getElementById("total").textContent = `Total Spent: $${totalSum}`
}

const clearForm = () => {
  document.getElementById("item").value = ""
  document.getElementById("amount").value = ""
  document.getElementById("category").selectedIndex = 0
  document.getElementById('date').value = today;
}

const renderApp = (arr, categoryText) => {
  renderExpenses(arr, categoryText)
  renderTotalSpent(arr)
  renderChart(arr)
}

// Event Listeners

amountInput.addEventListener("input", () => {
  let value = amountInput.value
  value = value.replace(/[^0-9.]/g, '')
  
  const dotCount = value.split('.').length - 1;
  if (dotCount > 1) {
    value = value.slice(0, value.lastIndexOf('.'))
  }

  amountInput.value = value;
});

form.addEventListener("submit", (e) => {
  e.preventDefault()

  const formData = new FormData(form)

  const item = formData.get("item").trim().replace(/\s+/g, " ")
  const number = formData.get("amount")
  const category = formData.get("category")
  const date = formData.get("date")

  const amount = Number(parseFloat(number).toFixed(2))

  addNewExpense(item, amount, category, date)
  clearForm()
})

document.addEventListener("click", (e) => {
  if (e.target.dataset.id) {
    deleteExpense(e.target.dataset.id)
  }
})

categoryFilter.addEventListener("change", (e) => {
  caterFilter = e.target.value
  filterItems()
})

periodFilter.addEventListener("change", (e) => {
  const selectedValue = e.target.value
  const date = new Date(today)
  date.setDate(date.getDate() - Number(selectedValue))
  periodFilterValue = date.toISOString().split('T')[0]
  filterItems()
})

darkModeBtn.addEventListener("click", toggleDarkMode)
document.getElementById("export-btn").addEventListener("click", () => {
  exportToCSV(expensesArray)
})

// Function Calls

renderApp(expensesArray)
