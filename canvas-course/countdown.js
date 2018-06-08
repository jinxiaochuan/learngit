var WIN_WID = 1024;
var WIN_HEI = 568;
var RADIUS = 8;
var MARGIN_LEFT = 30;
var MARGIN_TOP = 60;

const END_TIME = new Date(2018, 5, 7, 18, 57, 50);
var curTimeSeconds = 0;
var balls = [];
var colors = ['#33B5E5', '#0099CC', '#AA66CC', '#9933CC', '#99CC00', '#669900', '#FFBB33', '#FF8800', 'FF4444', 'CC0000']

window.onload = function() {
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');

    canvas.width = WIN_WID;
    canvas.height = WIN_HEI;
    curTimeSeconds = getCurrentTimeSeconds();

    setInterval(function(){
        render(context)
        update()
    },50)
}

function getCurrentTimeSeconds(){
    var curTime = new Date();
    var curHour = curTime.getHours();
    var curMinutes = curTime.getMinutes();
    var curSeconds = curTime.getSeconds();
    var ret = curHour*3600 + curMinutes*60 + curSeconds;
    return ret
    // var ret = END_TIME.getTime() - curTime.getTime();
    // ret = Math.round(ret/1000);
    // return ret < 0 ? 0 : ret
}

function render(cxt) {
    cxt.clearRect(0, 0, WIN_WID, WIN_HEI)
    var hours = parseInt(curTimeSeconds/3600);
    var minutes = parseInt((curTimeSeconds - hours*3600)/60);
    var seconds = parseInt(curTimeSeconds%60);

    renderDigit(MARGIN_LEFT, MARGIN_TOP, parseInt(hours/10), cxt)
    renderDigit(MARGIN_LEFT + 15*(RADIUS + 1), MARGIN_TOP, parseInt(hours%10), cxt)
    renderDigit(MARGIN_LEFT + 30*(RADIUS + 1), MARGIN_TOP, 10, cxt)
    renderDigit(MARGIN_LEFT + 39*(RADIUS + 1), MARGIN_TOP, parseInt(minutes/10), cxt)
    renderDigit(MARGIN_LEFT + 54*(RADIUS + 1), MARGIN_TOP, parseInt(minutes%10), cxt)
    renderDigit(MARGIN_LEFT + 69*(RADIUS + 1), MARGIN_TOP, 10, cxt)
    renderDigit(MARGIN_LEFT + 78*(RADIUS + 1), MARGIN_TOP, parseInt(seconds/10), cxt)
    renderDigit(MARGIN_LEFT + 93*(RADIUS + 1), MARGIN_TOP, parseInt(seconds%10), cxt)

    renderBalls(cxt);
}

function renderBalls(cxt) {
    for(var i = 0; i < balls.length; i++){
        var ball = balls[i];
        cxt.fillStyle = ball.color;
        cxt.beginPath();
        cxt.arc(ball.x, ball.y, RADIUS, 0, 2*Math.PI);
        cxt.closePath();
        cxt.fill();
    }
}

function update() {
    var nextTimeSeconds = getCurrentTimeSeconds();

    var nextHours = parseInt(nextTimeSeconds/3600);
    var nextMinutes = parseInt((nextTimeSeconds - nextHours*3600)/60);
    var nextSeconds = parseInt(nextTimeSeconds%60);

    var curHours = parseInt(curTimeSeconds/3600);
    var curMinutes = parseInt((curTimeSeconds - curHours*3600)/60);
    var curSeconds = parseInt(curTimeSeconds%60);

    // 确保时间间隔是1s - 因为setInterval的精度是50ms,一旦秒发生改变必定是此时间隔刚好为1s
    if(nextSeconds != curSeconds){
        if (parseInt(nextHours/10) != parseInt(curHours/10)) {
            addBalls(MARGIN_LEFT, MARGIN_TOP, parseInt(curHours/10))
        }

        if (parseInt(nextHours%10) != parseInt(curHours%10)) {
            addBalls(MARGIN_LEFT + 15*(RADIUS + 1), MARGIN_TOP, parseInt(curHours%10))
        }

        if (parseInt(nextMinutes/10) != parseInt(curMinutes/10)) {
            addBalls(MARGIN_LEFT + 39*(RADIUS + 1), MARGIN_TOP, parseInt(curMinutes/10))
        }

        if (parseInt(nextMinutes%10) != parseInt(curMinutes%10)) {
            addBalls(MARGIN_LEFT + 64*(RADIUS + 1), MARGIN_TOP, parseInt(curMinutes%10))
        }

        if (parseInt(nextSeconds/10) != parseInt(curSeconds/10)) {
            addBalls(MARGIN_LEFT + 78*(RADIUS + 1), MARGIN_TOP, parseInt(curSeconds/10))
        }

        if (parseInt(nextSeconds%10) != parseInt(curSeconds%10)) {
            addBalls(MARGIN_LEFT + 93*(RADIUS + 1), MARGIN_TOP, parseInt(curSeconds%10))
        }

        curTimeSeconds = nextTimeSeconds;
    }

    updateBalls()
}

function updateBalls(){
    for(var i = 0; i < balls.length; i++){
        var ball = balls[i];
        ball.x += ball.vx;
        ball.y += ball.vy;
        ball.vy += ball.g;
        if(ball.y >= WIN_HEI - RADIUS){
            ball.y = WIN_HEI - RADIUS;
            ball.vy = -ball.vy*0.75;
        }
    }
    console.log(balls.length);
    // 防止小球数量只增不减，将已离开屏幕的小球进行清除
    var cnt = 0;
    for(var i = 0; i < balls.length; i++){
        var ball = balls[i];
        if(ball.x + RADIUS > 0  && ball.x - RADIUS < WIN_WID){
            balls[cnt++] = ball;
        }
    }

    while (balls.length > cnt) {
        balls.pop();
    }
}

// 产生新的小球
function addBalls(x, y, num){
    for(var i = 0; i < digit[num].length; i++){
        for(var j = 0; j < digit[num][i].length; j++){
            if(digit[num][i][j] == 1){
                var ball = {
                    x: x + j*2*(RADIUS + 1) + (RADIUS + 1), // 生成小球的x坐标
                    y: y + i*2*(RADIUS + 1) + (RADIUS + 1), // 生成小球的y坐标
                    g: 1.5 + Math.random(), // 生成小球的重力速度
                    vx: Math.pow(-1, Math.ceil(Math.random()*1000))*4, // 生成小球的水平方向速度
                    vy: -5, // 生成小球的竖直方向速度
                    color: colors[Math.floor(Math.random()*colors.length)]
                }
                balls.push(ball)
            }
        }
    }
}

function renderDigit(x, y, num, cxt){
    cxt.fillStyle = 'rgb(0, 102, 153)';

    for(var i = 0; i < digit[num].length; i++){
        for(var j = 0; j < digit[num][i].length; j++){
            if(digit[num][i][j] == 1){
                cxt.beginPath();
                cxt.arc(x + (2*j + 1)*(RADIUS + 1), y + (2*i + 1)*(RADIUS + 1), RADIUS, 0, 2*Math.PI);
                cxt.closePath();
                cxt.fill()
            }

        }
    }
}
