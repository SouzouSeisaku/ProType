const G = {
    read_file: document.getElementById("file"),    //選択したファイルを読み込む
    output_text: document.getElementById("output_text"),   //お手本を表示するテキストエリア
    input_text: document.getElementById("input_text"),     //入力するテキストエリア
    start: document.getElementById("start"),               //スタートボタン
    close: document.getElementById("close"),               //モーダルウィンドウを閉じるボタン
    modal: document.getElementById("modal"),               //モーダルウィンドウ
    mask: document.getElementById("mask"),                 //マスク(ウィンドウ部分)
    kekka: document.getElementById("kekka"),               //何行目が間違ってるか表示
    back: document.getElementById("back"),                 //メニュー画面に戻るボタン
    texts: "",                              //ファイルから読み込む文字列
    texts_array: [],                             //読み込んだ文字列を配列にする
    input_array: [],                              //入力した文字列を配列にする
    line: []                               //間違ってる行数を代入する配列
}


//ファイルを読み込んだら実行
function readFile(e) {
    const file = e.target.files[0];    //ファイル情報を代入
    const reader = new FileReader();   //インスタンス化
    reader.onload = function () {        //読み込み完了後にloadする
        const fileContents = reader.result;
        const replacedContents = fileContents.replace(/\r\n|\r/g, '\n').replace(/ /g, 'Δ');   //空白を△に置き換える
        G.texts = replacedContents;
    }
    reader.readAsText(file); //textFileをRead
}

//お手本エリアにファイルの内容を表示
function displayText() {
    G.input_text.value = "";        //入力欄を空欄にする
    G.output_text.value = G.texts;  //お手本エリアにファイルから読み込んだ文字列を表示
    G.texts_array = G.texts.split("\n");     //改行で1行ごとに区切って配列に代入する
    for (var j = 0; j < G.texts_array.length; j++) {
        G.texts_array[j] = G.texts_array[j].replace(/Δ/g, ' ');      //△を空白に置き換える
    }
}

//キーダウン処理
document.addEventListener('keydown', keypress_ivent);
function keypress_ivent(e) {
    if (e.ctrlKey && e.keyCode == 13) {   //CtrlキーとEnterキーが同時に押された場合
        keyEvent();
    }

    if (e.keyCode === 27) { // ESCキーが押された場合
        modal_display();
    }
}

//キーダウン処理が行われたら
function keyEvent(e) {
    G.input_array = G.input_text.value.split("\n");
    var k = 0;
    var kekka_list = '';

    for (var i = 0; i < G.input_array.length; i++) {       //ファイルの内容と入力内容の比較
        if (G.texts_array[i] !== G.input_array[i]) {
            G.line[k] = i + 1;
            kekka_list += '<li>' + G.line[k] + '行目</li>';
            k++;
        }
    }
    if (k == 0) {                                         //間違ってない場合
        output_text.value = "PERFECT!";
        input_text.value = "";
        setTimeout(() => {
            readFileFromInput(); // 3秒後に選択したファイルの内容を再表示する
        }, 3000);
    } else {                                              //間違ってた場合
        G.kekka.innerHTML = kekka_list;
        modal.classList.remove('hidden');               //モーダルウィンドウを表示する
        mask.classList.remove('hidden');                //背景を暗くする
    }
}

//お手本エリアにファイルの内容を再び表示
function readFileFromInput() {
    G.output_text.value = G.texts;
}

//モーダルウィンドウを閉じる
function modal_display() {
    modal.classList.add('hidden');
    mask.classList.add('hidden');
}

//メニュー画面に戻る
function back_title(e) {
    location = "file:../HTML/select.html";
}

G.start.onclick = displayText;
G.read_file.onchange = readFile;
G.close.onclick = modal_display;
G.back.onclick = back_title;
