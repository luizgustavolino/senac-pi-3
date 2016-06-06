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


mapStyles.Package = function(_lat, _lng, _color){
    return {
        map: cerulean.map.view,
        position: {lat: _lat, lng: _lng},
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: _color,
            fillOpacity: 1.0,
            strokeOpacity: 0.0,
            strokeWeight: 0.0,
            scale: 10
        },
        draggable: false,
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

mapStyles.tempCentralMarker = {
    path: 'M 22.25 15.65 L 22.75 14.55 Q 23.95 11.933203125 23.95 10.2 23.95 6.45 21.3 3.8 18.703125 1.203125 15.05 1.15 14.975390625 1.15 14.9 1.15 11.15 1.15 8.5 3.8 5.85 6.45 5.85 10.2 5.85 12.1884765625 6.6 13.85 6.851171875 14.4525390625 8.9 18.25 L 15.05 29.6 15.05 29.65 22.25 15.65 M 10.3 5.3 Q 12.25 3.35 15 3.35 17.75 3.35 19.7 5.3 21.65 7.25 21.65 10 21.65 12.75 19.7 14.7 17.75 16.65 15 16.65 12.25 16.65 10.3 14.7 8.35 12.75 8.35 10 8.35 7.25 10.3 5.3 M 14.05 10.55 L 16.25 10.55 16.25 13.4 18.4 13.45 18.45 10.1 21.25 10.15 15.25 4.65 9.35 10.1 11.85 10.1 11.85 13.35 14.05 13.35 14.05 10.55 Z',
    fillOpacity: 0.0,
    scale: 2.0,
    anchor: {x:15, y:30},
    strokeColor: '#000000',
    strokeWeight: 2
};

mapStyles.centralMarker = {
    path: 'M 22.25 15.65 L 22.75 14.55 Q 23.95 11.933203125 23.95 10.2 23.95 6.45 21.3 3.8 18.703125 1.203125 15.05 1.15 14.975390625 1.15 14.9 1.15 11.15 1.15 8.5 3.8 5.85 6.45 5.85 10.2 5.85 12.1884765625 6.6 13.85 6.851171875 14.4525390625 8.9 18.25 L 15.05 29.6 15.05 29.65 22.25 15.65 M 10.3 5.3 Q 12.25 3.35 15 3.35 17.75 3.35 19.7 5.3 21.65 7.25 21.65 10 21.65 12.75 19.7 14.7 17.75 16.65 15 16.65 12.25 16.65 10.3 14.7 8.35 12.75 8.35 10 8.35 7.25 10.3 5.3 M 14.05 10.55 L 16.25 10.55 16.25 13.4 18.4 13.45 18.45 10.1 21.25 10.15 15.25 4.65 9.35 10.1 11.85 10.1 11.85 13.35 14.05 13.35 14.05 10.55 Z',
    fillColor: "#E09B17",
    fillOpacity: 1.0,
    scale: 2.0,
    anchor: {x:15, y:30},
    strokeWeight: 0
};



