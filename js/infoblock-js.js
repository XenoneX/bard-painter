var TimeToFade = 1000.0 ;

param.infoblock.handler = {
		fade   : '',
		render : '',
		scroll : ''
}
param.infoblock.scroll = function(arg) {
		
		clearTimeout(param.infoblock.handler.scroll);
		var _last_rand = '',
			_handler = null,
			_scroll = function() {
						var _random = Math.floor(Math.random() * scrollText.length)+1;
						if (_last_rand == _random) {
								while(_last_rand == _random) { _random = Math.floor(Math.random() * scrollText.length)+1; }
						}
			
						scrollMsg(scrollText[_random-1]);
						_last_rand = _random;
						param.infoblock.handler.scroll = setTimeout(_scroll, 10000);
			};
		
		param.infoblock.handler.scroll = setTimeout(_scroll, 300);
};
param.infoblock.start = function(txt) {
		isset();
}

param.infoblock.hide = function(txt) {
		renderMsg(txt);
}
function isset() {
	var _obj = document.getElementById(param.infoblockId);
	
	if(_obj) {
		return _obj;
	}
	else {
		return draw();
	}
	
}

function draw() {
	var _obj = document.createElement('div');
		_obj.id  = param.infoblockId;
		_obj.style.height = param.infoHeight+'px';
		_obj.style.top = '-6px';
		_obj.innerHTML =  '<div class="infoBody"><span id="infoText"></span><a href="#" style="display:none;" onClick="test();return false;">tst click</a></div>';
	
		document.getElementById(param.parentId).appendChild(_obj);
		
	return document.getElementById(param.infoblockId);
}

function renderMsg(txt) {
	var _txt = infoText[txt] || txt;
	var _obj = document.getElementById('infoText');
		_obj.innerHTML = '';
		_obj.appendChild(document.createTextNode(_txt.text));
		_obj.style.color = _txt.type == 'error' ? '#FF320A' : '#FFFFFF';
		_obj.style.opacity = 1;
	
	if(param.infoblock.handler.render) {
		clearTimeout(param.infoblock.handler.render);
		clearTimeout(param.infoblock.handler.fade);
	}
	
	param.infoblock.handler.render = setTimeout(function(){fade('infoText')}, 3000);
	
}
function scrollMsg(txt, time) {
	var _obj = document.getElementById('infoText');
		_obj.innerHTML = '';
		_obj.appendChild(document.createTextNode(txt));
		_obj.style.color ='#FFFFFF';
}
var scrollText = [
				'Вы можете задать длину стороны, просто набрав необходимую цифру на клавиатуре',
				'Для удаления точки, нажмите быстро на нее два раза',
				'Подсказка номер 3 ',
				'Подсказка номер 4 ',
				'Подсказка номер 5 '
];
var infoText = {
	crossing      : { 
						text : 'Обнаружено пересечение прямых. Для продолжения исправьте ошибку и нажмите на кнопку "Завершить"'
						,type : 'error'
	}
	,first_point  : {
						text : 'Начните набирать длину стороны, чтобы нарисовать линию в выбранном направлении'
						,type : 'info'
	}
	,start        : {
						text : 'Кликните в любое место поля чтобы поставить первую точку'
						,type : 'info'
	}
};

function animateFade(lastTick, eid)
{  
  var curTick = new Date().getTime();
  var elapsedTicks = curTick - lastTick;
  
  var element = document.getElementById(eid);
 
  if (element.FadeTimeLeft <= elapsedTicks)
	 {
		element.style.opacity = element.FadeState == 1 ? '1' : '0';
		element.style.filter = 'alpha(opacity = ' + (element.FadeState == 1 ? '100' : '0') + ')';
		element.FadeState = element.FadeState == 1 ? 2 : -2;
		return;
	 }
 
  element.FadeTimeLeft -= elapsedTicks;
  var newOpVal = element.FadeTimeLeft/TimeToFade;
  if (element.FadeState == 1)
		newOpVal = 1 - newOpVal;

  element.style.opacity = newOpVal;
  element.style.filter = 'alpha(opacity = ' + (newOpVal*100) + ')';
  
  param.infoblock.handler.fade = setTimeout(function(){animateFade(curTick,eid)}, 33);
}

function fade(eid) {
	var element = document.getElementById(eid);
	
	element.FadeState = -1;
	element.FadeTimeLeft = TimeToFade;
	
	param.infoblock.handler.fade = setTimeout(function(){animateFade(new Date().getTime(),eid)}, 33);
}