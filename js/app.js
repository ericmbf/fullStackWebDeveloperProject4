var CLIENT_ID = '5Y0RQGFXWA4VMNA5MPIW5RSFZ2BK0CVH0E4WXDBRYUQ13N2F';
var CLIENT_SECRET = 'L1SM3BEOGH1K4P05LN1FUHV1WF55XNSJCLVWRVYKSWWBKBTX';

var places = [
    {
      name: "America Airlines Arena",
      lat: 25.781685, 
      long: -80.186908
    },
    // {
    //   name: 'Phillip and Patricia Frost Museum of Science',
    //   lat: 25.785390,
    //   long: -80.188146
    // }
]

var map;

var Place = function (data) { 
  var self = this;

  this.name = ko.observable(data.name);
  this.searchPlace = ko.observable(data.name.toLowerCase());
  self.address = ko.observable();
  self.usersVisit = ko.observable();

  var url = 'https://api.foursquare.com/v2/venues/search?v=20161016&ll=';
  url += data.lat + ',';
  url += data.long;
  url += '&intent=global&query=' + data.name;
  url += '&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET;
  
  $.getJSON(url).done(function(data) {
    var ret = data.response.venues[0];

    self.address(ret.location.formattedAddress.join(', '));
    self.usersVisit(ret.stats.usersCount);

  }).fail(function() {
    console.error('Foursquare API error. Please try again later.');
  });
}

var ViewModel = function () { 
    var self = this;

    this.searchText = ko.observable('');
    this.placeList = ko.observableArray([]);

    places.forEach(function (newItem){
        self.placeList.push(new Place(newItem));
    })

    map = new google.maps.Map(document.getElementById('mapDiv'), {
      center: { lat: 25.765859, lng: -80.174280 },
      zoom: 13
    });

    this.selectLocation = function(location) {
      console.log(location.name());
    };

    this.filteredPlaces = ko.computed(function() {
      return this.placeList().filter(function(location) {
        return location.searchPlace().indexOf(this.searchText().toLowerCase()) !== -1;
      }, this);
    }, this);
}

function init() {
  ko.applyBindings(new ViewModel());
};

onMapsError = function() {
  console.error('Google Maps is unavailable. Please try again later.');
};