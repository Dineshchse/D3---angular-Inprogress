/**
 * Created by dinesh on 30-06-2015.
 */


var d3Model = d3Model || angular.module('d3Model', []);

//This module takes care of all activities inside Stored Proc Model
d3Model.factory("d3BarModel", [
    function () {

        function d3Bar() {
            var margin = {top: 40, right: 20, bottom: 30, left: 40},
                width = 960,
                height = 500,
                dotRadius = function () {
                    return 2.5
                },
                color = d3.scale.category10().range(),
                id = Math.floor(Math.random() * 10000), //Create semi-unique ID incase user doesn't select one
                x = x = d3.scale.ordinal().rangeRoundBands([0, width], .1),
                y = d3.scale.linear().range([height, 0]),

                dispatch = d3.dispatch("pointMouseover", "pointMouseout"),
                x0, y0, yr;


            function chart(selection) {
                selection.each(function (data) {

                    var seriesData = data.map(function(d) { return d.data });


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

                    x = d3.scale.ordinal().rangeRoundBands([0, width], .1);
                    xAxis = d3.svg.axis().scale(x).orient('bottom');
                    y = d3.scale.linear().range([height - margin.top - margin.bottom, 0]);
                    yAxis = d3.svg.axis().scale(y).orient('left')
                    var xaxisData = d3.merge(seriesData)
                    //x.domain(d3.range(seriesData.length))
                    x.domain(d3.merge(seriesData).map(function (d) {
                        return d[0];
                    }))
                    y.domain([d3.min(d3.merge(seriesData), function(d){return d[1]}), d3.max(d3.merge(seriesData), function(d){return d[1]})])
                        .range([height - margin.top - margin.bottom, 0]);

                    x0 = x0 || x;
                    y0 = y0 || y;


                    //TODO: reconsider points {x: #, y: #} instead of [x,y]
                    //TODO: data accessors so above won't really matter, but need to decide for internal use


                    var wrap = d3.select(this).selectAll('g.d3bar').data([data]);
                    var gEnter = wrap.enter().append('g').attr('class', 'd3bar').append('g');

                    gEnter.append('g').attr('class', 'bars');
                    gEnter.append('g').attr('class', 'point-clips');
                    gEnter.append('g').attr('class', 'point-paths');


                    var g = wrap.select('g')
                        .attr('transform', 'translate(' + 0 + ',' + 0 + ')');
                    /*g.select('.x.axis')
                     .attr('transform', 'translate(0,' + y.range()[0] + ')')
                     .call(xAxis)
                     .selectAll('line.tick')
                     .filter(function(d) { return !d })
                     .classed('zero', true);*/
                    var bars = wrap.select('.bars').selectAll('.bar')
                        .data(function(d) {
                            return d ;
                        }, function(d) {
                            return d.label ;
                        });
                    bars.enter().append('g')
                        .style('stroke-opacity', 1e-6)
                        .style('fill-opacity', 1e-6);
                    d3.transition(bars.exit())
                        .style('stroke-opacity', 1e-6)
                        .style('fill-opacity', 1e-6)
                        .remove();
                    bars.attr('class', function(d,i) { return 'bar bar-' + i })
                        .classed('hover', function(d) { return d.hover })
                        .style('fill', function(d,i) { return color[i % 10] })
                        .style('stroke', function(d,i) { return color[i % 10] })
                    d3.transition(bars)
                        .style('stroke-opacity', 1)
                        .style('fill-opacity', .5);
                    var paths = bars.selectAll('rect')
                        .data(function(d, i) {
                            return d.data
                        });
                    paths.enter().append('rect')
                        .attr("y", function(d) {
                            return height - y(d[1]);
                        })
                        .attr("x", function(d,i){
                            return (x(d[0]));
                        })
                        .attr("height", function(d) {
                            return y(d[1]);
                        })
                        .attr("width", x.rangeBand())
                        .attr("fill", function (d, i) {
                            return color[i % 10]
                        })

                    paths.exit().remove();
                    d3.transition(paths)
                        .attr("y", function(d) {
                            return height - y(d[1]);
                        })
                        .attr("x", function(d,i){
                            return (x(d[0]));
                        })
                        .attr("height", function(d) {
                            return y(d[1]);
                        })
                        .attr("width", x.rangeBand())
                        .attr("fill", function (d, i) {
                            return color[i % 10]
                        })





                });

                x0 = x;
                y0 = y;

                return chart;
            }


            chart.dispatch = dispatch;

            chart.margin = function (_) {
                if (!arguments.length) return margin;
                margin = _;
                return chart;
            };

            chart.width = function (_) {
                if (!arguments.length) return width;
                width = _;
                return chart;
            };

            chart.height = function (_) {
                if (!arguments.length) return height;
                height = _;
                return chart;
            };

            chart.dotRadius = function (_) {
                if (!arguments.length) return dotRadius;
                dotRadius = d3.functor(_);
                return chart;
            };

            chart.color = function (_) {
                if (!arguments.length) return color;
                color = _;
                return chart;
            };

            chart.id = function (_) {
                if (!arguments.length) return id;
                id = _;
                return chart;
            };


            return chart;
        }

        return (d3Bar);

    }]);