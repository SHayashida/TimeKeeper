let countdownTimeout; // カウントダウンを管理するための変数
let timeLeft; // 残り時間を管理する変数
let isPaused = false; // 一時停止状態を管理
let initialDuration; // 初期設定の時間を保持

document.getElementById('start-button').addEventListener('click', function() {
    // カウントダウンが進行中の場合、リセットする
    if (countdownTimeout) {
        clearTimeout(countdownTimeout);
    }

    const presentationTime = parseInt(document.getElementById('presentation-time').value) * 60; // 秒単位に変換
    timeLeft = presentationTime;
    initialDuration = presentationTime; // 初期時間を保存
    startCountdown(timeLeft);
    isPaused = false; // 再開後は一時停止状態をリセット
    document.getElementById('stop-button').textContent = "一時停止"; // ボタンのラベルをリセット
});

document.getElementById('stop-button').addEventListener('click', function() {
    if (isPaused) {
        // 一時停止状態ならカウントダウンを再開
        startCountdown(timeLeft);
        isPaused = false;
        document.getElementById('stop-button').textContent = "一時停止";
    } else {
        // 一時停止
        clearTimeout(countdownTimeout);
        isPaused = true;
        document.getElementById('stop-button').textContent = "再開";
    }
});

function startCountdown(duration) {
    timeLeft = duration; // カウントダウン開始時に残り時間をリセット

    function tick() {
        if (timeLeft >= 0) {
            updateDisplay(timeLeft);

            // 終了1分前、30秒前、終了時のベルを鳴らす
            if (timeLeft === 60) {
                playBell(1);  // 1分前に1回
            } else if (timeLeft === 30) {
                playBell(2);  // 30秒前に2回
            } else if (timeLeft === 0) {
                playBell(3);  // 終了時に3回
                showEndImage(); // 画像を表示
                startWaitCountdown(10); // 10秒間の待機カウントダウン開始
                return;  // カウントダウンを終了
            }

            timeLeft -= 1;
            countdownTimeout = setTimeout(tick, 1000);  // 1秒ごとにtickを再実行
        }
    }

    tick();
}

function showEndImage() {
    const imageContainer = document.getElementById('image-container');
    imageContainer.style.display = 'block';
    imageContainer.style.transition = 'opacity 1s';
    imageContainer.style.opacity = 1;

    setTimeout(() => {
        imageContainer.style.opacity = 0;
        setTimeout(() => {
            imageContainer.style.display = 'none';
        }, 1000); // 画像がフェードアウトするまで1秒待機
    }, 3000); // 画像が3秒間表示される
}

// 待機時間のカウントダウン（赤字表示）
function startWaitCountdown(waitTime) {
    function waitTick() {
        if (waitTime >= 0) {
            updateWaitDisplay(waitTime); // 赤字で残り時間を表示
            waitTime -= 1;
            countdownTimeout = setTimeout(waitTick, 1000);
        } else {
            startCountdown(initialDuration); // 待機時間が終わったら再度カウントダウン開始
        }
    }

    waitTick();
}

// 通常の残り時間表示
function updateDisplay(secondsLeft) {
    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;
    const timeElement = document.getElementById('time-left');
    timeElement.style.color = 'black';  // 通常は黒字
    timeElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// 待機時間の赤字表示
function updateWaitDisplay(secondsLeft) {
    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;
    const timeElement = document.getElementById('time-left');
    timeElement.style.color = 'red';  // 待機時間は赤字
    timeElement.textContent = `待機時間: ${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// ベルを鳴らす
function playBell(times) {
    const bell = new Audio('bell.mp3');  // 音声ファイルを指定
    let count = 0;

    // 1秒ごとにベルを鳴らす
    const intervalId = setInterval(() => {
        bell.play();
        count++;

        // 指定回数ベルを鳴らしたら停止
        if (count >= times) {
            clearInterval(intervalId);
        }
    }, 1000);  // 1秒ごとに鳴らす
}
