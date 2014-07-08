(function(){
  var $quakeinfo = $('#quakeinfo');

  var template = '<h2>Quake: <span id="quakeDetailName"></span></h2> \
                  <dl> \
                  <dt>Magnitude:</dt> \
                  <dd id="quakeDetailMagnitude"></dd> \
                  <dt>Location:</dt> \
                  <dd id="quakeDetailLocation"></dd> \
                  <dt>Date / Time:</dt> \
                  <dd id="quakeDetailTime"></dd> \
                  </dl>';

  window.quakeDetailView = {};

  window.quakeDetailView.showQuake = function(quake) {
    $quakeinfo.empty();
    $quakeinfo.append(template);
    $('#quakeDetailName').text(quake.code);
    $('#quakeDetailMagnitude').text(quake.mag);
    $('#quakeDetailLocation').text(quake.place);
    $('#quakeDetailTime').text((new Date(quake.time)).toString());
  }
})()