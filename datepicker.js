var Calendar = {
  currentDate:  new Date(),

  el: $('#calendar'),

  allMonths: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ],

  dayOfWeek:  [
    "Su",
    "Mo",
    "Tu",
    "We",
    "Th",
    "Fr",
    "Sa"
  ],

  monthDays: {
    'January': 31,
    'February': 28,
    'March': 31,
    'April': 30,
    'May': 31,
    'June': 30,
    'July': 31,
    'August': 31,
    'September': 30,
    'October': 31,
    'November': 30,
    'December': 31
  },

  getMonthName: function(id){
    return this.allMonths[id];
  },

  getCurrentMonth: function(){
    return this.getMonthName(this.currentDate.getMonth());
  },

  getCurrentYear: function(){
    return this.currentDate.getFullYear();
  },

  getMonthDays: function(year, month){
    //leap-year
    var isLeapYear = false;
    if ((year % 4 == 0 && year % 100 !== 0) || (year% 400 == 0)) {
        isLeapYear = true;
    };

    // Feb year condition
    if (month == 1){
       var febDays = this.monthDays[this.getMonthName(month)];
       return isLeapYear ? febDays + 1 : febDays;
    }//end
    else {
      return this.monthDays[this.getMonthName(month)];
    };

  },

  getDayIndex: function(year, month, date) {
    var date = new Date(year=year, month=month, date=date);
    return date.getDay();
  },

  getCurrentDate: function() {
    var d = this.currentDate;
    var d_month = parseInt(d.getMonth()) + 1;
    return this.getCurrentYear() + "-" + d_month + "-" +  d.getDay();
    }
  };

  var CalendarVeiw = {
  cal: Calendar,

  todayButton: "<button>today</button>",

  initialize: function(){
    var currentDate = this.cal.currentDate;
    return this.renderMonthContainer(currentDate.getFullYear(), currentDate.getMonth());
  },

  renderMonthContainer: function(year, month) {

    //render header and names of days
    var header = "<header class=\"header\"><i class=\"arrow-left\" data-action=\"decr\"></i><h2 data-year=\"" + year + "\" data-month=\""+ month +"\">" + this.cal.getMonthName(month) + " " + year + "</h2><i class=\"arrow-right\" data-action=\"incr\"></i></header>";
    
    var weekDayNames = [];
    $.each(this.cal.dayOfWeek, function(key, value){
        var dayNameCell = "<span class=\"day-name\">" + value + "</span>";
        weekDayNames.push(dayNameCell);
    });
    var weekDayNamesHtml = "<div class=\"week\">" + weekDayNames.join(' ') + "</div>";
     
    //render days
    var daysInMonth = this.cal.getMonthDays(year, month);
    var firstDayIndex = this.cal.getDayIndex(year, month, 1);
    var lastDayIndex = this.cal.getDayIndex(year, month, this.cal.getMonthDays(month))
     
    var days = [];
    for (var i = 1; i<daysInMonth+1; i++) {
      days.push(i);
    };
    if (firstDayIndex != 0) {
      for (var i = 0; i<firstDayIndex; i++) {
        days.unshift('');
      }
    }

    var dayCells = [];
    $.each(days, function(key, value) {
      if (!value) {
        var dayCell = "<span></span>";
      }
      else {
        var dayCell = "<span data-day-id=\""+ value +"\">" + value + "</span>";
      }
      dayCells.push(dayCell);
    });

    var dayCellsHTML = "<div class=\"content\">" + dayCells.join('') + "</div>";
    var monthContainer = "<div class=\"days box\">" + header + weekDayNamesHtml + dayCellsHTML + this.todayButton + "</div>";
    $('#calendar').html("").append(monthContainer).show();
  },

  renderYearMonths: function(year) {
    var header = "<header class=\"header\"><i data-year-view class=\"arrow-left\" data-action=\"decr\"></i><h2 data-year=\""+year+"\">" + year + "</h2><i data-year-view class=\"arrow-right\" data-action=\"inrc\"></i></header>";
    var innerMonths = [];
    $.each(this.cal.allMonths, function(key, value){
       var  monthCell = "<span data-month-id=\""+ key +"\">" + value.slice(0, 3) + "</span>";
       innerMonths.push(monthCell);
    });
    var innerMonthsHtml = "<div class=\"content\">" + innerMonths.join('') + "</div>";
    var monthsContainerHTML = "<div class=\"box months\">"+header+innerMonthsHtml+this.todayButton+"</div>"
    $('#calendar').html('').append(monthsContainerHTML).show();

  },

  renderYears: function(startYear, endYear) {
    var header = "<header class=\"header\"><i data-years class=\"arrow-left\" data-action=\"decr\"></i><h2 data-startyear=\""+startYear+"\"  data-endyear=\""+ endYear +"\">" + startYear+"-"+ endYear+ "</h2><i data-years class=\"arrow-right\" data-action=\"inrc\"></i></header>";
    var years = Array();
    for (var i = startYear; i <= endYear; i++){
      years.push(i);
    }
    var innerYears = [];
    $.each(years, function(key, value){
       var  yearCell = "<span data-year=\""+ value +"\">" + value + "</span>";
       innerYears.push(yearCell);
    });
    var innerYearsHtml = "<div class=\"content\">" + innerYears.join('') + "</div>";
    var yearsContainerHTML = "<div class=\"box years\">"+header+innerYearsHtml+this.todayButton+"</div>"
    $('#calendar').html('').append(yearsContainerHTML).show();
  },


};

