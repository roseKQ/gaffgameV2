var correctCards = 0;
var attempts = 0;

var retrieve = 0;
var create = 0;
var insert = 0;
var summmary = 0;
var update = 0;
var pos = 0;
var totalAnswer = 0;
var attempts = 0;

$(init);

  var questions = [
    ["img/bronze_small_medal.png", "Susie wants to create the crime table", [" table Crime (CrimeID ", " NOT NULL ", " )"], ["CREATE", "INT", "IDENTITY"], "CREATE"],
    ["img/silver_small_medal.png", "Fred wants to see burglary in the cliftonville area", ["robberies", "crime", "month=7"], ["SELECT", "FROM", "WHERE"], "RETRIEVE"],
    ["img/gold_small_medal.png", "Rathlin wants to see burglary in the antrim road area", ["robberies", "crime", "month=7"], ["SELECT", "FROM", "WHERE"], "RETRIEVE"],
  ];

function init() {

if(pos>=questions.length) { 
  
  //here I will be placing all the data drill down stuff and overall score eventually in the form of a method??
  pos=0; 

}


    console.log(questions[pos]);
    document.getElementById('premise').innerHTML = questions[pos][1];
    document.getElementById('image').src = questions[pos][0];

    // Hide the success message and correct message
    $('#successMessage').hide();
    $('#correctMessage').hide();

    // Reset the game
    correctCards = 0;
    attempts = 0;
    $('#cardPile').html('');
    $('#cardSlots').html('');


  var retrievalwords = questions[pos][3];
  var retrievalQuestions = questions[pos][2];

    for (var i = 1; i <= retrievalwords.length; i++) {
      //$('<div>' + retrievalQuestions[i-1] + '</div>').data( 'number', retrievalQuestions[i-1] ).appendTo( '#cardSlots' )
      $('<div name="choices">' + retrievalwords[i - 1] + '</div>').data('number', retrievalwords[i - 1]).appendTo('#cardSlots').droppable({
        accept: '#cardPile div',
        hoverClass: 'hovered',
        drop: handleCardDrop

      });
      $('<div id="cardQuestions">' + retrievalQuestions[i - 1] + '</div>').data('number', retrievalQuestions[i - 1]).appendTo('#cardSlots');


    }

  var retrievalCommands = ["SELECT", "FROM", "DISTINCT", "WHERE", "ORDER BY", "MONTH", "ON", "ASC", "DESC", "BETWEEN", "AND", "OR", "LIKE", "CREATE", "INT", "IDENTITY"];


    // Create the cards for the retrieval of data questions 
    for (var i = 0; i < retrievalCommands.length; i++) {
      console.log(retrievalCommands[1]);
      $('<div>' + retrievalCommands[i] + '</div>').data('number', retrievalCommands[i]).attr('id', 'card' + retrievalCommands[i]).appendTo('#cardPile').draggable({
        containment: '#header-content-inner',
        stack: '#cardPile div',
        cursor: 'move',
        revert: true
      });
    }
    test = document.getElementById("test").addEventListener("click", checkAnswer, false);
       
    //test.innerHTML += "<button onclick='checkAnswer()'>Submit Answer</button>";
    handleCardDrop();
    //checkAnswer();


}





  function handleCardDrop(event, ui) {
    var slotNumber = $(this).data('number');
    console.log($(this).data('number'));
    var cardNumber = ui.draggable.data('number');
    console.log(ui.draggable.data('number'));

    // If the card was dropped to the correct slot,
    // change the card colour, position it directly
    // on top of the slot, and prevent it being dragged
    // again

      if ( slotNumber != cardNumber ) {
    ui.draggable.addClass( 'incorrect' );
    ui.draggable.draggable( 'disable' );
    $(this).droppable( 'disable' );
    ui.draggable.position( { of: $(this), my: 'left top', at: 'left top' } );
    ui.draggable.draggable( 'option', 'revert', false );
    console.log(correctCards);
    attempts++;
      }

    if (slotNumber== cardNumber) {
      ui.draggable.addClass('correct');
      ui.draggable.draggable('disable');
      $(this).droppable('disable');
      ui.draggable.position({ of: $(this), my: 'left top', at: 'left top' });
      ui.draggable.draggable('option', 'revert', false);
      correctCards++;
      console.log(correctCards);
      attempts++;


  }
if(correctCards==3)
{
  totalAnswer++;
  console.log("Total right answer "+totalAnswer);
  console.log("Attempts "+attempts);
}
}

  function checkAnswer() {

  pos++;
  console.log("position variable " +pos);
init();
}





  //window.addEventListener("load", init, false);

