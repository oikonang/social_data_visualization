function loadData() {
	/*d3.json(filename, function(data) {

		var xScale = d3.scaleBand()
		.domain()
	});*/
}

function createBarplot() {
	var width = 1000;
	var height = 500;
	var padding = 30;
    //Create SVG element
    var svg = d3.select("#treeBarplot")
    .append("svg")
    .attr("width", width)
    .attr("height", height);
}

function drawBarplot() {
	var district = $("#districtTitle").html();
	var month = $("#monthTitle").html();
	var time = $("#timeTitle").html();
	//If there are still default values selected, don't redraw!
	if (district.charAt(0)=="(" || month.charAt(0)=="(" || time.charAt(0)=="(")
		return;

	//Else, (re)-draw the plot
	console.log([district,month,time]);
	loadData();
}

function populateDropdowns(filename) {
	d3.json(filename, function(data) {
		//Read all the keys inside the JSON and create the arrays to include as <option> items
		var districts = Object.keys(data);
		var months = Object.keys(data[districts[0]]);
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

treePredictionsFile = "data/decision_tree_predictions.json";
createBarplot();
populateDropdowns(treePredictionsFile);
//loadBarplot(treePredictionsFile);


