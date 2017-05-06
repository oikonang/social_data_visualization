
var width = 1000;
var height = 800;
var buttonFlag = $(".currentFlag").attr("value");
var title_3 = $(".currentFlag").attr("alt");
var neighNumber = ["neighs_5","neighs_10","neighs_30"];
var knnScores = ["61.60%", "53.22%", "44.32%"];

function createKNNMap(){
    //Define projection for the bounding box
    var projection = d3.geoMercator()
    .center([-73.94, 40.70])
    .scale(75000)
    .translate([width / 2, height / 2])

    //Define path generator
    var path = d3.geoPath()
    .projection(projection);

    // Define the div for the tooltip
    var div = d3.select("#map_3")
    .append("div") 
    .attr("class", "tooltip")       
    .style("opacity", 0);

    //Create SVG element
    var svg = d3.select("#map_3")
    .append("svg")
    .attr("height", height)
    .attr("width", width);

    //Load the json coordinates and print the map
    d3.json("d3_data_files/nyc.geojson", function(json) {
      svg.selectAll("path")
      .data(json.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("id", "neighborhood");

    //Load in csv and print the coordinates on the map 
    d3.csv("d3_data_files/KNN_predictions_2.csv", function(data) {
      svg.selectAll(".points")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "points")
      .attr("cx", function(d) { return projection([d.lon, d.lat])[0]; })
      .attr("cy", function(d) { return projection([d.lon, d.lat])[1]; })
      .attr("r", 6)
      .style("fill", "red") // the color is not mandatory as it is transparent
      .style("opacity", 0)
      .on("mouseover", function(d) {  
        div.transition()    
        .duration(200)    
        .style("opacity", .9);    

        div.html("Number of Nearest Neighbors: " + "<strong>" + title_3 + "</strong>" + "<br/>" + 
         "KNN Prediction Score: " + "<strong>" + knnScores[buttonFlag] + "</strong>" + "<br/>" +
         "Predicted Noise Complaint: " + "<strong>" + d[neighNumber[buttonFlag]] + "</strong>")  
        .style("left", (d3.mouse(this)[0]) + "px")   
        .style("top", (d3.mouse(this)[1] + 930) + "px");  
      })          
      .on("mouseout", function(d) {   
        div.transition()    
        .duration(500)    
        .style("opacity", 0);
      });;

      //Setting onMouseClick event handler for buttons, set current clustering
      d3.selectAll(".fancy_btn")
      .on("click", function(){                    
        buttonFlag = $(this).attr("value");
        title_3 = $(this).attr("alt");
        $(".btn").removeClass("currentFlag");
        $(this).addClass("currentFlag");
      });
    });
  });
  }
  createKNNMap();
