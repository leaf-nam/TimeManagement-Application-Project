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

let x = 100;
let y = 100;
let dx = 10;
let dy = 10;
const radius = 20;

function drawFrame() {
    ctx.clearRect(0,0,canvas.width,canvas.height)
    // 세로줄
    ctx.strokeStyle = "green";
    ctx.lineWidth = 1;
    for (let i = 1; i <= 24; i++){
        ctx.beginPath();
        ctx.moveTo(graphWidth/25*i, 0);
        ctx.lineTo(graphWidth/25*i, graphHeight);
        ctx.stroke();
    }
    for (let i = 1; i <= 10; i++){
        ctx.beginPath();
        ctx.moveTo(0, graphHeight/10*(2*i-1));
        ctx.lineTo(graphWidth, graphHeight/10*(2*i-1));
        ctx.stroke();
    }
    x += dx;
    y += dy;
    if (x + radius > canvas.width || x - radius < 0) {
        dx = -dx;
      }
    if (y + radius > canvas.height || y - radius < 0) {
        dy = -dy;
      }
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = 'red';
    ctx.fill();
    requestAnimationFrame(drawFrame);
}

function calLocationTodo(todo){ // Todo 위치를 계산하기 위한 함수(변수는 todo객체)
    const remains = RemainTimeCalcurate(todo);
    const locationX = graphWidth * (Number(remains[0])*60+Number(remains[1])) / (26*60);
    const locationY = graphHeight * (9-(todo.important-1)*2) / 10;
    return [locationX, locationY];
}



requestAnimationFrame(drawFrame)
//Todo 그리기(원)
// parsedToDos = JSON.parse(savedToDos);
// let locationTodos = []
// parsedToDos.forEach((parsedTodo) => locationTodos.push(calLocationTodo(parsedTodo)));
// locationTodos.forEach(function(locationTodo) {
//     ctx.strokeStyle = "red";
//     ctx.lineWidth = 10;
//     ctx.beginPath();
//     ctx.arc(locationTodo[0],locationTodo[1],checkSize,0,Math.PI*2);
//     ctx.fillStyle = "yellow";
//     ctx.fill();
//     ctx.closePath();
// })