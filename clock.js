
var myDuration = 300;
var firstTime = true;
var flag = true,
width = 150,
height = 200,
margin = 30,
border = 2,
radius = Math.min(width, height) / 2;
var color = d3.scaleOrdinal(d3.schemeCategory20);
var pie = d3.pie()
.value(function(d) { return d.count; })
.sort(null);
 
var current_index = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var index_key = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
var lastKeyUpAt = 0;

var arc = d3.arc()
.innerRadius(0)
.outerRadius(radius);

var BASE = 60.0;
var current_clock = 2;

input = generateInput(60.0);

graph(input, input[0], "0", 60.0, false);
graph(input, input[0], "1", 60.0, false);
graph(input, input[0], "2", 60.0, false);
setText("#clock-1-0", "1-0-total", 0, ["0 hours", "0 minutes", "0 seconds"]);
setText("#clock-1-1", "1-1-total", 0, ["0 hours", "0 minutes", "0 seconds"], ["0 × 60\u00B2", "0 × 60\u00B9", "0 × 60\u2070"]);
setBackground(current_clock);

input2 = generateInput(10.0);
graph(input2, input2[0], "3", 10.0, true);
graph(input2, input2[0], "4", 10.0, true);
graph(input2, input2[0], "5", 10.0, true);
setText("#clock-1-2", "1-2-total", 3, ["0 hundreds", "0 tens", "0 ones"], ["0 × 10\u00B2", "0 × 10\u00B9", "0 × 10\u2070"]);

input3 = generateInput(5.0);
graph(input3, input3[0], "6", 5.0, true);
graph(input3, input3[0], "7", 5.0, true);
graph(input3, input3[0], "8", 5.0, true);

input4 = generateInput(5.0);
graph(input4, input4[0], "9", 5.0, true);
graph(input4, input4[0], "10", 5.0, true);
graph(input4, input4[0], "11", 5.0, true);

d3.select("body").on('keyup', function() {
    if (d3.event.keyCode === 40) { 
      lastKeyUpAt = new Date();
      flag = true; 
    }
});

d3.select("body")
.on("keydown", function() { 
  if (current_index[0] >= BASE || current_index[1] >= BASE || current_index[2] >= BASE){
    return;
  }
  if (d3.event.keyCode === 37) {
    // left arrow
    current_set = Math.floor(current_clock / 3);
    current_clock = current_set * 3 + (current_clock + 3 - 1) % 3;
    setBackground(current_clock);
  } else if (d3.event.keyCode === 38) {
    // up arrow
    d3.event.preventDefault();
    if (current_index[0] === BASE-1 && current_clock === 0) {
      return;
    } else if (current_index[0] === BASE-1 && current_index[1] == BASE-1 && current_clock === 1) {
      return;
    } else if (current_index[0] === BASE-1 && current_index[1] == BASE-1 && current_index[2] == BASE-1 && current_clock === 2) {
      return;
    }
    var selected = "#clock" + current_clock.toString();
    var svg = d3.selectAll(selected).selectAll("svg");
    incrementByOne(svg, input[0], current_clock);
    setTimeout(function(){            
      if (current_index[current_clock] === 0) {
        if (current_clock !== 0) {
          selected = "#clock" + (current_clock-1).toString();
          svg = d3.select(selected).selectAll("svg");
          incrementByOne(svg, input[0], current_clock-1);
          setTimeout(function(){                      
            if (current_index[current_clock-1] === 0 && current_clock !== 1) {
              selected = "#clock" + (current_clock-2).toString();
              svg = d3.select(selected).selectAll("svg");
              incrementByOne(svg, input[0], current_clock-2);
            }
          }, myDuration*2 + 25);
        }
      }
      setText("#clock-1-0", "1-0-total", 0, [
        current_index[0].toString() + " hours  ",
        current_index[1].toString() + " minutes",
        current_index[2].toString() + " seconds",
      ]);
      setText("#clock-1-1", "1-1-total", 0, [
        current_index[0].toString() + " hours  ",
        current_index[1].toString() + " minutes",
        current_index[2].toString() + " seconds",
      ], [
        current_index[0].toString() + " × 60\u00B2",
        current_index[1].toString() + " × 60\u00B9",
        current_index[2].toString() + " × 60\u2070",
      ]);
    }, myDuration*2 + 25);
  } else if (d3.event.keyCode === 39) {
    // right arrow
    current_set = Math.floor(current_clock / 3);
    current_clock = (current_clock + 1) % 3 + current_set * 3;
    setBackground(current_clock);
  } else if (d3.event.keyCode === 40) {
    // down arrow   
    d3.event.preventDefault();
    var keyDownAt = new Date();
    setTimeout(function() {
        if (+keyDownAt > +lastKeyUpAt){
          flag = false;
        }
    }, 500);

    if (current_index[0] === 0 && current_clock === 0) {
      return;
    } else if (current_index[0] === 0 && current_index[1] === 0 && current_clock === 1) {
      return;
    } else if (current_index[0] === 0 && current_index[1] === 0 && current_index[2] === 0 && current_clock === 2) {
      return;
    }
    var selected = "#clock" + current_clock.toString();
    var svg = d3.selectAll(selected).selectAll("svg");
    goBackByOne(svg, input[0], current_clock);
    setTimeout(function(){
      if (current_index[current_clock] == BASE-1){
        if (current_clock !== 0) {
          selected = "#clock" + (current_clock-1).toString();
          svg = d3.select(selected).selectAll("svg");
          goBackByOne(svg, input[0], current_clock-1);
          setTimeout(function(){                      
            if (current_index[current_clock-1] === BASE-1 && current_clock !== 1) {
              selected = "#clock" + (current_clock-2).toString();
              svg = d3.select(selected).selectAll("svg");
              goBackByOne(svg, input[0], current_clock-2);
            }
          }, myDuration*2 + 25);
        }
      } 
      setText("#clock-1-0", "1-0-total", 0, [
        current_index[0].toString() + " hours  ",
        current_index[1].toString() + " minutes",
        current_index[2].toString() + " seconds",
      ]);
      setText("#clock-1-1", "1-1-total", 0, [
        current_index[0].toString() + " hours  ",
        current_index[1].toString() + " minutes",
        current_index[2].toString() + " seconds",
      ], [
        current_index[0].toString() + " × 60\u00B2",
        current_index[1].toString() + " × 60\u00B9",
        current_index[2].toString() + " × 60\u2070",
      ]);
    }, myDuration*2 + 25);
  }
});

