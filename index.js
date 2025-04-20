import { v4 as uuidv4 } from "https://jspm.dev/uuid";

const today = new Date().toLocaleDateString("en-CA");
document.getElementById("date").value = today;

const form = document.querySelector("form");
const categoryFilter = document.getElementById("category-filter");
const periodFilter = document.getElementById("period-filter");

const mainContent = document.querySelector("main");

let expensesArray = [];
let caterFilter = "All categories";
let periodFilterValue = "1925-04-18";

const stored = localStorage.getItem("expenses");

if (stored) {
  try {
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed)) {
      expensesArray = parsed;
    } else {
      console.warn("Invalid expenses data. Resetting.");
      localStorage.removeItem("expenses");
    }
  } catch (e) {
    console.error("Failed to parse expenses:", e);
    localStorage.removeItem("expenses");
  }
}

const amountInput = document.getElementById("amount");

const darkModeBtn = document.getElementById("dark-mode-btn");

const settingsBtn = document.getElementById("settings");

const capAmount = document.getElementById("cap");

const currentCap = document.getElementById("current-cap-display");

let chartInstance = null;

let monthlyCap = null;

const storedCap = localStorage.getItem("cap");

if (storedCap) {
  try {
    const parsedCap = JSON.parse(storedCap);
    if (typeof parsedCap === "number" && parsedCap >= 0) {
      monthlyCap = parsedCap;
    } else {
      console.warn("Invalid cap value. Removing.");
      localStorage.removeItem("monthlyCap");
    }
  } catch (e) {
    console.error("Cap parse failed:", e);
    localStorage.removeItem("monthlyCap");
  }
}

if (monthlyCap) {
  currentCap.style.display = "block"
  currentCap.textContent = `Current cap: ${monthlyCap}`
} else {
  currentCap.textContent = ""
  currentCap.style.display = "none"
}

settingsBtn.setAttribute("aria-label", `Click to set monthly cap. Current monthly cap is ${monthlyCap}`)

let darkMode = false;

const storedTheme = localStorage.getItem("theme");

if (storedTheme) {
  try {
    const parsed = JSON.parse(storedTheme);
    if (typeof parsed === "boolean") {
      darkMode = parsed;
    } else {
      console.warn("Invalid theme value");
      localStorage.removeItem("theme");
    }
  } catch (e) {
    console.error("Theme parse error:", e);
    localStorage.removeItem("theme");
  }
}


// Functions

function setupExpensesContainer(itemsArr, categoryText = "All categories") {
  const container = document.getElementById("all-expenses")
  container.innerHTML = ""
  const noDataMessage = itemsArr.length ? "" : "<p>No items found</p>"
  
  document.getElementById("data-placeholder").style.display =
    itemsArr.length === 0 ? "flex" : "none"
  container.insertAdjacentHTML(
    "beforeend",
    `<h2 id="category-heading">${categoryText}</h2>
    ${noDataMessage}
     <ul id="expense-list" aria-labelledby="category-heading"" class="expense-list"></ul>`
  )

  if (!itemsArr.length) {
    container.style.height = "135px"
  } else if (itemsArr.length === 1) {
    container.style.height = "200px"
  } else if (itemsArr.length === 2) {
    container.style.height = "300px"
  } else if (itemsArr.length > 2) {
    container.style.height = "410px"
  }
}

