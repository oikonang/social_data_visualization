//Load total data from csv
var dataset;
d3.csv("total.csv", function (data) {
    dataset = data;

    //Width and height
    var w = 1000;
    var h = 450;
    var padding = 30;

    //Create scale functions
    var xScale_b = d3.scaleBand()
                   .domain(dataset.map(function(d) { return d.PdDistrict; })) 
                   .rangeRound([0, w]) //Create equally big widths for the bars within the svg total width 
                   .paddingInner(0.05);//Create padding between consecutive bars in percentage

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(dataset, function (d) {
            return +d.count_tot_2015;
        })])
        .range([0, h]);

    //Create SVG element
    var svg = d3.select("body")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    //Create tip
    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function (d) {
            var count = +d.count_tot_2015;
            return "<strong>Frequency:</strong> <span style='color:red'>" + count + "</span>";
        })

    svg.call(tip)

    svg.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('width', function () {
            return xScale.bandwidth()
        })
        .attr('height', function (d) {
            return h - yScale(+d.count_tot_2015)
        })
        .attr('y', function (d) {
            return yScale(+d.count_tot_2015)
        })
        .attr('x', function (d, i) {
            return xScale(i)
        })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)
        .attr("fill", function (d) {
            return "rgb(0, 0, " + (d.count_tot_2015 * 10) + ")";
        });
})