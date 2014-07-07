var earthquakeRef = new Firebase("https://publicdata-earthquakes.firebaseio.com/by_continent/");
var continents = ["europe", "asia", "africa", "north_america", "south_america", "antartica", "oceanic"]; //database is organized by continents

// earthquakeRef.on("child_added", showEarthquake);

function showEarthquake(snapshot) {
  var earthquake = snapshot.val();
  console.log("Mag " + earthquake.mag + " at " + earthquake.place + '\n' + 'lat: ' + earthquake.location.lat + ' lon: ' + earthquake.location.lng);
}

function start() {
    for (var con=0; con<continents.length; con++) {
        var continent = continents[con];
        for (var mag=0; mag<10; mag++) {
            earthquakeRef.child(continent)
                .child(mag.toString())
                .endAt()
                .limit(3) // only get the last three quakes of each magnitutde
                .on('child_added', showEarthquake);
        }
    }
}

start();