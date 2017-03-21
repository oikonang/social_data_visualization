//d3.select("body").append("p").text("New paragraph!");
var dataset;
d3.csv("food.csv", function(data) {
	//var p = document.getElementById("food");
	dataset = data;
});

var dataset = [ 5, 10, 15, 20, 25 ];

d3.select("body").selectAll("p")
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
