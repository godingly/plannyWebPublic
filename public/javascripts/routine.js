import * as time from "./utils/time.js";
import * as audio from "./utils/audio.js";

class Task {
  constructor(name, duration, mongoID, routine, order) {
    this.name = name;
    this.duration = duration;
    this.mongoID = mongoID;
    this.routine = routine;
    this.order = order;
  }
}

function onCompleteClick(event) {
  // alert(`onCompleteClick(), tasks[0]=${tasks[0].name}`)
  resetTimer();
  let taskLI = event.target.parentNode;
  let ULElement = taskLI.parentNode;
  var index = Array.prototype.indexOf.call(ULElement.children, taskLI);
  tasks.splice(index, 1);
  ULElement.removeChild(taskLI);
  // alert(`onCompleteClick() removed, next child tasks[0]=${tasks[0].name}, elem length ${ULElement.children.length}`);
  if (ULElement.children.length) {
    // alert('onCompleteClick() more children');
    // more tasks
    startTimer();
  } else {
    // last item
    alert("Good job!");
  }
}

function getCompleteButton() {
  let completeButton = document.createElement("button");
  completeButton.classList.add("btn", "btn-success", "mr-1");
  completeButton.innerHTML = "Complete";
  completeButton.addEventListener("click", onCompleteClick);
  return completeButton;
}

function onRemoveClick(event) {
  let taskLI = event.target.parentNode;
  let ULElement = taskLI.parentNode;
  const index = Array.prototype.indexOf.call(ULElement.children, taskLI);
  const task_id = tasks[index].mongoID;
  // call db to delete
  $.ajax({
    url: `/routine/task/${task_id}`,
    type: "DELETE",
    success: (data, status) => {
      if (status == "success" && data.isDeleted) {
        for (let i = index + 1; i < tasks.length; i++) {
          tasks[i].order -= 1;
        }
        tasks.splice(index, 1);
        ULElement.removeChild(taskLI);
      } else {
        // alert(`onRemoveClick() DELETE failed, status = ${status}`);
      }
    },
  });
}

function getRemoveButton() {
  let removeButton = document.createElement("button");
  removeButton.classList.add("btn", "btn-danger", "mr-1");
  removeButton.innerHTML = "Remove";
  removeButton.addEventListener("click", onRemoveClick);
  return removeButton;
}

function clearInput() {
  taskNameInput.value = "";
  taskDurationInput.value = "";
}

function onDurationChange(event) {
  const new_duration = Number(event.target.value);
  const taskLI = event.target.parentNode;
  const ULElement = taskLI.parentNode;
  const index = Array.prototype.indexOf.call(ULElement.children, taskLI);
  const task = tasks[index];
  task.duration = new_duration;
  $.ajax({
    url: `/routine/task/${task.mongoID}`,
    type: "PUT",
    contentType: "application/json",
    data: JSON.stringify(task),
    success: (data, status) => {
      if (status == "success" && data.id) {
        tasks[index].duration = new_duration;
      } else {
        // alert(`onDurationChange() PUT failed, status = ${status}`);
      }
    },
  });
}

function getDurationElement(duration) {
  const durationEl = document.createElement("input");
  durationEl.classList.add("mx-1");
  // durationEl.style.width="8%";
  durationEl.type = "number";
  durationEl.min = 1;
  durationEl.value = duration;
  durationEl.addEventListener("change", onDurationChange);
  return durationEl;
}

function getLITask(task_name, task_duration) {
  let taskLI = document.createElement("li");
  taskLI.classList.add("list-group-item", "px-0");
  var textNode = document.createTextNode(task_name)
  let durationEl = getDurationElement(task_duration);
  let completeButton = getCompleteButton();
  let removeButton = getRemoveButton();
  let icon = document.createElement('i'); icon.classList.add('drag-handle', 'fas', 'fa-space-shuttle', 'mr-1');
  taskLI.appendChild(icon);
  taskLI.appendChild(textNode);
  taskLI.appendChild(durationEl);
  taskLI.appendChild(completeButton);
  taskLI.appendChild(removeButton);
  return taskLI;
}

function addTask() {
  let task_name = taskNameInput.value;
  let task_duration = Number(taskDurationInput.value) || 1;

  clearInput();
  taskNameInput.focus();
  var task_id;
  // add to DB
  $.post(
    "/routine/task/add",
    {
      name: task_name,
      duration: task_duration,
      routine: routineName,
      order: tasks.length,
    },
    (data, status) => {
      if (status == "success") {
        task_id = data.id;
        // add to tasks
        tasks.push(
          new Task(task_name, task_duration, task_id, routineName, tasks.length)
        );
        // add to HTML
        let taskLI = getLITask(task_name, task_duration);
        tasksListsUL.appendChild(taskLI);
      } else {
        console.error(`addTask():post error ${status}`);
      }
    }
  );
}

