var CLIENT_ID = '5Y0RQGFXWA4VMNA5MPIW5RSFZ2BK0CVH0E4WXDBRYUQ13N2F';
var CLIENT_SECRET = 'L1SM3BEOGH1K4P05LN1FUHV1WF55XNSJCLVWRVYKSWWBKBTX';

var places = [
    {
        name: "America Airlines Arena",
        lat: 25.781685, 
        long: -80.186908,
        info: "",
    },
]

var map;

places.forEach(function(place) {
  var url = 'https://api.foursquare.com/v2/venues/search?v=20161016&ll=';
  url += place.lat + ',';
  url += place.long;
  url += '&intent=global&query=' + place.title;
  url += '&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET;

  $.getJSON(url).done(function(data) {
    console.log(data.response.venues[0]);
  }).fail(function() {
    console.error('There was an error occured with the Foursquare API. Please try again later.');
  });
})

var Place = function (data) { 
    this.name = ko.observable(data.name);
    this.details = ko.observable(data.imgSrc);
    this.nicknames = ko.observableArray(data.nicknames);
}

var ViewModel = function () { 
    var self = this;
    this.searchText = ko.observable('');
    this.placeList = ko.observableArray([]);

    places.forEach(function (newItem){
        self.placeList.push(new Place(newItem));
    })

    map = new google.maps.Map(document.getElementById('mapDiv'), {
      center: { lat: 59.942803, lng: 30.324841 },
      zoom: 12
    });
}

function init() {
  ko.applyBindings(new ViewModel());
};