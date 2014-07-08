(function(){
  window.quakedata = {}
  window.quakedata.minMagnitude =  0;
  window.quakedata.maxMagnitude = 10;

  var earthquakeRef = new Firebase("https://publicdata-earthquakes.firebaseio.com/by_continent/");
  var continents = ["europe", "asia", "africa", "north_america", "south_america", "antartica", "oceanic"]; //database is organized by continents

  function showEarthquake(snapshot) {
    var earthquake = snapshot.val();
    globe.addQuake(earthquake);
  }

  function start() {
      for (var con=0; con<continents.length; con++) {
          var continent = continents[con];
          for (var mag=window.quakedata.minMagnitude ; mag < window.quakedata.maxMagnitude ; mag++) {
              earthquakeRef.child(continent)
                  .child(mag.toString())
                  .endAt()
                  .limit(3) // only get the last three quakes of each magnitutde
                  .on('child_added', showEarthquake);
          }
      }
  }

  start();

})();