function setText(id, total_id, start_index, texts, second_texts) {
  for (i = start_index; i < start_index+3; i++){
    selected = "#clock" + i.toString();
    d3.select(id).selectAll(selected).selectAll("tspan").remove();
    textElements = d3.select(id).selectAll(selected).selectAll("text");
    if (textElements) {
      d3.select(id).selectAll(selected).selectAll("g").append("text");
      textElements = d3.select(id).selectAll(selected).selectAll("g").selectAll("text");
    }
    textElements
      .append("tspan")
        .attr("class", ".current")
        .attr("x", 0)
        .attr("y", height/2+5)
        .attr("font-size", "1rem")
        .text(texts[i - start_index])
        .style("text-anchor", "middle");
    if (second_texts) {
      textElements
        .append("tspan")
          .attr("class", ".current")
          .attr('x', 0)
          .attr("y", height/2+5)
          .attr("dy", 20)
          .attr("font-size", "1rem")
          .text(second_texts[i - start_index])
          .style("text-anchor", "middle");
    }
  }
  document.getElementById(total_id).innerHTML = current_index[start_index]*BASE*BASE + current_index[start_index+1]*BASE + current_index[start_index+2] 
}

function graph(input, data, index, BASE, flag) {
  var selected = "#clock" + index;
  d3.selectAll(selected).selectAll("svg").remove();
  var svg = d3.selectAll(selected).selectAll("svg")
    .data(input)
    .enter().append("svg")
    .attr("width", width + margin)
    .attr("height", height + margin * 2)
    .append("g")
    .attr("transform", "translate(" + (width / 2 + margin / 2) + "," + (height / 2 + margin) + ")");

  var circle = svg.append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", radius+2);

  if (flag) {
    addTicks(BASE, svg);
  }

  var drag = setdrag();
  svg.call(drag);
  switchToIndex(0, svg, data);

  function addTicks(base, svg) {
    var radians = 0.0174532925;  
    svg.selectAll('.hour-label').remove();
    svg.selectAll('.hour-label')
    .data(generateLabel(base))
      .enter()
      .append('text')
      .attr('class', 'hour-label')
      .attr('text-anchor','middle')
      .attr('x',function(d){                
        var x = (radius+10) * Math.sin(d * 360.0 / base * radians);
        return x;
      })
      .attr('y',function(d){
        var y = -(radius+10) * Math.cos(d * 360.0 / base * radians);
        return y+5;
      })
      .text(function(d){
        return d;
      });
    }

  function setdrag() {
    var drag = d3.drag()
      .subject(function(d) { return d; })
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);

    var center = {};
    center.x = (width+margin) / 2;
    center.y = (height + margin * 2) / 2;

    var start = {};
    start.x = center.x;
    start.y = 0;

    // point1: start point, point2: center, point3: end point
    function getAngle(point1, point2, point3) {
        var bb = (point2.y - point1.y)*(point2.y - point1.y) + (point2.x - point1.x)*(point2.x - point1.x);
        var aa = (point3.y - point1.y)*(point3.y - point1.y) + (point3.x - point1.x)*(point3.x - point1.x);
        var cc = (point3.y - point2.y)*(point3.y - point2.y) + (point3.x - point2.x)*(point3.x - point2.x);
        var cosa = (bb + cc - aa)/(2*Math.sqrt(bb)*Math.sqrt(cc));
        return Math.acos(cosa);
    }

    // point1: center, point2: start, point3: center
    function duration(point1, point2, point3) {
        var sp = (point1.x-point3.x)*(point2.y-point3.y)-(point1.y-point3.y)*(point2.x-point3.x);
        if(sp > 0) { // clockwise
            return 1;
        } else if(sp < 0) {// counter clockwise
            return -1;
        } else {
            return 0;
        }
    }

    function dragstarted(d) {
      d3.event.sourceEvent.stopPropagation();
      d3.select(this).classed("dragging", true);
    }

    function dragged(d) {
      function toDegrees (angle) {
        return angle * (180 / Math.PI);
      }

      var angle = getAngle(start, center, d3.event);
      degree = toDegrees(angle);
      if (d3.event.x < center.x) {
        degree = 360 - degree;
      } 
      var index = degree * 1.0 / (360.0 / BASE);
      switchToIndex(Math.round(index));
    }

    function dragended(d) {
      d3.select(this).classed("dragging", false);
    }

    return drag;  
  }
}

