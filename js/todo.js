const toDoForm = document.querySelector("#todo-form");  // "todo-form" 이라는 값을 DOM에서 찾아서 저장
const toDoInput = toDoForm.querySelector("input[name='todo-text']");  // input 중 name이 todo-text인 값을 todoForm에서 찾아서 저장
const stars = toDoForm.querySelector("#stars");  // id가 star인 값을 todoForm에서 찾아서 저장
const toDoImportancy = stars.querySelectorAll("input[type='radio']");
const toDoLimit = toDoForm.querySelector("input[name='todo-limit']");  // input 중 name이 todo-limit인 값을 todoForm에서 찾아서 저장
const toDoList = document.querySelector("#todo-list");  // id가 "todo-list"인 값을 DOM에서 찾아서 저장
const TODOS_KEY = "todos";  // localStorage에 저장되는 Todos의 KEY값
let savedToDos = localStorage.getItem(TODOS_KEY);  // localStorage에 있는 Todo를 불러와 변수로 저장
let parsedToDos = JSON.parse(savedToDos);
let toDos = [];
toDos = parsedToDos;

function saveToDos() { // Todo를 localStorage에 저장하기 위한 함수
  localStorage.setItem(TODOS_KEY, JSON.stringify(toDos));
  savedToDos = localStorage.getItem(TODOS_KEY);
}

function RemainTimeCalcurate(todo) {
  const date = new Date();
  const limit = new Date(todo.limit);
  const diff = limit.getTime() - date.getTime();
  const hours = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2,"0");
  const minutes = String(Math.floor((diff - hours * 1000 * 60 * 60) / (1000 * 60))).padStart(2,"0");
  const seconds = String(Math.floor((diff - hours * 1000 * 60 * 60 - minutes * 1000 * 60) / 1000)).padStart(2,"0");
  return [hours, minutes, seconds];
}

function paintRemainTodo(toDolistLimit,todo) {
  const remains = RemainTimeCalcurate(todo);
  if (remains[0] < 0) {
    toDolistLimit.innerText = "This To-Do is Time out!"
  }else{
    toDolistLimit.innerText = "Remains =" + `${remains[0]} : ${remains[1]} : ${remains[2]}`;
  }
}

function paintTodo(newTodo) {  // 새로운 Todo의 속성값을 저장 후 html로 가져오는 함수
  const li = document.createElement("li");  // html에 li를 추가 후 변수로 저장
  li.id = newTodo.id;  // li의 id는 newTodo의 id(현재시간값)
  li.classList.add("todoStyle");
  const span_input = document.createElement("span");  // html에 span을 추가 후 변수로 저장
  span_input.innerText = newTodo.text;  // span 내부 글자는 newTodo의 text(입력값)
  span_input.classList.add("textBox");
  const span_importancy = document.createElement("span");
  span_importancy.innerText = "★".repeat(newTodo.important);
  span_importancy.classList.add("importancyBox");
  const span_limit = document.createElement("span");
  span_limit.classList.add("limitBox");
  paintRemainTodo(span_limit,newTodo)
  const button = document.createElement("button");  // html에 button을 추가 후 변수로 저장
  button.innerText = "❌";  // button 내부 글자는 ❌(삭제 표시)
  button.addEventListener("click", deleteToDo);  // button을 클릭하는지 감지
  li.appendChild(span_input);  // li에 span을 하위요소로 포함
  li.appendChild(span_importancy);  // li에 span을 하위요소로 포함
  li.appendChild(span_limit);  // li에 span을 하위요소로 포함
  li.appendChild(button);  // li에 button을 하위요소로 포함
  toDoList.appendChild(li);  // toDolist에 li를 하위요소로 포함
}

function handleToDoSubmit(event) {  // Todo를 Submit했을때 발생하는 일에 대한 함수
  event.preventDefault();  // 기본값(새로고침)이 발생되지 않도록 함
  const textTodo = toDoInput.value;  // textTodo에 현재 toDoForm에 입력된 input를 넣음
  const limitTodo = toDoLimit.value;  // limitTodo에 현재 toDolimit에 입력된 input를 넣음
  let selectedImportancy;
  toDoImportancy.forEach((star) => {
    if (star.checked){
      selectedImportancy = star.value;
      star.checked = false;
    }
  })
  if (selectedImportancy == undefined){
    alert("중요도를 체크해주시기 바랍니다.");
    return;
  }
  toDoInput.value = null;  // toDoForm의 input을 초기화함
  toDoLimit.value = null;  // toDoForm의 limit을 초기화함
  const newTodo = {  // newTodo의 객체를 생성
    id: Date.now(),  // id : 현재시간값
    text: textTodo,  // text : toDoForm 입력값
    important: selectedImportancy,  // important : 선택된 중요도
    limit: limitTodo  // limit : toDoLimit 입력값
  }
  paintTodo(newTodo);  //newTodo객체를 html에 추가
  toDos.push(newTodo);  //newTodo객체를 toDos 배열에 추가
  saveToDos();  // 현 toDos 배열을 localStorage에 저장
}

function deleteToDo(event) {  // Todo를 삭제하기 위한 함수(변수 event는 특정사건이 발생했을때 생김)
  const li = event.target.parentElement;  // 변수 li에 발생한 이벤트 내+ target(button)의 parent(li)를 저장
  toDos = toDos.filter((todo) => todo.id != parseInt(li.id));  // 배열의 원소 중 todo와 li가 다른 id(시간값)인 경우에만 저장(parseInt는 str을 int로 변경)
  li.remove();  // event가 발생한 todo의 li를 지워라
  saveToDos();  // 현 Todos(event가 발생한 todo 제외하고 나머지)를 localStorage에 저장하는 함수
}

toDoForm.addEventListener("submit", handleToDoSubmit);

let index = 0;
if (savedToDos !== null) {
  parsedToDos.forEach(paintTodo);
  setInterval(() => {
    parsedToDos = JSON.parse(savedToDos);
    parsedToDos.forEach((todo) => {
      const toDolistLimit = toDoList.querySelector(`li[id="${String(todo.id)}"] > span[class='limitBox']`);
      paintRemainTodo(toDolistLimit,todo);
    })},1000)
}