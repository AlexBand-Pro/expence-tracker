const today = new Date().toISOString().split('T')[0]
document.getElementById('date').value = today;
const form = document.querySelector("form")

const expensesArray = []

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
    id: expensesArray.length,
    item: name,
    amount: amount,
    category: category,
    date: date
  })

  renderApp()
}

const getExpenses = () => {
  return expensesArray.map((expense) => {
    return `<div class="expense">
              <p>${expense.date}</p>
              <div class="expense-details">
                <span>${expense.item}</span>
                <span>$${expense.amount}</span>
                <button class="delete-expense-btn">Delete</button>
              </div>
            </div>`
  }).join("")
}


const getTotalSpent = () => {
  const totalInCents = expensesArray.reduce((total, current) => {
    return total + Math.round(current.amount * 100)
  }, 0)

  return totalInCents / 100
}

const renderExpenses = () => {
  const container = document.getElementById("all-expenses")
  container.innerHTML = "<p>Expenses:</p>"

  expensesArray.forEach((expense) => {
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

    lineOneDiv.append(itemSpan, amountSpan)
    detailsDiv.append(lineOneDiv, deleteBtn)
    expenseDiv.append(dateP, detailsDiv)

    container.appendChild(expenseDiv)
  })
}

const renderTotalSpent = () => {
  const totalSum = getTotalSpent()
  document.getElementById("total").textContent = `Total Spent: $${totalSum}`
}

const clearForm = () => {
  document.getElementById("item").value = ""
  document.getElementById("amount").value = ""
  document.getElementById("category").selectedIndex = 0
  document.getElementById('date').value = today;
}

const renderApp = () => {
  renderExpenses()
  renderTotalSpent()
}
