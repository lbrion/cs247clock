
var myDuration = 300;
var firstTime = true;

var width = 200,
height = 300,
margin = 50,
radius = Math.min(width, height) / 2;
var color = d3.scaleOrdinal(d3.schemeCategory20);
var pie = d3.pie()
.value(function(d) { return d.count; })
.sort(null);
 
var current_index = [0, 0, 0];
var index_key = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

var arc = d3.arc()
.innerRadius(0)
.outerRadius(radius);

var BASE = 8.0;
var current_clock = 2;

input = generateInput(BASE);

graph(input[0], "0");
graph(input[0], "1");
graph(input[0], "2");

d3.select("body")
.on("keydown", function() { 
  if (d3.event.keyCode === 37) {
    // left arrow
    current_clock = (current_clock + 3 - 1) % 3;
    setBackground(current_clock);
  } else if (d3.event.keyCode === 38) {
    // up arrow
    var selected = "#clock" + current_clock.toString();
    var svg = d3.select(selected).selectAll("svg");
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
          }, myDuration + 15);
        }
      }
    }, myDuration + 15);
  } else if (d3.event.keyCode === 39) {
    // right arrow
    current_clock = (current_clock + 1) % 3;
    setBackground(current_clock);
  } else if (d3.event.keyCode === 40) {
    // down arrow
    var selected = "#clock" + current_clock.toString();
    var svg = d3.select(selected).selectAll("svg");
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
          }, myDuration + 15);
        }
       }
    }, myDuration+15);
  }
});

function graph(data, index) {
  var selected = "#clock" + index;
  d3.select(selected).selectAll("svg").remove();
  var svg = d3.select(selected).selectAll("svg")
    .data(input)
    .enter().append("svg")
    .attr("width", width + margin)
    .attr("height", height + margin * 2)
    .append("g")
    .attr("transform", "translate(" + (width / 2 + margin / 2) + "," + (height / 2 + margin) + ")");

  addTicks(BASE, svg);

  var drag = setdrag();
  svg.call(drag);
  switchToIndex(0, svg, data);
  setBackground(2);

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
  if(d = findPreceding(i, data0, data1, key)) {

    var obj = cloneObj(d)
    obj.startAngle = d.endAngle;
    return obj;

  } else if(d = findFollowing(i, data0, data1, key)) {

    var obj = cloneObj(d)
    obj.endAngle = d.startAngle;
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
  for (var i = 0; i < 3; i++) {
    var selected = "#clock" + i;
    var svg = d3.select(selected).selectAll("svg");
    if (i === parseInt(index)) {
      svg.attr("style", "background: #d3d3d3;");
    } else {
      svg.attr("style", "background: white;");
    }
  } 
}

function goBackByOne(svg, data, clock_index) {
  var obj = {};
  if (current_index[clock_index] == 0) {         
    current_index[clock_index] = BASE;
    temp = current_index[clock_index];
    obj["key"] = index_key[temp];
    obj["values"] = [data[temp*2], data[temp*2+1]];
    change(obj, svg);
    setTimeout(function(){            
      current_index[clock_index] = (current_index[clock_index] + BASE - 1) % BASE;
      temp = current_index[clock_index];
      obj["key"] = index_key[temp];
      obj["values"] = [data[temp*2], data[temp*2+1]];
      change(obj, svg);
    }, myDuration + 10);
  } else {          
    current_index[clock_index] = (current_index[clock_index] + BASE - 1) % BASE;
    temp = current_index[clock_index];
    obj["key"] = index_key[temp];
    obj["values"] = [data[temp*2], data[temp*2+1]];
    change(obj, svg);
  }      
}

function incrementByOne(svg, data, clock_index) {
  var obj = {};
  current_index[clock_index] = (current_index[clock_index] + 1);
  temp = current_index[clock_index];
  obj["key"] = index_key[temp];
  obj["values"] = [data[temp*2], data[temp*2+1]];
  change(obj, svg);
  if (temp == BASE) {
    setTimeout(function(){            
      current_index[clock_index] = 0;
      temp = current_index[clock_index]
      obj["key"] = index_key[temp];
      obj["values"] = [data[temp*2], data[temp*2+1]];
      change(obj, svg);
    }, myDuration + 10);
  }
}


function switchToIndex(index, svg, data) {
  var obj = {};
  current_index[current_clock] = index;
  temp = current_index[current_clock]
  obj["key"] = index_key[temp];
  obj["values"] = [data[temp*2], data[temp*2+1]];
  change(obj, svg);
}

function change(region, svg) {
  var path = svg.selectAll("path");
  var data0 = path.data(),
  data1 = pie(region.values);
  path = path.data(data1, key);

  path
  .transition()
  .duration(myDuration)
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
    if (d.data.region === "East") {
      return "#de0063";
    } else {
      return "#ffff00";
    }
   return color(d.data.region)
 })
  .transition()
  .duration(myDuration)
  .attrTween("d", arcTween)


  path
  .exit()
  .transition()
  .duration(myDuration)
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