document.addEventListener("DOMContentLoaded", () => {
 
  const tasks = [
    {
      id: 1,
      title: "Finalizează componenta de autentificare",
      category: "Lucru",
      deadline: "11:30",
      done: false,
    },
    {
      id: 2,
      title: "30 min curs Etică",
      category: "Învățat",
      deadline: "14:00",
      done: false,
    },
    {
      id: 3,
      title: "Plimbare 20 min",
      category: "Sănătate",
      deadline: "18:30",
      done: true,
    },
  ];

  let filter = "all";
  let modalTaskId = null;

 
  const startBtn = document.getElementById("startBtn");
  const startScreen = document.getElementById("startScreen");
  const dashboard = document.getElementById("dashboard");

  if (startBtn) {
    startBtn.addEventListener("click", () => {
      startScreen.classList.add("hidden");
      dashboard.classList.remove("hidden");
    });
  }


  const tasksGrid = document.getElementById("tasksGrid");
  const progressBar = document.getElementById("progressBar");
  const progressPercent = document.getElementById("progressPercent");
  const tasksCountLabel = document.getElementById("tasksCountLabel");

  function renderTasks() {
    tasksGrid.innerHTML = "";

    const filtered = tasks.filter((t) => {
      if (t.done) return false; 
      return filter === "all" ? true : t.category === filter;
    });

    filtered.forEach((task) => {
      const card = document.createElement("article");
      card.className = "task-card";
      card.dataset.id = task.id;
      card.dataset.category = task.category;

      const badgeDotClass =
        task.category === "Lucru"
          ? "badge-work"
          : task.category === "Învățat"
          ? "badge-study"
          : "badge-health";

      card.innerHTML = `
        <div class="task-badge">
          <span class="badge-dot ${badgeDotClass}"></span>
          ${task.category.toUpperCase()}
        </div>
        <h3 class="task-title">${task.title}</h3>
        <div class="task-meta">
          <span class="pill pill-deadline">${task.deadline || "azi"}</span>
          <span class="pill">În lucru</span>
        </div>
        <div class="task-actions">
          <button class="btn-small btn-details">Detalii</button>
          <button class="btn-small btn-done">Marchează done</button>
        </div>
      `;

      tasksGrid.appendChild(card);
    });

    updateProgress();
  }

  function updateProgress() {
    const total = tasks.length;
    const done = tasks.filter((t) => t.done).length;
    const percent = total === 0 ? 0 : Math.round((done / total) * 100);

    progressBar.style.width = percent + "%";
    progressPercent.textContent = percent + "%";
    tasksCountLabel.textContent = `${done} / ${total} done`;
  }

 
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".filter-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      filter = btn.dataset.filter;
      renderTasks();
    });
  });

 
  const modalBackdrop = document.getElementById("modalBackdrop");
  const modalTitle = document.getElementById("modalTitle");
  const modalBody = document.getElementById("modalBody");
  const modalClose = document.getElementById("modalClose");
  const modalCancelBtn = document.getElementById("modalCancelBtn");
  const modalDoneBtn = document.getElementById("modalDoneBtn");

  function openModal(task) {
    modalTaskId = task.id;
    modalTitle.textContent = task.title;
    modalBody.innerHTML = `
      <p><strong>Categorie:</strong> ${task.category}</p>
      <p><strong>Deadline:</strong> ${task.deadline || "azi"}</p>
      <p><strong>Status:</strong> În lucru</p>
      <p>
        Poți extinde acest modal să afișeze descrierea task-ului,
        subtask-uri, checklist, timer de focus, etc.
      </p>
    `;
    modalDoneBtn.textContent = "Marchează drept complet";
    modalBackdrop.classList.add("show");
  }

  function closeModal() {
    modalBackdrop.classList.remove("show");
    modalTaskId = null;
  }

  modalClose.addEventListener("click", closeModal);
  modalCancelBtn.addEventListener("click", closeModal);
  modalBackdrop.addEventListener("click", (e) => {
    if (e.target === modalBackdrop) closeModal();
  });

  modalDoneBtn.addEventListener("click", () => {
    if (modalTaskId == null) return;
    const t = tasks.find((x) => x.id === modalTaskId);
    if (!t) return;
    t.done = true;   
    renderTasks();   
    closeModal();
  });

  
  tasksGrid.addEventListener("click", (e) => {
    const card = e.target.closest(".task-card");
    if (!card) return;
    const id = Number(card.dataset.id);
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    if (e.target.classList.contains("btn-details")) {
      openModal(task);
    } else if (e.target.classList.contains("btn-done")) {
      task.done = true; 
      renderTasks();   
    } else {
      openModal(task);
    }
  });

  
  const addTaskBtn = document.getElementById("addTaskBtn");
  const taskTitleInput = document.getElementById("taskTitleInput");
  const taskCategoryInput = document.getElementById("taskCategoryInput");
  const taskDeadlineInput = document.getElementById("taskDeadlineInput");

  addTaskBtn.addEventListener("click", () => {
    const title = taskTitleInput.value.trim();
    if (!title) {
      alert("Scrie un titlu pentru task ");
      return;
    }
    const category = taskCategoryInput.value;
    const deadline = taskDeadlineInput.value;

    const newTask = {
      id: Date.now(),
      title,
      category,
      deadline,
      done: false,
    };
    tasks.push(newTask);
    taskTitleInput.value = "";
    taskDeadlineInput.value = "";

    renderTasks();
  });

 
  const themeToggle = document.getElementById("themeToggle");
  const THEME_KEY = "dashboard-theme";

  function applyStoredTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "light") {
      document.body.classList.add("light");
    }
  }

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light");
    const isLight = document.body.classList.contains("light");
    localStorage.setItem(THEME_KEY, isLight ? "light" : "dark");
  });

  const focusBtn = document.getElementById("focusBoost");
  focusBtn.addEventListener("click", () => {
    focusBtn.disabled = true;
    const originalText = focusBtn.innerHTML;
    focusBtn.innerHTML = " Ready to focus!";
    document.body.style.transition = "background 0.6s ease-out";
    document.body.style.background =
      "radial-gradient(circle at top, #a3168eff, #170209ff)";

    setTimeout(() => {
      document.body.style.background =
        "radial-gradient(circle at top, #27111bff, #020617)";
      focusBtn.innerHTML = originalText;
      focusBtn.disabled = false;
    }, 1200);
  });

  
  const tabDashboard = document.getElementById("tabDashboard");
  const tabReviews = document.getElementById("tabReviews");
  const dashboardContent = document.getElementById("dashboardContent");
  const reviewsSection = document.getElementById("reviewsSection");

  const reviewNameInput = document.getElementById("reviewNameInput");
  const reviewRatingInput = document.getElementById("reviewRatingInput");
  const reviewTextInput = document.getElementById("reviewTextInput");
  const addReviewBtn = document.getElementById("addReviewBtn");
  const reviewsList = document.getElementById("reviewsList");

 
  let reviews = JSON.parse(localStorage.getItem("reviews") || "[]");

  function saveReviews() {
    localStorage.setItem("reviews", JSON.stringify(reviews));
  }

  function renderReviews() {
    reviewsList.innerHTML = "";
    if (reviews.length === 0) {
      reviewsList.innerHTML = "<p>Încă nu există review-uri. Fii tu primul!</p>";
      return;
    }

    reviews.forEach((rev) => {
      const div = document.createElement("div");
      div.className = "review-card";
      div.innerHTML = `
        <div class="review-header">
          <span class="review-name">${rev.name || "Anonim"}</span>
          <span class="review-rating">${"⭐️".repeat(rev.rating)}</span>
        </div>
        <div class="review-text">
          ${rev.text}
        </div>
      `;
      reviewsList.appendChild(div);
    });
  }

  addReviewBtn.addEventListener("click", () => {
    const name = reviewNameInput.value.trim();
    const rating = parseInt(reviewRatingInput.value, 10);
    const text = reviewTextInput.value.trim();

    if (!text) {
      alert("Scrie ceva în review 😊");
      return;
    }

    reviews.push({ name, rating, text });
    saveReviews();    
    renderReviews();   

    reviewTextInput.value = "";
    reviewNameInput.value = "";
    reviewRatingInput.value = "5";
  });

  
  tabDashboard.addEventListener("click", () => {
    tabDashboard.classList.add("active");
    tabReviews.classList.remove("active");
    dashboardContent.classList.remove("hidden");
    reviewsSection.classList.add("hidden");
  });

  tabReviews.addEventListener("click", () => {
    tabReviews.classList.add("active");
    tabDashboard.classList.remove("active");
    dashboardContent.classList.add("hidden");
    reviewsSection.classList.remove("hidden");
    renderReviews();
  });

  
  applyStoredTheme();
  renderTasks();
  renderReviews(); 
});