$(document).ready(function() {
    console.log( "ready!" );
    
    $('#color-select').dropdown();

    $('.ui.form')
        .form({
            fields: {
                code: {
                    identifier: 'code',
                    rules: [
                      {
                        type   : 'empty',
                        prompt : 'Please enter a course code'
                      },
                      {
                        type   : 'regExp[/^[A-Z]{4}[0-9]{4}$/]',
                        prompt : 'Course code must be 4 capital letters followed by 4 digits'
                      }
                    ]
                },
                title: {
                    identifier  : 'title',
                    rules: [
                      {
                        type   : 'empty',
                        prompt : 'Please enter a course title'
                      }
                    ]
                },
                dropdown: {
                    identifier  : 'color',
                    rules: [
                      {
                        type   : 'empty',
                        prompt : 'Please select a color'
                      }
                    ]
                },
            }
        })
    ;
});