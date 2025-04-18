import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

const today = new Date().toISOString().split('T')[0]
document.getElementById('date').value = today;
const form = document.querySelector("form")
const categoryFilter = document.getElementById("category-filter")
const periodFilter = document.getElementById("period-filter")

let expensesArray = []
let caterFilter = "All categories"
let periodFilterValue = "1925-04-18"

const amountInput = document.getElementById("amount");

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

const addNewExpense = (name, amount, category, date) => {
  expensesArray.push({
    id: uuidv4(),
    item: name,
    amount: amount,
    category: category,
    date: date
  })

  const filteredByCategory = expensesArray.filter((expense) => {
    return caterFilter === "All categories" || expense.category === caterFilter
  })

  const filteredByDate = filteredByCategory.filter((expense) => {
    return expense.date >= periodFilterValue
  })

  renderApp(filteredByDate, caterFilter)
}

const deleteExpense = (expenseId) => {
  const updatedArr = expensesArray.filter((expense) => {
    return expense.id !== expenseId
  })

  expensesArray = updatedArr

  const filteredByCategory = expensesArray.filter((expense) => {
    return caterFilter === "All categories" || expense.category === caterFilter
  })

  const filteredByDate = filteredByCategory.filter((expense) => {
    return expense.date >= periodFilterValue
  })

  renderApp(filteredByDate, caterFilter)
}


const getTotalSpent = (arr) => {
  const totalInCents = arr.reduce((total, current) => {
    return total + Math.round(current.amount * 100)
  }, 0)

  return totalInCents / 100
}

const renderExpenses = (itemsArr, filterText="All categories") => {
  const container = document.getElementById("all-expenses")

  if (itemsArr.length === 0) {
    container.innerHTML = ""
  } else {
    container.innerHTML = `<p>${filterText}</p>`
  }

  itemsArr.forEach((expense) => {
    const expenseDiv = document.createElement("div")
    expenseDiv.classList.add("expense")

    const dateP = document.createElement("p")
    dateP.textContent = expense.date

    const detailsDiv = document.createElement("div")
    detailsDiv.classList.add("expense-details")

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

// const filterItems = () => {
//   const filteredByCategory = expensesArray.filter((expense) => {
//     return caterFilter === "All categories" || expense.category === caterFilter
//   })

//   const filteredByDate = filteredByCategory.filter((expense) => {
//     return expense.date >= periodFilterValue
//   })
// }

const renderApp = (arr) => {
  renderExpenses(arr)
  renderTotalSpent(arr)
}

document.addEventListener("click", (e) => {
  if (e.target.dataset.id) {
    deleteExpense(e.target.dataset.id)
  }
})

categoryFilter.addEventListener("change", (e) => {
  caterFilter = e.target.value

  const filteredByCategory = expensesArray.filter((expense) => {
    return caterFilter === "All categories" || expense.category === caterFilter
  })

  const filteredByDate = filteredByCategory.filter((expense) => {
    return expense.date >= periodFilterValue
  })

  renderApp(filteredByDate, caterFilter)
})

periodFilter.addEventListener("change", (e) => {
  const selectedValue = e.target.value
  const date = new Date(today)
  date.setDate(date.getDate() - Number(selectedValue))
  periodFilterValue = date.toISOString().split('T')[0]

  const filteredByCategory = expensesArray.filter((expense) => {
    return caterFilter === "All categories" || expense.category === caterFilter
  })
  
  const filteredByDate = filteredByCategory.filter((expense) => {
    return expense.date >= periodFilterValue
  })

  renderApp(filteredByDate, caterFilter)
})

renderApp(expensesArray)