function renderVirtualList(data) {
  const rowHeight = 130;
  const buffer = 5;
  const container = document.getElementById("all-expenses");
  const expenseList = document.getElementById("expense-list");

  expenseList.style.height = data.length * rowHeight + "px";

  function updateVisibleItems() {
    const scrollTop = container.scrollTop;
    const start = Math.max(0, Math.floor(scrollTop / rowHeight) - buffer);
    const end = Math.min(
      data.length,
      Math.ceil((scrollTop + container.clientHeight) / rowHeight) + buffer
    );

    expenseList.innerHTML = "";

    for (let i = start; i < end; i++) {
      const expense = data[i];

      const expenseDiv = document.createElement("li");
      expenseDiv.classList.add("expense");
      expenseDiv.style.position = "absolute";
      expenseDiv.style.top = `${i * rowHeight}px`;
      expenseDiv.style.left = "0";
      expenseDiv.style.right = "0";
      expenseDiv.style.height = `${rowHeight}px`;

      const dateP = document.createElement("p");
      dateP.textContent = expense.date;

      const detailsDiv = document.createElement("div");
      detailsDiv.classList.add("expense-details");
      if (darkMode) detailsDiv.classList.add("dark-theme-chart");

      const lineOneDiv = document.createElement("div");
      lineOneDiv.classList.add("details-line-one");

      const itemSpan = document.createElement("span");
      itemSpan.className = "item-name-line";
      itemSpan.textContent = expense.item;

      const amountSpan = document.createElement("span");
      amountSpan.classList.add("item-amount");
      amountSpan.textContent = `$${expense.amount}`;

      const deleteBtn = document.createElement("button");
      deleteBtn.classList.add("delete-expense-btn");
      deleteBtn.textContent = "Delete";
      deleteBtn.dataset.id = expense.id;
      deleteBtn.ariaLabel = `Delete expense on ${expense.date} for ${expense.amount}`;

      lineOneDiv.append(itemSpan, amountSpan);
      detailsDiv.append(lineOneDiv, deleteBtn);
      expenseDiv.append(dateP, detailsDiv);
      expenseList.appendChild(expenseDiv);
    }
  }

  container.addEventListener("scroll", updateVisibleItems);
  updateVisibleItems();
}

const saveCap = () => {
  localStorage.setItem("cap", JSON.stringify(monthlyCap));
};

const saveExpenses = () => {
  localStorage.setItem("expenses", JSON.stringify(expensesArray));
};

const saveTheme = () => {
  localStorage.setItem("theme", JSON.stringify(darkMode));
};

const setMonthlyCap = () => {
  monthlyCap = Number(capAmount.value);
  if (monthlyCap < 0) {
    monthlyCap = 0
  }
  currentCap.style.display = "block"
  currentCap.textContent = `Current cap: ${monthlyCap}`
  saveCap();
  capAmount.value = "";
  handleModuleDisplay();
};

const handleModuleDisplay = () => {
  const capDialog = document.getElementById("cap-setter")
  capDialog.classList.toggle("hidden");
  document.getElementById("success-module").classList.toggle("hidden");

  setTimeout(() => {
    document.getElementById("success-module").classList.toggle("hidden");
    document.getElementById("shade").classList.toggle("hidden");
  }, 1000);
};


const removeCap = () => {
  monthlyCap = null;
  currentCap.textContent = ""
  currentCap.style.display = "none"
  saveCap();
  handleModuleDisplay();
};

function trapFocus(dialog) {
  const focusableSelectors = `
    a[href], area[href], input:not([disabled]), select:not([disabled]), 
    textarea:not([disabled]), button:not([disabled]), 
    iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable]
  `;
  const focusableElements = dialog.querySelectorAll(focusableSelectors);
  const firstEl = focusableElements[0];
  const lastEl = focusableElements[focusableElements.length - 1];

  function handleTab(e) {
    if (e.key === "Tab") {
      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    } else if (e.key === "Escape") {
      // Optional: Close the dialog with Esc
      closeDialog();
    }
  }

  dialog.addEventListener("keydown", handleTab);

  // Return a cleanup function for later use
  return () => {
    dialog.removeEventListener("keydown", handleTab);
  };
}

let cleanupFocusTrap;

const openSettingsModal = () => {
  const capDialog = document.getElementById("cap-setter");
  capDialog.classList.remove("hidden");
  capDialog.setAttribute("aria-hidden", "false");

  mainContent.setAttribute("aria-hidden", "true");

  capDialog.querySelector("input").focus();

  document.getElementById("shade").classList.remove("hidden");

  cleanupFocusTrap = trapFocus(capDialog);
}

const closeSettingsModal = () => {
  const capDialog = document.getElementById("cap-setter");
  capDialog.classList.add("hidden");
  capDialog.setAttribute("aria-hidden", "true");
  mainContent.setAttribute("aria-hidden", "false");
  capDialog.querySelector("input").blur();

  document.getElementById("shade").classList.add("hidden");

  if (cleanupFocusTrap) cleanupFocusTrap();
}

