$(document).ready(function() {
    const videoContainer = $('#video-container');
    const btnWin = $('#btn-win');
    const btnLose = $('#btn-lose');
    let money = 0;

    const playVideo = (videoSrc, moneyChange) => {
        // 現在のコンテンツをクリア
        videoContainer.empty();

        // 動画要素をJQueryオブジェクトとして作成
        const video = $('<video>', {
            src: videoSrc,
            autoplay: true,
            muted: true,
            playsInline: true
        });

        // コントロールバーを非表示にし、再生・一時停止を不可にする
        video.prop('controls', false)
              .prop('disablePictureInPicture', true)
              .removeAttr('controls');
        video[0].oncontextmenu = () => false;

        // まずDOMに動画要素を追加
        videoContainer.append(video);

        // 動画の読み込みが完了したら再生を試みる
        video.on('canplaythrough', function() {
            console.log('動画の再生準備ができました');
            this.play().catch(error => {
                console.error('動画の再生に失敗しました:', error);
            });
        });

        // 動画再生終了後の処理
        video.on('ended', function() {
            money += moneyChange;
            window.location.href = `next.html?money=${money}`;
        });

    };

    // 「A」ボタンのクリックイベント
    btnWin.on('click', () => {
        playVideo('movie/test.mp4', 1000);
    });

    // 「B」ボタンのクリックイベント
    btnLose.on('click', () => {
        playVideo('movie/test2.mp4', -1000);
    });
});