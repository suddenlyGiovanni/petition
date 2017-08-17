$( document ).ready( function () {
    // DOM HANDLERS:
    var $canvas = $( '#canvas' )[ 0 ];
    var $btnClear = $( '#clear' );
    var ctx;

    // GLOBAL VARIABLES:
    var drawable = false;

    var prevX = 0,
        currX = 0,
        prevY = 0,
        currY = 0;


    // EVENT LISTENERS:
    if ( $canvas ) {

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
    }

    $btnClear.click( clear );

    $('form').on('submit', function (event) {
        var first = $( 'input[name="firstName"]' ).val();
        var last = $( 'input[name="lastName"]' ).val();
        var sig = $( 'input[name="signature"]' ).val();
        if (!first && !last && !sig) {
            event.preventDefault();
            alert('form not valid');
        }
    });


    function findXY( res, event ) {
        if ( res == 'down' ) {
            prevX = currX;
            prevY = currY;
            currX = event.offsetX;
            currY = event.offsetY;
            drawable = true;
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

    function draw() {
        ctx.beginPath();
        ctx.moveTo( prevX, prevY );
        ctx.lineTo( currX, currY );
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();
    }

    function clear() {
        $( 'input[name="firstName"]' ).val( '' );
        $( 'input[name="lastName"]' ).val( '' );
        $( 'input[name="signature"]' ).val( '' );
        ctx.clearRect( 0, 0, $canvas.width, $canvas.height );
    }
} );
