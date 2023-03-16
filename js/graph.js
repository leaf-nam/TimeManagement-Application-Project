const canvas = document.querySelector("#todoCanvas");
const canvasContainer = document.querySelector("#canvas-container");
const queriedToDo = document.querySelector("#todo-list");
const graphWidth = window.innerWidth;
const graphHeight = 500;
const checkImg = new Image();
checkImg.src = `img/check.png`;
const checkSize = 20;
// 캔버스 설정
canvas.width = graphWidth;
canvas.height = graphHeight;
const ctx = canvas.getContext('2d');
// 애니메이션을 위한 초기화
let x = 100;
let dx = 1;
const radius = 20;
let isMouseOnCircle = false;
let nowId
let nowTodoX
let nowTodoY
ctx.font = "30px Arial";
// Frame 그리는 함수
function drawFrame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    // 격자
    ctx.strokeStyle = "green";
    ctx.lineWidth = 1;
    x -= dx;
    if (x - radius < 0) {
        x = graphWidth;
    }
    for (let i = 1; i <= 48; i++) {
        ctx.beginPath();
        ctx.moveTo(x + (i - 24) * graphWidth / 24, 0);
        ctx.lineTo(x + (i - 24) * graphWidth / 24, graphHeight);
        ctx.stroke()
    }
    for (let i = 1; i <= 10; i++) {
        ctx.beginPath();
        ctx.moveTo(0, graphHeight / 10 * (2 * i - 1));
        ctx.lineTo(graphWidth, graphHeight / 10 * (2 * i - 1));
        ctx.stroke();
    }
    // Check 표시
    parsedToDos = JSON.parse(savedToDos);
    let locationTodos = []
    parsedToDos.forEach((parsedToDo) => locationTodos.push(calLocationTodo(parsedToDo)));
    locationTodos.forEach(function (locationTodo) {
        circleX = locationTodo[0] + x
        circleY = locationTodo[1]
        ctx.beginPath();
        ctx.arc(circleX, circleY, radius, 0, Math.PI * 2);
        ctx.fillStyle = 'red';
        ctx.fill();
    })
    // 마우스 상호작용
    canvas.addEventListener("mousemove", function (event) {
        let rect = canvas.getBoundingClientRect();
        locationTodos.forEach(function (locationTodo) {
            circleX = locationTodo[0] + x
            circleY = locationTodo[1]
            let eventX = event.clientX - rect.left;
            let eventY = event.clientY - rect.top;
            let distance = Math.sqrt(Math.pow(eventX - circleX, 2) + Math.pow(eventY - circleY, 2));
            if (distance <= radius && !isMouseOnCircle) {
                isMouseOnCircle = true;
                nowId = locationTodo[2];
                nowTodoX = eventX;
                nowTodoY = eventY;
            }
        })
    })
    if (isMouseOnCircle) {
        ctx.fillText(nowId, nowTodoX, nowTodoY);
    }
    requestAnimationFrame(drawFrame);
}
// Todo 위치를 계산하기 위한 함수(변수는 todo객체)
function calLocationTodo(todo) {
    const remains = RemainTimeCalcurate(todo);
    const locationX = graphWidth * (Number(remains[0]) * 60 + Number(remains[1])) / (26 * 60);
    const locationY = graphHeight * (9 - (todo.important - 1) * 2) / 10;
    return [locationX, locationY, todo.id];
}

requestAnimationFrame(drawFrame)