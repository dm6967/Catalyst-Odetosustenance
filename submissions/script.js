let students = [];
let recipes = [];
let selectedRecipes = [];

let attendanceMode = "mark"; 
let menuMode = "choose";     

function showMessage(sectionId, text, type = "danger") {
  const box = document.querySelector(`#${sectionId} .message-area`);
  box.innerHTML = `<div class="alert alert-${type}">${text}</div>`;
}


document.querySelectorAll(".sidebar-link").forEach(link => {
  link.onclick = e => {
    e.preventDefault();
    document.querySelectorAll(".sidebar-link").forEach(l => l.classList.remove("active"));
    link.classList.add("active");

    document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
    document.getElementById(link.dataset.target).classList.add("active");
  };
});

document.querySelector(".mark-btn").onclick = () => {
  attendanceMode = "mark";
  renderStudents();
};

document.querySelector(".edit-btn").onclick = () => {
  attendanceMode = "edit";
  renderStudents();
};

addStudentBtn.onclick = () => {
  const name = studentName.value.trim();
  const prefs = [];
  if (prefBreak.checked) prefs.push("Break");
  if (prefLunch.checked) prefs.push("Lunch");
  if (prefDinner.checked) prefs.push("Dinner");

  if (!name || prefs.length === 0) {
    showMessage("attendance", "Name and meal preference are compulsory.");
    return;
  }

  students.push({ name, preferences: prefs, present: false });

  studentName.value = "";
  prefBreak.checked = prefLunch.checked = prefDinner.checked = false;

  showMessage("attendance", "Student added!", "success");
  renderStudents();
};

function renderStudents() {
  studentList.innerHTML = "";

  students.forEach((s, i) => {
    const li = document.createElement("li");
    li.className = "list-group-item";

    if (attendanceMode === "mark") {
      li.innerHTML = `
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <strong>${s.name}</strong><br>
            <small>${s.preferences.join(", ")}</small>
          </div>
          <button class="btn btn-sm ${s.present ? "present-btn" : "absent-btn"}">
            ${s.present ? "Present" : "Absent"}
          </button>
        </div>
      `;
      li.querySelector("button").onclick = () => {
        s.present = !s.present;
        renderStudents();
      };

    } else {
      li.innerHTML = `
        <input class="form-control mb-1" value="${s.name}" id="sname-${i}">
        <label><input type="checkbox" id="sb-${i}" ${s.preferences.includes("Break")?"checked":""}> Breakfast</label>
        <label class="ms-2"><input type="checkbox" id="sl-${i}" ${s.preferences.includes("Lunch")?"checked":""}> Lunch</label>
        <label class="ms-2"><input type="checkbox" id="sd-${i}" ${s.preferences.includes("Dinner")?"checked":""}> Dinner</label>
        <div class="mt-2">
          <button class="btn btn-success btn-sm save">Save</button>
          <button class="btn btn-danger btn-sm delete">Delete</button>
        </div>
      `;

      li.querySelector(".save").onclick = () => {
        const newName = document.getElementById(`sname-${i}`).value.trim();
        const newPrefs = [];
        if (document.getElementById(`sb-${i}`).checked) newPrefs.push("Break");
        if (document.getElementById(`sl-${i}`).checked) newPrefs.push("Lunch");
        if (document.getElementById(`sd-${i}`).checked) newPrefs.push("Dinner");

        if (!newName || newPrefs.length === 0) {
          showMessage("attendance", "Edit requires name and preference.");
          return;
        }

        students[i].name = newName;
        students[i].preferences = newPrefs;
        showMessage("attendance", "Student updated!", "success");
        renderStudents();
      };

      li.querySelector(".delete").onclick = () => {
        students.splice(i, 1);
        renderStudents();
      };
    }

    studentList.appendChild(li);
  });
}

document.querySelector(".choose-btn").onclick = () => {
  menuMode = "choose";
  renderRecipes();
};

document.querySelector(".edit-recipe-btn").onclick = () => {
  menuMode = "edit";
  renderRecipes();
};

addIngredientBtn.onclick = () => {
  const name = ingredientName.value.trim();
  const qty = ingredientQty.value.trim();

  if (!name || !qty) {
    showMessage("menu", "Ingredient name and quantity required.");
    return;
  }

  const li = document.createElement("li");
  li.className = "list-group-item";
  li.textContent = `${name} - ${qty}`;
  ingredientPreview.appendChild(li);

  ingredientName.value = "";
  ingredientQty.value = "";
};

