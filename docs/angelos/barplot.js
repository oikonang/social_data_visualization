d3.csv("crime_occurences.csv", function(data) {
    dataset_b = data;
    console.log(d3.max(dataset_b, function(d) { return +d.count;}));
    //console.log(d3.max(dataset, function(d) { return +d.count_veh_2003; }));

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
                    //.tickFormat(formatPercent);

    //Create SVG element
    var svg_b = d3.select("body")
                .append("svg")
                .attr("width", w_b)
                .attr("height", h_b);

    //Add a rectangle to each element
    svg_b.selectAll("rect")
           .data(dataset_b)
           .enter()
           .append("rect")
           .attr("fill", function(d) {
                return "rgb(100, 100, " + (+d.count * 10) + ")";
            })
           .attr("x", function(d) { return xScale_b(d.Category); })
           .attr("y", function(d) { return  yScale_b(+d.count); }) //invert yaxis upside-down
           .attr("width", xScale_b.bandwidth())
           .attr("height", function(d,i) { return h_b - yScale_b(+d.count);});   //invert yaxis upside-down

           

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

    svg_b.append("g")
           .attr("class", "y axisb")
           .attr("transform", "translate(0,0)")  // + 5 + "
           .call(yAxis_b);


               // svg.selectAll(".bar")
               //    .data(data)
               //    .enter()
               //    .append("rect")
               //    .attr("class", "bar")
               //    .attr("x", function(d) { return x(d.letter); })
               //    .attr("width", x.rangeBand())
               //    .attr("y", function(d) { return y(d.frequency); })
               //    .attr("height", function(d) { return height - y(d.frequency); })
               //    .on('mouseover', tip.show)
               //    .on('mouseout', tip.hide)
});