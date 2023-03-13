const canvas = document.querySelector("#todoCanvas");
const canvasContainer = document.querySelector("#canvas-container");
const queriedToDo = document.querySelector("#todo-list");
const ctx = canvas.getContext('2d');
// 캔버스 설정
canvas.width = window.innerWidth;
canvas.height = 500;

// 선 그래프를 그립니다.
for (let i = 1; i < 10; i++){
    ctx.beginPath();
    ctx.moveTo(1920/10*i, 0);
    ctx.lineTo(1920/10*i, canvas.height);
    ctx.stroke();
}
ctx.beginPath();
ctx.moveTo(0,canvas.height/2);
ctx.lineTo(canvas.width, canvas.height/2);
ctx.stroke();