$(document).ready(function() {
    console.log( "ready!" );
    
    
    $('#course-select').dropdown();

    console.log(weeks);
    // $('#checkboxes').append();
    for(var i =1 ; i<= weeks; ++i) {
      var div = document.createElement('div');
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