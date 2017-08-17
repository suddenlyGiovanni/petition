$( document ).ready( function () {


    // DOM HANDLERS:

    var $canvas = $( '#canvas' );
    var $canvasInput = $( '#canvasInput' );
    // var context = getElementById( 'canvas' ).getContext( '2d' );

    $canvas.mousedown( function () {
        console.log( 'mouse down' );
        listenMouseMove();
    } );

    $canvas.mouseup( function () {
        draw( 'mouseUp' );
        $canvas.off( 'mousemove', console.log( 'mouse up' ) );
    } );


    function listenMouseMove() {
        $canvas.mousemove( function ( event ) {
            draw( event.offsetX, event.offsetY, 'mouseDown' );
        } );
    }



    function draw( mouseX, mouseY, mouseEvent ) {
        if ( mouseEvent == 'mouseDown' ) {
            console.log( mouseEvent );
            console.log( mouseX, mouseY );
            // context.strokeStyle = '#900';
            // context.beginPath();
            // context.lineTo( mouseX, mouseY );
        }
        if ( mouseEvent == 'mouseUp' ) {
            console.log( mouseEvent );

            // context.stroke();
        }
    }

    var canvas, ctx, flag = false,
        prevX = 0,
        currX = 0,
        prevY = 0,
        currY = 0,
        dot_flag = false;


    function draw() {
        ctx.beginPath();
        ctx.moveTo( prevX, prevY );
        ctx.lineTo( currX, currY );
        ctx.strokeStyle = x;
        ctx.lineWidth = y;
        ctx.stroke();
        ctx.closePath();
    }


} );
