var d3Controllers = d3Controllers || angular.module('d3Controllers',[])

d3Controllers.controller('chartController', ['$scope','D3LineWithLegendModel', 'D3tooltipModel', function($scope, d3LineWithLegend, D3tooltipModel) {
	$scope.name = "D3 Charts";
    $(document).ready(function() {
        var margin = {top: 30, right: 10, bottom: 50, left: 60};

          var  chart = new d3LineWithLegend();
                chart.xAxis.label('Time (ms)')
                .width(width(margin))
                .height(height(margin))
                .yAxis.label('Voltage (v)');


        var svg = d3.select('#test1 svg')
            .datum(generateData("bar"))

        svg.transition().duration(500)
            .attr('width', width(margin))
            .attr('height', height(margin))
            .call(chart);
    var nvtooltip = new D3tooltipModel();

        chart.dispatch.on('showTooltip', function(e) {
            var offset = $('#test1').offset(), // { left: 0, top: 0 }
                left = e.pos[0] + offset.left,
                top = e.pos[1] + offset.top,
                formatter = d3.format(".04f");

            var content = '<h3>' + e.series.label + '</h3>' +
                '<p>' +
                '<span class="value">[' + e.point[0] + ', ' + formatter(e.point[1]) + ']</span>' +
                '</p>';

            nvtooltip.show([left, top], content);
        });

        chart.dispatch.on('hideTooltip', function(e) {
            nvtooltip.cleanup();
        });




        $(window).resize(function() {
            var margin = chart.margin();

            chart
                .width(width(margin))
                .height(height(margin));

            d3.select('#test1 svg')
                .attr('width', width(margin))
                .attr('height', height(margin))
                .call(chart);

        });




        function width(margin) {
            var w = $("#test1").width() - 20;

            return ( (w - margin.left - margin.right - 20) < 0 ) ? margin.left + margin.right + 2 : w;
        }

        function height(margin) {
            var h = $("#test1").height() - 20;

            return ( h - margin.top - margin.bottom - 20 < 0 ) ?
            margin.top + margin.bottom + 2 : h;
        }


        //data
        function generateData(type) {
            var sin = [],
                sin2 = [],
                cos = [],
                cos2 = [],
                r1 = Math.random(),
                r2 = Math.random(),
                r3 = Math.random(),
                r4 = Math.random();

            for (var i = 0; i < 100; i++) {
                sin.push([ i, r1 * Math.sin( r2 +  i / (10 * (r4 + .5) ))]);
                cos.push([ i, r2 * Math.cos( r3 + i / (10 * (r3 + .5) ))]);
                sin2.push([ i, r3 * Math.sin( r1 + i / (10 * (r2 + .5) ))]);
                cos2.push([ i, r4 * Math.cos( r4 + i / (10 * (r1 + .5) ))]);
            }
            if(type== "bar"){
                return  {data: [
                    {
                        data: sin,
                        label: "Sine Wave"
                    }

                ],
                    type: "bar"
                };

            }

            return {data:[
                {
                    data: sin,
                    label: "Sine Wave"
                },
                {
                    data: cos,
                    label: "Cosine Wave"
                },
                {
                    data: sin2,
                    label: "Sine2 Wave"
                },
                {
                    data: cos2,
                    label: "Cosine2 Wave"
                }

                ],
                type: "line"
        }

        }


    });

}]);