(function(){
  var $quakeinfo = $('#quakeinfo');

  window.quakeDetailView = {};

  window.quakeDetailView.showQuake = function(quake) {
    $quakeinfo.empty();
    $quakeinfo.append('<p>Quake happened in: ' + quake.place + '</p>');
  }
})()