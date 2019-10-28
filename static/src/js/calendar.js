$(document).ready(function() {
    console.log("ready");
    var calendarEl = document.getElementById('calendar');
        var calendar = new FullCalendar.Calendar(calendarEl, {
          plugins: [ 'dayGrid'],
          eventSources: [
            {
                events: [{
                    title: 'event hari ini',
                    start: '2019-10-27'
                  }]
            }
          ]
          
        });

        calendar.render();
});