(function(lowMag, highMag){
    // Lots of code from:
    //  http://bl.ocks.org/3757125
    //  http://bl.ocks.org/3795040

    //Initialize ranges 
    lowMag = lowMag || -1;
    highMag = highMag || 12;

    window.globe = {}; //an object to reference in other applications.

    d3.select(window)
        .on("mousemove", mousemove)
        .on("mouseup", mouseup);

    var width = 560,
        height = 500;

    var proj = d3.geo.orthographic()
        .scale(220)
        .translate([width / 2, height / 2])
        .clipAngle(90);


    var path = d3.geo.path().projection(proj).pointRadius(1.5);

    var graticule = d3.geo.graticule();

    var svg = d3.select("#globe")
                .attr("width", width)
                .attr("height", height)
                .on("mousedown", mousedown);

    window.globe.drawGlobe = function() {
      queue()
          .defer(d3.json, "world-110m.json")
          .defer(d3.json, "places.json")
          .await(ready);

      function ready(error, world, places) {
        var ocean_fill = svg.append("defs").append("radialGradient")
                .attr("id", "ocean_fill")
                .attr("cx", "75%")
                .attr("cy", "25%");
            ocean_fill.append("stop").attr("offset", "5%").attr("stop-color", "#ddf");
            ocean_fill.append("stop").attr("offset", "100%").attr("stop-color", "#9ab");

        var globe_highlight = svg.append("defs").append("radialGradient")
              .attr("id", "globe_highlight")
              .attr("cx", "75%")
              .attr("cy", "25%");
            globe_highlight.append("stop")
              .attr("offset", "5%").attr("stop-color", "#ffd")
              .attr("stop-opacity","0.6");
            globe_highlight.append("stop")
              .attr("offset", "100%").attr("stop-color", "#ba9")
              .attr("stop-opacity","0.2");

        var globe_shading = svg.append("defs").append("radialGradient")
              .attr("id", "globe_shading")
              .attr("cx", "50%")
              .attr("cy", "40%");
            globe_shading.append("stop")
              .attr("offset","50%").attr("stop-color", "#9ab")
              .attr("stop-opacity","0")
            globe_shading.append("stop")
              .attr("offset","100%").attr("stop-color", "#3e6184")
              .attr("stop-opacity","0.3")

          svg.append("circle")
              .attr("cx", width / 2).attr("cy", height / 2)
              .attr("r", proj.scale())
              .attr("class", "noclicks")
              .style("fill", "url(#ocean_fill)");
          
          svg.append("path")
              .datum(topojson.object(world, world.objects.land))
              .attr("class", "land")
              .attr("d", path);

          svg.append("path")
              .datum(graticule)
              .attr("class", "graticule noclicks")
              .attr("d", path);

          svg.append("circle")
              .attr("cx", width / 2).attr("cy", height / 2)
              .attr("r", proj.scale())
              .attr("class","noclicks")
              .style("fill", "url(#globe_highlight)");

          svg.append("circle")
              .attr("cx", width / 2).attr("cy", height / 2)
              .attr("r", proj.scale())
              .attr("class","noclicks")
              .style("fill", "url(#globe_shading)");

          svg.append("g").attr("class","points")
              .selectAll("text").data(places.features)
            .enter().append("path")
              .attr("class", "point")
              .attr("d", path);

          svg.append("g").attr("class","labels")
              .selectAll("text").data(places.features)
            .enter().append("text")
            .attr("class", "label")
            .text(function(d) { return d.properties.name });

          // uncomment for hover-able country outlines

          // svg.append("g").attr("class","countries")
          //   .selectAll("path")
          //     .data(topojson.object(world, world.objects.countries).geometries)
          //   .enter().append("path")
          //     .attr("d", path); 

          position_labels();

          if (window.globe.ready){
            window.globe.ready();
          }
      }
    }


    function position_labels() {
      var centerPos = proj.invert([width/2,height/2]);

      var arc = d3.geo.greatArc();

      svg.selectAll(".label")
        .attr("text-anchor",function(d) {
          var x = proj(d.geometry.coordinates)[0];
          return x < width/2-20 ? "end" :
                 x < width/2+20 ? "middle" :
                 "start"
        })
        .attr("transform", function(d) {
          var loc = proj(d.geometry.coordinates),
            x = loc[0],
            y = loc[1];
          var offset = x < width/2 ? -5 : 5;
          return "translate(" + (x+offset) + "," + (y-2) + ")"
        })
        .style("display",function(d) {
          var d = arc.distance({source: d.geometry.coordinates, target: centerPos});
          return (d > 1.57) ? 'none' : 'inline';
        })
        
    }

    // modified from http://bl.ocks.org/1392560
    var m0, o0;
    function mousedown() {
      m0 = [d3.event.pageX, d3.event.pageY];
      o0 = proj.rotate();
      d3.event.preventDefault();
    }
    function mousemove() {
      if (m0) {
        var m1 = [d3.event.pageX, d3.event.pageY]
          , o1 = [o0[0] + (m1[0] - m0[0]) / 6, o0[1] + (m0[1] - m1[1]) / 6];
        o1[1] = o1[1] > 30  ? 30  :
                o1[1] < -30 ? -30 :
                o1[1];
        proj.rotate(o1);
        refresh();
      }
    }
    function mouseup() {
      if (m0) {
        mousemove();
        m0 = null;
      }
    }

    //Show or hide an earthquake point depending on it's location.
    var quakeShowHide = function(quake) { 
      if(quake.mag < lowMag || quake.mag > highMag) {
        //Hide earthquake magnitudes that are out of range.
        return 'none';
      }
      var centerPos = proj.invert([width/2,height/2]);
      var arc = d3.geo.greatArc();
      var d = arc.distance({source: [quake.location.lng, quake.location.lat], target: centerPos});
      return (d > 1.57) ? 'none' : 'inline';
    };

    var quakeTranslate = function(quake) {
      return "translate(" + proj([
          quake.location.lng,
          quake.location.lat
        ]) + ")"
    };

    var quakeSize = function(quake) {
      var scaleFactor = 1.5;
      return (Math.pow(scaleFactor, quake.mag)); // represent mag size on logrythmic scale.
    };

    function refresh() {
      svg.selectAll(".land").attr("d", path);
      svg.selectAll(".countries path").attr("d", path);
      svg.selectAll(".graticule").attr("d", path);
      svg.selectAll(".point").attr("d", function(d){return path(d) || 'M 0 0 l 0 0'}); //Instead of remvoving d attr when empty, set it to an empty value.

      svg.selectAll(".quake").attr("transform", quakeTranslate)
      .style("display", quakeShowHide);

      position_labels();
    }

    window.globe.addQuake = function (earthquake) {
      var quake = {mag: earthquake.mag, location: earthquake.location, code: earthquake.code};

      if(svg.selectAll(".quakes")[0].length === 0){
        //Create the group for the quake circles if it doesn't exist
        svg.append("g").attr("class", "quakes");
      }

      svg.selectAll(".quakes")
      .append("circle").attr("class","quake")
      .data([quake])
      .attr("r", quakeSize)
      .attr("transform", quakeTranslate)
      .style("display", quakeShowHide)
      .on('click', function(quakeData){
        if(window.globe.quakeClick) {
          d3.select(this).transition()
          .attr('r', 40)
          .transition()
          .attr('r', quakeSize)

          window.globe.quakeClick(quakeData);
        }
      })
      .transition()
      .attr("r", 1)
      .transition()
      .attr("r", quakeSize);

    };

    window.globe.updateMagnitudeRange = function(minMag, maxMag) {
      lowMag = minMag;
      highMag = maxMag;
      refresh();
    }
})();
