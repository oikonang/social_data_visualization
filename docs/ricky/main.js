//d3.select("body").append("p").text("New paragraph!");
var dataset;
d3.csv("food.csv", function(data) {
	//var p = document.getElementById("food");
	dataset = data;
});

//Global variables
var dataset = generateRandomData(10);
var colors = ["red","green","blue","green","orange","yellow","pink"];

function generateRandomData(tot) {
	dataset = [];
	for(var i=0;i<tot;i++) {
		dataset[i]=Math.floor((Math.random()*100)+1);
	}
	return dataset;

}

//Numbers
d3.select("#numbers").selectAll("p")
.data(dataset)
.enter()
.append("p")
.text(function(d) { return d; })
.style("color", function(d) {
	if (d > 15) { //Threshold of 15
		return "red";
	} else {
		return "black";}});
console.log(d3.selectAll("p"));

//Draw circles
refreshCircles();
function refreshCircles() {
	var dataset = [ 5, 10, 15, 20, 25 , 30, 35, 40];
	startingCx = 100;
	currentCx = startingCx;
	d3.select("#drawing").selectAll("circle").remove();
	d3.select("#drawing").selectAll("circle")
	.data(dataset)
	.enter()
	.append("circle")
	.style("cy",function(d) {
		return 100;
	})
	.style("cx",function(d) {
		currentCx+=100;
		return currentCx;
	})
	.style("r",function(d) {return d+50;})
	.style("fill",function(d) {
		colors = ["red","green","blue","green","orange","yellow","pink"];
		var item = colors[Math.floor(Math.random()*colors.length)];
		return item;
	})
	.style("stroke",function(d) {
		colors = ["red","green","blue","green","orange","yellow","pink"];
		var item = colors[Math.floor(Math.random()*colors.length)];
		return item;
	})
	.style("stroke-width",function(d) {
		widths = ["5","10","3","7","20","15"];
		var item = widths[Math.floor(Math.random()*widths.length)];
		return item;
	});
	//console.log(d3.selectAll("circle"));
}

//General Properties of SVG
w = 1000;
h = 500;
barPadding = 1;

/*DRAW BAR CHART*/
var svg = d3.select("#bars").append("svg")
.attrs({
	width: w,
	height: h
})
.style("border","3px solid black");
var dataset = generateRandomData(40);

var xScale = d3.scaleBand()
.domain(d3.range(dataset.length))
.range([0,w])
.padding(0.05);

var yScale = d3.scaleLinear()
.domain([d3.max(dataset),d3.min(dataset)])
.range([h,0]);

svg.selectAll("rect")
.data(dataset)
.enter()
.append("rect")
.attrs({
	x: function(d,i) {return xScale(i);},
	y: function(d) {return h-yScale(d);},
	fill: function(d) {return "rgb(0,0,"+d*3+")";},
	height: function(d) {return yScale(d);}
})
.classed("bar",true)
.styles({
	width:  w/dataset.length-barPadding
});

svg.selectAll("text")
.data(dataset)
.enter()
.append("text")
.text(function(d) {
	if (d>50) {
		return d;
	} else return "";
})
.attrs({
	x: function(d,i) {return xScale(i)+ (w / dataset.length - barPadding) / 2},
	y: function(d) {return h-yScale(d)+14},
	fill: "white"
})
.attr("font-size","13px")
.attr("text-anchor","middle");

function refreshBarChart() {
	var dataset = generateRandomData(40);
	//Update bars height
	d3.select("#bars").select("svg").selectAll("rect")
	.data(dataset)
	.transition()
	.duration(1000)
	.attrs({
		y: function(d) {return h-yScale(d);},
		fill: function(d) {return "rgb(0,0,"+d*3+")";},
		height: function(d) {return yScale(d);}
	});

	//Update labels height
	d3.select("#bars").select("svg").selectAll("text")
	.data(dataset)
	.transition()
	.duration(1000)
	.text(function(d) {
		if (d>50) {
			return d;
		} else return "";
	})
	.attr("y", function(d) {
		return h-yScale(d)+14;
	});
}

/*DRAW random circles*/
var svg = d3.select("#svgCirclesArea")
.append("svg")
.attrs({
	width: w,
	height: h,
	id: "svgCircles"
})
.style("border","3px solid black");
refreshSvg();

function refreshSvg() {

	var animateCircles = function(targetElement, speed){

		$(targetElement).css({left:'-200px'});
		$(targetElement).animate(
		{
			'left': $(document).width() + 200
		},
		{
			duration: speed,
			complete: function(){
				animateCircles(this, speed);
			}
		}
		);
	};
	var dataset = generateRandomData(500);
	d3.select("#svgCircles").selectAll("circle").remove();
	var circles = d3.select("#svgCircles").selectAll("circle")
	.data(dataset)
	.enter()
	.append("circle");

	circles.attr("r",function(d) {
		return d/5;
	})
	.attr("cx",function(d) {
		return Math.floor(Math.random()*w+1);
	})
	.attr("cy",function(d) {
		return Math.floor(Math.random()*h+1);
	})
	.style("fill",function(d) {
		return colors[Math.floor(Math.random()*colors.length)];
	})
	.style("stroke",function(d) {
		return colors[Math.floor(Math.random()*colors.length)];
	})
	.style("stroke-width",function(d) {
		return d/20;
	})
	.classed("circles",true);

	//animateCircles($(".circles"),100);
}




