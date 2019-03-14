var CLIENT_ID = '5Y0RQGFXWA4VMNA5MPIW5RSFZ2BK0CVH0E4WXDBRYUQ13N2F';
var CLIENT_SECRET = 'L1SM3BEOGH1K4P05LN1FUHV1WF55XNSJCLVWRVYKSWWBKBTX';

var map;
var actualPointTip;

var placesModel = [
    {
      name: "America Airlines Arena",
      lat: 25.781685, 
      long: -80.186908
    },
    {
      name: 'Mandarin Oriental, Miami',
      lat: 25.765025,
      long: -80.185173
    },
    {
      name: 'Brickell Key Jogging Trail',
      lat: 25.769032,
      long: -80.186610
    }
]


var Place = function (data) { 
  var self = this;

  self.name = ko.observable(data.name);
  self.searchPlace = ko.observable(data.name.toLowerCase());
  self.address = ko.observable();
  self.usersVisit = ko.observable();
  self.isHide = ko.observable();

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

  this.point = new google.maps.Marker({
    map: map,
    position: new google.maps.LatLng(data.lat, data.long),
    name: self.name()
  });

  this.setPoint = ko.computed(function() {
    if(self.isHide()) {
      self.point.setMap(null);
    } else {
      self.point.setMap(map);
    }
    return true;
  });

  this.point.addListener('click', function() {

    if (actualPointTip) {
      actualPointTip.close();
    }
    
    var formatedAddr = self.address().trim();
    var infoHtml = [
      '<div class="info text-center">',
        '<h3>', self.name(), '</h3>',
        '<p>',
        'This place was visited <strong>', self.usersVisit(), '</strong> times.',
        '</p>',
        '<br>',
        '<span class="glyphicon glyphicon-screenshot" aria-hidden="true"></span>',
        '<strong>', formatedAddr, '</strong>',
      '</div>'
    ];

    var newToolTip = new google.maps.InfoWindow({ content: infoHtml.join('') });
    newToolTip.open(map, self.point);

    // Update actual place point
    actualPointTip = newToolTip;
  });
}

var ViewModel = function () { 
    var self = this;

    this.searchText = ko.observable('');
    this.placeList = ko.observableArray([]);

    map = new google.maps.Map(document.getElementById('mapDiv'), {
      center: { lat: 25.765859, lng: -80.174280 },
      zoom: 14
    });

    placesModel.forEach(function (newItem){
      var place = new Place(newItem);  
      place.isHide(false);
      self.placeList.push(place);
    })

    this.selectLocation = function(location) {
      console.log(location.name());
    };

    this.filteredPlaces = ko.computed(function() {
      return this.placeList().filter(function(place) {
        var state = place.searchPlace().indexOf(this.searchText().toLowerCase()) !== -1;
        place.isHide(!state);
        return state;
      }, this);
    }, this);
}

function init() {
  ko.applyBindings(new ViewModel());
};

onMapsError = function() {
  console.error('Google Maps is unavailable. Please try again later.');
};