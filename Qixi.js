var container = $('#content');
// 页面可视区域
var visualWidth = container.width();
var visualHeight = container.height();

var swipe = Swipe($('#content'));
//获取数据
var getValue = function(className) {
	var $elem = $('' + className + '');
	// 走路的路线坐标
	return {
		height: $elem.height(),
		top: $elem.position().top
	};
};

//路的Y轴
var pathY = function() {
	var data = getValue('.a_background_middle');
	return data.top + data.height / 2;
}();

var $boy = $('#boy');
var boyHeight = $boy.height();

// 修正小男孩的正确位置
// 路的中间位置减去小孩的高度，25是一个修正值
$boy.css({
	top: pathY - boyHeight + 25
});

////////////////////////////////////////////////////////
//===================动画处理============================ //
////////////////////////////////////////////////////////
// 恢复走路
function restoreWalk() {
	$boy.removeClass('pauseWalk');
};
// css3的动作变化
function slowWalk() {
	$boy.addClass('slowWalk');
};
// 计算移动距离
function calculateDist(direction, proportion) {
	return (direction == 'x' ? visualWidth : visualHeight) * proportion
};
// 用transition做运动
function startRun(options, runTime) {
	var dfdPlay = $.Deferred();
	restoreWalk();
	// 运动的属性
	$boy.transition(
		options,
		runTime,
		'linear',
		() => {});
	return dfdPlay;
};
//开始走路
function walkRun(time, distX, distY) {
	time = time || 3000;
	// 脚动作
	slowWalk();
	// 开始走路
	var dl = startRun({
		'left': distX + 'px',
		'top': distY ? distY : undefined
	}, time);
	return dl;
};