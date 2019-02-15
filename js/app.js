var places = [
    {
        name: "America Airlines Arena",
        details: "",
        lat: "",
        log: "",
    },
]

var Place = function (data) { 

    this.name = ko.observable(data.name);
    this.details = ko.observable(data.imgSrc);
    this.nicknames = ko.observableArray(data.nicknames);
    
    this.level = ko.computed(function () { 
        if(this.countClick() < 5)
        {
            return "level 1";
        }
        else 
        {
            return "level 2";
        }
     }, this);
}

var ViewModel = function () { 
    var self = this;
    
    this.placeList = ko.observableArray([]);

    places.forEach(function (newItem){
        self.placeList.push(new Place(newItem));
    })
    
    // this.currentCat = ko.observable(this.catList()[0]);

    // this.incrementCount = function () { 
    //     this.countClick(this.countClick() + 1);
    // };

    // this.setCat = function (clickedCat) { 
    //     self.currentCat(clickedCat)
    //  }
}

ko.applyBindings(new ViewModel());