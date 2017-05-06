//Define here global variables
var clustersFilename = "d3_data_files/clusters_shrinked.csv";
var centroidsFilename = "d3_data_files/centroids.json";
var geojsonMapFilename = "d3_data_files/nyc.geojson";
var clusterColors = ['#9e0142','#d53e4f','#f46d43','#fdae61','#fee08b','#e6f598','#abdda4','#66c2a5','#3288bd','#5e4fa2'];
var clusterMapCenter = [-74.011, 40.676];
var clusterKeys;
var svg_2,projection_clusterMap;
var defaultClusteringTitle = "Clustering of New York City UNSANITARY CONDITION Complaints";
var rootClusterTitle = "Clustered Map of NYC with K = ";
var width_2 = 1000;
var height_2 = 800;
var toggleClustering = false;

//Load GeoJSON map of New York
function loadNewYorkMap() {

  //Define projection_clusterMap for the bounding box
  projection_clusterMap = d3.geoMercator()
  .center(clusterMapCenter)
  .scale(75000)
  .translate([width_2 / 2, height_2 / 2])

  //Define path generator
  var path = d3.geoPath()
  .projection(projection_clusterMap);

  // Define the div for the tooltip
  var div = d3.select("#clustering")
  .append("div") 
  .classed("tooltip",true)
  .style("opacity", 0);

  //Create SVG element
  svg_2 = d3.select("#clustering")
  .append("svg")
  .attr("height", height_2)
  .attr("width", width_2);

  //Load the json coordinates and print the map
  d3.json(geojsonMapFilename, function(json) {
    svg_2.selectAll("path")
    .data(json.features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("stroke", "white")
    .attr("stroke-width", 2)
    .attr("stroke-opacity", 0.3)
    .style("fill", "black")
    .style("opacity", "0.4");

    loadDefaultPoints();
});
}

//Load points on the map by default at first load of the page, without clustering
function loadDefaultPoints() {
    //Load in cluster data and print the prostitution points on the map 
    d3.csv(clustersFilename, function(data) {
        clusterKeys = d3.keys(data[0]).slice(2);
        dataset = data;
        //Get reference to SVG element in DOM
        svg_2.selectAll(".points")
        .data(data)
        .enter()
        .append("circle")
        .classed("points",true)
        .attrs({
            cx: function(d) {return projection_clusterMap([d["Longitude"], d["Latitude"]])[0];},
            cy: function(d) {return projection_clusterMap([d["Longitude"], d["Latitude"]])[1];},
            r: 3
        })
        .styles({
            fill: clusterColors[0], //no clustering by default
            opacity: 0.8
        });

      //Must be invoked here because it depends on the number of clusters!
      loadSlider();
  });
}

//Clusterize points in the map, by coloring according to the cluster they belong to
function clusterize(k) {
    d3.csv(clustersFilename, function(data) {
        svg_2.selectAll(".points")
        .transition()
        .duration(500)
        .style("fill", function(d){
            return clusterColors[d[clusterKeys[k-2]]];
        });
    });

    //Update title
    $("#clustering").find("h1").html(rootClusterTitle+k);
}


//Show/Hide slider elements
function toggleClusteringSlider() {
    toggleClustering = !toggleClustering;
    var fadingValue = toggleClustering ? 0 : 1;
    $("#slider").fadeTo("slow",fadingValue);
    $(".sliderInfo").fadeTo("slow",fadingValue);
    if(fadingValue==1) {
        $("#clustering").find(".fancy_btn").html("<span>Remove Clustering</span>");
        var k = $( "#slider" ).slider( "value" );
        clusterize(k);
        loadCentroids(k);
    }
    else {
        $("#clustering").find(".fancy_btn").html("<span>Activate Clustering</span>");
        d3.selectAll(".points")
        .transition()
        .duration(500)
        .style("fill", function(d){
            return clusterColors[0];
        });

        removeCentroids();

        //Update title
        $("#clustering").find("h1").html(defaultClusteringTitle);
    }
}

//Load Slider and assign onSlide function
function loadSlider() {
    $( "#slider" ).slider({
      value:2,
      min: 2,
      max: clusterKeys.length+1,
      step: 1,
      animate: "fast",
      slide: function( event, ui ) {
        var k = ui.value;
        $( "#numClusters" ).val(k);
        clusterize(k);
        loadCentroids(k);
    }
});
    $( "#numClusters" ).val($( "#slider" ).slider( "value" ) );
}

function loadCentroids(k) {
    removeCentroids();
    d3.json(centroidsFilename,function(json) {
        var centroidsCoordinates = json[clusterKeys[k-2]];
        svg_2.selectAll(".centroids")
        .data(centroidsCoordinates)
        .enter()
        .append("circle")
        .classed("centroids",true)
        .attrs({
            cx: function(d) {return projection_clusterMap([d[1], d[0]])[0];},
            cy: function(d) {return projection_clusterMap([d[1], d[0]])[1];},
            r: 15,
            value: function(d,i) {return k;}
        })
        .styles({
            fill: function(d,i) {return clusterColors[i];},
            opacity: 0
        });
        $(".centroids").fadeTo("fast",1);
        $(".centroids").animate({
            r: "+=5",
        },300).promise().then(function() {
            $(".centroids").animate({
                r: "-=5"
            });});
    });
}

function removeCentroids() {
    $(".centroids").fadeTo("slow",0);
    $(".centroids").remove();
}

loadNewYorkMap(); //It will invoke, nestedly, loadDefaultPoints() and loadSlider()
toggleClusteringSlider();
$("#clustering").find(".fancy_btn").click(toggleClusteringSlider);
$("#clustering").find("h1").html(defaultClusteringTitle);