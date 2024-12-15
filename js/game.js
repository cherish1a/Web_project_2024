let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

//공룡 이미지
let dinoImg = new Image();
dinoImg.src = './media/game/dino.png';
let dino2Img = new Image();
dino2Img.src = './media/game/dino2.png';
let dinoDownImg = new Image();
dinoDownImg.src = './media/game/dino_down.png';
let dinoJumpImg = new Image();
dinoJumpImg.src = './media/game/dino_jump.png';

//공룡
let dino = {
    x : 100,
    y : 200,
    width : 60,
    height : 70,
    speed: 5,
    isCrouching:false,
    walkFrame: 0,
    //아이템
    isShield: false,
    shieldTime: 0, //쉴드 지속 시간
    draw(){
        if (this.isShield) {
            ctx.shadowBlur = 20;
            ctx.shadowColor = "yellow";
        } else {
            ctx.shadowBlur = 0;
        }
        
        if (this.isCrouching) {
            ctx.drawImage(dinoDownImg, this.x, this.y); // 엎드림
        } else if(jump == true) {
            ctx.drawImage(dinoJumpImg, this.x, this.y); // 점프
        } else {
            if (this.walkFrame === 0) { //기본
                ctx.drawImage(dinoImg, this.x, this.y); 
            } else {
                ctx.drawImage(dino2Img, this.x, this.y);
            }
        }
          //효과가 캐릭터에게만 적용되게
        if (this.isShield) {
            ctx.shadowBlur = 0; 
        }
    }
}

//장애물 이미지
let bigImg = new Image();
bigImg.src = './media/game/big.png';

let smallImg = new Image();
smallImg.src = './media/game/small.png';

let midImg = new Image();
midImg.src = './media/game/mid.png';

let birdImg = new Image();
birdImg.src = './media/game/airplane.png';

//장애물
class Obstacle {
    constructor(speed, type = "default") {
        this.x = 1000;
        this.speed = speed;
        this.type = type;
        
        // 타입에 따라 크기 다르게 설정
        if (this.type === "big") {
            this.y = 195; 
            this.width = 40; 
            this.height = 70; 
            this.image = bigImg;
        } else if (this.type === "small") {
            this.y = 235; 
            this.width = 50; 
            this.height = 30; 
            this.image = smallImg;
        } else {
            this.y = 215; // 기본 선인장
            this.width = 30; 
            this.height = 50; 
            this.image = midImg;
        }
    }

    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height); 
    }
}
//장애물 추가
class Bird extends Obstacle {
    constructor(speed) {
        super(speed, "bird"); 
        this.width = 50; 
        this.height = 20; 
        this.y = Math.random() < 0.5 ? 220 : 185;  
        this.image = birdImg;
    }
}

//아이템 이미지
let itemImg = new Image();
itemImg.src = './media/game/shield.png';

//아이템 
class Item {
    constructor(speed) {
        this.x = 1000;
        this.y = 215;
        this.speed = speed;
        this.width = 20; 
        this.height = 20; 
        this.image = itemImg;
    }
    
    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height); 
    }
}

// 배경 이미지 설정
let frontBgImage = new Image(); // 앞 배경
frontBgImage.src = "./media/game/front.png";

let backBgImage = new Image(); // 뒤 배경
backBgImage.src = "./media/game/back.png";

// 배경 x좌표 
let frontBgX = 0;
let backBgX = 0;

//변수 정리
let score = 0;
let timer = 0;
//점프
let jump = false;
let jump_timer = 0;
let jump_speed = 12;
let gravity = 0.5;
let crouchRequested = false;
//장애물
let cactus_arr = [];
let cactusSpeed = 5;
let nextObstacleTime = Math.floor(Math.random() * 200) + 20;
//아이템
let shieldItem;
let nextShieldTime = Math.floor(Math.random() * 600) + 300;
//게임 시작, 끝 여부
let gameStarted = false; 
let gameOver = false; 
//효과음
// 효과음 로드
let backBgSound = new Audio('./media/game/sounds/025270_pixel-song-4-72676.mp3');
let jumpSound = new Audio('./media/game/sounds/retro-jump-3-236683.mp3');
let shieldSound = new Audio('./media/game/sounds/retro-coin-4-236671.mp3');
let gameOverSound = new Audio('./media/game/sounds/retro-hurt-1-236672.mp3');

//음량 조절
jumpSound.volume = 0.01;
shieldSound.volume = 0.05;
gameOverSound.volume = 0.05;
backBgSound.volume = 0.1;

