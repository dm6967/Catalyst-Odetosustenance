let menu = {};
let orders = [];
let tempIngredients = [];

document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", function () {

    document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
    this.classList.add("active");

    document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));

    let section = this.getAttribute("data-section");
    document.getElementById(section).classList.add("active");
  });
});

addIngredientBtn.onclick = function () {
  let name = ingredientName.value;
  let qty = parseFloat(ingredientQty.value);

  if (!name || !qty) return;

  tempIngredients.push({ name, qty });

  let li = document.createElement("li");
  li.className = "list-group-item";
  li.textContent = name + " - " + qty;
  ingredientPreview.appendChild(li);

  ingredientName.value = "";
  ingredientQty.value = "";
};

saveDishBtn.onclick = function () {
  let dish = dishName.value;
  if (!dish || tempIngredients.length === 0) return;

  menu[dish] = [...tempIngredients];
  tempIngredients = [];
  ingredientPreview.innerHTML = "";

  let li = document.createElement("li");
  li.className = "list-group-item";
  li.textContent = dish;
  menuList.appendChild(li);

  let option = document.createElement("option");
  option.value = dish;
  option.textContent = dish;
  dishSelect.appendChild(option);

  dishName.value = "";
};

addOrderBtn.onclick = function () {
  let dish = dishSelect.value;
  let qty = parseInt(orderQty.value);
  let status = orderStatus.value;
  let date = new Date().toISOString().split("T")[0];

  if (!dish || !qty) return;

  orders.push({ dish, qty, status, date });
  renderOrders(orders);

  orderQty.value = "";
};

function renderOrders(list) {
  orderList.innerHTML = "";

  list.forEach(order => {
    let li = document.createElement("li");
    li.className = "list-group-item";
    li.textContent =
      order.date + " | " +
      order.dish + " x " + order.qty +
      " | " + order.status;

    orderList.appendChild(li);
  });
}

filterBtn.onclick = function () {
  let date = filterDate.value;
  let status = filterStatus.value;

  let filtered = orders.filter(o =>
    (date === "" || o.date === date) &&
    (status === "" || o.status === status)
  );

  renderOrders(filtered);
};

analyzeBtn.onclick = function () {

  let totals = {};

  orders.forEach(order => {

    let recipe = menu[order.dish];
    if (!recipe) return;

    recipe.forEach(item => {
      if (!totals[item.name]) totals[item.name] = 0;
      totals[item.name] += item.qty * order.qty;
    });
  });

  analyticsList.innerHTML = "";

  for (let ingredient in totals) {
    let li = document.createElement("li");
    li.className = "list-group-item";
    li.textContent = ingredient + " : " + totals[ingredient];
    analyticsList.appendChild(li);
  }
};

const sidebarLinks = document.querySelectorAll(".sidebar-link");
const sections = document.querySelectorAll(".section");

sidebarLinks.forEach(link => {
  link.addEventListener("click", function (e) {
    e.preventDefault();

    const target = this.getAttribute("data-target");
    if (!target) return;

    sidebarLinks.forEach(l => l.classList.remove("active"));
    this.classList.add("active");

    sections.forEach(section => section.classList.remove("active"));

    const activeSection = document.getElementById(target);
    if (activeSection) {
      activeSection.classList.add("active");
    }

    if (target === "graphs") {
      renderChart();
    }
  });
});

const wasteInput = document.getElementById("wasteInput");
const saveWasteBtn = document.getElementById("saveWasteBtn");
const ctx = document.getElementById("wasteChart");

let wasteData = JSON.parse(localStorage.getItem("wasteData")) || {};
let chart = null;

function getToday() {
  return new Date().toISOString().split("T")[0];
}

if (saveWasteBtn) {
  saveWasteBtn.addEventListener("click", () => {

    const value = parseFloat(wasteInput.value);

    if (isNaN(value) || value <= -1) {
      alert("Please enter a valid wastage amount");
      return;
    }

    const today = getToday();

   
    wasteData[today] = value;

    localStorage.setItem("wasteData", JSON.stringify(wasteData));

    wasteInput.value = "";

    renderChart();
  });
}

function renderChart() {

  if (!ctx) return;

  const labels = Object.keys(wasteData);
  const values = Object.values(wasteData);

  if (chart) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: "Food Wasted (kg)",
        data: values,
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointHoverRadius: 7,
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Kilograms"
          }
        },
        x: {
          title: {
            display: true,
            text: "Date"
          }
        }
      }
    }
  });
}

renderChart();
