var currSequence = new Array(16);
var start = false;
var emptyPos = 15;

$( function () {
    initial( 'panda' );

    $('#show-button').click( function() {
        $('#original-picture').fadeIn();
        setTimeout( function() { $('#original-picture').fadeOut(); } , 2000 );
    });

    $('.puzzle-piece').click( toMove );

    for ( var i = 0; i < 15; ++i )
        $('.puzzle-piece:nth-child('+(i+1)+')').prop( 'idx', i );

} );

function initial( picture ) {

    $('.puzzle-piece div').addClass( picture );
    $('#original-picture').addClass( picture ).hide();
    $('#start-button').off( 'click' ).click( function() { mess( picture ); } ).text('Start');
    $('#status').hide();
    $('.selector').off( 'click' ).click( function() { changeImg( picture ); } );

    for ( var i = 0; i < 16; ++i )
        currSequence[i] = i;
    
}

function changeImg( picture ) {

    if ( event.target.className === 'selector on' )
        return;

    var chan = true;
    if ( start )
        chan = confirm('Change to another picture? The current progress will be lost.');

    if ( !chan ) {
        return;
    } else {
        start = false;
        for ( var i = 1; i <= 15; ++i )
            $('.puzzle-piece:nth-child('+i+')').animate( { left: '0px', top: '0px' } );
    }

    $('.selector').removeClass('on');
    $( event.target ).addClass('on');

    if ( picture == 'panda' ) {
        $('.puzzle-piece div').removeClass('panda');
        $('#original-picture').removeClass('panda');
        initial( 'sen' );
    } else {
        $('.puzzle-piece div').removeClass('sen');
        $('#original-picture').removeClass('sen');
        initial( 'panda' );
    }
}

function mess( picture ) {

    $('#status').hide();

    if ( start ) {
        toGiveUp( picture );
        return;
    }
    
    var randomArr = new Array(15);
    var temp;
    for ( var i = 0; i < 15; ++i ) {
        randomArr[i] = i;
    }

    for ( i = 0; i < 5; ++i ) {

        for ( var k = 0; k < 15; ++k)
            currSequence[k] = k;

        randomArr.sort( function() {
            return Math.random() - 0.5;
        } );

        for ( var j = 0; j < 15; j += 3 ) {
            transformPiece( currSequence[randomArr[j]], 
                            currSequence[randomArr[j+1]],
                            currSequence[randomArr[j+2]] );
            temp = currSequence[randomArr[j+2]];
            currSequence[randomArr[j+2]] = currSequence[randomArr[j+1]];
            currSequence[randomArr[j+1]] = currSequence[randomArr[j]];
            currSequence[randomArr[j]] = temp;
        }
    }

    $('#start-button').text('Give up');
    start = true;

}

// i -> j -> k -> i
function transformPiece( i, j, k ) {
    var piece1 = $('.puzzle-piece:nth-child('+(i+1)+')'),
        piece2 = $('.puzzle-piece:nth-child('+(j+1)+')'),
        piece3 = $('.puzzle-piece:nth-child('+(k+1)+')');

        parseInt( piece1.css('left') );

    piece1.animate( { left: (j%4)*128 - (i%4)*128 +'px',
                      top: ((Math.floor(j/4)) - Math.floor(i/4)) * 128 +'px' } );
    piece2.animate( { left: (k%4)*128 - (j%4)*128 +'px',
                      top: ((Math.floor(k/4)) - Math.floor(j/4)) * 128 +'px' } );
    piece3.animate( { left: (i%4)*128 - (k%4)*128 +'px',
                      top: ((Math.floor(i/4)) - Math.floor(k/4)) * 128 +'px' } );
}

function toMove() {
    if ( !start )
        return;

    var moved = false, temp;
    if ( currSequence[emptyPos-1] == this.idx && emptyPos % 4 != 0 ) {
        temp = emptyPos;
        currSequence[emptyPos--] = this.idx;
        currSequence[emptyPos] = 15;
        moved = true;
    } else if ( currSequence[emptyPos+1] == this.idx && (emptyPos+1) % 4 != 0 ) {
        temp = emptyPos;
        currSequence[emptyPos++] = this.idx;
        currSequence[emptyPos] = 15;
        moved = true;
    } else if ( currSequence[emptyPos+4] == this.idx ) {
        temp = emptyPos;
        currSequence[emptyPos] = this.idx;
        emptyPos += 4;
        currSequence[emptyPos] = 15;
        moved = true;
    } else if ( currSequence[emptyPos-4] == this.idx ) {
        temp = emptyPos;
        currSequence[emptyPos] = this.idx;
        emptyPos -= 4;
        currSequence[emptyPos] = 15;
        moved = true;
    }

    if ( moved ) {
        $(this).animate( { left: (temp%4)*128 - (this.idx%4)*128 +'px',
                           top: ((Math.floor(temp/4)) - Math.floor(this.idx/4)) * 128 +'px' } ); 
        toWin();
    }
}

function toWin() {
    if ( currSequence.toString() === '0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15' ) {
        $('#status').slideDown();
        start = false;
        $('#start-button').text('Start');
    }
}

function toGiveUp( picture ) {
    var re = confirm('Give up? The current progress will be lost.');

    if ( re ) {
        for ( var i = 1; i <= 15; ++i )
            $('.puzzle-piece:nth-child('+i+')').animate( { left: '0px', top: '0px' } );
        start = false;
        initial( picture );
    }
}