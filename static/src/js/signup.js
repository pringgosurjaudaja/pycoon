$(document).ready(function() {
    console.log( "ready!" );
    
    $('#repassword').keyup(()=>{
        var pass = $('#password').val();
        var repass = $('#repassword').val();
    
        console.log(pass+" and "+repass);
            
        if(pass!==repass) {
            console.log("APPEAR!");
            $('#notif').removeClass('hidden');
            $('#register').addClass('disabled');
        } else {
            console.log("DISAPPEAR!");
            $('#notif').addClass('hidden');
            $('#register').removeClass('disabled');
        }
    })
    
    
});