var yinState = 0;
function showYinFunc() {
	if(yinState == 0) {
		$('#yinImg').attr('src', '/images/yinzhangpost.jpg');
		$('#yinDiscription').html('Scan the QR code to follow her WeChat subscription. She\'s a great beauty you\'ll never know enough about');
		yinState = 1;
	}
	else {
		$('#yinImg').attr('src', '/images/yinzhang.jpg');
		$('#yinDiscription').html('Ph.D. candidate in the School of Architecture, Tsinghua Unviersity.');
		yinState = 0;
	}
}