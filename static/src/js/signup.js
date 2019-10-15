$(document).ready(function() {
    console.log( "ready!" );
    
    $('#register').hover(()=>{
        var name = $('#name').val();
        var email = $('#email').val();

        if(name !== '' && email !== '') {
            $('#notif').addClass('hidden');
            $('#register').removeClass('disabled');
        } else {
            $('#notif').removeClass('hidden');
            $('#register').addClass('disabled');
        }
    })

    $('#name').keyup(()=>{
        var name = $('#name').val();
        var email = $('#email').val();

        if(name !== '' && email !== '') {
            $('#notif').addClass('hidden');
            $('#register').removeClass('disabled');
        } else {
            $('#notif').removeClass('hidden');
            $('#register').addClass('disabled');
        }
    })

    $('#email').keyup(()=>{
        var name = $('#name').val();
        var email = $('#email').val();

        if(name !== '' && email !== '') {
            $('#notif').addClass('hidden');
            $('#register').removeClass('disabled');
        } else {
            $('#notif').removeClass('hidden');
            $('#register').addClass('disabled');
        }
    })
    $('#repassword').keyup(()=>{
        var pass = $('#password').val();
        var repass = $('#repassword').val();
    
        if(pass !== repass || pass === '' || repass === '') {
            $('#notif1').removeClass('hidden');
            $('#register').addClass('disabled');
        } else {
            $('#notif1').addClass('hidden');
            $('#register').removeClass('disabled');
        }
    })
    
    
});