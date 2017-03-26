function loadBarPlot() {
	d3.csv("js/crime_occurences.csv", function(data) {
		dataset_b = data;

//Width and height
var w_b = 1000;
var h_b = 450;
var padding_b = 30;

//var formatPercent = d3.format(".0%");

//Create scaled x
var xScale_b = d3.scaleBand()
               .domain(dataset_b.map(function(d) { return d.Category; })) //Assign Cateory value
               .rangeRound([0, w_b]) //Create equally big widths for the bars within the svg total width 
               .paddingInner(0.05);//Create padding between consecutive bars in percentage

//Create scaled y
var yScale_b = d3.scaleLinear()
.domain([0, d3.max(dataset_b, function(d) { return +d.count;})])
               .range([h_b, 0]);  // Invert yaxis upside-down

//Define X axis
var xAxis_b = d3.axisBottom()
.scale(xScale_b);

//Define Y axis
var yAxis_b = d3.axisLeft()
.scale(yScale_b);

//Create tip
var tip = d3.tip()
.attr('class', 'd3-tip')
.offset([-10, 0])
.html(function(d) {
	return "<strong>Frequency:</strong> <span style='color:red'>" + d.count + "</span>";
})

//Create SVG element
var svg_b = d3.select("#barplot")
.append("svg")
.attr("width", w_b)
.attr("height", h_b);

// Call the tip
svg_b.call(tip);

//Add a rectangle to each element
svg_b.selectAll(".bar")
.data(dataset_b)
.enter()
.append("rect")
.attr("class", "bar")
.attr("x", function(d) { return xScale_b(d.Category); })
       .attr("y", function(d) { return  yScale_b(+d.count); }) //invert yaxis upside-down
       .attr("width", xScale_b.bandwidth())
       .attr("height", function(d,i) { return h_b - yScale_b(+d.count);})   //invert yaxis upside-down
       .on('mouseover', tip.show)
       .on('mouseout', tip.hide);
       
//Add X axis
svg_b.append("g")
.attr("class", "x axisb")
.attr("transform", "translate(0," + h_b + ")")
.call(xAxis_b)
.selectAll("text")
.attr("y", 0)
.attr("x", 9)
.attr("dy", ".35em")
.attr("transform", "rotate(90)")
.style("text-anchor", "start");

//Add Y axis
svg_b.append("g")
.attr("class", "y axisb")
       .attr("transform", "translate(0,0)")  // + 5 + "
       .call(yAxis_b);

// Text label for the Y axis
svg_b.append("text")
.attr("transform", "rotate(-90)")
.attr("y", 0 - padding_b*3)
.attr("x",0 - (h_b / 2))
.attr("dy", "1em")
.attr("font-family", "sans-serif")
.style("text-anchor", "middle")
.text("FREQUENCY");

// Text for the title of the plot
svg_b.append("text")
.attr("class", "text title") 
.attr("transform","translate(" + w_b/2 + ",0)")
.style("text-anchor","middle")
.attr("font-family", "sans-serif")
.attr("font-size", "20px")
.text("Frequency of San Francisco categories of crimes (2003-2016)");

});
}

loadBarPlot();