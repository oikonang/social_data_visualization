function loadScatterplot() {
//Load total data from csv
d3.csv("js/total.csv", function(data) {
    dataset = data;

    //Width and height
    var w = 1000;
    var h = 450;
    var padding = 30;

    //Create scaled x
    var xScale = d3.scaleLinear()
                   .domain([0, d3.max(dataset, function(d) { return +d.count_pros_2003;})]) // from 0 to maximum value of input(x)
                     .range([padding, w - padding * 2]); //from padding to the number of pixels declared in width - pad in order to avoid the edges
    //Create scaled y
    var yScale = d3.scaleLinear()
                     .domain([0, d3.max(dataset, function(d) { return +d.count_veh_2003; })]) // from 0 to maximum value of input(y)
                     .range([h - padding, padding]); //from height - padding to the number of pixels declared in pad in order to avoid the edges and turn y upside down
    //Create scaled r(radius) of the scatter points
    var rScale = d3.scaleLinear()
                     .domain([0, d3.max(dataset, function(d) { return +d.count_tot_2003; })]) // from 0 to maximum value of input(y)
                     .range([2, 30]); // Size of points   

    //Define X axis
    var xAxis = d3.axisBottom()
    .scale(xScale)
    .ticks(5);

    //Define Y axis
    var yAxis = d3.axisLeft()
    .scale(yScale)
    .ticks(5); 
    

    //Create SVG element
    var svg = d3.select("#scatterSvg")
    .append("svg")
    .attr("width", w)
    .attr("height", h);
    
    //Define clipping path
    svg.append("clipPath")        //Make a new clipPath
       .attr("id", "chart-area") //Assign an ID
       .append("rect")           //Within the clipPath, create a new rect
       .attr("x", padding)
       .attr("y", padding)
       .attr("width", w - padding * 3)
       .attr("height", h - padding *2);

    //Create circles
    svg.append("g")
    .attr("id", "circles")
    .attr("clip-path", "url(#chart-area)")
    .selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("cx", function(d) {
      return xScale(+d.count_pros_2003);
  }) 
    .attr("cy", function(d) {
      return yScale(+d.count_veh_2003);
  })
    .attr("r", function(d) {
      return rScale(+d.count_tot_2003);
  });

    //Create labels
    svg.selectAll("text")
    .data(dataset)
    .enter()
    .append("text")
    .text(function(d) {
      return d.PdDistrict;
  })
    .attr("x", function(d) {
      return xScale(+d.count_pros_2003);
  })
    .attr("y", function(d) {
      return yScale(+d.count_veh_2003);
  })
    .attr("font-family", "sans-serif")
    .attr("font-size", "11px")
    .attr("fill", "red");

    //Create X axis
    svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + (h - padding) + ")")
    .call(xAxis);

    // Text label for the X axis
    svg.append("text")             
    .attr("transform","translate(" + w/2 + ", " + (h+10) + ")")
    .style("text-anchor", "middle")
    .attr("font-family", "sans-serif")
    .text("PROSTITUTION");

    //Create Y axis
    svg.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + padding + ",0)")
    .call(yAxis);

    // Text label for the Y axis
    svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - padding)
    .attr("x",0 - (h / 2))
    .attr("dy", "1em")
    .attr("font-family", "sans-serif")
    .style("text-anchor", "middle")
    .text("VEHICLE THEFT");

    // Text for the title of the plot
    svg.append("text")
    .attr("class", "text title") 
    .attr("transform","translate(" + w/2 + ",0)")
    .style("text-anchor","middle")
    .attr("font-family", "sans-serif")
    .attr("font-size", "20px")
    .text("Correlation of San Francisco crimes in 2003");
    

    //////////////////////////////////////On click update with new data////////////////////////////////////
    d3.select("#scatterplot button").on("click", function(){

        //Update all circles
        svg.selectAll("circle")
        .data(dataset)
        .transition()
        .duration(1000)    
        .attr("cx", function(d) {
          return xScale(+d.count_pros_2015);
      })
        .attr("cy", function(d) {
          return yScale(+d.count_veh_2015);
      })
        .attr("r", function(d) {
          return rScale(+d.count_tot_2015);
      });
        //Update label's position
        svg.selectAll("text")
        .data(dataset)
        .transition()
        .duration(1000)
        .attr("x", function(d) {
          return xScale(+d.count_pros_2015);
      })
        .attr("y", function(d) {
          return yScale(+d.count_veh_2015);
      });
        //Update title
        svg.selectAll(".text.title")
        .text("Correlation of San Francisco crimes in 2015");
    });
});
}

loadScatterplot();