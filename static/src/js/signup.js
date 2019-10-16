$(document).ready(function() {
 
    // $('#register').click(function () {
    //     var name = $('#name').val();
    //     var email = $('#email').val();

    //     var pass = $('#password').val();
    //     var repass = $('#repassword').val();
        
    //     if(name.length == 0 
    //         || email.length == 0 
    //         || pass == 0 
    //         || repass  == 0) {
    //         alert('Please fill out empty fields');
    //     }
    //     if(pass !== repass && pass.length > 0 && repass.length > 0) {

    //         alert('Passwords do not match');
    //     }
    // });

    $('.form')
    .form({
        fields: {
          name: {
            identifier: 'name',
            rules: [
              {
                type   : 'empty',
                prompt : 'Please enter your name'
              }
            ]
          },
          skills: {
            identifier: 'email',
            rules: [
              {
                type   : 'empty',
                prompt : 'Please enter your email'
              }
            ]
          },
          
          password: {
            identifier: 'password',
            rules: [
              {
                type   : 'empty',
                prompt : 'Please enter a password'
              }
            ]
          },
          repassword: {
            identifier: 'repassword',
            rules: [
              {
                type   : 'empty',
                prompt : 'Please re-confirm password'
              },
              {
                type   : 'match[password]',
                prompt : 'Password must match'
              }
            ]
          }
        }
      })

});