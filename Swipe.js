//页面滑动

/**
 * [Swipe description]
 * @param {[type]} container [页面容器节点]
 * @return {[type]} swipe
 */
function Swipe(container) {
	//滑动对象
	var swipe = {};

	var element = container.find(':first');

	var slides = element.find('>');

	var width = container.width();
	var height = container.height();

	element.css({
		width: (slides.length * width) + 'px',
		height: height +'px'
	});
	//设置每一个页面li的宽度
	$.each(slides, index => {
		var slide = slides.eq(index);
		slide.css({
			width: width + 'px',
			height: height + 'px'
		});
	});
	
	//监控完成与移动
	swipe.scrollTo = (x, speed) => {
		//执行动画移动
		element.css({
			'transition-timing-function': 'linear',
			'transition-duration'		: speed + 'ms',
			'transform'					: 'translate3d(-' + x + 'px, 0px, 0px)'
		});
		return this;
	};

	return swipe;
};