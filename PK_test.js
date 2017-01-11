var correctCards = 0;
var attempts = 0;


var create = 0;
var insert = 0;
var retrieve = 0;
var summary = 0;
var join = 0;
var update = 0;
var DeleteQuestion = 0;
var pos = 0;
var totalAnswer = 0;
var attempts = 0;

var data = [create, insert, retrieve, summary, join, update, DeleteQuestion]; 

$(init);

  var questions = [
    ["img/bronze_small_medal.png", "Susie wants to create the crime table", [" table Crime (CrimeID ", " NOT NULL ", " )"], ["CREATE", "INT", "IDENTITY"], "CREATE"],
    ["img/silver_small_medal.png", "Fred wants to see burglary in the cliftonville area", ["robberies", "crime", "month=7"], ["SELECT", "FROM", "WHERE"], "INSERT"],
    ["img/gold_small_medal.png", "Rathlin wants to see burglary in the antrim road area", ["robberies", "crime", "month=7"], ["SELECT", "FROM", "WHERE"], "RETRIEVE"],
    ["img/gold_small_medal.png", "Rathlin wants to see burglary in the antrim road area", ["robberies", "crime", "month=7"], ["SELECT", "FROM", "WHERE"], "SUMMARY"],
    ["img/gold_small_medal.png", "Rathlin wants to see burglary in the antrim road area", ["robberies", "crime", "month=7"], ["SELECT", "FROM", "WHERE"], "JOIN"],
    ["img/gold_small_medal.png", "Rathlin wants to see burglary in the antrim road area", ["robberies", "crime", "month=7"], ["SELECT", "FROM", "WHERE"], "UPDATE"],
     ["img/gold_small_medal.png", "Rathlin wants to see burglary in the antrim road area", ["robberies", "crime", "month=7"], ["SELECT", "FROM", "WHERE"], "DELETE"],
         ["img/bronze_small_medal.png", "Susie wants to create the crime table", [" table Crime (CrimeID ", " NOT NULL ", " )"], ["CREATE", "INT", "IDENTITY"], "CREATE"],
    ["img/silver_small_medal.png", "Fred wants to see burglary in the cliftonville area", ["robberies", "crime", "month=7"], ["SELECT", "FROM", "WHERE"], "INSERT"],
    ["img/gold_small_medal.png", "Rathlin wants to see burglary in the antrim road area", ["robberies", "crime", "month=7"], ["SELECT", "FROM", "WHERE"], "RETRIEVE"],
    ["img/gold_small_medal.png", "Rathlin wants to see burglary in the antrim road area", ["robberies", "crime", "month=7"], ["SELECT", "FROM", "WHERE"], "SUMMARY"],
    ["img/gold_small_medal.png", "Rathlin wants to see burglary in the antrim road area", ["robberies", "crime", "month=7"], ["SELECT", "FROM", "WHERE"], "JOIN"],
    ["img/gold_small_medal.png", "Rathlin wants to see burglary in the antrim road area", ["robberies", "crime", "month=7"], ["SELECT", "FROM", "WHERE"], "UPDATE"],
     ["img/gold_small_medal.png", "Rathlin wants to see burglary in the antrim road area", ["robberies", "crime", "month=7"], ["SELECT", "FROM", "WHERE"], "DELETE"]
  ];

function init() {

if(pos>=questions.length) { 
  
  document.getElementById('scoreOverall').innerHTML = overallMedal();
  //here I will be placing all the data drill down stuff and overall score eventually in the form of a method??
  //pos=0; 

}

else{
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
if(questions[pos][4]=="CREATE")
{
  create++;
  console.log("Create questions count "+create);
}
else if(questions[pos][4]=="INSERT") {
insert++;
console.log("Insert questions count "+insert);

}
else if(questions[pos][4]=="RETRIEVE") {
retrieve++;
console.log("Retrieve questions count "+retrieve);

}else if(questions[pos][4]=="SUMMARY"){

summary++;
console.log("Summary questions count "+summary);

}else if(questions[pos][4]=="JOIN"){

join++;
console.log("Join questions count "+join);

}else if(questions[pos][4]=="UPDATE"){

update++;
console.log("Update questions count "+update);

} else { 

DeleteQuestion++;

}
  totalAnswer++;


  console.log("Total right answer "+totalAnswer);
  console.log("Attempts "+attempts);
  console.log("Create questions count "+create);
  console.log("Insert questions count " +insert);
  console.log("Retrieve questions count " +retrieve);
  console.log("Summary questions count " +summary);
  console.log("Join questions count " +join);
  console.log("Update questions count " +update);
  console.log("Delete questions count "+DeleteQuestion);

}
}
}

  function checkAnswer() {
  pos++;
  console.log("position variable " +pos);
init();
}


function overallMedal(){

var width = 800,
height = 500;

var x = d3.scale.linear()
    .range([0, width]);


var svg2 = d3.select("#chart2").append("svg")
.attr("width", width)
.attr("height", height);

var chart2 = svg2.append("g").attr("width", width).attr("height", height);

//d3.json("scores.json", function(error, data) {
  x.domain([0, d3.sum(data, function(d) { 
    return +d.score*10; })])

var sum = d3.sum(data, function (d) { return d; });



console.log(sum);

  var image = chart2.selectAll("g")
      .data(data)
    .enter().append("g");

    image.append("image")
    .attr("xlink:href",   function (d)
  {

            if(sum <= 4){
        return 'img/bronze_big.png';
      }
      else if(sum <= 8){
            return 'img/silver_big.png';
      }
        else if(sum <= 12){
          return 'img/gold_big.png';
        }
              else {
                return 'img/platinum_big.png';
              };
    })
    .attr("x", 0)
    .attr("y", 50)
    .attr("width", 300)
    .attr("height", 300)
    .attr("transform", function(d, i) { return "translate(200," + i * height*10 + ")"; });

    image.append("text")
      .style("fill", "#31708f")
      .style("font-size", "34px")
      .style("font-family", "Catamaran")
      .attr("x", 565)
      .attr("y", 400)
      .text(function (d) { 
       if(sum <= 4){
        return "It's a Bronze..you scored " +sum ;
      }
      else if(sum <= 8){
            return "Silver medal! You scored " +sum;
      }
        else if(sum <= 12){
          return "You got a gold! You scored " +sum;
        }
              else{
                return "Perfect Platinum! You scored " +sum;
              }; });

;


}


  //window.addEventListener("load", init, false);

