
'use strict';

/**
 * calendar v2 mvc...
 *  createElement, innerHTML, appendChild...
 *  createElement = dom형태의 태그를 생성함
 *  appendChild = dom형태 태그를 append
 *  innerHTML = string html tag 존재하는경우 dom으로 변환하여 붙임
 *  innerText = string html tag 존재하더라도 dom으로 변환없이 붙임
 *
 */
var sui = {};
sui.component = {};
var Model = function(attributes) {

	this.attributes = attributes || {};

	if (attributes.collection) {
		this.collection = attributes.collection;
	}
};

var Collection = function(models) {
	this.models = [];
	this.add(models);
};

var eventBind = function(context) {
	var self = this;

	return function() {
		return self.apply(context);
	};
};

var View = function(attributes) {
	var self = this;
	this.model = attributes.model;
	this.tagName = attributes.tagName || 'div';

	for (var properties in attributes) {
		if ( !this.hasOwnProperty(properties) ) {
			this[properties] = attributes[properties];
		}

	}

	this.el = document.createElement(this.tagName);


	if (attributes.className) {
		this.el.setAttribute('class', attributes.className);
	}

	if (attributes.template) {
		this.el.innerHTML = attributes.template;
	}

	if (attributes.events) {
		var delegateEventSplitter = /^(\S+)\s*(.*)$/;
		///./g,''         : 특정문자 제거2 (,)

		//이벤트 등록하는 부분인데 따로 함수를 만들어서 빼야할듯... 보다 정교하게 개선해야함...
		for (var key in attributes.events) {
			var matched = key.match(delegateEventSplitter);

			var elClassName = this.el.getElementsByClassName(matched[2].replace('.',''));
			for (var i = 0; i < elClassName.length; i++) {

				var method = attributes[attributes.events[matched[0]]];
				elClassName[i].addEventListener(matched[1], eventBind.apply(method, [this]));

			}
		}
	}

};

Model.prototype = {
	set : function(attributes, value) {
		this.attributes[attributes] = value;
	},
	get : function(attributes) {
		return this.attributes[attributes];
	}
};

Collection.prototype = {
	add : function(models) {
		for(var i = 0; i < models.length; i++) {
			//console.log(models[i]);
			this.models.push(models[i]);
		}
	}
};

View.prototype = {

	//클로저
	//Array prototype bind apply
	//Function prototype bind apply
	//Array prototype slice call

	_bind : function(func, context) {

	}

};



