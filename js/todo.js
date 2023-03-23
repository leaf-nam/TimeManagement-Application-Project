// HTML에서 요소 속성 불러오기
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
}
// Todo의 limit까지 남은시간을 계산하기 위한 함수
function RemainTimeCalcurate(todo) {
  const diff = new Date(todo.limit).getTime() - new Date().getTime();
  const hours = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, "0");
  const minutes = String(
    Math.floor((diff - hours * 1000 * 60 * 60) / (1000 * 60))
  ).padStart(2, "0");
  const seconds = String(
    Math.floor((diff - hours * 1000 * 60 * 60 - minutes * 1000 * 60) / 1000)
  ).padStart(2, "0");
  return [hours, minutes, seconds];
}
// Todo의 limit까지 남은시간을 출력하기 위한 함수
function paintRemainTodo(toDolistLimit, todo) {
  const remains = RemainTimeCalcurate(todo);
  if (remains[0] < 0) {
    toDolistLimit.innerText =
      "Timeover =" + `${remains[0]} : ${remains[1]} : ${remains[2]}`;
  } else {
    toDolistLimit.innerText =
      "Remains =" + `${remains[0]} : ${remains[1]} : ${remains[2]}`;
  }
}
// 새로운 Todo의 속성값을 저장 후 html로 가져오는 함수
function paintTodo(newTodo) {
  const li = document.createElement("li");
  li.id = newTodo.id;
  li.classList.add("todoStyle");
  const span_input = document.createElement("span");
  span_input.innerText = newTodo.text;
  span_input.classList.add("textBox");
  const span_importancy = document.createElement("span");
  span_importancy.innerText = "★".repeat(newTodo.important);
  span_importancy.classList.add("importancyBox");
  const span_limit = document.createElement("span");
  span_limit.classList.add("limitBox");
  paintRemainTodo(span_limit, newTodo);
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
    limit: limitTodo,
    is_mouse_on: false,
    mouseLock: false,
  };
  const locationTodo = calLocationTodo(newTodo);
  newTodo.x = locationTodo[0];
  newTodo.y = locationTodo[1];
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
  // 1초마다 남은 시간을 다시 출력하는 코드
  setInterval(() => {
    parsedToDos = JSON.parse(savedToDos);
    parsedToDos.forEach((todo) => {
      const toDolistLimit = toDoList.querySelector(
        `li[id="${String(todo.id)}"] > span[class='limitBox']`
      );
      paintRemainTodo(toDolistLimit, todo);
    });
  }, 1000);
}
