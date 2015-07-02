/**
 * Created by dinesh on 26-06-2015.
 */


var d3Model = d3Model || angular.module('d3Model', []);

//This module takes care of all activities inside Stored Proc Model
d3Model.factory("d3AreaModel", [
    function () {

        function d3Area() {
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
                x0, y0,yr ;


            function chart(selection) {
                selection.each(function(data) {
                    var seriesData = data.map(function(d) { return d.data });

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


                    x   .domain(d3.extent(d3.merge(seriesData), function(d) { return d[0] } ))
                        .range([0, width - margin.left - margin.right]);

                    y   .domain(d3.extent(d3.merge(seriesData), function(d) { return d[1] } ))
                        .range([height - margin.top - margin.bottom, 0]);
                    yRight   .domain(d3.extent(d3.merge(seriesData), function(d) { return d[1]*2 } ))
                        .range([height - margin.top - margin.bottom, 0]);




                    var wrap = d3.select(this).selectAll('g.d3area').data([data]);
                    var gEnter = wrap.enter().append('g').attr('class', 'd3area').append('g');
                    gEnter.append('g').attr('class', 'point-clips');
                    gEnter.append('g').attr('class', 'point-paths');

                    gEnter.append('g').attr('class', 'areas');



                    var g = wrap.select('g')
                        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');






                    var areas = wrap.select('.areas').selectAll('.area')
                        .data(function(d) { return d }, function(d) { return d.label });
                    areas.enter().append('g')
                        .style('stroke-opacity', 1e-6)
                        .style('fill-opacity', 1e-6);
                    d3.transition(areas.exit())
                        .style('stroke-opacity', 1e-6)
                        .style('fill-opacity', 1e-6)
                        .remove();
                    areas.attr('class', function(d,i) { return 'area area-' + i })
                        .classed('hover', function(d) { return d.hover })
                        .style('fill', function(d,i) { return color[i % 10] })
                        .style('stroke', function(d,i) { return color[i % 10] })
                    d3.transition(areas)
                        .style('stroke-opacity', 1)
                        .style('fill-opacity', .5);


                    var paths = areas.selectAll('path')
                        .data(function(d, i) {
                            return [d.data]
                        });
                    paths.enter().append('path')
                        .attr('d', d3.svg.area()
                            .x(function(d) {
                                return x0(d[0])
                            })
                            .y0(function(d) {
                                if(d[0] == 3){
                                    return yr(d[1]*2);

                                }
                                return y0(d[1])
                            })
                            .y1(height)
                    );
                    paths.exit().remove();
                    d3.transition(paths)
                        .attr('d', d3.svg.area()
                            .x(function(d) {
                                return x0(d[0])
                            })
                            .y0(function(d) {
                                if(d[0] == 3){
                                    return yr(d[1]*2);

                                }
                                return y0(d[1])
                            })
                            .y1(height)
                    );


                    var points = areas.selectAll('circle.point')
                        .data(function(d, i) {
                            return d.data
                        }, function (d) {
                            return d;
                        });
                    points.enter().append('circle')
                        .attr('cx', function(d) { return x0(d[0]) })
                        .attr('cy', function(d) { return y0(d[1]) })
                        .on('mouseover', function(d){
                            console.log(d);

                        });
                    points.exit().remove();
                    points.attr('class', function(d,i) { return 'point point-' + i });
                    d3.transition(points)
                        .attr('cx', function(d) { return x(d[0]) })
                        .attr('cy', function(d) { return y(d[1]) })
                        .attr('r', dotRadius());

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

        return (d3Area);
    }
]);
