(function(){
  window.quakedata = {}
  window.quakedata.minMagnitude =  0;
  window.quakedata.maxMagnitude = 10;
  window.quakedata.quakes = {}

  var earthquakeRef = new Firebase("https://publicdata-earthquakes.firebaseio.com/by_continent/");
  var continents = ["europe", "asia", "africa", "north_america", "south_america", "antartica", "oceanic"]; //database is organized by continents

  var oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  function addEarthquake(snapshot) {
    var earthquake = snapshot.val();
    globe.addQuake(earthquake);
    window.quakedata.quakes[earthquake.code] = earthquake;
  }

  window.quakedata.loadData = function() {
      for (var con=0; con<continents.length; con++) {
          var continent = continents[con];
          for (var mag=window.quakedata.minMagnitude ; mag < window.quakedata.maxMagnitude ; mag++) {
              earthquakeRef.child(continent)
                  .child(mag.toString())
                  .startAt(oneWeekAgo.getTime())
                  .endAt()
                  //.limit(5) // only get the last 5 quakes of each magnitude per contient
                  .on('child_added', addEarthquake);
          }
      }
  }

})();