sui.component.createCalendar = function(options) {

	this.el = document.getElementById(options.elementId);

	var date = new Date();



	var weeks = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	var model = new Model({
				options : options,
				year : date.getFullYear(),
				month : date.getMonth() + 1,
				today : date.getDate()

	});
	model.set('lastDate', (new Date(model.get('year'), model.get('month'), '')).getDate());
	model.set('weekRow', Math.ceil((model.get('lastDate') + date.getDay()) / 7));
	model.set('startDay', weeks[(new Date(model.get('year'), date.getMonth(), 1)).getDay()]);
	model.set('startDate', (new Date(model.get('year'), date.getMonth(), 1)).getDay());
	model.set('lastDay', weeks[(new Date(date.getFullYear(), date.getMonth(), model.get('lastDate'))).getDay()]);

	//console.log(model.attributes);




	var view = new View({
		model : model,
		tagName : 'div',
		className : 'container',
		template : '<button class="pre_year">전년도</button><button class="pre_month">이전달</button><h1 class="current_day">' + model.get('year') + '년' + model.get('month') +'월</h1><button class="next_month">다음달</button><button class="next_year">다음해</button>',
		tableTemplate :
						'<thead>' +
						'</thead>' +
						'<tbody>' +
						'</tbody>',
		events : {
			'click .pre_year' : 'preYear',
			'click .next_year' : 'nextYear',
			'click .next_month' : 'nextMonth',
			'click .pre_month' : 'preMonth'
		},
		preYear : function(e) {
			this.model.set('year', this.model.get('year') - 1 );
			this.calculation();
		},
		nextYear : function(e) {
			this.model.set('year', this.model.get('year') + 1 );
			this.calculation();
		},
		nextMonth : function() {

			if ( this.model.get('month') < 12 ) {
				this.model.set('month', this.model.get('month') + 1 );
			} else {
				this.model.set('month', 1 );
			}
			this.calculation();
		},
		preMonth : function() {

			if ( this.model.get('month') > 1) {
				this.model.set('month', this.model.get('month') - 1 );
			} else {
				this.model.set('month', 12 );
			}
			this.calculation();
		},
		dayRender : function(e) {

			for ( var i = 0; i < this.el.childNodes.length; i++ ) {
				if ( this.el.childNodes[i].getAttribute('class') === 'current_day') {
					this.el.childNodes[i].innerText = model.get('year') + '년' + model.get('month') + '월';
				}
			}


			////날짜 관련 랜더....나머진 내일 와서 랜더링 해보자..
			if ( !document.getElementsByTagName('table').length ) {
				var elTable = document.createElement('table');

				elTable.innerHTML = this.tableTemplate;

				for (var k = 0; k < elTable.childNodes.length; k++) {


					if (elTable.childNodes[k].tagName.toLowerCase() === 'thead') {

						var elTr = document.createElement('tr');

						for (var w = 0; w < weeks.length; w++) {
							var elTh = document.createElement('th');
							elTh.innerText = weeks[w];
							elTr.appendChild(elTh);
						}
						elTable.childNodes[k].appendChild(elTr);

					} else if (elTable.childNodes[k].tagName.toLowerCase() === 'tbody') {
						console.log("!!!" + elTable.constructor.name);
						this.dateTimeRender(elTable.childNodes[k]);
						//이곳에서 1~30일까지의 기간을 넣음
						//console.log(elTable.childNodes[k]);
						//console.log(this.model.get('weekRow'));
					}

				}

				this.el.appendChild(elTable);
			} else {
				this.dateTimeRender()
			}

		},
		dateTimeRender : function(elTbody) {

			if ( !elTbody ) {
				var elTbody = document.getElementsByTagName('tbody');
				elTbody = elTbody[0];
			}






			if ( elTbody.children.length ) {
				elTbody.remove();
				elTbody = document.createElement('tbody');
				var elTable = document.getElementsByTagName('table');

				elTable[0].appendChild(elTbody);

			}

			var startDateCount = 0;
			var dateCount = 1;

			for ( var i = 0; i < this.model.get('weekRow'); i++) {
				var elTr = document.createElement('tr');
				for ( var k = 0; k < 7; k++ ) {
					if ( (startDateCount < this.model.get('startDate')) || (dateCount > this.model.get('lastDate')) ) {
						var elTd = document.createElement('td');
						elTd.innerText = '';
						elTr.appendChild(elTd);
						elTbody.appendChild(elTr);
					} else {
						var elTd = document.createElement('td');
						elTd.innerText = dateCount;
						elTr.appendChild(elTd);
						elTbody.appendChild(elTr);
						dateCount++;
					}
					startDateCount++;

				}
			}


		},
		calculation : function() {

			model.set('lastDate', (new Date(model.get('year'), model.get('month'), '')).getDate());
			model.set('weekRow', Math.ceil( (model.get('lastDate') + (new Date(model.get('year'), model.get('month') - 1, 1)).getDay() ) / 7));
			model.set('startDate', (new Date(model.get('year'), model.get('month') - 1, 1)).getDay());
			model.set('startDay', weeks[(new Date(model.get('year'), model.get('month') - 1, 1)).getDay()]);
			model.set('lastDay', weeks[(new Date(date.getFullYear(), model.get('month') - 1, model.get('lastDate'))).getDay()]);

			//lastDay 한달의 마지막 요일
			//weekRow 한달의 주 횟수
			//startDay 한달의 시작 요일
			//lastDate 한달의 마지막 일수

			//달력에 뿌릴때 빈숫자 넣는거
			//console.log(model.get('startDate'));
			//달력에 본문 데이터 숫자 넣기1~lastDate..
			//console.log(model.get('lastDate'));



			this.dayRender();






		}
	});
	view.dayRender();




	this.el.appendChild(view.el);
};