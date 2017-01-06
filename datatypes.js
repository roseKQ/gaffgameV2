var score=0;
var attempts=0;

function datatypes(menu, correct){


    var selection=menu.options[menu.selectedIndex].text;
    var correctAnswer = menu.options[menu.Index = correct].text;
    var isCorrect = false;
   
    console.log(selection);
    console.log(isCorrect);
    console.log(correctAnswer);
     
  
    if(selection == correctAnswer){
      isCorrect=true;
      console.log(isCorrect);
      score += 1;
      attempts+=1;
      console.log(score);
      
    }else{
      score=score;
      console.log(isCorrect);
      console.log(score);
      attempts+=1;
  }

if(attempts == 5){
       $('#displayScore').html('<h2> Your score is ' +score+ '/5!</h2>').show();
    }
}

 


