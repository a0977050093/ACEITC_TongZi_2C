function checkTime(i) {
  return i < 10 ? "0" + i : i;
}

function startTime() {
  const today = new Date();
  const h = today.getHours();
  const m = checkTime(today.getMinutes());
  const s = checkTime(today.getSeconds());
  document.getElementById('time').innerHTML = "現在時間是 " + h + ":" + m + ":" + s;
  setTimeout(startTime, 500);
}

function showSection(platform) {
  document.getElementById('ios-section').classList.add('hidden');
  document.getElementById('android-section').classList.add('hidden');
  document.getElementById(`${platform}-section`).classList.remove('hidden');
}

startTime();