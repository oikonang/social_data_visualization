//d3.select("body").append("p").text("New paragraph!");
var dataset;
d3.csv("food.csv", function(data) {
	//var p = document.getElementById("food");
	dataset = data;
});

var dataset = [ 5, 10, 15, 20, 25 , 30, 35, 40];

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
refresh();
function refresh() {
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