addRecipeBtn.onclick = () => {
  const name = recipeName.value.trim();
  const meals = [];
  if (mealBreak.checked) meals.push("Break");
  if (mealLunch.checked) meals.push("Lunch");
  if (mealDinner.checked) meals.push("Dinner");

  if (!name || ingredientPreview.children.length === 0 || meals.length === 0) {
    showMessage("menu", "All recipe fields are compulsory.");
    return;
  }

  const ingredients = [];
  [...ingredientPreview.children].forEach(li => ingredients.push(li.textContent));

  recipes.push({ name, ingredients, meals });

  recipeName.value = "";
  ingredientPreview.innerHTML = "";
  mealBreak.checked = mealLunch.checked = mealDinner.checked = false;

  showMessage("menu", "Recipe added!", "success");
  renderRecipes();
};

function renderRecipes() {
  menuList.innerHTML = "";

  recipes.forEach((r, i) => {
    const li = document.createElement("li");
    li.className = "list-group-item";

    if (menuMode === "choose") {
      li.innerHTML = `
        <strong>${r.name}</strong><br>
        <small>${r.meals.join(", ")}</small>
        <input type="checkbox">
      `;
      li.querySelector("input").onchange = e => {
        if (e.target.checked) selectedRecipes.push(i);
        else selectedRecipes = selectedRecipes.filter(x => x !== i);
      };

    } else {
      li.innerHTML = `
        <input class="form-control mb-1" value="${r.name}" id="rname-${i}">
        <textarea class="form-control mb-1" id="ring-${i}">${r.ingredients.join("\n")}</textarea>
        <label><input type="checkbox" id="rb-${i}" ${r.meals.includes("Break")?"checked":""}> Breakfast</label>
        <label class="ms-2"><input type="checkbox" id="rl-${i}" ${r.meals.includes("Lunch")?"checked":""}> Lunch</label>
        <label class="ms-2"><input type="checkbox" id="rd-${i}" ${r.meals.includes("Dinner")?"checked":""}> Dinner</label>
        <div class="mt-2">
          <button class="btn btn-success btn-sm save">Save</button>
          <button class="btn btn-danger btn-sm delete">Delete</button>
        </div>
      `;

      li.querySelector(".save").onclick = () => {
        const newName = document.getElementById(`rname-${i}`).value.trim();
        const newIngredients = document.getElementById(`ring-${i}`).value.trim().split("\n");
        const newMeals = [];
        if (document.getElementById(`rb-${i}`).checked) newMeals.push("Break");
        if (document.getElementById(`rl-${i}`).checked) newMeals.push("Lunch");
        if (document.getElementById(`rd-${i}`).checked) newMeals.push("Dinner");

        if (!newName || newIngredients.length === 0 || newMeals.length === 0) {
          showMessage("menu", "Edit requires all fields.");
          return;
        }

        recipes[i] = { name: newName, ingredients: newIngredients, meals: newMeals };
        showMessage("menu", "Recipe updated!", "success");
        renderRecipes();
      };

      li.querySelector(".delete").onclick = () => {
        recipes.splice(i, 1);
        renderRecipes();
      };
    }

    menuList.appendChild(li);
  });
}

calculateBtn.onclick = () => {
  calculatorResult.innerHTML = "";

  if (selectedRecipes.length === 0) {
    showMessage("calculator", "Select at least one recipe.");
    return;
  }

  const counts = { Break: 0, Lunch: 0, Dinner: 0 };

  students.forEach(s => {
    if (s.present) s.preferences.forEach(p => counts[p]++);
  });

  selectedRecipes.forEach(i => {
    const r = recipes[i];

    r.meals.forEach(meal => {
      const studentsCount = counts[meal];
      const card = document.createElement("div");
      card.className = "card p-3 mb-3";

      let html = `<h5>${meal} – ${r.name}</h5><ul>`;

      r.ingredients.forEach(ing => {
        const parts = ing.split("-");
        if (parts.length === 2) {
          const value = parseFloat(parts[1]);
          if (!isNaN(value)) {
            html += `<li>${parts[1].trim()} × ${studentsCount} students = ${value * studentsCount}</li>`;
            return;
          }
        }
        html += `<li>${ing}</li>`;
      });

      html += "</ul>"; 
      card.innerHTML = html;
      calculatorResult.appendChild(card);
    });
  });
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




