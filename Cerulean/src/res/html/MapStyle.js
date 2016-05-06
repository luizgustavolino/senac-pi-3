var mapStyle = [
    {
        stylers: [
            {
                hue: '#00C0DE'
            },
            {
                visibility: 'simplified'
            },
            {
                gamma: 0.12
            },
            {
                weight: 0.8
            }
        ]
    },
    {
        featureType: 'road',
        elementType: 'all',
        stylers: [
            {
                color: "#dedeff"
            },
            {
                visibility: 'on'
            },
            
        ]
    },
    {
        elementType: 'labels',
        stylers: [
            {
                visibility: 'off'
            }
        ]
    },
    {
        featureType: 'road',
        elementType: 'labels',
        stylers: [
            {
                visibility: 'off'
            },
            {
                color: "#000000"
            }
        ]
    },
    {
        featureType: 'poi.park',
        stylers: [
            {
                color: "#93BF9E"
            }
        ]
    },
    {
        featureType: "landscape.man_made",
        elementType: "geometry",
        stylers: [
            {
                weight: 0.2
            }
        ]
    },
    {
        featureType: 'water',
        stylers: [
            {
                color: '#00C0DE'
            }
        ]
    }
]