const checkAmount = (item, amount, category, date) => {
  if (amount >= 1000000000) {
    document.getElementById("over-billion-module").classList.toggle("hidden");
    document.getElementById("shade").classList.toggle("hidden");

    setTimeout(() => {
      document.getElementById("over-billion-module").classList.toggle("hidden");
      document.getElementById("shade").classList.toggle("hidden");
    }, 2000);

    return;
  }

  if (monthlyCap) {
    checkCap(item, amount, category, date);
  } else {
    addNewExpense(item, amount, category, date);
  }
};

const checkCap = (item, amount, category, date) => {

  const startOfMonth = new Date(today);
  startOfMonth.setDate(1);

  console.log(startOfMonth.setDate(1))

  const periodFilterValue = startOfMonth.toISOString().split("T")[0];

  const filteredByDate = expensesArray.filter((expense) => {
    return expense.date >= periodFilterValue;
  });

  const total = getTotalSpent(filteredByDate);
  const capModal = document.getElementById("cap-warning");
  const yesBtn = document.getElementById("warning-yes-btn");
  const noBtn = document.getElementById("warning-no-btn");

  const cleanUp = () => {
    capModal.classList.add("hidden");
    capModal.setAttribute("aria-hidden", "true");
    mainContent.setAttribute("aria-hidden", "false");
    document.getElementById("warning-yes-btn").focus();
    if (cleanupFocusTrap) cleanupFocusTrap();

    yesBtn.removeEventListener("click", handleCapYesResponse);
    noBtn.removeEventListener("click", handleCapNoResponse);
  };

  const handleCapYesResponse = () => {
    addNewExpense(item, amount, category, date);
    cleanUp();
  };

  const handleCapNoResponse = () => {
    cleanUp();
  };

  if (total + amount > monthlyCap) {
    capModal.classList.remove("hidden");
    capModal.setAttribute("aria-hidden", "false");
    mainContent.setAttribute("aria-hidden", "true");
    document.getElementById("warning-yes-btn").focus();
    cleanupFocusTrap = trapFocus(capModal);

    yesBtn.addEventListener("click", handleCapYesResponse);
    noBtn.addEventListener("click", handleCapNoResponse);
  } else {
    addNewExpense(item, amount, category, date);
  }
};

function exportToCSV(data) {
  if (!data.length) return;

  const cleanedData = data.map(({ id, ...rest }) => rest);

  const headers = Object.keys(cleanedData[0]).join(",");
  const rows = cleanedData.map((obj) =>
    Object.values(obj)
      .map((val) => `"${val}"`)
      .join(",")
  );
  const csv = [headers, ...rows].join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "expenses.csv";
  a.click();

  URL.revokeObjectURL(url);
}

const toggleDarkMode = () => {
  darkMode = !darkMode;
  saveTheme();
  updateElementsTheme();

  filterItems();
};

const updateElementsTheme = () => {
  const themeName = darkMode ? "Dark" : "Light"
  darkModeBtn.textContent = themeName;
  darkModeBtn.setAttribute("aria-label", `Click to toggle theme. Current theme is ${themeName}.`);

  document.querySelector("body").classList.toggle("dark-theme");
  darkModeBtn.classList.toggle("dark-theme-chart");
  settingsBtn.classList.toggle("dark-theme-chart");
  document.getElementById("download-icon").classList.toggle("dark-icon");
  document.querySelector("main").classList.toggle("dark-theme");
  document
    .getElementById("data-placeholder")
    .classList.toggle("dark-theme-chart");
  document.getElementById("form-btn").classList.toggle("dark-theme-chart");
  document.getElementById("total").classList.toggle("dark-theme-chart");
  document.getElementById("amount").classList.toggle("dark-theme-chart");
  document.getElementById("item").classList.toggle("dark-theme-chart");
  document.getElementById("date").classList.toggle("dark-theme-chart");
  categoryFilter.classList.toggle("dark-theme-chart");
  periodFilter.classList.toggle("dark-theme-chart");
  document.querySelector("select").classList.toggle("dark-theme-chart");
};

