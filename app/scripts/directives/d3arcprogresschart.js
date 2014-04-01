'use strict';

angular.module('betterworksTestApp')
  .directive('arcProgressChart', ['d3Service',
    function(d3) {

      var DEFAULT_DISPLAY_PARAMS = {
        expected: {
          radius: 0.9,
          width: 0.05,

          color: '#BCEC94'
        },

        actual: {
          radius: 1,
          width: 0.075
        },

        inner: {
          radius: 0.75,
          classes: 'label-group',

          circle: {
            classes: 'inner',
            color: '#F4F4F4'
          }
        },

        duration: 750,
        width: 200,
        height: 200,

        backgroundColor: '#fff'
      };

      return {
        restrict: 'EA',

        // sets up the isolate scope so that we don't clobber parent scope
        scope: {
          expected: '=',
          actual: '=',
          displayParams: '=display'
        },

        link: function postLink(scope, element, attrs) {
          // Setup default parameters.
          var expected = scope.expected || 0.5;
          var actual = scope.actual || 0.75;

          var displayParams = $.extend(true, {}, DEFAULT_DISPLAY_PARAMS, scope.displayParams);

          var duration = displayParams.duration;

          var $ele = $(element[0]);

          var width = displayParams.width || ($ele.width() - 20);
          var height = displayParams.height || ($ele.height() - 20);

          var baseRadius = displayParams.radius || Math.min(width, height) / 2;

          var target = d3.select(element[0]);

          var svg = target
            .append('svg:svg')
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .attr('viewBox', '0 0 ' + width + ' ' + height)
            .style('width', width)
            .style('height', height)
            .append('svg:g');

          var pie = d3.layout.pie()
            .sort(null);

          var arcs = {
            expected: {
              val: expected
            },
            actual: {
              val: actual
            }
          };
          var arcsArr = Object.keys(arcs);
          arcsArr.forEach(function(which) {
            var params = displayParams[which];

            var arc = d3.svg.arc()
              .outerRadius(baseRadius * params.radius)
              .innerRadius(baseRadius * (params.radius - params.width));

            function tween(d, i) {
              /* jshint validthis:true */

              var fn = d3.interpolate(this._current, d);
              this._current = fn(0);
              return function(t) {
                return arc(fn(t));
              };
            }

            arcs[which].arc = arc;
            arcs[which].tween = tween;

            // watch for data changes and re-render
            scope.$watch(which, function(newVal, oldVal) {
              arcs[which].val = newVal;
              return scope.render();
            }, true);
          });

          arcs.expected.color = function expectedColor(d, i) {
            if (!i) {
              return displayParams.expected.color;
            } else {
              return displayParams.backgroundColor;
            }
          };

          // group for arcs
          var arcsElement = svg.append('g')
            .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ') rotate(180) scale(-1, -1)');

          // group for labels
          var labels = svg.append('g')
            .attr('class', displayParams.inner.classes)
            .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')');

          var circle = labels.append('circle')
            .attr('class', displayParams.inner.circle.classes)
            .attr('r', baseRadius * displayParams.inner.radius)
            .attr('fill', displayParams.inner.circle.color);

          var label = labels.append('text')
            .attr('class', 'svg-label actual-progress')
            .text(Math.round(actual * 100))
            .attr('dx', -5);

          var labelBounds = label.node().getBBox();

          var percentLabel = labels.append('text')
            .attr('class', 'svg-label percent-sign')
            .text('%')
            .attr('y', -5)
            .attr('x', labelBounds.width / 2)
            .attr('dx', 10);

          var progressLabel = labels.append('text')
            .attr('class', 'svg-label progress-label')
            .text('Progress')
            .attr('y', labelBounds.height / 2)
            .attr('dy', -10);

          // define render function
          scope.render = function() {
            var diff = arcs.actual.val - arcs.expected.val;

            arcs.actual.color = function actualColor(d, i) {
              if (!i) {
                if (diff < -0.25) {
                  return '#FF6600';
                } else if (diff < -0.5) {
                  return '#FF0000';
                }

                return '#56CB00';
              } else {
                return displayParams.backgroundColor;
              }
            };

            arcsArr.forEach(function(which) {
              var model = arcs[which];

              // Select the arc
              var path = arcsElement.selectAll('path.' + which)
                .data(pie([model.val, 1 - model.val]));

              // Draw the arcs if not drawn
              path.enter().append('path')
                .attr('class', which)
                .attr('fill', model.color)
                .attr('d', model.arc)
                .each(function(d) {
                  this._current = d;
                });

              // Transition the arcs if drawn
              path
                .attr('fill', model.color)
                .transition()
                .duration(duration)
                .attrTween('d', model.tween)
                .attr('fill', model.color);

              // remove arcs not in the dataset
              path.exit().remove();
            });

            var text = Math.round(actual * 100) + '';
            label.text(text);
            labelBounds = label.node().getBBox();
            percentLabel.attr('x', labelBounds.width / 2);
          };
        }
      };
    }
  ]);