function updateCountdown() {
  let now = time.getTimeNow();
  // dur = time.subtractSeconds(dur);
  let diff_in_sec = (countdown_end - now) / 1000;
  const countdownThres = isDebug? 58: 30;
  countdownLabel.innerHTML = time.getCountdownString(countdown_end, now);
  if (diff_in_sec < countdownThres && (!flash)) {
    flash = true;
    audio.play();
  }
  if (diff_in_sec < 1)  {
    const message = `timeout morning routine, task=${tasks[0].name}`
    resetTimer();
    $.post(
      '/bee/charge',
      {amount:5, comment:`morning routine, task=${tasks[0].name}`},
      (data, status) => {
        if (status != 'success') {
          console.error(`bee post error, status=${status}`);
        }
      });
    alert(`timeout!!!`);
  }
}

function onKeyup(e) {
  if (e.key === "Enter") {
    addTask();
  }
}

function startTimer() {
  // if (isLocked){
    audio.unlock();
    // isLocked = true;
  // }
  // alert(`startTimer() for ${tasks[0].name}`);
  if (isTimerRunning)
    resetTimer();
  let now = time.getTimeNow();
  countdown_end = time.addMinutes(now, tasks[0].duration, isDebug);
  const countdownString = time.getCountdownString(countdown_end, now);
  tasksListsUL.firstChild.classList.add('active');
  countdownLabel.innerHTML = countdownString;
  // alert(`startTimer() with task ${tasks[0].name} countdown string=${countdownLabel.innerHTML}`);
  timerId = setInterval(updateCountdown, 1000);
  isTimerRunning = true;
}

function resetTimer() {
  // alert(`resetTimer(), tasks[0]=${tasks[0].name}`)
  tasksListsUL.firstChild.classList.remove('active');
  flash = false;
  audio.stop();
  countdownLabel.innerHTML = "";
  clearInterval(timerId);
  isTimerRunning = false;
}

function init() {
  $.get(`/routine/${routineName}/tasks`, (tasks_array, status) => {
    if (status != "success") {
      alert(`init() error: status=${status}`);
    }
    tasks_array.forEach((task) => {
      // add to tasks
      let new_task = new Task(
        task.name,
        task.duration,
        task._id,
        task.routine,
        task.order
      );
      tasks.push(new_task);
      // add to HTML
    });
    tasks_array.sort((a, b) => {
      return a.order - b.order;
    });
    tasks_array.forEach((task) => {
      let taskLI = getLITask(task.name, task.duration);
      tasksListsUL.appendChild(taskLI);
    });
  });
}

function onDragEnd(evt) {
  // correct tasks ordering
  tasks[evt.oldIndex].order = evt.newIndex;
  const task_mongo_id = tasks[evt.oldIndex].mongoID;
  if (evt.oldIndex < evt.newIndex) {
    for (let i = evt.newIndex; i > evt.oldIndex; i--) {
      tasks[i].order -= 1;
    }
  } else if (evt.newIndex < evt.oldIndex) {
    for (let i = evt.newIndex; i < evt.oldIndex; i++) {
      tasks[i].order += 1;
    }
  }
  tasks.sort((a,b) => {return a.order - b.order});
  // update db
  $.post(
    `/routine/${routineName}/reorder`,
    { oldIndex: evt.oldIndex, newIndex: evt.newIndex, id: task_mongo_id },
    (data, status) => {
      if (status != "success") {
        console.error(`error at onDragEnd, status=${status}`);
      }
    }
  );
}
const submitButton = document.getElementById("submitButton");
const tasksListsUL = document.getElementById("tasksList");
const taskNameInput = document.getElementById("taskName");
const taskDurationInput = document.getElementById("taskDuration");
const startButton = document.getElementById("startButton");
const resetButton = document.getElementById("resetButton");
const addMinuteButton = document.getElementById("addMinuteButton");
const countdownLabel = document.getElementById("countdownLabel");

const tasks = [];
var isTimerRunning = false;
var timerId;
var countdown_end;
var isDebug = (document.querySelector('meta[property=debug]') !== null)
var flash = false;
let routineName = document.getElementById('routineName').textContent;
$(document).ready(function() {
  init();
});
var isLocked = false;
submitButton.addEventListener("click", addTask);
startButton.addEventListener("click", startTimer);
resetButton.addEventListener("click", resetTimer);
addMinuteButton.addEventListener("click", () => {
  countdown_end = time.addMinutes(countdown_end);
});
taskNameInput.addEventListener("keyup", onKeyup);
taskDurationInput.addEventListener("keyup", onKeyup);

let sortableTaskList = Sortable.create(tasksListsUL, {
  animation: 150,
  ghostClass: "blue-background-class",
  handle: '.drag-handle',
  onEnd: onDragEnd,
});
