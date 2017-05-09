// Define global variables
var width_4 = 1000,
height_4 = 800,
centered;

function createNYCMap(){

            // Define the projection boundaries
            var projection = d3.geoMercator()
            .center([-73.94, 40.70])
            .scale(75000)
            .translate([(width_4) / 2, (height_4) / 2]);

            // Define the path
            var path = d3.geoPath()
            .projection(projection);

            // Define the div for the tooltip
            var div = d3.select("#map_4")
            .append("div") 
            .attr("class", "tooltip")       
            .style("opacity", 0);

            // Define the svg for the map
            var svg = d3.select("#map_4")
            .append("svg")
            .attr("width", width_4)
            .attr("height", height_4);

            // Define the g for each neighborhood
            var g = svg.append("g");

            d3.json("d3_data_files/nyc.geojson", function(json) {
                g.append("g")
                .attr("id", "neighborhood")
                .selectAll("path")
                .data(json.features)
                .enter()
                .append("path")
                .attr("d", path)
                .on("click", clicked);
            });

            function clicked(d){
                var x, y, k;
            // IF zoomed-in state is on
            if (d && centered !== d) {
                // Change the center of the projection
                var centroid = path.centroid(d);
                x = centroid[0];
                y = centroid[1];
                k = 4;
                centered = d;
                // Show tooltip
                div.transition()    
                .duration(200)    
                .style("opacity", .9);  

                // Write staff on tooltip
                div.html("Neighborhood: " + "<strong>" + d.properties.PO_NAME.toLowerCase().toUpperCase() + "</strong>" + "<br/>" + 
                   "Number of Complaints: " + '<strong id="frequency"></strong>' + "<br/>" + 
                   "Most Common Complaint: " + '<strong id="districtName"></strong>'
                   )
                // Place the tooltip
                div.style("left", (d3.mouse(this)[0]) + "px")   
                .style("top", (d3.mouse(this)[1]) + "px");

                // Load CSV for filling the missing info on tooltip
                d3.csv("d3_data_files/total_neight.csv", function(data) {
                    var districtName = d.properties.PO_NAME.toUpperCase();
                    var matchFound = false;
                    for(var i=0;i<data.length;i++) {
                        if (data[i]["City"]==districtName) {
                            $("#districtName").html(data[i]['top_complaint']);
                            $("#frequency").html(data[i]['count']);
                            matchFound = true;
                        }
                    }
                    if (!matchFound) {
                        $("#districtName").html("No data available");
                        $("#frequency").html("No data available");
                    }
                });
            // IF zoomed-out state is on
        } else {
            x = width_4 / 2;
            y = height_4 / 2;
            k = 1;
            centered = null;
            $(".tooltip").css('opacity', 0);
        }
            //
            g.selectAll("path")
            .classed("active", centered && function(d) {
                return d === centered;
            })

            g.transition()
            .duration(750)
            .attr("transform", "translate(" + width_4 / 2 + "," + height_4 / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
            .style("stroke-width", 1.5 / k + "px");
        }
    }


        // Load NYC map function
        createNYCMap();