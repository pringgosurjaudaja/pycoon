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
                        prompt : 'Course code must be in the form of 4 captial letters followed by 4 digits'
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
                    identifier  : 'dropdown',
                    rules: [
                      {
                        type   : 'minCount[1]',
                        prompt : 'Please select a color'
                      }
                    ]
                },
            }
        })
    ;
});