const startTime = new Date();
const today = new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate());
let lastTime = startTime;
let measureOneSecond = 0;
//time을 불러왔을 때 형식을 format해주는 함수
function formatTime(time, format) {
  const date = new Date(time);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  const formattedTime = format
    .replace(/yyyy/g, year)
    .replace(/MM/g, month.toString().padStart(2, "0"))
    .replace(/dd/g, day.toString().padStart(2, "0"))
    .replace(/hh/g, hour.toString().padStart(2, "0"))
    .replace(/mm/g, minute.toString().padStart(2, "0"))
    .replace(/ss/g, second.toString().padStart(2, "0"));
  return formattedTime;
}
// 1프레임에 가야하는 거리를 구하는 함수
function getDistancePerFrame(timestamp = new Date()) {
  const elapsed = (timestamp - lastTime) / 1000;
  const distancePerFrame = distancePerSecond * elapsed;
  if (lastTime != timestamp) lastTime = timestamp;
  return distancePerFrame;
}