var CalendarEvents = {
  view: CalendarVeiw,
  selectDate: function() {  
    $('span[data-day-id]').live('click', function(){
      var header = $(this).parents('#calendar').find('h2');
      var year =  header.data('year');
      var month = parseInt(header.data('month'))+1;
      var date = $(this).data('day-id');

      $('input').val(year + '-' + month + '-' + date);
    });
  },

  changeMonthArrow: function() {
    $('.days i[data-action]').live('click', function() {
      var action = $(this).data('action');
      var header = $(this).parent().find('h2');
      var year = parseInt(header.data('year'));
      var month = parseInt(header.data('month'));

      //switch to next/prev year
      switch(action) {
        case "incr":
          if (month==11) {
            CalendarEvents.view.renderMonthContainer(year+1, 0);
          } else {
            CalendarEvents.view.renderMonthContainer(year, month+1);
          }
          break;
        case "decr":
          if (month==0) {
            CalendarEvents.view.renderMonthContainer(year-1, 11);
          } else {
            CalendarEvents.view.renderMonthContainer(year, month-1);
          }
          break;
      }     
    })
  },

  selectMonth: function(){
    $('span[data-month-id]').live('click', function(){
      var header = $(this).parents('#calendar').find('h2');
      var year = parseInt(header.data('year'));
      var month = parseInt($(this).data('month-id'));
      CalendarVeiw.renderMonthContainer(year, month);
    });
  },
  selectCurrentDate: function(){
    $('.box button').live('click', function(){
       $('input').val(Calendar.getCurrentDate());
    });
  },
  showYearMonths: function(){
    $('.days h2, .box.years span[data-year]').live('click', function(){
      $('#calendar').html('');
      CalendarVeiw.renderYearMonths($(this).data('year'));
    });
  },

  changeYearArrow: function(){
    $('i[data-year-view]').live('click', function(){
       var year = parseInt($(this).siblings('h2').text());
       var action = $(this).data('action');
       if (action == 'decr') {
        year -= 1;
       }
       else {
        year += 1;
       }
       CalendarVeiw.renderYearMonths(year);
    });
  },

  closeWidgetByKeypress: function(){
      if (Calendar.el.css('display') != 'none') {
        $(document).keyup(function(e){
          if (e.keyCode == 27) {Calendar.el.hide()}
        });
      }
  },
  showYearsBlock: function(){
    $('h2[data-year]:not([data-month])').live('click', function(){
      var current_year = Calendar.getCurrentYear();
      var this_year = current_year % 20;
      var startYear;
      var endYear;
      if (this_year == 0){
        endYear = current_year + 19;
        startYear = current_year;
      }
      else {
        startYear = current_year - this_year;
        endYear = current_year + 19 - this_year;
      }

      CalendarVeiw.renderYears(startYear, endYear);
    });
  },
  changeYearsBlockArrow: function(){
    $('i[data-years]').live('click', function(){
       var startYear = parseInt($(this).siblings('h2').data('startyear'));
       var endYear = parseInt($(this).siblings('h2').data('endyear'));
       var action = $(this).data('action');
       if (action == 'decr') {
        endYear = startYear - 1;
        startYear = endYear - 19;
       }
       else {
         startYear = endYear + 1;
         endYear = endYear + 20;
       }
       CalendarVeiw.renderYears(startYear, endYear);
    });
  }

};
//should be new Calendar(el)
  $('*[data-calendar-icon]').click(function(){
  CalendarVeiw.initialize();
  CalendarEvents.selectCurrentDate();
  CalendarEvents.selectDate();
  CalendarEvents.changeMonthArrow();
  CalendarEvents.showYearMonths();
  CalendarEvents.selectMonth();
  CalendarEvents.changeYearArrow();
  CalendarEvents.closeWidgetByKeypress();
  CalendarEvents.showYearsBlock();
  CalendarEvents.changeYearsBlockArrow();
  });
