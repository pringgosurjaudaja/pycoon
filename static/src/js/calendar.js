$(document).ready(function() {
    $('#back').click(()=> {
        var str = new String(window.location.href);
        str = str.replace('/calendar','');
        window.location.href = str;
    })
    console.log("ready");
    
    let start_date = new Date(terms[0].start_date);
    
    var day_of_week = start_date.getDay();
    
    // Rounding down the date to the nearest monday
    if(start_date.getDay() != 1) {
        start_date = new Date(start_date.setDate(start_date.getDate() - day_of_week));
    }

    
    const start = Date.parse(terms[0].start_date);
    const end = Date.parse(terms[0].end_date);
    var diff = end-start;
    diff = Math.ceil(diff / (1000 * 60 * 60 * 24 * 7));


    var ev = []

    assessments.forEach(function(o) {
        var date = new Date(o.start);
        var pieces = o.due_time.toString().split(":");
        var hour, minute, second;
        hours = parseInt(pieces[0], 10);
        minutes = parseInt(pieces[1], 10);
        seconds = parseInt(pieces[2], 10);

        date.setHours(hours)
        date.setMinutes(minutes);
        date.setSeconds(seconds);

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


    // =============== Recurring classes ================= //
    classes.forEach(function(o) {

        var days = getDay(o.day)-1;
        
        var weeks = o.weeks.split(',').map(Number);
        var pieces = o.time.toString().split(":");
        var hour, minute, second;
        hours = parseInt(pieces[0], 10);
        minutes = parseInt(pieces[1], 10);
        seconds = parseInt(pieces[2], 10);


        for (var n in weeks) {
            // n returns the index
            // weeks[n] returns the correct value
            var date = new Date(start_date.getTime()+ ((weeks[n]-1)*7*86400000));
            
            date.setDate(date.getDate()+days);
            date.setHours(+hours)
            date.setMinutes(minutes);
            date.setSeconds(seconds);
            var col = courses.filter((el) => {
                return el.id == o.course_id
            });

            var e = {
                title: o.type,
                start: date,
                backgroundColor: col[0].color,
                borderColor: col[0].color 
            }
            ev.push(e)
        }
        
    });

    var calendarEl = document.getElementById('calendar');
        var calendar = new FullCalendar.Calendar(calendarEl, {
          plugins: [ 'dayGrid', 'timeGrid', 'list' ],
          defaultView: 'dayGridMonth',
          header: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          },
          eventSources: [
            {
                events: ev
            }
          ]
          
        });

        calendar.render();
    


    // =============== To Do List ================= //
    
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
        author.setAttribute('id', o.id);
        author.innerHTML = o.title;

        var meta = document.createElement('div');
        meta.setAttribute('class', 'metadata');

        var span = document.createElement('span');
        span.setAttribute('class', 'date');
        span.setAttribute('id', 'date');
        
        var text =  document.createElement('div');
        text.setAttribute('class', 'text');
        text.innerText = o.description;

        meta.appendChild(span);
        content.appendChild(author);
        content.appendChild(meta);
        content.appendChild(text);
        comment.appendChild(content);
        message.appendChild(comment);
        $('#todo').append(message);


        // =============== Create Modal ================= //

        $('#'+o.id+'.close').click(() => {
            fetch('/api/delete/assessment'+o.id);
            window.location.reload(true);
        })

        
        var modal = document.createElement('div');
        modal.setAttribute('class', 'ui modal');
        modal.setAttribute('id', o.id);

        var micon = document.createElement('i');
        micon.setAttribute('class', 'close icon');

        var mheader = document.createElement('div');
        mheader.setAttribute('class', 'header');
        // console.log("HERE");
        var d = new Date(o.start);
        
        var pieces = o.due_time.toString().split(":");
        var hour, minute, second;
        hours = parseInt(pieces[0], 10);
        minutes = parseInt(pieces[1], 10);
        seconds = parseInt(pieces[2], 10);

        d.setHours(hours)
        d.setMinutes(minutes);
        d.setSeconds(seconds);
        mheader.innerText = o.title+' | Due at '+d.getHours()+':'+d.getMinutes()+' '+d.getDate()+'/'+d.getMonth()+'/'+d.getFullYear();

        var content = document.createElement('div');
        content.setAttribute('class', 'content');

        var desc = document.createElement('div');
        desc.setAttribute('class', 'description');
        desc.innerText = o.description;

        var list = document.createElement('div');
        list.setAttribute('class', 'ui list');
        
        fetch('/api/assessment'+o.id)
            .then(function (response) {
                if(response.status != 200) {
                    console.log("error. Status code "+response.status);
                    return;
                }
                
                response.json().then(function (data) {
                    for (var at in data.attachments) {
                        var item = document.createElement('div');
                        item.setAttribute('class', 'item');

                        var icon = document.createElement('i');
                        icon.setAttribute('class', 'file icon');

                        var content = document.createElement('div');
                        content.setAttribute('class', 'content');

                        var a = document.createElement('a');
                        a.setAttribute('class', 'header');
                        a.setAttribute('href', '/attachment'+data.attachments[at].id);
                        a.innerHTML = data.attachments[at].name;
                        
                        content.appendChild(a);
                        item.appendChild(icon);
                        item.appendChild(content);

                        list.appendChild(item);
                        
                    }
                })
            });
        
            desc.appendChild(list);
            content.appendChild(desc);


            modal.appendChild(micon);
            modal.appendChild(mheader);
            modal.appendChild(content);

            $('body').append(modal);
            
            

        $('#'+o.id+'.author').click(()=>{
            var str = "/assessment"+o.id;
            
            // console.log(str);
            // window.location.href = str;

            $('#'+o.id+'.ui.modal').modal('toggle');
            // console.log(str);
            
        })

        // =============== Notification ================= //
        Push.Permission.request();

        var tomorrow = new Date(o.start).toDateString();;
        if (getNotification(o.start)) {
            Push.create(o.title, {
                body: "Due on " + tomorrow + " " + o.due_time,
                icon: "/static/assets/assessment.png",
                tag: 'assessment',
                timeout: 8000,
                onClick: function () {
                    window.focus();
                    this.close();
                }
            });
        }

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

function getNotification(date) {
    var prevDay = new Date(date);
    prevDay.setDate(prevDay.getDate()-1);

    var curr_date = new Date();

    if (curr_date.getDate() == prevDay.getDate()
        && curr_date.getMonth() == prevDay.getMonth()
        && curr_date.getFullYear() == prevDay.getFullYear()) {
        console.log("good to notify");
        return true;
    }

    return false;
}

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


// Gets the previous closest monday
function getMonday(date)
{
    var day = date.getDay();
    var monday;
    if(date.getDay() == 0){
        return date;
    }
    else{
        monday = new Date().setDate(date.getDate() - day);
    }

    return monday;
}

function getDay(d) {
    if(d == 'Monday') {
        return 1;
    } else if (d == 'Tuesday') {
        return 2;
    } else if (d == 'Wednesday') {
        return 3;
    } else if (d == 'Thursday') {
        return 4;
    } else if (d == 'Friday') {
        return 5;
    } else if (d == 'Saturday') {
        return 6;
    } else if (d == 'Sunday') {
        return 7;
    } else {
        return d;
    }
}