function key(d) {
  return d.data.region;
}

function type(d) {
  d.count = +d.count;
  return d;
}

function findNeighborArc(i, data0, data1, key) {
  var d;
  if(d = findFollowing(i, data0, data1, key)) {

    var obj = cloneObj(d)
    obj.endAngle = d.startAngle;
    return obj;

  } else if(d = findPreceding(i, data0, data1, key)) {

    var obj = cloneObj(d)
    obj.startAngle = d.endAngle;
    return obj;

  }

  return null


}

// Find the element in data0 that joins the highest preceding element in data1.
function findPreceding(i, data0, data1, key) {
  var m = data0.length;
  while (--i >= 0) {
    var k = key(data1[i]);
    for (var j = 0; j < m; ++j) {
      if (key(data0[j]) === k) return data0[j];
    }
  }
}

// Find the element in data0 that joins the lowest following element in data1.
function findFollowing(i, data0, data1, key) {
  var n = data1.length, m = data0.length;
  while (++i < n) {
    var k = key(data1[i]);
    for (var j = 0; j < m; ++j) {
      if (key(data0[j]) === k) return data0[j];
    }
  }
}

function arcTween(d) {

  var i = d3.interpolate(this._current, d);

  this._current = i(0);

  return function(t) {
    return arc(i(t))
  }

}


function cloneObj(obj) {
  var o = {};
  for(var i in obj) {
    o[i] = obj[i];
  }
  return o;
}

function changebase() {
  BASE = parseInt(document.getElementById('base').value);

  input = generateInput(BASE);
  
  graph(input[0], "0");
  graph(input[0], "1");
  graph(input[0], "2");

  current_clock = 2;
  current_index = [0, 0, 0];
}

function setBackground(index) {
  for (var i = 0; i < 12; i++) {
    var selected = "#clock" + i;
    var svg = d3.selectAll(selected).selectAll("svg");
    if (i === parseInt(index)) {
      svg.attr("style", "background: #ebfcf6;");
    } else {
      svg.attr("style", "background: white;");
    }
  } 
}

function goBackByOne(svg, data, clock_index) {
  var obj = {};
  if (current_index[clock_index] == 0) { 
    var g = svg.selectAll("g");
    g.selectAll("path").remove();
    switchToIndex(BASE, g, input[0]);
    current_index[clock_index] = 0;  
    temp = current_index[clock_index]
    obj["key"] = index_key[temp];
    obj["values"] = [data[temp*2], data[temp*2+1]];
    change(obj, svg, myDuration, "West");
    setTimeout(function() {       
      current_index[clock_index] = BASE;
      temp = current_index[clock_index];
      obj["key"] = index_key[temp];
      obj["values"] = [data[temp*2], data[temp*2+1]];
      change(obj, svg, 0, "East");
      setTimeout(function(){            
        current_index[clock_index] = (current_index[clock_index] + BASE - 1) % BASE;
        temp = current_index[clock_index];
        obj["key"] = index_key[temp];
        obj["values"] = [data[temp*2], data[temp*2+1]];
        change(obj, svg, myDuration, "East");
      }, myDuration + 10);
    }, myDuration+10);
  } else {          
    current_index[clock_index] = (current_index[clock_index] + BASE - 1) % BASE;
    temp = current_index[clock_index];
    obj["key"] = index_key[temp];
    obj["values"] = [data[temp*2], data[temp*2+1]];
    change(obj, svg, myDuration, "East");
  }      
}

