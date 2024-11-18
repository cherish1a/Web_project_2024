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
var dino = {
    x : 100,
    y : 200,
    width : 60,
    height : 70,
    speed: 5,
    isCrouching:false,
    walkFrame: 0,
    draw(){
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
let jump = false;
let jump_timer = 0;
let cactus_arr = [];
let cactusSpeed = 5;
let animation;
let gameStarted = false; // 게임 시작 여부
let gameOver = false; //게임 끝 여부

let nextObstacleTime = Math.floor(Math.random() * 200) + 20;

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
    frame(); // 게임 루프 시작
}

// 게임 종료 화면 그리기
function gameOverScreen() {
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

    cactus_arr.forEach((a, i, arr)=>{
        //x 좌표가 0 미만이면 제거
        if(a.x < 0) {
            arr.splice(i, 1);
        }
        a.x-=cactusSpeed;

        if (!gameOver && crash(dino, a)) {
            cancelAnimationFrame(animation);
            gameOver = true; // 게임 종료
            gameOverScreen();
        }

        if (!gameOver) a.draw();
    })


    //점프 기능
    if(jump){
        dino.y -= 9;
        jump_timer++;

        if(jump_timer > 20){
            jump = false;
            jump_timer = 0;
        }

    } else {
        if(dino.y < 200) {
            dino.y += 9;
        }
    }

    //점수 증가
    if(timer%10 === 0){
        score++;
    }

    ctx.fillStyle = "purple";
    ctx.font = "20px bitbit";
    ctx.fillText("Score: " + score, 10, 30);

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
        cactus_arr = [];
        cactusSpeed = 5;
        gameStarted = false; 
        gameOver = false;
        //게임 오버 후 재시작
        startGame(); 
    }
});


document.addEventListener('keydown', function(e){
    //dino.y >= 195은 더블 점프 방지
    if(e.code === 'Space' && dino.y >= 190 && !jump){
        jump = true;
    } 
    
    if (e.code === 'ArrowDown') {
        if(!jump && !dino.isCrouching && dino.y >= 190){
            dino.isCrouching = true; // 엎드리기
            dino.height = 50; // 엎드린 높이로 줄이기
            dino.width = 70;
            dino.y=220;
        }
    }
})

// 좌클릭도 점프되게
document.addEventListener('mousedown', function (e) {
    if (e.button === 0 && dino.y >= 190  && !jump) { 
        jump = true;
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

if (!gameStarted) {
    gameStartScreen(); // 게임 시작 전 시작 화면 표시
}
