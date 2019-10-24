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
          start: {
            identifier: 'start',
            rules: [
              {
                type   : 'empty',
                prompt : 'Please enter start date'
              }
            ]
          },
          
          end: {
            identifier: 'end',
            rules: [
              {
                type   : 'empty',
                prompt : 'Please enter end date'
              }
            ]
          }
        //   ,
        //   repassword: {
        //     identifier: 'repassword',
        //     rules: [
        //       {
        //         type   : 'empty',
        //         prompt : 'Please re-confirm password'
        //       },
        //       {
        //         type   : 'match[password]',
        //         prompt : 'Password must match'
        //       }
        //     ]
        //   }
        }
      })
});