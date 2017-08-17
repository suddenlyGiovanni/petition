$( document ).ready( function () {


    // DOM HANDLERS:

    var $canvas = $( '#canvas' );
    var $canvasInput = $( '#canvasInput' );

    $canvas.mouseenter( function () {
        console.log( 'mouse enter' );
        listenMouseMove();
    } );

    $canvas.mouseleave( function () {
        $canvas.off( 'mousemove', console.log( 'mouse leave' ) );
    } );


    function listenMouseMove() {
        $canvas.mousemove( function ( event ) {
            var mouseX = event.offsetX;
            var mouseY = event.offsetY;
            console.log( mouseX, mouseY );
        } );
    }









} );
