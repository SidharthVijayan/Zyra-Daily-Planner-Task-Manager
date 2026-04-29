{
  "manifest_version": 3,
  "name": "Zyra – Daily Planner & Task Manager",
  "version": "1.0",
  "description": "A smart daily planner with spreadsheet-style tasks, dependencies, reminders, and execution tracking.",
  "permissions": ["storage", "alarms", "notifications"],
  "background": {
    "service_worker": "background.js"
  },
  "action": {
    "default_popup": "popup.html"
  }
}

