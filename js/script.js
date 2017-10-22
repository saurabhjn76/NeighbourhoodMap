//Ref:https://github.com/udacity/ud864/blob/master/Project_Code_4_WindowShoppingPart2.html
var map;
// Create a new blank array for all the listing markers.
var markers = [];
function initMap() {
    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 28.6127, lng: 77.2773},
        zoom: 13,
        mapTypeControl: false
    });
    // These are the real estate listings that will be shown to the user.
    // Normally we'd have these in a database instead.
    var locations = [
        {title: 'Akshardham', location: {lat: 28.6127, lng: 77.2773}},
        {title: 'Worlds of Wonder', location: {lat: 28.5638, lng: 77.3261}},
        {title: 'India Gate', location: {lat: 28.6129, lng: 77.2295}},
        {title: 'Red Fort', location: {lat: 28.6562, lng: 77.2410}},
        {title: 'Qutb Minar', location: {lat: 28.5244, lng: 77.1855}},
        {title: 'Lotus Temple', location: {lat: 28.5535, lng: 77.2588}}
    ];
    var largeInfowindow = new google.maps.InfoWindow();
    // The following group uses the location array to create an array of markers on initialize.
    for (var i = 0; i < locations.length; i++) {
        // Get the position from the location array.
        var position = locations[i].location;
        var title = locations[i].title;
        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            id: i
        });
        // Push the marker to our array of markers.
        markers.push(marker);
        // Create an onclick event to open an infowindow at each marker.
        marker.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow);
        });
    }
    document.getElementById('show-listings').addEventListener('click', showListings);
    document.getElementById('hide-listings').addEventListener('click', hideListings);
}
// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        infowindow.marker = marker;
        infowindow.setContent('<div>' + marker.title + '</div>');
        infowindow.open(map, marker);
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
        });
    }
}

 function PlacesViewModel() {
    //Ref-https://stackoverflow.com/questions/21523745/knockoutjs-computed-is-not-a-function
    var self=this;
     self.placeFilter = ko.observable('');
     self.placeList = markers;

     self.filterPlaces = ko.computed(function () {
         if(self.placeFilter() === ''){
             return self.placeList;
         } else {
             var list = self.placeList.slice();
             // Refrence: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
             return list.filter(function (place) {
                 return place.title.toLowerCase().indexOf(self.placeFilter().toLowerCase()) > -1;
             });
         }
     });

 }
// This function will loop through the markers array and display them all.
function showListings() {
    var bounds = new google.maps.LatLngBounds();
    // Extend the boundaries of the map for each marker and display the marker
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
        bounds.extend(markers[i].position);
    }
    map.fitBounds(bounds);
}
// This function will loop through the listings and hide them all.
function hideListings() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}
// apply KO bindings
ko.applyBindings(new PlacesViewModel());