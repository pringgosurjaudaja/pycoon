$(document).ready(function() {
    console.log( "ready!" );
    $('#example1').progress('increment');
    $('#example1').progress({
        text: {
            active  : 'Week {value} of {total}',
            success : 'End of Term! Week {value} of {total}',
        }
    });
    $('#increment-button').click(()=>{
        $('#example1').progress('increment')
    });
});