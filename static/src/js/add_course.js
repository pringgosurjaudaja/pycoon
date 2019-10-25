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
                        prompt : 'Please enter a course code (e.g. COMP1234)'
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