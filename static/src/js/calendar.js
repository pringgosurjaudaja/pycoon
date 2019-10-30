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

    // console.log(diff)
    // // console.log(end)
    // console.log(courses);

    var ev = []
    

    assessments.forEach(function(o) {
        console.log(o.start)
        var date = new Date(o.start);
        date.setHours(0)
        date.setMinutes(0);
        date.setSeconds(0);
        var col = courses.filter((el) => {
            return el.id == o.course_id
        });
        var e = {
            title: o.title,
            start: date,
            backgroundColor: col[0].color,
            borderColor: col[0].color 
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

            var col = courses.filter((el) => {
                return el.id == o.course_id
            });

            // console.log("HERE "+JSON.stringify(col))
            // var color = col[0].color;
            var e = {
                title: o.type,
                start: date,
                backgroundColor: col[0].color,
                borderColor: col[0].color 
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
                events: ev
            }
          ]
          
        });

        calendar.render();
    


    assessments.forEach(function(o) {
        var message = document.createElement('div');
        var color = courses.filter((el) => {
            return el.id == o.course_id
        })[0].color;
        
        message.setAttribute('class', 'ui message '+getColor(color));
        
        var close = document.createElement('i');
        close.setAttribute('class', 'close icon');
        close.setAttribute('id', o.id);

        message.appendChild(close);

        var comment = document.createElement('div');
        comment.setAttribute('class', 'comment');

        var content = document.createElement('div');
        content.setAttribute('class', 'content');

        var author = document.createElement('a');
        author.setAttribute('class', 'author');
        author.innerHTML = o.title;

        var meta = document.createElement('div');
        meta.setAttribute('class', 'metadata');

        var span = document.createElement('span');
        span.setAttribute('class', 'date');
        span.setAttribute('id', 'date');
        
        var text =  document.createElement('div');
        text.setAttribute('class', 'text');
        text.innerHTML = 'Description';

        meta.appendChild(span);
        content.appendChild(author);
        content.appendChild(meta);
        content.appendChild(text);
        comment.appendChild(content);
        message.appendChild(comment);
        $('#todo').append(message);


        // console.log("IOI "+getColor(color));
        

        $('#'+o.id).click(() => {
            fetch('/api/delete/assessment'+o.id);
            window.location.reload(true);
        })

        

    })
    var button = document.createElement('div');
    var label = document.createElement('label');
    label.innerText = 'Add new Assessment';
    button.setAttribute('class', 'ui fluid button teal');
    button.setAttribute('id', 'button');
    
    button.appendChild(label);
    $('#todo').append(button);
    $('#button').click(()=>{
        var url = new String(window.location);
        url = url.replace('/calendar', '');
        // console.log(url);
        window.location.href = url;
    })
});

function getColor(color) {
    if (color == "#ca3b33") {
        return "red";
    } else if (color == "#e27737") {
        return "orange";
    } else if (color == "#f2be43") {
        return "yellow";
    } else if (color == "#baca45") {
        return "olive";
    } else if (color == "#50b2ac") {
        return "teal";
    } else if (color == "#3f85ca") {
        return "blue";
    } else if (color == "#5c3dc2") {
        return "violet";
    } else if (color == "#9640c1") {
        return "purple";
    } else {
        return "pink";
    }
        
}