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


mapStyles.standingVerticeIcon = {
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: '#3154AB',
    fillOpacity: 1.0,
    strokeColor: '#FFFFFF',
    strokeOpacity: 0.0,
    strokeWeight: 0.0,
    scale: 9
}

mapStyles.startVerticeIcon = {
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: '#FFFFFF',
    fillOpacity: 1.0,
    strokeColor: '#3154AB',
    strokeOpacity: 1.0,
    strokeWeight: 5.0,
    scale: 10
}

mapStyles.Vertice = function(_lat, _lng){
    return {
        map: cerulean.map.view,
        position: {lat: _lat, lng: _lng},
        icon: mapStyles.standingVerticeIcon,
        draggable: true,
    }
}

mapStyles.DirectedEdge = [
    {
        icon:{
            path: 'M 0,-1.5 -2,1 -2,2 0,1 2,2 2,1 z',
            fillColor: '#732BAB',
            fillOpacity: 1,
            strokeWeight: 0
        },
        offset: '50%'
    },{
        icon:{
            path: 'M 0,2  z',
            fillColor: '#732BAB',
            fillOpacity: 1,
            strokeWeight: 0
        },
        offset: '50%'
    }
]

mapStyles.Edge = {
    icons: mapStyles.DirectedEdge,
    strokeColor: '#732BAB',
    strokeWeight: 3
}

mapStyles.ReversableEdge = {
    icons: [],
    strokeColor: '#2BAB73',
    strokeWeight: 6
}