//배경음악 반복
backBgSound.loop = true; 

let animation;
// 게임 시작 화면 그리기
function gameStartScreen() {
    ctx.fillStyle = "white";
    ctx.font = "30px bitbit";
    ctx.fillText("Press Space or Click to Start", canvas.width / 3, canvas.height / 2);
}

// 게임 시작 함수
function startGame() {
    gameStarted = true;
    startScreenDisplayed = false;
    backBgSound.play();
    frame(); // 게임 루프 시작
}

// 게임 종료 화면 그리기
function gameOverScreen() {
    backBgSound.pause(); // 배경음악 중지
    backBgSound.currentTime = 0; // 음악 처음으로 되돌림
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "30px bitbit";
    ctx.fillText("Game Over!", canvas.width / 3, canvas.height / 2 - 50);
    ctx.fillText("Score: " + score, canvas.width / 3, canvas.height / 2);
    ctx.fillText("Click to Replay", canvas.width / 3, canvas.height / 2 + 50);
}

//1초에 60번 실행시키기
function frame(){
    animation = requestAnimationFrame(frame);
    timer++;

     // 걷는 모션 
     if (timer % 10 === 0) {
        dino.walkFrame = (dino.walkFrame + 1) % 2; // 0과 1을 반복
    }

    // 배경 이동
    backBgX -= 3; // x축으로 왼쪽 이동
    frontBgX -= 4;
    if (backBgX <= -canvas.width) { // 배경이 화면 끝까지 이동하면 초기화
        backBgX = 0;
    }
    if (frontBgX <= -canvas.width) { // 배경이 화면 끝까지 이동하면 초기화
        frontBgX = 0;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // 배경 그리기
    ctx.drawImage(backBgImage, backBgX, 0, canvas.width, canvas.height); // 뒷 배경
    ctx.drawImage(backBgImage, backBgX + canvas.width, 0, canvas.width, canvas.height);

    ctx.drawImage(frontBgImage, frontBgX, 0, canvas.width, canvas.height); // 앞 배경
    ctx.drawImage(frontBgImage, frontBgX + canvas.width, 0, canvas.width, canvas.height); // 이어지는 배경
    
    if(timer >= nextObstacleTime){
        let randomType = Math.random(); // 랜덤 값
        let type = randomType < 0.3 ? "small" : randomType < 0.6 ? "big" : "default"; // 30% small, 30% big, 40% default
        let obstacle;
        
        // 장애물 종류에 따라 랜덤으로 생성
        if (Math.random() < 0.5) {
            obstacle = new Obstacle(cactusSpeed, type); // 선인장
        } else {
            obstacle = new Bird(cactusSpeed); // 새
        }

        cactus_arr.push(obstacle); // 생성된 장애물 배열에 추가
        nextObstacleTime = timer + Math.floor(Math.random() * 200) + 30; 
    }

    //아이템
    if(timer >= nextShieldTime){
        shieldItem = new Item(cactusSpeed);
        nextShieldTime = timer + Math.floor(Math.random() * 600) + 1800; 
    }

    if(shieldItem) {
       shieldItem.x -= cactusSpeed;
        if(!gameOver) shieldItem.draw();

       if(crash(dino, shieldItem)){
            dino.isShield = true; 
            dino.shieldTime = 300; 
            shieldItem = null; //아이템 제거
       }

       //화면 밖으로 나가도 제거
       if(shieldItem && shieldItem.x < 0){
            shieldItem = null; //아이템 제거
       }
    }

    if(dino.isShield){
        dino.shieldTime--;
        if(dino.shieldTime <= 0){
            dino.isShield = false;
            dino.shieldTime = 0;
        }
    }

    cactus_arr.forEach((a, i, arr)=>{
        //x 좌표가 0 미만이면 제거
        if(a.x < 0) {
            arr.splice(i, 1);
        }
        a.x-=cactusSpeed;

        if (!dino.isShield && !gameOver && crash(dino, a)) {
            gameOverSound.play();
            cancelAnimationFrame(animation);
            gameOver = true; // 게임 종료
            gameOverScreen();
        }

        if (!gameOver) a.draw();
    })


    //점프 
    if(jump) {
        dino.y -= jump_speed;
        jump_speed -= gravity;  

        if(jump_speed <= 0) {
            jump = false; 
            jump_speed = 12;
        }
    } else { 
        if(dino.y < 200) {
            dino.y += (8 + gravity);
            dino.y = Math.min(200, dino.y); //더 아래로 내려가는 경우가 있어 고정.

            if (crouchRequested && !jump && !dino.isCrouching && dino.y >= 190) {
                dino.isCrouching = true;
                dino.height = 50; // 엎드린 높이
                dino.width = 70;
                dino.y = 220;
                crouchRequested = false; // 엎드리기 요청 초기화
            }
        } 
    }

    //점수 증가
    if(timer%10 === 0){
        score++;
    }
    
    if(!gameOver){
        ctx.fillStyle = "purple";
        ctx.font = "20px bitbit";
        ctx.fillText("Score: " + score, 10, 30);
    }

      // 장애물 속도 증가
    if (score % 100 === 0 && score > 0) {
        cactusSpeed += 0.2;
    }

    dino.draw();
}

//충돌 확인
function crash(dino, obstacle){
    return (dino.x < obstacle.x + obstacle.width &&
    dino.x + dino.width > obstacle.x &&
    dino.y < obstacle.y + obstacle.height &&
    dino.y + dino.height > obstacle.y);
}

// 키보드나 마우스 클릭으로 게임 시작
document.addEventListener('keydown', function (e) {
    if (e.code === 'Space' && !gameStarted) {
        startGame(); // 스페이스바로 게임 시작
    }
});

document.addEventListener('mousedown', function () {
    if (!gameStarted) {
        startGame(); // 마우스 클릭으로 게임 시작
    }
    if (gameOver) {
        //초기화
        score = 0;
        timer = 0;
        nextObstacleTime = Math.floor(Math.random() * 200) + 30;
        jump = false;
        jump_timer = 0;
        jump_speed = 12;
        cactus_arr = [];
        cactusSpeed = 5;
        dino.isShield = false;
        dino.shieldTime = 0;
        nextShieldTime = Math.floor(Math.random() * 600) + 300;
        gameStarted = false; 
        gameOver = false;
        //배경음악 다시 재생
        backBgSound.play(); 
        //게임 오버 후 재시작
        startGame(); 
    }
});


document.addEventListener('keydown', function(e){
    //dino.y >= 195은 더블 점프 방지
    if(e.code==='Space'){
        e.preventDefault(); // 기본 동작(스크롤) 방지
        if(dino.y >= 190 && !jump &&  (dino.isCrouching===false)){
            jump = true;
            jumpSound.play();
        }
    }
    
    if (e.code === 'ArrowDown') {
        e.preventDefault(); // 기본 동작(스크롤) 방지
        if(!jump && (dino.isCrouching===false) && dino.y >= 190){
            dino.isCrouching = true; // 엎드리기
            dino.height = 50; // 엎드린 높이로 줄이기
            dino.width = 70;
            dino.y=220;
        } else if (dino.y < 200) {
            crouchRequested = true; // 점프 중 착지 후 엎드리기 요청
        }
    }
})

// 좌클릭도 점프되게
document.addEventListener('mousedown', function (e) {
    // 클릭 위치가 캔버스 안에 있는지 확인
    let canvasRect = canvas.getBoundingClientRect(); // 캔버스의 실제 화면 내 위치
    let mouseX = e.clientX - canvasRect.left; // 마우스 클릭 위치 (캔버스 좌측 상단 기준)
    let mouseY = e.clientY - canvasRect.top; // 마우스 클릭 위치 (캔버스 상단 기준)

    // 클릭이 게임 화면 안에서 발생하면 점프
    if (mouseX >= 0 && mouseX <= canvasRect.width && mouseY >= 0 && mouseY <= canvasRect.height) {
        if (e.button === 0 && dino.y >= 190  && !jump && (dino.isCrouching===false)) { 
            jump = true;
            jumpSound.play();
        }
    }
});

document.addEventListener('keyup', function (e) {
    if (e.code === 'ArrowDown' &&  dino.y >= 210) {
        dino.isCrouching = false; // 엎드린 상태 해제
        dino.height = 60; // 기본 높이로 복구
        dino.width = 50;
        dino.y=200;
    }
});

// 버튼 클릭 시 점프, 엎드리기 처리
document.getElementById('jump_btn').addEventListener('click', function() {
    if (dino.y >= 190 && !jump &&  (dino.isCrouching===false)) {
        jump = true;
        jumpSound.play();
    }
});

document.getElementById('crouch_btn').addEventListener('mousedown', function() {
    if (!jump && (dino.isCrouching===false) && dino.y >= 190) {
        dino.isCrouching = true;
        dino.height = 50;
        dino.width = 70;
        dino.y = 220;
    }
});

document.getElementById('crouch_btn').addEventListener('mouseup', function() {
    if (dino.isCrouching && dino.y >= 200) {
        dino.isCrouching = false; // 엎드린 상태 해제
        dino.height = 60; // 기본 높이로 복구
        dino.width = 50;
        dino.y= 200;
    }
});

//음소거
let isMuted = false;

document.getElementById('mute_btn').addEventListener('click', function () {
    isMuted = !isMuted;
    if (isMuted) {
        backBgSound.muted = true;
        jumpSound.muted = true;
        shieldSound.muted = true;
        gameOverSound.muted = true;
        backBgSound.muted = true;
        this.textContent = "🔇 Unmute";
    } else {
        backBgSound.muted = false;
        jumpSound.muted = false;
        shieldSound.muted = false;
        gameOverSound.muted = false;
        backBgSound.muted = false;
        this.textContent = "🔊 Mute";
    }
});

if (!gameStarted) {
    gameStartScreen(); // 게임 시작 전 시작 화면 표시
}

//스코어 그래프
let scores = []; // 점수 배열
const maxScores = 10; // 최대 점수 저장 개수
let gameCount = 1; //1번부터 시작

// Chart.js 그래프 초기화
const score_ctx = document.getElementById('scoreChart').getContext('2d');

// 그레디언트 생성 함수
let width, height, gradient;
function getGradient(ctx, chartArea) {
    const chartWidth = chartArea.right - chartArea.left;
    const chartHeight = chartArea.bottom - chartArea.top;
    if (!gradient || width !== chartWidth || height !== chartHeight) {
        // 차트 크기에 맞는 새로운 그레디언트를 생성
        width = chartWidth;
        height = chartHeight;
        gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
        gradient.addColorStop(0, '#81d8d1'); // 노란색
        gradient.addColorStop(0.5, '#FA7000'); // 주황색
        gradient.addColorStop(1, '#f589ff'); // 보라색
    }
    return gradient;
}

const scoreChart = new Chart(score_ctx, {
    type: 'line',
    data: {
        labels: [], // x축: 점수 인덱스
        datasets: [{
            label: 'Scores',
            data: [], // y축: 점수 데이터
            backgroundColor: (context) => {
                const chartArea = context.chart.chartArea;
                if (!chartArea) {
                    // 그래프가 아직 초기화되지 않았으면 기본값 반환
                    return '#f589ff';
                }
                return getGradient(score_ctx, chartArea);
            },
            borderColor: function(ctx) {
                const chartArea = ctx.chart.chartArea;
                if (!chartArea) return; // chartArea가 초기화되지 않았다면 무시
                return getGradient(ctx.chart.ctx, chartArea);
              },
            borderWidth: 3
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: false
            }
        },
        plugins: {
            legend : {
                display : false
            }
        }
    }
});

// 점수 추가 및 업데이트 함수
function saveScore(newScore) {
    // 점수를 배열에 추가하고, 게임 번호를 순차적으로 증가시킴
    scores.push({ game: gameCount, score: newScore });
    gameCount++; // 게임 번호 증가

    if (scores.length > maxScores) {
        scores.shift(); // 오래된 점수 제거
    }
    updateChart(); //그래프 업데이트
    updateRankingBoard(); // 랭킹 보드 업데이트
}

// 그래프 업데이트
function updateChart() {
    // x축에 게임 번호 (게임1, 게임2, ...)
    scoreChart.data.labels = scores.map(score => `게임${score.game}`);
    
    // 점수 데이터를 y축에 반영
    scoreChart.data.datasets[0].data = scores.map(score => score.score);

    // 그래프를 업데이트
    scoreChart.update();
}

// 랭킹 보드 업데이트 함수
function updateRankingBoard() {
     // 랭킹 보드를 업데이트할 테이블 body
     const rankingTableBody = document.getElementById('rankingTable').getElementsByTagName('tbody')[0];

     // 기존 테이블 내용을 모두 삭제
     rankingTableBody.innerHTML = '';
 
     // 점수 배열을 내림차순으로 정렬
     const sortedScores = [...scores].sort((a, b) => b.score - a.score);
 
     // 최대 10개 점수만 표시
     sortedScores.slice(0, maxScores).forEach((score, index) => {
         const row = document.createElement('tr');
         const gameCell = document.createElement('td');
         const scoreCell = document.createElement('td');
 
         gameCell.textContent = `게임${score.game}`; // 순차적인 게임 번호
         scoreCell.textContent = score.score;
 
         row.appendChild(gameCell);
         row.appendChild(scoreCell);
         rankingTableBody.appendChild(row);
     });
}
