var width = 600,
height = 300,
barHeight = 70;

var x = d3.scale.linear()
    .range([0, width]);


var svg = d3.select("#chart").append("svg")
.attr("width", width)
.attr("height", height);

var chart = svg.append("g").attr("width", width);

d3.json("scores.json", function(error, data) {
  x.domain([0, d3.max(data, function(d) { 
    return +d.score +200; })])

  chart.attr("height", barHeight * data.length*10);

  var bar = chart.selectAll("g")
      .data(data)
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(250," + i * barHeight + ")"; });

  bar.append("rect")
      .attr("width", function (d) { return x(d.score) * 15; })
      .attr("height", barHeight - 1)
          .attr("rx", 20)
    .attr("ry", 20)
      .style({
          'fill': function (d) {

            if(d.score <= 2){
        return '#CD7F32';
      }
      else if(d.score == 3){
            return '#c0c0c0';
      }
        else if(d.score == 4){
          return '#FFD700';
        }
              else{
                return '#E5E4E2';
              };
    },
    'stroke': '#ffffff',
    'stroke-width': '10'
  });

  bar.append("text")
      .style({'fill': '#ffffff', 'font-size': 35} )
      .attr("x", function(d) { return x(d.score)*10 - 10; })
      .attr("y", barHeight / 2)
      .attr("dy", ".35em")
      .text(function(d) { return d.score; });

  bar.append("text")
      .style({"fill": "#31708f", "font-size": 15})
      .attr("x", -10 )
      .attr("y", barHeight / 2)
      .text(function (d) { return d.name; });

  bar.append("image")
    .attr("xlink:href",   function (d)
  {

            if(d.score <= 2){
        return 'img/bronze_small_medal.png';
      }
      else if(d.score == 3){
            return 'img/silver_small_medal.png';
      }
        else if(d.score == 4){
          return 'img/gold_small_medal.png';
        }
              else{
                return 'img/platinum_small_medal.png';
              };
    })
    .attr("x", function(d) { return x(75); })
    .attr("y", barHeight/10)
    .attr("width", barHeight)
    .attr("height", barHeight);

});


