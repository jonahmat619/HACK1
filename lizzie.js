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
    const taskNameInput = document.querySelector("#task-title");
    const taskAssigneeSelect = document.querySelector("#task-assignee");
    const roommateNameInput = document.querySelector("#roommate-name");
    const roommatePhoneInput = document.querySelector("#roommate-phone");
    const tradeTaskSelect = document.querySelector("#trade-chore");
    const tradeRoommateSelect = document.querySelector("#trade-roommate");
    const tradePartnerTaskSelect = document.querySelector("#trade-partner-chore");
    const cancelTradeButton = document.querySelector("#cancel-trade");

    const requiredElements = [
      taskForm,
      taskList,
      taskTemplate,
      roommateForm,
      roommateList,
      roommateTemplate,
      tradeForm,
      notice,
      taskNameInput,
      taskAssigneeSelect,
      roommateNameInput,
      roommatePhoneInput,
      tradeTaskSelect,
      tradeRoommateSelect,
      tradePartnerTaskSelect,
    ];

    if (requiredElements.some((element) => !element)) {
      console.error(
        "Tracker JavaScript needs the task, roommate, trade, and notice elements described in README.md.",
      );
      return;
    }

    let nextTaskId = 1;
    let nextRoommateId = 1;
    const roommates = new Map();

    const showNotice = (message) => {
      notice.textContent = message;
    };

    const readTemplate = (template) => {
      const item = template.content.cloneNode(true).firstElementChild;
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
      const label = document.createTextNode(` ${name}`);
      if (marker) {
        element.replaceChildren(marker, label);
      } else {
        element.textContent = name;
      }
    };

    const updateTradePartnerChoices = () => {
      const selectedTaskId = tradeTaskSelect.value;
      const selectedRoommateId = tradeRoommateSelect.value;
      const previousPartnerTaskId = tradePartnerTaskSelect.value;
      const selectedTask = taskItems().find(
        (task) => task.dataset.taskId === selectedTaskId,
      );
      const selectedAssigneeId = selectedTask?.dataset.assigneeId || "";
      const placeholder = selectedAssigneeId
        ? "Optional chore to swap"
        : "Choose the current roommate's chore";

      tradePartnerTaskSelect.replaceChildren(new Option(placeholder, ""));

      if (selectedRoommateId) {
        for (const task of taskItems()) {
          if (
            task.dataset.taskId !== selectedTaskId &&
            task.dataset.assigneeId === selectedRoommateId
          ) {
            const title = task.querySelector(".task-title")?.textContent?.trim();
            if (title) {
              tradePartnerTaskSelect.add(
                new Option(title, task.dataset.taskId),
              );
            }
          }
        }
      }

      if (
        Array.from(tradePartnerTaskSelect.options).some(
          (option) => option.value === previousPartnerTaskId,
        )
      ) {
        tradePartnerTaskSelect.value = previousPartnerTaskId;
      }
    };

    const updateTaskChoices = () => {
      const selectedAssigneeId = taskAssigneeSelect.value;
      taskAssigneeSelect.replaceChildren(new Option("Unassigned", ""));
      for (const [id, roommate] of roommates) {
        taskAssigneeSelect.add(new Option(roommate.name, id));
      }
      if (roommates.has(selectedAssigneeId)) {
        taskAssigneeSelect.value = selectedAssigneeId;
      }

      const selectedRoommateId = tradeRoommateSelect.value;
      tradeRoommateSelect.replaceChildren(new Option("Choose a roommate", ""));
      for (const [id, roommate] of roommates) {
        tradeRoommateSelect.add(new Option(roommate.name, id));
      }
      if (roommates.has(selectedRoommateId)) {
        tradeRoommateSelect.value = selectedRoommateId;
      }

      const selectedTaskId = tradeTaskSelect.value;
      tradeTaskSelect.replaceChildren(new Option("Choose a chore", ""));
      for (const task of taskItems()) {
        const title = task.querySelector(".task-title")?.textContent?.trim();
        if (task.dataset.taskId && title) {
          tradeTaskSelect.add(new Option(title, task.dataset.taskId));
        }
      }
      if (
        taskItems().some((task) => task.dataset.taskId === selectedTaskId)
      ) {
        tradeTaskSelect.value = selectedTaskId;
      }

      updateTradePartnerChoices();
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
      const progressDescription = document.querySelector(
        "#progress-description",
      );
      const progressTitle = document.querySelector("#progress-title");
      const taskCount = document.querySelector("#task-count");

      if (progressValue) progressValue.textContent = `${percentage}%`;
      if (progressMeter) {
        progressMeter.max = 100;
        progressMeter.value = percentage;
        progressMeter.textContent = `${percentage}%`;
      }
      if (progressRing) {
        progressRing.setAttribute("role", "progressbar");
        progressRing.setAttribute("aria-valuemin", "0");
        progressRing.setAttribute("aria-valuemax", "100");
        progressRing.setAttribute("aria-valuenow", String(percentage));
        progressRing.setAttribute(
          "aria-label",
          `${percentage}% of chores completed`,
        );
        progressRing.style.setProperty("--progress", `${percentage}%`);
      }
      if (doneCount) doneCount.textContent = String(completed);
      if (remainingCount) remainingCount.textContent = String(remaining);
      if (taskCount) {
        taskCount.textContent = `${tasks.length} ${
          tasks.length === 1 ? "task" : "tasks"
        }`;
      }
      if (progressTitle) {
        progressTitle.textContent =
          tasks.length > 0 && completed === tasks.length
            ? "Everything's done!"
            : completed > 0
              ? "Nice work, keep it up."
              : "A fresh start";
      }
      if (progressDescription) {
        progressDescription.textContent =
          tasks.length === 0
            ? "Add a chore to start tracking today's progress."
            : completed === tasks.length
              ? "Every chore is done. Enjoy your lovely, tidy space."
              : `${completed} of ${tasks.length} chores completed.`;
      }

      for (const task of tasks) {
        const checkbox = task.querySelector(".task-check");
        const title = task.querySelector(".task-title")?.textContent?.trim();
        if (checkbox && title) {
          checkbox.setAttribute(
            "aria-label",
            `Mark ${title} ${checkbox.checked ? "not done" : "done"}`,
          );
        }
        task.classList.toggle("completed", Boolean(checkbox?.checked));
      }
      updateEmptyState(taskList, ".task");
    };

    const updateRoommateCount = () => {
      const count = document.querySelector("#roommate-count");
      if (count) {
        count.textContent = `${roommates.size} ${
          roommates.size === 1 ? "person" : "people"
        }`;
      }

      const avatarStack = document.querySelector("#avatar-stack");
      if (avatarStack) {
        avatarStack.replaceChildren();
        for (const roommate of roommates.values()) {
          const avatar = document.createElement("span");
          avatar.className = "avatar";
          avatar.textContent = roommate.name
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map((part) => part.charAt(0).toUpperCase())
            .join("");
          avatar.setAttribute("aria-label", roommate.name);
          avatarStack.append(avatar);
        }
      }
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
      checkbox.setAttribute("aria-label", `Mark ${title} done`);
      task.querySelector(".reminder")?.setAttribute(
        "aria-label",
        `Prepare a text reminder for ${title}`,
      );
      task.querySelector(".trade")?.setAttribute(
        "aria-label",
        `Trade or reassign ${title}`,
      );
      task.querySelector(".delete")?.setAttribute(
        "aria-label",
        `Remove ${title}`,
      );
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
      roommate
        .querySelector(".roommate-remove")
        ?.setAttribute("aria-label", `Remove ${name}`);
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

    taskAssigneeSelect.addEventListener("change", updateTaskChoices);

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
        const title = task.querySelector(".task-title")?.textContent?.trim();
        const digits = roommate?.phone.replace(/\D/g, "") || "";

        if (!roommate) {
          showNotice(
            "Assign this chore to a roommate before preparing a reminder.",
          );
        } else if (digits.length < 7 || digits.length > 15) {
          showNotice(
            "That phone number doesn't look valid. Update it before sending a reminder.",
          );
        } else {
          const phone = roommate.phone.replace(/[^\d+]/g, "");
          const message = `Hi ${roommate.name}! Friendly reminder: ${
            title || "your chore"
          } is on your chore list for today.`;
          const link = document.createElement("a");
          link.href = `sms:${phone}?body=${encodeURIComponent(message)}`;
          link.hidden = true;
          document.body.append(link);
          link.click();
          link.remove();
          showNotice(
            `Your messaging app should open with a reminder for ${roommate.name}. Review and send it there.`,
          );
        }
      } else if (button.classList.contains("trade")) {
        tradeTaskSelect.value = task.dataset.taskId;
        tradeRoommateSelect.value = "";
        updateTradePartnerChoices();
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
      const digitCount = phone.replace(/\D/g, "").length;

      if (!name) {
        roommateNameInput.focus();
        return;
      }
      if (digitCount < 7 || digitCount > 15) {
        roommatePhoneInput.setCustomValidity(
          "Enter a phone number containing 7 to 15 digits.",
        );
        roommatePhoneInput.reportValidity();
        roommatePhoneInput.setCustomValidity("");
        roommatePhoneInput.focus();
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

    tradeTaskSelect.addEventListener("change", updateTradePartnerChoices);
    tradeRoommateSelect.addEventListener("change", updateTradePartnerChoices);

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
      if (task.dataset.assigneeId === roommateId) {
        showNotice("Choose a different roommate for this chore.");
        return;
      }
      if (
        partnerTask &&
        (partnerTask === task || partnerTask.dataset.assigneeId !== roommateId)
      ) {
        showNotice(
          "Choose a different chore assigned to the roommate you selected.",
        );
        return;
      }

      const targetName = roommates.get(roommateId).name;
      const taskTitle = task.querySelector(".task-title")?.textContent?.trim();
      if (partnerTask) {
        const partnerTitle = partnerTask
          .querySelector(".task-title")
          ?.textContent?.trim();
        const originalAssignee = task.dataset.assigneeId || "";
        setTaskAssignee(task, roommateId);
        setTaskAssignee(partnerTask, originalAssignee);
        showNotice(
          `Swapped "${taskTitle}" with "${partnerTitle}".`,
        );
      } else {
        setTaskAssignee(task, roommateId);
        showNotice(`Assigned "${taskTitle}" to ${targetName}.`);
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

