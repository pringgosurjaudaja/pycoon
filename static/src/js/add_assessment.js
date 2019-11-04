$(document).ready(function() {
    console.log( "ready!" );
    
    $('#course-select').dropdown();

    var acode = $('#code').val();
    var atitle = $('#title').val();
    var adate = $('#due_date').val();
    
    $('.ui.form')
        .form({
            fields: {
                title: {
                    identifier  : 'title',
                    rules: [
                      {
                        type   : 'empty',
                        prompt : 'Please enter an assessment title'
                      }
                    ]
                },
                due_date: {
                    identifier: 'due_date',
                    rules: [
                      {
                        type   : 'empty',
                        prompt : 'Please enter a due date'
                      }
                    ]
                },
                due_time: {
                    identifier: 'due_time',
                    rules: [
                      {
                        type   : 'empty',
                        prompt : 'Please enter a due time'
                      }
                    ]
                },
               
            }
        })
    ;
});