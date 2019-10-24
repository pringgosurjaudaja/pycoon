$(document).ready(function() {
    console.log("HERE")
    $('.form')
    .form({
        fields: {
          name: {
            identifier: 'title',
            rules: [
              {
                type   : 'empty',
                prompt : 'Please enter term name'
              }
            ]
          },
          start_date: {
            identifier: 'start_date',
            rules: [
              {
                type   : 'empty',
                prompt : 'Please enter start date'
              }
            ]
          },
          
          end_date: {
            identifier: 'end_date',
            rules: [
              {
                type   : 'empty',
                prompt : 'Please enter end date'
              }
            ]
          }
        }
      })
});