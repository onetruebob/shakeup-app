var $quakeinfo = $('#quakeinfo');

$( "#slider" ).slider({max: window.quakedata.maxMagnitude, 
                       min: window.quakedata.minMagnitude, 
                       range: true, 
                       values: [window.quakedata.minMagnitude, window.quakedata.maxMagnitude]
                     })
.on("slide", function(e, ui){
  $('#minmag').empty().text(ui.values[0]);
  $('#maxmag').empty().text(ui.values[1]);
  globe.updateMagnitudeRange(ui.values[0], ui.values[1]);
});

window.globe.quakeClick = function(quakeData) {
  var quake = window.quakedata.quakes[quakeData.code]
  window.quakeDetailView.showQuake(quake);
};