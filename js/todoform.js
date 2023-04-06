// HTML 객체 불러오기
const toDoForm = document.querySelector("#todo-form");
const toDoInput = toDoForm.querySelector("input[name='todo-text']");
const stars = toDoForm.querySelector("#stars");
const toDoImportancy = stars.querySelectorAll("input[type='radio']");
const toDoLimit = toDoForm.querySelector("input[name='todo-limit']");
const toDoList = document.querySelector("#todo-list");
// localStorage에 있는 Todo를 불러와 변수로 저장
const TODOS_KEY = "todos";
let savedToDos = localStorage.getItem(TODOS_KEY);
let parsedToDos = JSON.parse(savedToDos);
// Todo를 localStorage에 저장하기 위한 함수
function saveToDos() {
  localStorage.setItem(TODOS_KEY, JSON.stringify(parsedToDos));
  savedToDos = localStorage.getItem(TODOS_KEY);
  parsedToDosOnGraph = JSON.parse(savedToDos);
}
// Graph 내 todo의 속성을 가져와서 html로 변경해주는 함수
function syncGraphToHtml(todo) {
  const toDoInHtml = toDoList.querySelector(`li[id="${String(todo.id)}"]`);
  todo.limit = new Date(today.getTime() + todo.x / distancePerSecond);
  toDoInHtml.querySelector("span[class='limitBox']").innerText = `Remains = ${formatTime(todo.limit, "hh:mm:ss")}`;
  todo.important = Math.round(5.5 - (todo.y * 5) / graphHeight);
  toDoInHtml.querySelector("span[class='importancyBox']").innerText = "★".repeat(todo.important) + "☆".repeat(5 - todo.important);
}
// 새로운 Todo의 속성값을 저장 후 html로 가져오는 함수
function paintTodo(newTodo) {
  const li = document.createElement("li");
  li.id = newTodo.id;
  li.classList.add("todo-style");
  const span_input = document.createElement("span");
  span_input.innerText = newTodo.text;
  span_input.classList.add("text-box");
  const span_importancy = document.createElement("span");
  span_importancy.innerText = "★".repeat(newTodo.important) + "☆".repeat(5 - newTodo.important);
  span_importancy.classList.add("importancy-box");
  const span_limit = document.createElement("span");
  span_limit.classList.add("limit-box");
  span_limit.innerText = `Remains = ${formatTime(newTodo.id, "hh:mm:ss")}`;
  const button = document.createElement("button");
  button.innerText = "❌";
  button.addEventListener("click", deleteToDo);
  li.appendChild(span_input);
  li.appendChild(span_importancy);
  li.appendChild(span_limit);
  li.appendChild(button);
  toDoList.appendChild(li);
}
// Todo를 Submit했을때 발생하는 함수 : Todo의 속성값을 저장하고, 화면에 출력함
function handleToDoSubmit(event) {
  event.preventDefault();
  const textTodo = toDoInput.value;
  const limitTodo = toDoLimit.value;
  toDoInput.value = null;
  toDoLimit.value = null;
  let selectedImportancy;
  toDoImportancy.forEach((star) => {
    if (star.checked) {
      selectedImportancy = star.value;
      star.checked = false;
    }
  });
  if (selectedImportancy == undefined) {
    alert("중요도를 체크해주시기 바랍니다.");
    return;
  }
  const newTodo = {
    id: Date.now(),
    text: textTodo,
    important: selectedImportancy,
    limit: new Date(limitTodo),
    is_mouse_on: false,
    mouseLock: false,
  };
  newTodo.x = ((newTodo.limit.getTime() - today.getTime()) / 1000) * distancePerSecond;
  newTodo.y = (graphHeight * (9 - (newTodo.important - 1) * 2)) / 10;
  paintTodo(newTodo);
  parsedToDos.push(newTodo);
  saveToDos();
}
// ❌ 버튼을 클릭했을 때, Todo를 삭제하기 위한 함수
function deleteToDo(event) {
  const li = event.target.parentElement;
  parsedToDos = parsedToDos.filter((todo) => todo.id != parseInt(li.id));
  li.remove();
  saveToDos();
}
//<-----------------------main ------------------------------->
// toDoForm이 submit되는지 감지하는 EventListener
toDoForm.addEventListener("submit", handleToDoSubmit);
// localStorage에 저장값이 있을때 이를 나타내기 위한 코드
if (savedToDos !== null) {
  parsedToDos.forEach(paintTodo);
}
