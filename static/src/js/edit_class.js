$(document).ready(function() {
    console.log( "ready!" );
  
    $('#course-select').dropdown();
    $('#'+curr_days).attr('selected','');
    
    curr_weeks = curr_weeks.split(',').map(Number);

    for(var i =1 ; i<= weeks; ++i) {
      var div = document.createElement('div');
      if(curr_weeks.includes(i)) {
        div.setAttribute('class', 'ui checked checkbox');
        var input = document.createElement('input');
        input.setAttribute('type', 'checkbox');
        input.setAttribute('checked', '');
        input.setAttribute('name', 'weeks');
        input.setAttribute('value', i);
        input.setAttribute('class', 'cinput');
        var label = document.createElement('label');
        label.setAttribute('class', 'clabel');
        label.innerText = i;

        div.appendChild(input);
        div.appendChild(label);
      } else {
        div.setAttribute('class', 'ui checkbox');
        var input = document.createElement('input');
        input.setAttribute('type', 'checkbox');
        input.setAttribute('name', 'weeks');
        input.setAttribute('value', i);
        input.setAttribute('class', 'cinput');
        var label = document.createElement('label');
        label.setAttribute('class', 'clabel');
        label.innerText = i;

        div.appendChild(input);
        div.appendChild(label);
      }
      
      
      
      $('#checkboxes').append(div);
      
    }
    
    $('.ui.form')
        .form({
            fields: {
                dropdown: {
                    identifier  : 'type',
                    rules: [
                      {
                        type   : 'empty',
                        prompt : 'Please select a class type'
                      }
                    ]
                },
                location: {
                    identifier  : 'location',
                    rules: [
                      {
                        type   : 'empty',
                        prompt : 'Please enter a location'
                      }
                    ]
                },
                dropdown2: {
                    identifier  : 'day',
                    rules: [
                      {
                        type   : 'empty',
                        prompt : 'Please select a day'
                      }
                    ]
                },
                start_time: {
                    identifier: 'start_time',
                    rules: [
                      {
                        type   : 'empty',
                        prompt : 'Please enter a start time'
                      }
                    ]
                },
                end_time: {
                    identifier: 'end_time',
                    rules: [
                      {
                        type   : 'empty',
                        prompt : 'Please enter an end time'
                      }
                    ]
                },
                weeks: {
                    identifier: 'weeks',
                    rules: [
                      {
                        type   : 'checked',
                        prompt : 'You must check at least 1 week'
                      }
                    ]
                  } 
                
            }
        })
    ;
});

function getDay(i) {
  i = parseInt(i);
  if(i==1) {
    return "Monday";
  } else if(i== 2) {
    return "Tuesday";
  } else if(i== 3) {
    return "Wednesday";
  } else if(i== 4) {
    return "Thursday";
  } else if(i== 5) {
    return "Friday";
  } else if(i== 6) {
    return "Saturday";
  } else {
    return "Sunday";
  }
}

function getDayofWeek(i) {
 
  if(i=="Monday") {
    return 1;
  } else if(i==  "Tuesday") {
    return 2;
  } else if(i== "Wednesday") {
    return 3;
  } else if(i== "Thursday") {
    return 4;
  } else if(i== "Friday") {
    return 5;
  } else if(i== "Saturday") {
    return 6;
  } else {
    return 7;
  }
}