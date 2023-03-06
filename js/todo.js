const toDoForm = document.querySelector("#todo-form");  // "todo-form" 이라는 값을 html에서 찾아서 저장
const toDoInput = toDoForm.querySelector("input[name='todo-text']");  // input 중 name이 todo-text인 값을 todoForm에서 찾아서 저장
const toDolimit = toDoForm.querySelector("input[name='todo-limit']");  // input 중 name이 todo-limit인 값을 todoForm에서 찾아서 저장
const toDoList = document.querySelector("#todo-list");  // "todo-list" 라는 값을 html에서 찾아서 저장
const TODOS_KEY = "todos";  // localStorage에 저장되는 Todos의 KEY값

let toDos = [];

function saveToDos() { // Todo를 localStorage에 저장하기 위한 함수
  localStorage.setItem(TODOS_KEY, JSON.stringify(toDos));  // localStorage에 Todos를 JSON으로 변환해서 저장
}

function paintTodo(newTodo) {  // Todo를 웹페이지(html)에 그리기 위한 함수(변수는 객체)
  const li = document.createElement("li");  // html에 li를 추가 후 변수로 저장
  li.id = newTodo.id;  // li의 id는 newTodo의 id(현재시간값)
  const span_input = document.createElement("span");  // html에 span을 추가 후 변수로 저장
  span_input.innerText = newTodo.text;  // span 내부 글자는 newTodo의 text(입력값)
  span_input.classList.add("textBox");
  const span_limit = document.createElement("span");
  span_limit.innerText = "limit =" + newTodo.limit;
  span_limit.classList.add("limitBox");
  const button = document.createElement("button");  // html에 button을 추가 후 변수로 저장
  button.innerText = "❌";  // button 내부 글자는 ❌(삭제 표시)
  button.addEventListener("click", deleteToDo);  // button을 클릭하는지 감지
  li.appendChild(span_input);  // li에 span을 하위요소로 포함
  li.appendChild(span_limit);  // li에 span을 하위요소로 포함
  li.appendChild(button);  // li에 button을 하위요소로 포함
  toDoList.appendChild(li);  // toDolist에 li를 하위요소로 포함
}

function getStar(){
  var childList = toDoForm.childNodes;
  for (var i=0; i<childList.length; i++){
    if(childList[i].checked){
      console.log(childList[i].value)
    }
  console.log(childList)
  }
}

function handleToDoSubmit(event) {  // Todo를 Submit했을때 발생하는 일에 대한 함수
  event.preventDefault();  // 기본값(새로고침)이 발생되지 않도록 함
  const newTodo = toDoInput.value;  // newTodo에 현재 toDoForm에 입력된 input를 넣음
  const limitTodo = toDolimit.value;  // limitTodo에 현재 toDolimit에 입력된 input를 넣음
  toDoInput.value = null;  // toDoForm의 input을 초기화함
  toDolimit.value = null;  // toDoForm의 limit을 초기화함
  const newTodoObj = {  // newTodo의 객체를 생성
    id: Date.now(),  // id : 현재시간값
    text: newTodo,  // text : toDoForm 입력값
    limit: limitTodo  // limit : toDoLimit 입력값
  };
  toDos.push(newTodoObj);  //newTodoObj를 배열에 추가
  paintTodo(newTodoObj);  //newTodo를 웹페이지에 그림
  getStar()
  saveToDos();  // 현 Todos를 localStorage에 저장
}

function deleteToDo(event) {  // Todo를 삭제하기 위한 함수(변수 event는 특정사건이 발생했을때 생김)
  const li = event.target.parentElement;  // 변수 li에 발생한 이벤트 내 target(button)의 parent(li)를 저장
  toDos = toDos.filter((todo) => todo.id != parseInt(li.id));  // 배열의 원소 중 todo와 li가 다른 id(시간값)인 경우에만 저장(parseInt는 str을 int로 변경)
  li.remove();  // event가 발생한 todo의 li를 지워라
  saveToDos();  // 현 Todos(event가 발생한 todo 제외하고 나머지)를 localStorage에 저장하는 함수
}

toDoForm.addEventListener("submit", handleToDoSubmit);  
  // TodoForm을 제출(submit)하는것을 감지하기 위해 EventLister 호출
const savedToDos = localStorage.getItem(TODOS_KEY);  // localStorage에 있는 Todo를 불러와 변수로 저장
if (savedToDos !== null) {  // savedTodos가 비어있지 않으면(localStorage가 비어있지 않으면):
  const parsedToDos = JSON.parse(savedToDos);  // savedTodos에 있는 JSON형식의 파일을 자바스크립트 객체로 변환하여 저장한다.
  toDos = parsedToDos;  // savedTodos에 있는 내용을 현재 todo배열로 가져옴
  parsedToDos.forEach(paintTodo);  // 각각의 parsedtodo를 html에 그림
}
