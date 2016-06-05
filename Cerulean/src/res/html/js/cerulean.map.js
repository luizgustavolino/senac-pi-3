
// ---[ Map  ]---

cerulean.map = {}
cerulean.map.bootstrap = function(){
    cerulean.map.view = new google.maps.Map(document.getElementById('map'), {
        zoom: 17,
        center: {lat: -23.5607558, lng: -46.6597692},
        styles: mapStyles.Road,
        fullscreenControl: false,
        mapTypeControl: false,
        streetViewControl: false,
        minZoom: 16,
        maxZoom: 18,
        scrollwheel: false,
        noClear: true,
        zoomControlOptions: {
            position: google.maps.ControlPosition.LEFT_CENTER
        }
    });
};