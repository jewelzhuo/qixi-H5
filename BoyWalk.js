///////////////
////灯动画/////
//////////////
var lamp = {
	elem: $('.b_background'),
	bright: function() {
		this.elem.addClass('lamp-bright');
	},
	dark: function() {
		this.elem.removeClass('lamp-bright');
	}
};	

////门动画/////
function doorAction(left, right, time) {
	var doorLeft = $('.door-left');
	var doorRight = $('.door-right');
	var count = 2;
	var defer = $.Deferred();
	// 等待开门完成
	function complete() {					
		if (count == 1) {
			defer.resolve();
			return;
		};
		count--;
	};

	doorLeft.transition({
		'left': left
	}, time, complete);

	doorRight.transition({
		'left': right
	}, time, complete);

	return defer;
};

function openDoor() {
	return doorAction('-50%', '100%', 2000);
};

function shutDoor() {
	return doorAction('0%', '50%', 2000);
};

/**
 * [BoyWalk description]
 * @param {[type]} argument [description]
 */
function BoyWalk() {

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
	
	//===================动画处理============================ //

	//暂停走路
	function pauseWalk() {
		$boy.addClass('pauseWalk');
	};
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
			function() {
				dfdPlay.resolve(); // 动画完成
			}
		);
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

	let instanceX;
	//走进商店	
	function walkToShop(runTime) {
		restoreWalk();
		//设置异步
		let defer = $.Deferred();
		//门的坐标
		let doorObj = $('.door');
		let doorOffsetLeft = doorObj.offset().left;
		//男孩的坐标
		let boyOffsetLeft = $boy.offset().left;
		//当前需要移动的坐标
		instanceX = (doorOffsetLeft + doorObj.width() / 2) - (boyOffsetLeft + $boy.width() / 2);
		//开始走路
		let walkPlay = startRun({
			transform: `translateX(${instanceX}px),scale(0.3, 0.3)`,
			opacity: 0.1
		}, runTime);
		//走路完毕
		walkPlay.done(() => {
			$boy.css({
				opacity: 0
			});
			defer.resolve();
		});

		return defer;
	};

	//走出商店
	function walkOutShop(runTime) {
		restoreWalk();
		// 设置异步
		let defer = $.Deferred();
		//开始走路
		let walkPlay = startRun({
			transform: `translateX(${instanceX}px),scale(1, 1)`,
			opacity: 1
		}, runTime);
		//走路完毕
		walkPlay.done(() => {
			defer.resolve();
		});

		return defer;
	};

	function talkFlower(time) {
		let defer = $.Deferred();
		//增加延时等待效果
		setTimeout(() => {
			//取花
			$boy.addClass('slowFlolerWalk');
			defer.resolve();
		}, time);

		return defer;
	};

	return {
		// 开始走路
		walkTo: function(time, proportionX, proportionY) {
			var distX = calculateDist('x', proportionX);
			var distY = calculateDist('y', proportionY);
			return walkRun(time, distX, distY);
		},
		// 停止走路
		stopWalk: function() {
			pauseWalk();
		},

		setColor: function(value) {
			$boy.css('background-color', value);
		},
		// 走进商店
		toShop: function(time) {
			return walkToShop(time);
		},
		// 走出商店
		outShop: function(time) {
			return walkOutShop(time);
		},
		//取花
		talkFlower: function(time) {
			return talkFlower(time);
		}
	}
}