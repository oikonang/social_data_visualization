//Load total data from csv
var dataset;
d3.csv("total.csv", function (data) {
    dataset = data;

    //Width and height
    var w = 1000;
    var h = 450;
    var padding = 30;

    //Create scale functions
    // xScale: prostitution
    var xScale = d3.scaleLinear()
        .domain([0, d3.max(dataset, function (d) {
            var pros_03 = parseInt(+d.count_pros_2003, 10);
            var pros_15 = parseInt(+d.count_pros_2003, 10);
            if (pros_03 > pros_15) {
                return pros_03;
            } else {
                return pros_15;
            }
        })])
        .range([padding, w - padding * 2]);

    // yScale: vehicle
    var yScale = d3.scaleLinear()
        .domain([0, d3.max(dataset, function (d) {
            var veh_03 = parseInt(+d.count_veh_2003, 10);
            var veh_15 = parseInt(+d.count_veh_2015, 10);
            if (veh_03 > veh_15) {
                return veh_03;
            } else {
                return veh_15;
            }
        })])
        .range([h - padding, padding]);

    //Define X axis
    var xAxis = d3.axisBottom()
        .scale(xScale)
        .ticks(5);
    //Define Y axis
    var yAxis = d3.axisLeft()
        .scale(yScale)
        .ticks(5);

    //Create SVG element
    var svg = d3.select("body")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    //Define clipping path
    svg.append("clipPath") //Make a new clipPath
        .attr("id", "chart-area") //Assign an ID
        .append("rect") //Within the clipPath, create a new rect
        .attr("x", padding) //Set rect's position and size…
        .attr("y", padding)
        .attr("width", w - padding * 3)
        .attr("height", h - padding * 2);

    //Create circles
    svg.append("g") //Create new g
        .attr("id", "circles") //Assign ID of 'circles'
        .attr("clip-path", "url(#chart-area)")
        .selectAll("circle")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("cx", function (d) {
            return xScale(+d.count_pros_2003);
        })
        .attr("cy", function (d) {
            return yScale(+d.count_veh_2003);
        })
        .attr("r", 2);

    //Create labels
    svg.selectAll("text")
        .data(dataset)
        .enter()
        .append("text")
        .text(function (d) {
            return d.PdDistrict;
        })
        .attr("x", function (d) {
            return xScale(+d.count_pros_2003);
        })
        .attr("y", function (d) {
            return yScale(+d.count_veh_2003);
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .attr("fill", "red");

    //Create X axis
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (h - padding) + ")")
        .call(xAxis);

    //Create Y axis
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + padding + ",0)")
        .call(yAxis);

    //On click, update with new data			
    d3.select("button")
        .on("click", function () {
            //Update all circles
            svg.selectAll("circle")
                .data(dataset)
                .transition()
                .duration(1000)
                .on("start", function repeat() {
                    d3.select(this)
                        .style("fill", "magenta")
                        .style("r", 3)
                })
                // .on("end", function repeat() {
                //     d3.select(this)
                //         .style("fill", "black")
                //         .style("r", 2)
                // })                    
                .attr("cx", function (d) {
                    return xScale(+d.count_pros_2015);
                })
                .attr("cy", function (d) {
                    return yScale(+d.count_veh_2015);
                })
                .transition()
                .style("fill", "black")
                .style("r", 2);

            //Update label's position
            svg.selectAll("text")
                .data(dataset)
                .transition()
                .duration(1000)
                .attr("x", function (d) {
                    return xScale(+d.count_pros_2015);
                })
                .attr("y", function (d) {
                    return yScale(+d.count_veh_2015);
                });

            //Update x-axis
            svg.select(".x.axis")
                .transition()
                .duration(1000)
                .call(xAxis);

            //Update y-axis
            svg.select(".y.axis")
                .transition()
                .duration(1000)
                .call(yAxis);

        });
});