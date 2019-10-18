$(document).ready(function() {
    console.log( "ready!" );
    
    $('#color-select').dropdown();

    var ccode = $('#code').val();
    var ctitle = $('#title').val();
    var ccolor = $('#color').val();

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
                        prompt : 'Course code must be in the form of 4 capital letters followed by 4 digits'
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
                        type   : 'empty',
                        prompt : 'Please select a color'
                      }
                    ]
                },
            }
        })
    ;
});