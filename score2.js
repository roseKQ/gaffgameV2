
var dataBefore = JSON.parse(localStorage.getItem('data'));


console.log("Create variable "+dataBefore.create+" Insert variable "+dataBefore.insert+ " retrieve variable "+dataBefore.retrieve);

var data = {
  "create": dataBefore.create,
  "insert": dataBefore.insert,
  "retrieve": dataBefore.retrieve,
  "summary": dataBefore.summary,
  "join": dataBefore.join,
  "update": dataBefore.update,
  "delete": dataBefore.delete,
  "total": dataBefore.total
};

console.log(data);

var width = 800,
height = 500;

var x = d3.scale.linear()
    .range([0, width]);


var svg2 = d3.select("#chart2").append("svg")
.attr("width", width)
.attr("height", height);

var chart2 = svg2.append("g").attr("width", width).attr("height", height);

//d3.json("scores.json", function(error, data) {
  x.domain([0, data.total*10 ])

//var sum = d3.sum(data, function (d) { return d.total; });

//console.log(sum);

  var image = chart2.selectAll("g")
  .data(data)
  .enter().append("g");

image.append("image")
  .attr("xlink:href", function (d) {

    if (d.total <= 3) {
      return 'img/bronze_big.png';
    }
    else if (d.total <= 4) {
      return 'img/silver_big.png';
    }
    else if (d.total <= 7) {
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
       if(d.total <= 3){
        return "It's a Bronze..you scored " +d.total ;
      }
      else if(d.total <= 4){
            return "Silver medal! You scored " +d.total;
      }
        else if(d.total <= 7){
          return "You got a gold! You scored " +d.total;
        }
              else{
                return "Perfect Platinum! You scored " +d.total;
              }; });

;







