$(document).ready(function() {
    console.log( "ready!" );
    
    $('#course-select').dropdown();

    var acode = $('#code').val();
    var atitle = $('#title').val();
    var adate = $('#due_date').val();
    
    $('.ui.form')
        .form({
            fields: {
                due_date: {
                    identifier: 'due_date',
                    rules: [
                      {
                        type   : 'empty',
                        prompt : 'Please enter an assessment date'
                      }
                    ]
                },
                title: {
                    identifier  : 'title',
                    rules: [
                      {
                        type   : 'empty',
                        prompt : 'Please enter an assessment title'
                      }
                    ]
                },
                dropdown: {
                    identifier  : 'dropdown',
                    rules: [
                      {
                        type   : 'empty',
                        prompt : 'Please select a course'
                      }
                    ]
                },
            }
        })
    ;
});