// HTML 객체 불러오기
const toDoForm = document.querySelector("#todo-form");
const toDoInput = toDoForm.querySelector("input[name='todo-text']");
const stars = toDoForm.querySelector("#stars");
const toDoImportancy = stars.querySelectorAll("input[type='radio']");
const toDoStart = toDoForm.querySelector("input[name='todo-start']");
const toDoEnd = toDoForm.querySelector("input[name='todo-end']");
const toDoList = document.querySelector("#todo-list");
const canvasContainer = document.querySelector("#canvas-container");
// localStorage에 todo 있는지 확인
const TODOS_KEY = "todos";
let savedToDos = localStorage.getItem(TODOS_KEY);
let parsedToDos = [];
// graph 속성 미리 설정
const graphWidth = canvasContainer.clientWidth;
const graphHeight = canvasContainer.clientHeight;
console.log(graphWidth, graphHeight);
// Todo를 localStorage에 저장하기 위한 함수
function saveToDos() {
  localStorage.setItem(TODOS_KEY, JSON.stringify(parsedToDos));
  savedToDos = localStorage.getItem(TODOS_KEY);
}
// Graph 내 todo의 속성을 가져와서 html로 변경해주는 함수
function syncGraphToHtml(todo) {
  const toDoInHtml = toDoList.querySelector(`li[id="${String(todo.id)}"]`);
  todo.limit = todo.x / distancePerSecond;
  toDoInHtml.querySelector("span[class='limit-box']").innerText = formatSecond(todo.limit, "hh:mm:ss");
  todo.important = Math.round(5 - (5 * todo.y) / graphHeight);
  toDoInHtml.querySelector("span[class='importancy-box']").innerText = "★".repeat(todo.important) + "☆".repeat(5 - todo.important);
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
  const span_start_time = document.createElement("span");
  span_start_time.classList.add("time-box");
  span_start_time.innerText = formatSecond(newTodo.start_time, "hh:mm:ss");
  const span_end_time = document.createElement("span");
  span_end_time.classList.add("time-box");
  span_end_time.innerText = formatSecond(newTodo.end_time, "hh:mm:ss");
  const button = document.createElement("button");
  button.classList.add("delete-button");
  button.innerText = "❌";
  button.addEventListener("click", deleteToDo);
  li.appendChild(span_input);
  li.appendChild(span_importancy);
  li.appendChild(span_start_time);
  li.appendChild(span_end_time);
  li.appendChild(button);
  toDoList.appendChild(li);
}
// Todo를 Submit했을때 검증하기 위한 함수
function checkHandleTodoSubmit(selectedImportancy, start_time, end_time, creatTodoTime) {
  if (selectedImportancy == undefined) {
    alert("중요도를 체크해주시기 바랍니다.");
    return true;
  }
  if (start_time > end_time) {
    alert("시작시간을 종료시간보다 작게 설정해주시기 바랍니다.");
    return true;
  }
  if (new Date(start_time).getTime() - creatTodoTime < 0) {
    alert("시작시간을 현재시간보다 크게 설정해주시기 바랍니다.");
    return true;
  }
}
// Todo를 Submit했을때 발생하는 함수 : Todo의 속성값을 저장하고, 화면에 출력함
function handleToDoSubmit(event) {
  event.preventDefault();
  const textTodo = toDoInput.value;
  const start_time = toDoStart.value;
  const end_time = toDoEnd.value;
  const creatTodoTime = Date.now();
  toDoInput.value = null;
  toDoStart.value = null;
  toDoEnd.value = null;
  let selectedImportancy;
  toDoImportancy.forEach((star) => {
    if (star.checked) {
      selectedImportancy = star.value;
      star.checked = false;
    }
  });
  if (checkHandleTodoSubmit(selectedImportancy, start_time, end_time, creatTodoTime)) return;
  const newTodo = {
    id: creatTodoTime,
    text: textTodo,
    important: selectedImportancy,
    start_time: (new Date(start_time).getTime() - creatTodoTime) / 1000,
    end_time: (new Date(end_time).getTime() - creatTodoTime) / 1000,
    is_mouse_on: false,
    mouseLock: false,
  };
  newTodo.x = newTodo.limit * distancePerSecond;
  newTodo.y = (graphHeight / 5) * (5 - newTodo.important);
  paintTodo(newTodo);
  parsedToDos.push(newTodo);
  console.log(parsedToDos);
  saveToDos();
  console.log(parsedToDos);
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
  parsedToDos = JSON.parse(savedToDos);
  parsedToDos.forEach(paintTodo);
}
