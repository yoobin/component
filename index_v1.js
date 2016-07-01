/**
 * @description
 * 현재까지의 버전 2016.6.25 18:08
 * 추후 개선 사항, v2에서 추후 기능을 구현..
 * 0. 달력을 일치하기 랜더 O
 * 1. getMonth + 1문제 해결 1빼도 정상적인 숫자가 나오게.x
 * 2. 달력 태이블 상단에 <> 넣어 년도와 월을 이동x
 * 3. 해당 날짜를 선택할 경우 얼랏으로 현재 date 표시x
 * 4. 주말 구분 추가x
 * 5. 달력 template보다 강도 높게...x
 */

var component = {};

(function(){

	'use strict';

	/**
	 * @description
	 * 1. index.html에 위치에 상관없이 #caledner를 생성하여 사용
	 */

	component.DEFINETEMPLATE = {
		header : '',
		body : [
			'<tabel>',
				'<thead>',
					'<tr><th>Sun</th><th>Mon</th><th>Tues</th><th>Wednes</th><th>Thurs</th><th>Fri</th><th>Satur</th></tr>',
				'</thead>',
				'<tboday>',
					'<tr class="week">',
						'<td></td>',
						'<td></td>',
						'<td></td>',
						'<td></td>',
						'<td></td>',
						'<td></td>',
						'<td></td>',
					'</tr>',
				'</tbody>',
			'</table>'
		].join(''),
		footer : ''
	};

	component.TEMPLATE = {
		body :
			'<table>' +
			'<thead>' +
				'<tr>' +
			'       <th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th>' +
			'   </tr>' +
			'</thead>' +
			'<tbody>'
	};

	/**
	 * <button>전년도</button><button>이전달</button><h1>6월</h1><button>다음달</button><button>다음해</button>
	 * <table>
	 *     <thead>
	 *         <tr>
	 *             <th></th>
	 *             <th></th>
	 *         </tr>
	 *     </thead>
	 *     <tbody>
	 *         <tr>
	 *             <td></td>
	 *             <td></td>
	 *         </tr>
	 *         </tbody>
	 * </table>
	 */






	component.Calendar = function(options) {

		this.options = options;
		var self = this,
			currentDate = new Date(),
			currentLastDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, ''),
			weeks = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

		//현재 년도
		this.options.getCurrentYear = currentDate.getFullYear();
		//현재 월
		this.options.getCurrentMonth = currentDate.getMonth() + 1;
		//현재 일
		this.options.getCurrentTodate = currentDate.getDate();
		//현재 월 마지막 일
		this.options.getCurrentLastDate = currentLastDate.getDate();
		//현재 달의 시작 요일
		this.options.getFirstDay = weeks[(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)).getDay()];
		//현재 달의 시작 위치 일
		this.options.getFirstStartDay = (new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)).getDay();
		//현재 달의 마지막 요일
		this.options.getLastDay = weeks[(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentLastDate.getDate()).getDay())];
		//월의 row개수...
		this.options.getWeekRow = Math.ceil(((new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay())+currentLastDate.getDate())/7);
console.log(this.options);
		(function() {

			var calendarEl = document.getElementById(self.options.id),
				tempEl = "<h1>" +self.options.getCurrentMonth + "</h1>" + component.TEMPLATE.body,
				tempNum = 1,
				tempNum2 = 1;

			for(var i = 1; i <= self.options.getWeekRow; i++){
				tempEl += "<tr>";
				for(var k = 1; k <= 7; k++) {

					tempEl += "<td>";
					if((tempNum <= self.options.getFirstStartDay) || (tempNum2 > self.options.getCurrentLastDate)) {
						tempEl += "";
					} else {
						tempEl += tempNum2;
						tempNum2++;
					}
					tempNum++;


					tempEl += "</td>"
				}
				tempEl += "</tr>";
			}

			tempEl +="</tbody></table>";
			calendarEl.innerHTML = tempEl;
		})();

		return this;
	};

})();