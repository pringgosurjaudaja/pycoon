$(document).ready(function() {
    console.log("ready");
    // console.log(assessments);
    // console.log(classes);
    // console.log(terms)
    const start_date = new Date(terms[0].start_date);
    const start = Date.parse(terms[0].start_date);
    const end = Date.parse(terms[0].end_date);
    var diff = end-start;
    diff = Math.ceil(diff / (1000 * 60 * 60 * 24 * 7));

    console.log(diff)
    // console.log(end)

    var ev = []
    

    assessments.forEach(function(o) {
        console.log(o.start)
        var date = new Date(o.start);
        date.setHours(0)
        date.setMinutes(0);
        date.setSeconds(0);
        var e = {
            title: o.title,
            start: date
        }
        ev.push(e);
    });
    classes.forEach(function(o) {

        var days = o.day;
        var pieces = o.time.toString().split(":");
        var hour, minute, second;
        hours = parseInt(pieces[0], 10);
        minutes = parseInt(pieces[1], 10);
        seconds = parseInt(pieces[2], 10);

        // console.log(class_time);
        // console.log("HERE "+days)
        for (var n = 1 ; n<=days; ++n) {
            
            var date = new Date(start_date.getTime() + (n*86400000*7));
            date.setHours(+hours)
            date.setMinutes(minutes);
            date.setSeconds(seconds);
            var e = {
                title: o.type,
                start: date
            }
            ev.push(e)
        }
        
    });
    console.log(ev)
    var calendarEl = document.getElementById('calendar');
        var calendar = new FullCalendar.Calendar(calendarEl, {
          plugins: [ 'dayGrid'],
          eventSources: [
            {
                // events: [{
                //     title: 'event hari ini',
                //     start: '2019-10-27'
                //   }]
                events: ev
            }
          ]
          
        });

        calendar.render();

    assessments.forEach(function(e) {
        $('#'+e.id).click(() => {
            fetch('/api/delete/assessment'+e.id);
            window.location.reload(true);
        })
    })
});