var mapStyles = {}

mapStyles.Mesh = [
    {
      stylers: [
        { hue: '#003344' },
        { saturation: 200 }
      ]
    },{
      featureType: 'road',
      elementType: 'geometry',
      stylers: [
        { lightness: 100 },
        { visibility: 'simplified' }
      ]
    },{
        elementType: 'labels',
        stylers: [
            { visibility: 'off' }
        ]
    }
];

mapStyles.Road = [
    {
        featureType: "all",
        stylers: [
            { saturation: -80 }
        ]
    },{
        featureType: "road.arterial",
        elementType: "geometry",
        stylers: [
            { hue: "#00ffee" },
            { saturation: 50 }
        ]
    },{
        featureType: "poi.business",
        elementType: "labels",
        stylers: [
            { visibility: "off" }
        ]
    }
]


mapStyles.Vertice = function(_lat, _lng){
    return {
        map: cerulean.map.view,
        position: {lat: _lat, lng: _lng},
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: '#3939B2',
            fillOpacity: 1.0,
            strokeColor: '#FFFFFF',
            strokeOpacity: 0.0,
            strokeWeight: 0.0,
            scale: 9
        },
        draggable: true,
    }
}