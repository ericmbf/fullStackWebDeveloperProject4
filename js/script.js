$("#menu-toggle").click(function(e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
});

function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');
    var $address = $("#street").val() + ", " + $("#city").val();

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    var urlGStreet = "https://maps.googleapis.com/maps/api/streetview?"
    urlGStreet += "size=600x400";
    urlGStreet += "&location=" + $address;
    urlGStreet += "&key=AIzaSyDRDr3vn34EbQPkQjsRMzMr3C9n_8_hw6w";
    
    // YOUR CODE GOES HERE!
    $body.append('<img class="bgimg" src="' + urlGStreet + '">');

    // load artcicles from ny
    urlNy = "https://api.nytimes.com/svc/search/v2/articlesearch.json?"
    urlNy += "q=" + $address;
    urlNy += "&api-key=oqE0MIfdmEemMAyjr7y2HHt0qWhwn5km";

    $.getJSON( urlNy, function( data ) {
        var items = [];
        $.each( data["response"]["docs"], function( key, val ) {
          items.push( "<li class='article'>" 
                        + "<a href=" + val["web_url"] + ">"
                            + val["headline"]["main"] + 
                          "</a>"
                        + "<p>" + val["snippet"] + "</p>"
                        +"</li>");
        })
       
        $( "<ul/>", {
          "class": "my-new-list",
          html: items.join( "" )
        }).appendTo( "#nytimes-articles" );
      }).fail(function() {
        $nytHeaderElem.text("New York Times Articles Could not be load");
      });

    urlWiki = "https://en.wikipeasasdasddia.org/w/api.php?action=query&list=search"
    urlWiki += "&format=json"
    urlWiki += "&srsearch=" + $("#city").val()
    $.ajax({
      url: urlWiki,
      dataType: 'jsonp',
      jsonpCallback: 'handleWikiApi',
      type: 'GET'
    });

    return false;
};

$('#form-container').submit(loadData);

// loadData();

function handleWikiApi(result) {
  var items = [];
  $.each(result["query"]["search"], function (key, val) {
    items.push("<li>"
      + "<a href='http://en.wikipedia.org/wiki/" + val["title"] + "'>"
      + val["title"]+
      "</a>"
      + "</li>");
  })

  $("<ul/>", {
    html: items.join("")
  }).appendTo("#wikipedia-links");
}
