var width = 800,
height = 500;

var x = d3.scale.linear()
    .range([0, width]);


var svg2 = d3.select("#chart2").append("svg")
.attr("width", width)
.attr("height", height);

var chart2 = svg2.append("g").attr("width", width).attr("height", height);

d3.json("scores.json", function(error, data) {
  x.domain([0, d3.sum(data, function(d) { 
    return +d.score*10; })])

var sum = d3.sum(data, function (d) { return d.score; });

console.log(sum);

  var image = chart2.selectAll("g")
      .data(data)
    .enter().append("g");

    image.append("image")
    .attr("xlink:href",   function (d)
  {

            if(sum <= 5){
        return 'img/bronze_big.png';
      }
      else if(sum <= 10){
            return 'img/silver_big.png';
      }
        else if(sum <= 15){
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

});



