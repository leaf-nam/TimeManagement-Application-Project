const canvas = document.querySelector("#todoCanvas");
const canvasContainer = document.querySelector("#canvas-container");
const queriedToDo = document.querySelector("#todo-list");
const ctx = canvas.getContext('2d');
const graphWidth = window.innerWidth;
const graphHeight = 500;
const img = new Image();
img.src = `img/check.png`;

function paintCheckTodo(todo){ // Todo를 웹페이지(html)에 그리기 위한 함수(변수는 todo객체)
    const checkSize = 30
    const remains = RemainTimeCalcurate(todo);
    const locationX = graphWidth * (Number(remains[0])*60+Number(remains[1])) / (24*60);
    const locationY = graphHeight * (5-todo.important) / 5;
    console.log(todo);
    img.onload = function(){
        ctx.drawImage(img,locationX,locationY,checkSize,checkSize);
        console.log(locationX);
        console.log(locationY);
    }
}
// 캔버스 설정
canvas.width = graphWidth;
canvas.height = graphHeight;

// 세로줄
ctx.strokeStyle = "green";
ctx.lineWidth = 3;
for (let i = 1; i <= 24; i++){
    ctx.beginPath();
    ctx.moveTo(1920/24*i, 0);
    ctx.lineTo(1920/24*i, canvas.height);
    ctx.stroke();
}

// 가로줄
ctx.beginPath();
ctx.moveTo(0,0);
ctx.lineTo(canvas.width, 0);
ctx.stroke();
ctx.beginPath();
ctx.moveTo(0,canvas.height);
ctx.lineTo(canvas.width, canvas.height);
ctx.stroke();

parsedToDos = JSON.parse(savedToDos);
parsedToDos.forEach(paintCheckTodo);