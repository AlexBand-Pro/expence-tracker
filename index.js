const today = new Date().toISOString().split('T')[0]
document.getElementById('date').value = today;

const expensesArray = [
  {
    id: 1,
    item: "snacks",
    amount: 12.5,
    category: "food",
    date: today
  },
  {
    id: 2,
    item: "shirt",
    amount: 5,
    category: "personal & household",
    date: today
  },
]

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

const renderExpenses = () => {
  const container = document.getElementById("all-expenses")
  container.innerHTML = ""

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

renderExpenses()