function incrementByOne(svg, data, clock_index) {
  var obj = {};
  current_index[clock_index] = (current_index[clock_index] + 1);
  temp = current_index[clock_index];
  obj["key"] = index_key[temp];
  obj["values"] = [data[temp*2], data[temp*2+1]];
  change(obj, svg, myDuration, "East");
  if (temp == BASE) {
    setTimeout(function(){ 
      var g = svg.selectAll("g");
      g.selectAll("path").remove();
      current_index[clock_index] = 0;    
      switchToIndex(0, g, input[0]);
      current_index[clock_index] = BASE;  
      temp = current_index[clock_index]
      obj["key"] = index_key[temp];
      obj["values"] = [data[temp*2], data[temp*2+1]];
      change(obj, svg, myDuration, "West"); 
      setTimeout(function(){
        current_index[clock_index] = 0;
        temp = current_index[clock_index]
        obj["key"] = index_key[temp];
        obj["values"] = [data[temp*2], data[temp*2+1]];
        change(obj, svg, 0, "East");
      }, myDuration + 10);
    }, myDuration + 10);
  }
}


function switchToIndex(index, svg, data) {
  var obj = {};
  current_index[current_clock] = index;
  temp = current_index[current_clock]
  obj["key"] = index_key[temp];
  obj["values"] = [data[temp*2], data[temp*2+1]];
  change(obj, svg, myDuration, "East");
}

function change(region, svg, duration, clockwise) {
  var path = svg.selectAll('path')
  var data0 = path.data(),
  data1 = pie(region.values);
  path = path.data(data1, key);

  path
  .attr("fill", function(d,i) { 
    if (d.data.region === clockwise) {
      return "#ff0080";
    } else {
      return "#ffffff";
    }
   return color(d.data.region)
  })
  .transition()
  .duration(duration)
  .attrTween("d", arcTween)

  path
  .enter()
  .append("path")
  .each(function(d, i) {
    var narc = findNeighborArc(i, data0, data1, key) ;
    if(narc) {          
      this._current = narc;
      this._previous = narc;
    } else {          
      this._current = d;
    }
  }) 
  .attr("fill", function(d,i) { 
    if (d.data.region === clockwise) {
      return "#ff0080";
    } else {
      return "#ffffff";
    }
   return color(d.data.region)
  })
  .transition()
  .duration(duration)
  .attrTween("d", arcTween)

  path
  .attr("fill", function(d,i) { 
    if (d.data.region === clockwise) {
      return "#9AB3AC";
    } else {
      return "#ffffff";
    }
   return color(d.data.region)
  })
  .exit()
  .transition()
  .duration(duration)
  .attrTween("d", function(d, index) {

    var currentIndex = this._previous.data.region;
    var i = d3.interpolateObject(d,this._previous);
    return function(t) {
      return arc(i(t))
    }

  })
  .remove()


  firstTime = false;
}

function isElementOutViewport (el) {
    var rect = el.getBoundingClientRect();
    return rect.bottom < 0 || rect.right < 0 || rect.left > window.innerWidth || rect.top > window.innerHeight;
}

document.getElementById("content").onscroll = function() {
  var clock_set_0 = document.getElementById("clock-1-0");
  var clock_set_1 = document.getElementById("clock-1-1");
  var clock_set_2 = document.getElementById("clock-1-2");
  var clock_set_3 = document.getElementById("clock-2-0");
  var clock_set_4 = document.getElementById("clock-3-0");
  var clock_set_5 = document.getElementById("clock-5-0");
  if (!isElementOutViewport(clock_set_0) || !isElementOutViewport(clock_set_1)) {
    current_clock = 2;
    setBackground(2); 
  } else if (!isElementOutViewport(clock_set_2)) {
    current_clock = 5; 
    setBackground(5); 
  } else if (!isElementOutViewport(clock_set_3) || !isElementOutViewport(clock_set_4)) {
    current_clock = 8;
    setBackground(8);  
  } else if (!isElementOutViewport(clock_set_5)) {
    current_clock = 11; 
    setBackground(11); 
  } 
};