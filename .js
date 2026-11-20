(() => {
  const start = () => {
    const taskForm = document.querySelector("#task-form");
    const taskList = document.querySelector("#task-list");
    const taskTemplate = document.querySelector("#task-template");
    const roommateForm = document.querySelector("#roommate-form");
    const roommateList = document.querySelector("#roommate-list");
    const roommateTemplate = document.querySelector("#roommate-template");
    const tradeForm = document.querySelector("#trade-form");
    const notice = document.querySelector("#notice");

    if (
      !taskForm ||
      !taskList ||
      !taskTemplate ||
      !roommateForm ||
      !roommateList ||
      !roommateTemplate ||
      !tradeForm ||
      !notice
    ) {
      console.error(
        "Tracker JavaScript needs the task, roommate, trade, and notice elements described in README.md.",
      );
      return;
    }

    const taskNameInput = document.querySelector("#task-title");
    const taskAssigneeSelect = document.querySelector("#task-assignee");
    const roommateNameInput = document.querySelector("#roommate-name");
    const roommatePhoneInput = document.querySelector("#roommate-phone");
    const tradeTaskSelect = document.querySelector("#trade-chore");
    const tradeRoommateSelect = document.querySelector("#trade-roommate");
    const tradePartnerTaskSelect = document.querySelector("#trade-partner-chore");
    const cancelTradeButton = document.querySelector("#cancel-trade");

    if (
      !taskNameInput ||
      !taskAssigneeSelect ||
      !roommateNameInput ||
      !roommatePhoneInput ||
      !tradeTaskSelect ||
      !tradeRoommateSelect ||
      !tradePartnerTaskSelect
    ) {
      console.error("Tracker JavaScript is missing one or more form controls.");
      return;
    }

    let nextTaskId = 1;
    let nextRoommateId = 1;
    const roommates = new Map();

    const showNotice = (message) => {
      notice.textContent = message;
    };

    const readTemplate = (template) => {
      const fragment = template.content.cloneNode(true);
      const item = fragment.firstElementChild;
      if (!item) {
        console.error(`Template #${template.id} needs a root element.`);
        return null;
      }
      return item;
    };

    const taskItems = () => Array.from(taskList.querySelectorAll(".task"));
    const updateEmptyState = (list, itemSelector) => {
      const emptyState = list.querySelector(".empty-state");
      if (emptyState) {
        emptyState.hidden = list.querySelector(itemSelector) !== null;
      }
    };

    const setAssigneeLabel = (element, name) => {
      const marker = element.querySelector(".assignee-dot");
      if (marker) {
        element.replaceChildren(marker, document.createTextNode(` ${name}`));
      } else {
        element.textContent = name;
      }
    };

    const updateTaskChoices = () => {
      const choices = [
        [taskAssigneeSelect, "Choose a roommate"],
        [tradeRoommateSelect, "Choose a roommate"],
      ];

      for (const [select, placeholder] of choices) {
        const selectedValue = select.value;
        select.replaceChildren(new Option(placeholder, ""));
        for (const [id, roommate] of roommates) {
          select.add(new Option(roommate.name, id));
        }
        if (roommates.has(selectedValue)) {
          select.value = selectedValue;
        }
      }

      const selectedTaskId = tradeTaskSelect.value;
      const selectedPartnerId = tradePartnerTaskSelect.value;
      const tasks = taskItems();

      for (const select of [tradeTaskSelect, tradePartnerTaskSelect]) {
        const placeholder =
          select === tradeTaskSelect ? "Choose a chore" : "Optional chore to swap";
        select.replaceChildren(new Option(placeholder, ""));
        for (const task of tasks) {
          const title = task.querySelector(".task-title")?.textContent?.trim();
          if (task.dataset.taskId && title) {
            select.add(new Option(title, task.dataset.taskId));
          }
        }
      }

      tradeTaskSelect.value = selectedTaskId;
      tradePartnerTaskSelect.value = selectedPartnerId;
    };

    const updateProgress = () => {
      const tasks = taskItems();
      const completed = tasks.filter(
        (task) => task.querySelector(".task-check")?.checked,
      ).length;
      const remaining = tasks.length - completed;
      const percentage = tasks.length
        ? Math.round((completed / tasks.length) * 100)
        : 0;

      const progressValue = document.querySelector("#progress-value");
      const progressMeter = document.querySelector("#progress-meter");
      const progressRing = document.querySelector("#progress-ring");
      const doneCount = document.querySelector("#done-count");
      const remainingCount = document.querySelector("#remaining-count");
      const progressDescription = document.querySelector("#progress-description");
      const taskCount = document.querySelector("#task-count");

      if (progressValue) progressValue.textContent = `${percentage}%`;
      if (progressMeter) {
        progressMeter.max = 100;
        progressMeter.value = percentage;
      }
      if (progressRing) {
        progressRing.style.setProperty("--progress", `${percentage}%`);
        progressRing.setAttribute("aria-valuenow", String(percentage));
      }
      if (doneCount) doneCount.textContent = String(completed);
      if (remainingCount) remainingCount.textContent = String(remaining);
      if (progressDescription) {
        progressDescription.textContent =
          tasks.length === 0
            ? "Add a chore to start tracking today's progress."
            : `${completed} of ${tasks.length} chores completed.`;
      }
      if (taskCount) taskCount.textContent = String(tasks.length);

      for (const task of tasks) {
        task.classList.toggle(
          "completed",
          Boolean(task.querySelector(".task-check")?.checked),
        );
      }

      updateEmptyState(taskList, ".task");
    };

    const updateRoommateCount = () => {
      const count = document.querySelector("#roommate-count");
      if (count) count.textContent = String(roommates.size);
      updateEmptyState(roommateList, ".roommate-row");
    };

    const addTask = (title, roommateId = "") => {
      const task = readTemplate(taskTemplate);
      if (!task) return false;

      const id = `task-${nextTaskId++}`;
      const titleElement = task.querySelector(".task-title");
      const assigneeElement = task.querySelector(".task-assignee");
      const checkbox = task.querySelector(".task-check");

      if (!titleElement || !assigneeElement || !checkbox) {
        console.error(
          "Each task template needs .task-title, .task-assignee, and .task-check.",
        );
        return false;
      }

      task.dataset.taskId = id;
      titleElement.textContent = title;
      checkbox.id = `${id}-check`;
      const checkboxLabel = task.querySelector(`label[for]`);
      if (checkboxLabel) checkboxLabel.htmlFor = checkbox.id;
      task.querySelectorAll("button").forEach((button) => {
        button.type = "button";
      });

      if (roommates.has(roommateId)) {
        task.dataset.assigneeId = roommateId;
        setAssigneeLabel(assigneeElement, roommates.get(roommateId).name);
      } else {
        task.dataset.assigneeId = "";
        setAssigneeLabel(assigneeElement, "Unassigned");
      }

      taskList.append(task);
      updateProgress();
      updateTaskChoices();
      return true;
    };

    const addRoommate = (name, phone) => {
      const roommate = readTemplate(roommateTemplate);
      if (!roommate) return false;

      const nameElement = roommate.querySelector(".roommate-name");
      const phoneElement = roommate.querySelector(".roommate-phone");
      const initialElement = roommate.querySelector(".roommate-initial");
      if (!nameElement || !phoneElement || !initialElement) {
        console.error(
          "Each roommate template needs .roommate-name, .roommate-phone, and .roommate-initial.",
        );
        return false;
      }

      const id = `roommate-${nextRoommateId++}`;
      roommates.set(id, { name, phone });
      roommate.dataset.roommateId = id;
      nameElement.textContent = name;
      phoneElement.textContent = phone;
      initialElement.textContent = name.trim().charAt(0).toUpperCase();
      roommate.querySelectorAll("button").forEach((button) => {
        button.type = "button";
      });

      roommateList.append(roommate);
      updateRoommateCount();
      updateTaskChoices();
      return true;
    };

    const setTaskAssignee = (task, roommateId) => {
      const assigneeElement = task.querySelector(".task-assignee");
      if (!assigneeElement) return;

      if (roommates.has(roommateId)) {
        task.dataset.assigneeId = roommateId;
        setAssigneeLabel(assigneeElement, roommates.get(roommateId).name);
      } else {
        task.dataset.assigneeId = "";
        setAssigneeLabel(assigneeElement, "Unassigned");
      }
    };

    const today = new Date();
    const dateText = today.toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
    document.querySelectorAll(".date-label, .today-pill").forEach((element) => {
      element.textContent = dateText;
    });

    taskForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const title = taskNameInput.value.trim();
      if (!title) {
        taskNameInput.focus();
        return;
      }

      if (addTask(title, taskAssigneeSelect.value)) {
        taskForm.reset();
        showNotice(`Added chore: ${title}.`);
        taskNameInput.focus();
      }
    });

    taskList.addEventListener("change", (event) => {
      if (event.target.matches(".task-check")) updateProgress();
    });

    taskList.addEventListener("click", (event) => {
      const button = event.target.closest("button");
      const task = button?.closest(".task");
      if (!button || !task) return;

      if (button.classList.contains("delete")) {
        const title = task.querySelector(".task-title")?.textContent?.trim();
        task.remove();
        updateProgress();
        updateTaskChoices();
        showNotice(title ? `Removed chore: ${title}.` : "Chore removed.");
      } else if (button.classList.contains("reminder")) {
        const roommate = roommates.get(task.dataset.assigneeId);
        showNotice(
          roommate
            ? `Reminder ready for ${roommate.name}${roommate.phone ? ` at ${roommate.phone}` : ""}.`
            : "Assign this chore to a roommate before preparing a reminder.",
        );
      } else if (button.classList.contains("trade")) {
        tradeTaskSelect.value = task.dataset.taskId;
        tradeRoommateSelect.value = "";
        tradePartnerTaskSelect.value = "";
        document.querySelector("#trade-title")?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        showNotice("Choose a roommate to reassign or trade this chore.");
      }
    });

    roommateForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const name = roommateNameInput.value.trim();
      const phone = roommatePhoneInput.value.trim();
      if (!name) {
        roommateNameInput.focus();
        return;
      }

      if (addRoommate(name, phone)) {
        roommateForm.reset();
        showNotice(`Added roommate: ${name}.`);
        roommateNameInput.focus();
      }
    });

    roommateList.addEventListener("click", (event) => {
      const button = event.target.closest(".roommate-remove");
      const roommateRow = button?.closest(".roommate-row");
      if (!button || !roommateRow) return;

      const id = roommateRow.dataset.roommateId;
      const roommate = roommates.get(id);
      roommates.delete(id);
      roommateRow.remove();

      for (const task of taskItems()) {
        if (task.dataset.assigneeId === id) setTaskAssignee(task, "");
      }

      updateRoommateCount();
      updateTaskChoices();
      updateProgress();
      showNotice(
        roommate ? `Removed roommate: ${roommate.name}.` : "Roommate removed.",
      );
    });

    tradeForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const task = taskItems().find(
        (item) => item.dataset.taskId === tradeTaskSelect.value,
      );
      const roommateId = tradeRoommateSelect.value;
      const partnerTask = taskItems().find(
        (item) => item.dataset.taskId === tradePartnerTaskSelect.value,
      );

      if (!task || !roommates.has(roommateId)) {
        showNotice("Choose a chore and a roommate before submitting the trade.");
        return;
      }
      if (partnerTask === task) {
        showNotice("Choose a different second chore to swap.");
        return;
      }
      if (partnerTask && partnerTask.dataset.assigneeId !== roommateId) {
        showNotice("The second chore must be assigned to the roommate you selected.");
        return;
      }

      const targetName = roommates.get(roommateId).name;
      if (partnerTask) {
        const originalAssignee = task.dataset.assigneeId || "";
        setTaskAssignee(task, roommateId);
        setTaskAssignee(partnerTask, originalAssignee);
        showNotice(
          `Swapped "${task.querySelector(".task-title")?.textContent}" with "${partnerTask.querySelector(".task-title")?.textContent}".`,
        );
      } else {
        setTaskAssignee(task, roommateId);
        showNotice(
          `Assigned "${task.querySelector(".task-title")?.textContent}" to ${targetName}.`,
        );
      }

      tradeForm.reset();
      updateTaskChoices();
    });

    cancelTradeButton?.addEventListener("click", () => {
      tradeForm.reset();
      updateTaskChoices();
      showNotice("Trade selection cleared.");
    });

    updateProgress();
    updateRoommateCount();
    updateTaskChoices();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();