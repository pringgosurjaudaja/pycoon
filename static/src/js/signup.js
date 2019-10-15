$(document).ready(function() {
    console.log( "ready!" );
    
    $('#register').click(function (event) {
        var name = $('#name').val();
        var email = $('#email').val();

        var pass = $('#password').val();
        var repass = $('#repassword').val();
    

        if(name.length == 0 
            || email.length == 0 
            || pass == 0 
            || repass  == 0) {
            $('#notif').removeClass('hidden');
            $('#register').addClass('disabled');
            return false;
        } else {
            $('#notif').addClass('hidden');
            $('#register').removeClass('disabled');
        }

        if(pass !== repass && pass.length > 0 && repass.length > 0) {
            $('#notif1').removeClass('hidden');
            $('#register').addClass('disabled');
            return false;
        } else {
            $('#notif1').addClass('hidden');
            $('#register').removeClass('disabled');
        }
        return true;
    });    
});