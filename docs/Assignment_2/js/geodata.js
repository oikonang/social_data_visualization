function loadGeodata() {
//Width and height
var w = 1000;
var h = 800;  
var colors = ['#E64A19','#388E3C','#303F9F','#FFEB3B','#00BCD4','#FF4081','seagreen','skyblue','salmon'];
    var buttonFlag = $(".currentFlag").attr("value"); //Set default to 0 for no clustering
    var title = $(".currentFlag").attr("alt");
    var clusterClasses = ["clusters_2","clusters_3","clusters_4","clusters_5","clusters_6"];
    var centroidsKeys = ["centroids_2","centroids_3","centroids_4","centroids_5","centroids_6"];
    var allCentroids = [];

    //Populate the centroids parsing the JSON
    function parseJSON(file) {
      d3.json(file,function(json) {
        for(var i=0;i<centroidsKeys.length;i++) {
          allCentroids[i] = json[centroidsKeys[i]];
        }
      });
    }
    parseJSON("js/centroids.json");

    //Define projection for the bounding box
    var projection = d3.geoMercator()
    .center([-122.433701, 37.767683])
                       .scale(250000) //zoom-in (default=1000)
                       .translate([w / 2, h / 2]);

    //Define path generator
    var path = d3.geoPath()
    .projection(projection);

    //Create SVG element
    var svg = d3.select("#geodata")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

    //Load the json coordinates and print the map
    d3.json("js/geo.json", function(json) {
      svg.selectAll("path")
      .data(json.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("stroke", "white")
      .attr("stroke-width", 2)
      .attr("stroke-opacity", 0.3)
      .style("fill", "black")
      .style("opacity", "0.4");
    });
    
    //Load in cluster data and print the prostitution points on the map 
    d3.csv("js/clusters.csv", function(data) {

      // Create crimes coordinates by default
      svg.selectAll(".points")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "points")
      .attr("cx", function(d) {
       return projection([d.X, d.Y])[0];
     })
      .attr("cy", function(d) {
       return projection([d.X, d.Y])[1];
     })
      .attr("r", 5)
      .style("fill", colors[0])
      .style("opacity", 0.3);

      // Set Text for the title of the plot
      svg.append("text")
      .attr("class", "text title") 
      .attr("transform","translate(" + w/2 + ",80)")
      .style("text-anchor","middle")
      .attr("font-size", "20px")
      .text(title);

      //Draw the centroids for the current clustering
      function centroiding(clusterClass,data){
        svg.selectAll(clusterClass)
        .data(data)
        .enter()
        .append("circle")
        .transition()
        .duration(500)
        .attr("class", clusterClass)
        .attr("cx", function(d) { return projection(d)[0]; })
        .attr("cy", function(d) { return projection(d)[1]; })
        .attr("r", 15)
        .attr("stroke", "white")
        .attr("stroke-width", 3)
        .style("fill", "black");
      }

      //Clustering function to recolor the points
      function clustering(title,isPreview){
        var currentFlag = !isPreview ? buttonFlag : previewButtonFlag;
        var currentTitle = !isPreview ? title : previewTitle;
        svg.selectAll(".text.title").text(currentTitle);
        if(currentFlag==-1)
          svg.selectAll(".points").style("fill", colors[0]);
        else
          svg.selectAll(".points").style("fill", function(d){return colors[d[clusterClasses[currentFlag]]]; });
        //Remove centroids not needed
        for (i = 0; i < clusterClasses.length; i++) {
            if (i == currentFlag) { continue; } //don't remove the current centroids
            svg.selectAll("."+clusterClasses[i]).remove();
          }

          if(currentFlag!=-1) {
          //Load the centroids for the current clustering
          centroiding(clusterClasses[currentFlag], allCentroids[currentFlag]);
        }
      }

      //Setting onMouseClick event handler for buttons, set current clustering
      d3.selectAll(".btn").on("click", function(){                    
        buttonFlag = $(this).attr("value");
        title = $(this).attr("alt");
        var isPreview = false;
        $(".btn").removeClass("currentFlag");
        $(this).addClass("currentFlag");
      });

      //Setting onMouseOver event handler for buttons, preview clustering
      d3.selectAll(".btn").on("mouseover", function(){                    
        previewButtonFlag = $(this).attr("value");
        previewTitle = $(this).attr("alt");
        var isPreview = true;
        if(!$(this).hasClass("currentFlag")) 
          clustering(title,isPreview);
      });

      //Setting onMouseOut event handler for buttons, switch back to current clustering unless button has been clicked
      d3.selectAll(".btn").on("mouseout", function(){
        var isPreview = false;
        if(!$(this).hasClass("currentFlag"))                    
          clustering(title,isPreview);
      });
    });
  }

loadGeodata();