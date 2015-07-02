/**
 * Created by dinesh on 26-06-2015.
 */
var d3Model = d3Model || angular.module('d3Model', []);

//This module takes care of all activities inside Stored Proc Model
d3Model.factory("d3PieModel", [
    function () {

        function d3Pie() {
            var margin = {top: 0, right: 0, bottom: 0, left: 0},
                width = 960,
                height = 500,
                dotRadius = function() { return 2.5 },
                color = d3.scale.category10().range(),
                id = Math.floor(Math.random() * 10000), //Create semi-unique ID incase user doesn't select one
                x = d3.scale.linear(),
                y = d3.scale.linear(),
                yRight = d3.scale.linear(),
                dispatch = d3.dispatch("pointMouseover", "pointMouseout"),
                x0, y0,yr, radius = Math.min(width -100, height - 100) / 2; ;


            function chart(selection) {
                selection.each(function(data) {
                    var seriesData = data.map(function(d) { return d.data });
                    var PieData = data.map(function(series, i) {
                        var response = {};
                        series.data.map(function(point) {
                            response = {
                                value: point[1],
                                label: series.label
                            }
                        });
                        return response;
                    });

                    x0 = x0 || x;
                    y0 = y0 || y;
                    yr = yr || yRight;

                    //TODO: reconsider points {x: #, y: #} instead of [x,y]
                    //TODO: data accessors so above won't really matter, but need to decide for internal use

                    //add series data to each point for future ease of use
                    data = data.map(function(series, i) {
                        series.data = series.data.map(function(point) {
                            point.series = i;
                            point.label = series.label;
                            return point;
                        });
                        return series;
                    });




                    var wrap = d3.select(this).selectAll('g.d3line').data([data]);
                    var gEnter = wrap.enter().append('g').attr('class', 'd3line').append('g');

                    gEnter.append('g').attr('class', 'arcs');
                    gEnter.append('g').attr('class', 'point-clips');
                    gEnter.append('g').attr('class', 'point-paths');


                    var g = wrap.select('g')
                        .attr('transform', 'translate(' +( radius + 50) + ',' + radius + ')');
                    var arcs = wrap.select('.arcs').selectAll('.arc')
                        .data([PieData]);
                    arcs.enter().append('g')
                        .style('stroke-opacity', 1e-6)
                        .style('fill-opacity', 1e-6);
                    d3.transition(arcs.exit())
                        .style('stroke-opacity', 1e-6)
                        .style('fill-opacity', 1e-6)
                        .remove();
                    arcs.attr('class', function(d,i) { return 'arc arc-' + i })
                        .classed('hover', function(d) { return d.hover })
                        .style('fill', function(d,i) { return color[i % 10] })
                        .style('stroke', function(d,i) { return color[i % 10] })
                    d3.transition(arcs)
                        .style('stroke-opacity', 1)
                        .style('fill-opacity', .5);
                    var arc = arcs.selectAll("g.arc")
                        .data(d3.layout.pie().value(function(d) {
                            console.log(d); return d.value }))
                        .enter().append("svg:g")
                        .attr("class", "arc")
                    // arc.exit().remove();
                    arc.append("svg:path").attr("fill", function(d, i) { return color[i % 10]; })
                        .attr("d", d3.svg.arc().innerRadius(radius * .6).outerRadius(radius))
                    d3.transition(arc).attr("d", d3.svg.arc().innerRadius(radius * .6).outerRadius(radius))


                });

                x0 = x;
                y0 = y;

                return chart;
            }



            chart.dispatch = dispatch;

            chart.margin = function(_) {
                if (!arguments.length) return margin;
                margin = _;
                return chart;
            };

            chart.width = function(_) {
                if (!arguments.length) return width;
                width = _;
                return chart;
            };

            chart.height = function(_) {
                if (!arguments.length) return height;
                height = _;
                return chart;
            };

            chart.dotRadius = function(_) {
                if (!arguments.length) return dotRadius;
                dotRadius = d3.functor(_);
                return chart;
            };

            chart.color = function(_) {
                if (!arguments.length) return color;
                color = _;
                return chart;
            };

            chart.id = function(_) {
                if (!arguments.length) return id;
                id = _;
                return chart;
            };


            return chart;
        }

        return (d3Pie);
    }
]);
