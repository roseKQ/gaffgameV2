var correctCards = 0;
var attempts = 0;

$( init );
 
function init() {
 

  var questions = 
  ["img/bronze_small_medal.png", "Susie wants to see robberies in the ormeau area",["robberies", "crime", "month=7"], ["SELECT", "FROM", "WHERE"], "RETRIEVE"];

document.getElementById('premise').innerHTML=questions[1];
document.getElementById('image').src = questions[0];

  // Hide the success message and correct message
  $('#successMessage').hide();
  $('#correctMessage').hide();

  $('#successMessage').css( {
    left: '580px',
    top: '250px',
    width: 0,
    height: 0
  } );
 
  // Reset the game
  correctCards = 0;
  attempts=0;
  $('#cardPile').html( '' );
  $('#cardSlots').html( '' );
  
 
  // Create the pile of shuffled cards
 // var numbers = [ "Composite Key", "Foreign Key", "Composite Key", "Composite Key", "Primary Key"];
  var retrievalCommands = ["SELECT", "FROM", "DISTINCT", "WHERE", "ORDER BY", "MONTH", "ON", "ASC", "DESC", "BETWEEN", "AND", "OR", "LIKE"];
 /*
  for ( var i=0; i<5; i++ ) {
    console.log(numbers[1]);
    $('<div>' + numbers[i] + '</div>').data( 'number', numbers[i] ).attr( 'id', 'card'+numbers[i] ).appendTo( '#cardPile' ).draggable( {
      containment: '#header-content-inner',
      stack: '#cardPile div',
      cursor: 'move',
      revert: true
    } );
  }
 */

// Create the cards for the retrieval of data questions 
   for ( var i=0; i<retrievalCommands.length; i++ ) {
    console.log(retrievalCommands[1]);
    $('<div>' + retrievalCommands[i] + '</div>').data( 'number', retrievalCommands[i] ).attr( 'id', 'card'+retrievalCommands[i] ).appendTo( '#cardPile' ).draggable( {
      containment: '#header-content-inner',
      stack: '#cardPile div',
      cursor: 'move',
      revert: true
    } );
  }

  // Create the card slots
 /* var words = [ "Primary Key", "Composite Key", "Foreign Key", "Composite Key", "Composite Key" ];
  for ( var i=1; i<=5; i++ ) {
    $('<div>' + words[i-1] + '</div>').data( 'number', words[i-1] ).appendTo( '#cardSlots' ).droppable( {
      accept: '#cardPile div',
      hoverClass: 'hovered',
      drop: handleCardDrop
    } );
  }*/

 
  // var retrievalwords = [ "SELECT", "FROM", "DISTINCT", "WHERE", "ORDER BY" ];

  var retrievalwords = questions[3];
  for ( var i=1; i<=retrievalwords.length; i++ ) {
    $('<div>' + retrievalwords[i-1] + '</div>').data( 'number', retrievalwords[i-1] ).appendTo( '#cardSlots' ).droppable( {
      accept: '#cardPile div',
      hoverClass: 'hovered',
      drop: handleCardDrop
    } );
  }
}


function handleCardDrop( event, ui ) {
  var slotNumber = $(this).data( 'number' );
  console.log($(this).data( 'number' ));
  var cardNumber = ui.draggable.data( 'number' );
  console.log(ui.draggable.data( 'number' ));
 
  // If the card was dropped to the correct slot,
  // change the card colour, position it directly
  // on top of the slot, and prevent it being dragged
  // again
  
 
  if( slotNumber == cardNumber ) {
    ui.draggable.addClass( 'correct' );
    ui.draggable.draggable( 'disable' );
    $(this).droppable( 'disable' );
    ui.draggable.position( { of: $(this), my: 'left top', at: 'left top' } );
    ui.draggable.draggable( 'option', 'revert', false );
    correctCards++;
    console.log(correctCards);
    attempts++;
  } 
  /* if ( slotNumber != cardNumber ) {
    ui.draggable.addClass( 'incorrect' );
    ui.draggable.draggable( 'disable' );
    $(this).droppable( 'disable' );
    ui.draggable.position( { of: $(this), my: 'left top', at: 'left top' } );
    ui.draggable.draggable( 'option', 'revert', false );
    console.log(correctCards);
    attempts++;
   
  } */
  
  
  // If all the cards have been placed correctly then display a message
  // and reset the cards for another go
 
  if ( correctCards == 5 ) {
    $('#successMessage').show();
        $('#correctMessage').show();

    $('#successMessage').animate( {
      left: '380px',
      top: '200px',
      width: '400px',
      height: '100px',
      opacity: 1
      
    } );
  }




}