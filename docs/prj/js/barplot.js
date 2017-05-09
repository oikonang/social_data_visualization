//Global variables
var width_1 = 800;
var height_1 = 400;
var barPadding_1 = 80;
var treePredictionsFile = "d3_data_files/decision_tree_predictions.json";
var initBarplot = false;
var barColors = ['#99ff66','#ff7733','#4db8ff'];

function loadBarplotData(district,month,time) {
	initBarplot = true;
	d3.json(treePredictionsFile, function(data) {

		var probabilities = data[district][month][time]["probabilities"]; //array of probabilities, len=3
		var complaints = data[district][month][time]["predictions"]; //array of complaint types, len=3

		//Define scales
		var xScale = d3.scaleBand()
		.domain(d3.range(complaints.length))
		.range([0,width_1])
		.padding(0.23);

		var yScale = d3.scaleLinear()
		.domain([0,100]) //since they will be percentages, it's fixed 0%-100%
		.range([height_1,0]);

		//Get reference to SVG element in DOM
		var svg = d3.select("#treeBarplot").select("svg");

		//Define X axis
		var xAxis = d3.axisBottom()
		.scale(xScale)
		.tickFormat("");

        //Define Y axis
        var yAxis = d3.axisLeft()
        .scale(yScale);

		//Draw bars
		svg.selectAll("rect")
		.data(probabilities)
		.enter()
		.append("rect")
		.attrs({
			x: function(d,i) {return xScale(i);},
			y: function(d) {return yScale(+d);},
			height: function(d) {return height_1-yScale(+d);}
		})
		.classed("bar",true)
		.styles({
			width:  width_1/probabilities.length-barPadding_1,
			fill: function(d,i) {return barColors[i];}
		});

		//Draw bar names
		svg.selectAll("text")
		.data(complaints)
		.enter()
		.append("text")
		.text(function(d) {
			return d;
		})
		.attrs({
			x: function(d,i) {return xScale(i)+ (width_1 / complaints.length - barPadding_1) / 2},
			y: function(d,i) {return yScale(+probabilities[i])+30},
			fill: "black"
		})
		.classed("barTitle",true)
		.attr("text-anchor","middle");

		/* TIP NOT WORKING. WHY?
		//Init tips
		var tip = d3.tip()
		.attr("class","barTip")
		.offset([-10, 0])
		.html(function(d) {
			return "<strong>Probability:</strong> <span style='color:red'>" + d + " %</span>";
		});

		// Call the tip
		svg.call(tip);

		//Draw tips on bars on mouse over
		svg.selectAll(".bar")
		.data(probabilities)
		.enter()
		.append("rect")
		.attr("class", "bar")
		.attrs({
			x: function(d,i) { return xScale(i); },
			y: function(d) { return  yScale(+d); },
			height_1: function(d,i) { return height_1 - yScale(+d);}
		})
		.on('mouseover', tip.show)
		.on('mouseout', tip.hide);*/

		//Add X axis
		svg.append("g")
		.classed("axis",true)
		.attr("transform", "translate(0," + height_1 + ")")
		.call(xAxis);

        //Add Y axis
        svg.append("g")
        .classed("axis",true)
        .attr("transform", "translate(0,0)")  // + 5 + "
        .call(yAxis);

        // Text label for the Y axis
        svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -50)
        .attr("x",0 - (height_1 / 2))
        .attr("dy", "1em")
        .attr("font-family", "sans-serif")
        .style("text-anchor", "middle")
        .text("Probability");
    });
}

function updateBarplotData(district,month,time) {
	d3.json(treePredictionsFile,function(data) {
		var probabilities = data[district][month][time]["probabilities"]; //array of probabilities, len=3
		var complaints = data[district][month][time]["predictions"]; //array of complaint types, len=3

		var yScale = d3.scaleLinear()
		.domain([0,100]) //since they will be percentages, it's fixed 0%-100%
		.range([height_1,0]);

		//Update bars height_1
		d3.select("#treeBarplot").select("svg").selectAll(".bar")
		.data(probabilities)
		.transition()
		.duration(1000)
		.attrs({
			y: function(d) {return yScale(+d);},
			height: function(d) {return height_1-yScale(+d);}
		});

		//Update bar labels
		d3.selectAll(".barTitle")
		.data(complaints)
		.transition()
		.duration(1000)
		.text(function(d) {
			return d;
		})
		.attr("y",function(d,i) {return yScale(+probabilities[i])+30});
	});
}

function createBarplot() {

    //Create SVG element
    var svg = d3.select("#treeBarplot")
    .append("svg")
    .attr("width", width_1)
    .attr("height", height_1);
}

function drawBarplot() {
	var district = $("#districtTitle").html();
	var month = $("#monthTitle").html();
	var time = $("#timeTitle").html();
	//If there are still default values selected, don't redraw!
	if (district.charAt(0)=="(" || month.charAt(0)=="(" || time.charAt(0)=="(")
		return;

	//Else, (re)-draw the plot
	if (!initBarplot)
		loadBarplotData(district,month,time);
	else {
		updateBarplotData(district,month,time);
	}
}

function populateDropdowns(filename) {
	d3.json(filename, function(data) {
		//Read all the keys inside the JSON and create the arrays to include as <option> items
		var districts = Object.keys(data);
		var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
		var times = Object.keys(data[districts[0]][months[0]]);

		//Create the option items
		for (var i = 0; i < districts.length; i++) {
			var district = districts[i];
			$("<option>").appendTo("#districtSelect").attr("value",district).html(district);
		}
		for (var i = 0; i < months.length; i++) {
			var month = months[i];
			$("<option>").appendTo("#monthSelect").attr("value",month).html(month);
		}
		for (var i = 0; i < times.length; i++) {
			var time = times[i];
			$("<option>").appendTo("#timeSelect").attr("value",time).html(time);
		}
		//Create dropdowns correctly (needed for the template)
		[].slice.call( document.querySelectorAll( 'select.cs-select' ) ).forEach( function(el) {    
			new SelectFx(el);
		} );

		//Assign all the onClick events to re-write the title according to the selected element
		var elements = $("#districtColumn").find("li");
		for (var i = 0; i<elements.length; i++) {
			$(elements[i]).click(function() {
				var value = $(this).attr("data-value");
				$("#districtTitle").html(value);
				drawBarplot();
			})
		}
		elements = $("#monthColumn").find("li");
		for (var i = 0; i<elements.length; i++) {
			$(elements[i]).click(function() {
				var value = $(this).attr("data-value");
				$("#monthTitle").html(value);
				drawBarplot();
			})
		}
		elements = $("#timeColumn").find("li");
		for (var i = 0; i<elements.length; i++) {
			$(elements[i]).click(function() {
				var value = $(this).attr("data-value");
				$("#timeTitle").html(value);
				drawBarplot();
			})
		}
	});
}

//Invoke functions
createBarplot();
populateDropdowns(treePredictionsFile);


