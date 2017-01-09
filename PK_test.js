var correctCards = 0;
var attempts = 0;

var retrieve = 0;
var create = 0;
var insert = 0;
var summmary = 0;
var update = 0;

$( init );
 
function init() {
 

  var questions = [
  ["img/bronze_small_medal.png", "Susie wants to see robberies in the ormeau area",["robberies", "crime", "month=7"], ["SELECT", "FROM", "WHERE"], "RETRIEVE"], 
  ["img/silver_small_medal.png", "Fred wants to see burglary in the cliftonville area",["robberies", "crime", "month=7"], ["SELECT", "FROM", "WHERE"], "RETRIEVE"],
  ["img/gold_small_medal.png", "Rathlin wants to see burglary in the cliftonville area",["robberies", "crime", "month=7"], ["SELECT", "FROM", "WHERE"], "RETRIEVE"],
  ];

  for(var j=0; j<questions.length; j++){

    console.log(questions[j]);
document.getElementById('premise').innerHTML=questions[j][1];
document.getElementById('image').src = questions[j][0];

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


  var retrievalwords = questions[j][3];
  var retrievalQuestions = questions[j][2];
  for ( var i=1; i<=retrievalwords.length; i++ ) {
    //$('<div>' + retrievalQuestions[i-1] + '</div>').data( 'number', retrievalQuestions[i-1] ).appendTo( '#cardSlots' )
    $('<div>' + retrievalwords[i-1] + '</div>').data( 'number', retrievalwords[i-1] ).appendTo( '#cardSlots' ).droppable( {
      accept: '#cardPile div',
      hoverClass: 'hovered',
      drop: handleCardDrop
    } );
    $('<div id="cardQuestions">' + retrievalQuestions[i-1] + '</div>').data( 'number', retrievalQuestions[i-1] ).appendTo( '#cardSlots' );
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

}
}