/**
 * Created by dinesh on 15-06-2015.
 */
var d3Model = d3Model || angular.module('d3Model', []);

//This module takes care of all activities inside Stored Proc Model
d3Model.factory("D3tooltipModel", [
    function () {

            function D3Tooltip(){
                var self = this
                self.show= function(pos, content, gravity, dist) {
                    var container = $('<div class="nvtooltip">');

                    gravity = gravity || 's';
                    dist = dist || 20;

                    container
                        .html(content)
                        .css({left: -1000, top: -1000, opacity: 0})
                        .appendTo('body');

                    var height = container.height() + parseInt(container.css('padding-top'))  + parseInt(container.css('padding-bottom')),
                        width = container.width() + parseInt(container.css('padding-left'))  + parseInt(container.css('padding-right')),
                        windowWidth = $(window).width(),
                        windowHeight = $(window).height(),
                        scrollTop = $('body').scrollTop(),  //TODO: also adjust horizontal scroll
                        left, top;


                    //TODO: implement other gravities
                    switch (gravity) {
                        case 'e':
                        case 'w':
                        case 'n':
                            left = pos[0] - (width / 2);
                            top = pos[1] + dist;
                            if (left < 0) left = 5;
                            if (left + width > windowWidth) left = windowWidth - width - 5;
                            if (scrollTop + windowHeight < top + height) top = pos[1] - height - dist;
                            break;
                        case 's':
                            left = pos[0] - (width / 2);
                            top = pos[1] - height - dist;
                            if (left < 0) left = 5;
                            if (left + width > windowWidth) left = windowWidth - width - 5;
                            if (scrollTop > top) top = pos[1] + dist;
                            break;
                    }

                    container
                        .css({
                            left: left,
                            top: top,
                            opacity: 1
                        });
                };
                self.cleanup = function() {
                    var tooltips = $('.nvtooltip');

                    // remove right away, but delay the show with css
                    tooltips.css({
                        'transition-delay': '0 !important',
                        '-moz-transition-delay': '0 !important',
                        '-webkit-transition-delay': '0 !important'
                    });

                    tooltips.css('opacity',0);

                    setTimeout(function() {
                        tooltips.remove()
                    }, 500);
                };
            }
            return (D3Tooltip);

    }
]);
