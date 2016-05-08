var mapStyleMesh = [
    {
        stylers: [
            { hue: '#00C0DE' },
            { visibility: 'simplified' },
            { gamma: 0.12 },
            { weight: 0.8 }
        ]
    },{
        featureType: 'road',
        elementType: 'all',
        stylers: [
            { color: "#000000" },
            { visibility: 'on' }
        ]
    },{
        elementType: 'labels',
        stylers: [
            { visibility: 'off' }
        ]
    },{
        featureType: 'road',
        elementType: 'labels',
        stylers: [
            { visibility: 'off' },
            { color: "#000000" }
        ]
    },{
        featureType: 'poi.park',
        stylers: [
            { color: "#93BF9E" }
        ]
    },{
        featureType: "landscape.man_made",
        elementType: "geometry",
        stylers: [
            { weight: 0.2 }
        ]
    },{
        featureType: 'water',
        stylers: [
            { color: '#00C0DE'}
        ]
    }
];

var mapStyleRoad = [
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