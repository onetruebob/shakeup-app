(function(){
  var $quakeinfo = $('#quakeinfo');
  $quakeinfo.hide();

  var template = '<h2>Quake: <span id="quakeDetailName"></span></h2> \
                  <dl> \
                  <dt>Magnitude:</dt> \
                  <dd id="quakeDetailMagnitude"></dd> \
                  <dt>Location:</dt> \
                  <dd id="quakeDetailLocation"></dd> \
                  <dt>Date / Time:</dt> \
                  <dd id="quakeDetailTime"></dd> \
                  <dt>USGS Data:</dt> \
                  <dd id="quakeDetailUSGS"></dd> \
                  </dl>';

  window.quakeDetailView = {};

  window.quakeDetailView.showQuake = function(quake) {
    $quakeinfo.show();
    $quakeinfo.empty();
    $quakeinfo.append(template);
    $quakeinfo.addClass('animated shake');
    $('#quakeDetailName').text(quake.code);
    $('#quakeDetailMagnitude').text(quake.mag);
    $('#quakeDetailLocation').text(quake.place);
    $('#quakeDetailTime').text((new Date(quake.time)).toString());
    $('#quakeDetailUSGS').append('<a href="' + quake.url + '" target="_blank"> US Geological Survey Data </a>');
    $quakeinfo.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
      $(this).removeClass('animated shake');
    });
  }
})()