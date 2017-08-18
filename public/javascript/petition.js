$( document ).ready( function () {
    // DOM HANDLERS:
    var $canvas = $( '#canvas' )[ 0 ];
    var $btnClear = $( 'button[name="clear"]' );
    // var $btnSubmit = $( 'button[type="submit"]' );
    var ctx;

    // GLOBAL VARIABLES:
    var drawable = false;
    var dot = false;

    var prevX = 0,
        currX = 0,
        prevY = 0,
        currY = 0;


    // EVENT LISTENERS:


    ctx = $canvas.getContext( '2d' );

    $canvas.addEventListener( 'mousemove', function ( event ) {
        findXY( 'move', event );
    } );

    $canvas.addEventListener( 'mousedown', function ( event ) {
        findXY( 'down', event );
    } );

    $canvas.addEventListener( 'mouseup', function ( event ) {
        findXY( 'up', event );
    } );

    $canvas.addEventListener( 'mouseout', function ( event ) {
        findXY( 'out', event );
    } );


    $btnClear.click( clear );

    // SIGNATURES get mouse position
    function findXY( res, event ) {
        if ( res == 'down' ) {
            prevX = currX;
            prevY = currY;
            currX = event.offsetX;
            currY = event.offsetY;
            drawable = true;
            dot = true;
            if ( dot ) {
                ctx.beginPath();
                ctx.fillStyle = 'black';
                ctx.fillRect( currX, currY, 2, 2 );
                ctx.closePath();
                dot = false;
            }
        }
        if ( res == 'up' || res == 'out' ) {
            drawable = false;
            $( 'input[name="signature"]' ).val( $canvas.toDataURL() );
        }
        if ( res == 'move' ) {
            if ( drawable ) {
                prevX = currX;
                prevY = currY;
                currX = event.offsetX;
                currY = event.offsetY;
                draw();
            }
        }
    }

    // SIGNATURES get draw path
    function draw() {
        ctx.beginPath();
        ctx.moveTo( prevX, prevY );
        ctx.lineTo( currX, currY );
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();
    }


    // SIGNATURES clear canvas
    function clear() {
        $( 'input[name="firstName"]' ).val( '' );
        $( 'input[name="lastName"]' ).val( '' );
        $( 'input[name="signature"]' ).val( '' );
        ctx.clearRect( 0, 0, $canvas.width, $canvas.height );
    }
} );
