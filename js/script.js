//Ref:https://github.com/udacity/ud864/blob/master/Project_Code_4_WindowShoppingPart2.html
var map;
// Create a new blank array for all the listing markers.
var markers = [];
 var bounds;

initMap =function() {
    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 28.6127, lng: 77.2773},
        zoom: 13,
        mapTypeControl: false
    });
    bounds = new google.maps.LatLngBounds();
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
   // document.getElementById('show-listings').addEventListener('click', showListings);
   // document.getElementById('hide-listings').addEventListener('click', hideListings);
    showListings();
}
// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow) {
    loadInfo(marker, infowindow);
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        infowindow.marker = marker;
        infowindow.setContent('<div>' + marker.title + '</div>');
        infowindow.open(map, marker);
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
        });
        marker.setAnimation(google.maps.Animation.BOUNCE);


        setTimeout(function () {  // // Disable animation after 1.2s time
            marker.setAnimation(null);
        }, 1200);
    }
}

// get info from foursquare API //https://developer.foursquare.com/docs/api/
function loadInfo(marker, infowindow) {
    var url = 'https://api.foursquare.com/v2/venues/search?v=20161016';
    var client_id  = '&client_id='+ '25GZBIJ5JLK3GIWE3X01YUWVLDB32EGGDVX3IYGOFRNSFRS3';
    var client_secret = '&client_secret='+ 'VGE0QY5XFAS5JZUDNUZ3SISKBCHFQFUBADKZ44XVL05OOJY1';
    url += client_id + client_secret + '&ll=' + marker.getPosition().lat();
    url += ',' + marker.getPosition().lng() + '&query=' + marker.title;

    console.log(url);
    https://api.jquery.com/jquery.get/
    $.getJSON(url, function (recieved) {
        console.log(recieved);
        if(recieved !=null){
            infowindow.setContent("");
            var content = '';
            var firstVenue = recieved.response.venues[0];
            var name = firstVenue['name'];
            var category = firstVenue.categories[0].name;
            var address = firstVenue.location.address;
            content ='<h3>' + name + '</h3>';
            content+= '<b>Category:</b> ' + category + '<br>';
            content+= '<b>Address:</b> ' + address;
            infowindow.setContent(content);
        } else {
            infowindow.setContent("No venue found!!");
        }
    }).fail(function () {
        infowindow.setContent("oops!! Details could not be loaded");
    });

}

var showPlaceInfo = function (place) {
    //console.log(placeIndex);
    hideListings();
    markers[place.id].set(map);
   // bounds.extend(markers[place.id].position);
    google.maps.event.trigger(markers[place.id], 'click');
    //map.fitBounds(bounds);
    markers[place.id].setAnimation(google.maps.Animation.BOUNCE);



    setTimeout(function () {  // // Disable animation after 1.2s time
        markers[place.id].setAnimation(null);
    }, 1200);
    markers[place.id].setMap(map);
   // map.setZoom(15);
   // map.fitBounds(bounds);
};

function PlacesViewModel() {
    //Ref-https://stackoverflow.com/questions/21523745/knockoutjs-computed-is-not-a-function
    var self=this;
     self.placeFilter = ko.observable('');
     self.placeList = markers;


     self.filterPlaces = ko.computed(function () {
         if(map!==undefined){
             map.panTo({lat: 28.6127, lng: 77.2773});
         }
         if(self.placeFilter() === ''){
             console.log(self.placeList);
             return self.placeList;
         } else {
             // Refrence: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
             var filteredList = self.placeList.slice().filter(function (place) {
                 return place.title.toLowerCase().indexOf(self.placeFilter().toLowerCase()) > -1;
             });
             hideListings();
             for (var i = 0; i < filteredList.length; i++) {
                 markers[filteredList[i].id].setMap(map);
             }
             return filteredList;

         }
     });
     self.placeClicked= function (place) {
            showPlaceInfo(place)
     }

 }
// This function will loop through the markers array and display them all.
function showListings() {

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


