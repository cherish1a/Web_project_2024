//시계
function updateClock(){
    const now = new Date();
    const targetDate = new Date('2025-01-01T00:00:00');  //2025/1/1 자정

    // 남은 시간 계산
    const timeDiff = targetDate - now;

     // 남은 시간에서 시간, 분, 초 계산
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    // 카운트다운을 '일:시:분:초' 형식으로
    const countdown = document.getElementById('clock');
    countdown.textContent = `${days}일 ${hours.toString().padStart(2, '0')}시간 ${minutes.toString().padStart(2, '0')}분 ${seconds.toString().padStart(2, '0')}초`;
  }

//1초마다 업데이트
setInterval(updateClock, 1000);
