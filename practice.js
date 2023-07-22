var p = document.getElementById('text'); //テキストの表示領域
var explain = document.getElementById('explain'); //説明の表示領域
var explainLabel = document.getElementById('explain-label'); //説明のラベルを表す要素
var timerLabel = document.getElementById('timer');
var startTime;
var timerId;

const scoreLabel = document.getElementById('score'); //constで宣言することにより値の書き換えが起こらない
const missLabel = document.getElementById('miss');
const correctLabel = document.getElementById('correct');

let score = 0;  //初期化
let miss = 0;
let correct = 0;

var scoreSound = document.getElementById('scoresound'); // オーディオ要素の取得
var missSound = document.getElementById('misssound');
var nextSound = document.getElementById('nextsound');
var finishSound = document.getElementById('finishsound');

var checkTexts = [];

var textLists = [
    {
        text: 'int␣count␣=␣0;',
        explain: '整数型はintで宣言。countに0を代入',
        used: false
    },
    {
        text: 'boolean␣flag␣==␣true;',
        explain: '論理型はbooleanで宣言。flagに「真」を代入',
        used: false
    },
    {
        text: 'String␣name␣=␣"ABCDE";',
        explain: '文字列型はStringで宣言。nameにJohnを代入',
        used: false
    },
    {
        text: 'int␣score[]␣=␣new␣int[5];',
        explain: '長さ5の整数型配列scoreの宣言',
        used: false
    },

    {
        text: 'number[0]␣=␣10;',
        explain: '配列numberの最初の要素に値10を代入',
        used: false
    },
    {
        text: 'for(int␣i␣=␣0;␣i␣<␣10;␣i++)␣{',
        explain: 'for文。10回ループする処理',
        used: false
    },
    {
        text: 'while(count␣<␣5)␣{',
        explain: 'while文。countが5未満の間ループを繰り返す',
        used: false
    },
    {
        text: 'if␣(x␣>␣y)␣{',
        explain: 'if文。xがyより大きいなら処理を実行',
        used: false
    },
    {
        text: 'break;',
        explain: 'ループから抜け出す',
        used: false
    },
    {
        text: 'System.out.println("Hello␣World!");',
        explain: 'Hello World!と出力',
        used: false
    }
];

function startTimer() {
    startTime = Date.now();
    timerId = setInterval(updateTimer, 1000);
}

function updateTimer() {
    var elapsedTime = Date.now() - startTime;
    var seconds = Math.floor(elapsedTime / 1000);
    timerLabel.textContent = seconds.toString();
    var minutes = Math.floor(seconds / 60);  // 分数を計算
    seconds = seconds % 60;  // 60秒で割った余りが秒数

    var timeString = minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
    timerLabel.textContent = timeString;
}

function stopTimer() {
    clearInterval(timerId);
}

createText();

function createText() {
    var unusedTexts = textLists.filter(function (text) {
        return text.used === false;
    });

    if (unusedTexts.length === 0) {
        stopTimer();
        finishSound.onended = function () {
            showResult();
        };
        finishSound.play();
        return;
    }

    var randomIndex = Math.floor(Math.random() * unusedTexts.length);
    var selectedText = unusedTexts[randomIndex];

    selectedText.used = true; // 使用済

    p.textContent = ''; // テキストの表示領域をクリア
    explainLabel.textContent = ''; // 説明のラベルをクリア

    checkTexts = selectedText.text.split('').map(function (value) {
        var span = document.createElement('span');
        span.textContent = value;

        if (value === '␣') {
            span.classList.add('small-space');
        }

        p.appendChild(span);
        return span;
    });

    explainLabel.textContent = selectedText.explain; // 説明のラベルに設定

}

function showResult() {
    const total = score + miss;
    const correctPercentage = (score / total) * 100;
    const ansPercentage = correctPercentage.toFixed(2);
    const resultUrl = `result.html?timer=${timerLabel.textContent}&score=${score}&miss=${miss}&correct=${ansPercentage}`;  //ジェイクエリーを使用
    window.location.href = resultUrl;
}

window.addEventListener('keydown', e => {
    if (!timerId) { // タイマーがスタートしていない場合
        startTimer(); // タイマーをスタート
    }

    if (e.code === 'Space') {
        if (checkTexts[0].textContent !== '␣') {  //␣以外のところでスペースが押された時

            miss++;
            missLabel.textContent = miss;

            const total = score + miss;
            const correctPercentage = (score / total) * 100;
            correctLabel.textContent = correctPercentage.toFixed(2);  //小数点二桁で表示
            missSound.currentTime = 0; // タイピングミス時の音を巻き戻す
            missSound.play(); // タイピングミス時の音を再生
            return;
        }
    }

    else if (e.key !== checkTexts[0].textContent) {  // 正しくないキーが押された時
        if (e.key === 'Shift') return;

        miss++;
        missLabel.textContent = miss;

        const total = score + miss;
        const correctPercentage = (score / total) * 100;
        correctLabel.textContent = correctPercentage.toFixed(2);
        missSound.currentTime = 0; // タイピングミス時の音を巻き戻す
        missSound.play(); // タイピングミス時の音を再生
        return;
    }

    if (e.code === 'Space') {  //spaceが押されたときの色の変化
        checkTexts[0].className = 'add-blues';
    } else {
        checkTexts[0].className = 'add-blue';
    }

    score++;  //その他の場合はすべて正解
    scoreLabel.textContent = score;
    checkTexts.shift();

    if (checkTexts.length === 0) {  //最後の文字の時
        nextSound.play();
        createText();
    }


    const total = score + miss;
    const correctPercentage = (score / total) * 100;
    correctLabel.textContent = correctPercentage.toFixed(2);

    scoreSound.currentTime = 0; // タイピング時の音を巻き戻す
    scoreSound.play(); // タイピング時の音を再生

    e.preventDefault();  //スペースを押した時のスクロールを防止
});