const checkDarkMode = () => {
  if (darkMode) {
    updateElementsTheme();
  } else {
    return;
  }
};

const getCategoryBreakdown = (arr) => {
  const totals = {};

  arr.forEach((expense) => {
    if (!totals[expense.category]) {
      totals[expense.category] = 0;
    }
    totals[expense.category] += expense.amount;
  });

  return totals;
};

const renderChart = (arr) => {
  const breakdown = getCategoryBreakdown(arr);

  const ctx = document.getElementById("category-chart").getContext("2d");

  const labels = Object.keys(breakdown);
  const data = Object.values(breakdown);

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(ctx, {
    type: "pie",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Expenses by Category",
          data: data,
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
            "#FF9F40",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom", 
          labels: {
            boxWidth: 13,
          },
        },
      },
    },
  });
};

const filterItems = () => {
  const filteredByCategory = expensesArray.filter((expense) => {
    return caterFilter === "All categories" || expense.category === caterFilter;
  });

  const filteredByDate = filteredByCategory.filter((expense) => {
    return expense.date >= periodFilterValue;
  });

  renderApp(filteredByDate, caterFilter);
};

const addNewExpense = (name, amount, category, date) => {
  expensesArray.unshift({
    id: uuidv4(),
    item: name,
    amount: amount,
    category: category,
    date: date,
  });

  saveExpenses();
  filterItems();
};

const deleteExpense = (expenseId) => {
  const updatedArr = expensesArray.filter((expense) => {
    return expense.id !== expenseId;
  });

  expensesArray = updatedArr;
  saveExpenses();
  filterItems();
};

const getTotalSpent = (arr) => {
  const totalInCents = arr.reduce((total, current) => {
    return total + Math.round(current.amount * 100);
  }, 0);

  const total = totalInCents / 100;

  return total;
};

const renderTotalSpent = (arr) => {
  const totalSum = getTotalSpent(arr);
  document.getElementById("total").textContent = `Total Spent: $${totalSum}`;
};

const clearForm = () => {
  document.getElementById("item").value = "";
  document.getElementById("amount").value = "";
  document.getElementById("category").selectedIndex = 0;
  document.getElementById("date").value = today;
};

const renderApp = (arr, categoryText) => {
  setupExpensesContainer(arr, categoryText)
  renderVirtualList(arr)
  renderTotalSpent(arr);
  renderChart(arr);
};

// Event Listeners

amountInput.addEventListener("input", () => {
  let value = amountInput.value;
  value = value.replace(/[^0-9.]/g, "");

  const dotCount = value.split(".").length - 1;
  if (dotCount > 1) {
    value = value.slice(0, value.lastIndexOf("."));
  }

  amountInput.value = value;
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  const item = formData.get("item").trim().replace(/\s+/g, " ");
  const number = formData.get("amount");
  const category = formData.get("category");
  const date = formData.get("date");

  const amount = Number(parseFloat(number).toFixed(2));

  checkAmount(item, amount, category, date);
  clearForm();
});

document.addEventListener("click", (e) => {
  if (e.target.id === "shade") {
    return;
  } else if (e.target.dataset.id) {
    deleteExpense(e.target.dataset.id);
  }
});

categoryFilter.addEventListener("change", (e) => {
  caterFilter = e.target.value;
  filterItems();
});

periodFilter.addEventListener("change", (e) => {
  const selectedValue = e.target.value;
  const date = new Date(today);
  date.setDate(date.getDate() - Number(selectedValue));
  periodFilterValue = date.toISOString().split("T")[0];
  filterItems();
});

darkModeBtn.addEventListener("click", toggleDarkMode);
document.getElementById("export-btn").addEventListener("click", () => {
  exportToCSV(expensesArray);
});

settingsBtn.addEventListener("click", openSettingsModal);

document.getElementById("set-btn").addEventListener("click", setMonthlyCap);

document
  .getElementById("cancel-btn")
  .addEventListener("click", closeSettingsModal);

document.getElementById("remove-cap-btn").addEventListener("click", removeCap);

// Function Calls

renderApp(expensesArray);
checkDarkMode();
