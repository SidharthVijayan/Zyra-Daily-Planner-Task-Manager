chrome.alarms.create("taskReminder", { periodInMinutes: 60 });

chrome.alarms.onAlarm.addListener(() => {
  chrome.storage.local.get("tasks", ({ tasks }) => {
    if (!tasks) return;

    const today = new Date().toISOString().split("T")[0];

    tasks.forEach(task => {
      if (task.date === today && task.status !== "Done") {
        chrome.notifications.create({
          type: "basic",
          iconUrl: "icons/icon.png",
          title: "Zyra Reminder",
          message: task.task
        });
      }
    });
  });
});
