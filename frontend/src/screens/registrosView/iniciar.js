import React, { Component } from 'react';
import { Image, StyleSheet, Dimensions, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';

const { width, height } = Dimensions.get('window');
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = 0.0421;

const busIcon = require('../../assets/logo/busMap.png');

const baseUrl = 'http://192.168.0.63:3000/';

const initCoordinates = {
    latitude: -24.133765,
    longitude: -90.198258,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
};

export default class SmoothAnimation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            initialRegion: {
                latitude: -19.9942,
                longitude: -44.01745,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            },
            ready: false,
            busStops: [],
            polyline: [],
            error: null,
            coordinate: new MapView.AnimatedRegion({
                latitude: -19.9942,
                longitude: -44.01745,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            }),
            dadosRota: this.props.navigation.getParam('dadosRota', 'null'),
        };
        this.index = 0;
    }

    componentWillReceiveProps(newProps) { // esse componente é construido sempre que os props são modificados
        //alert(JSON.stringify(newProps.navigation.state.params.dadosRota))
        let oldDados = this.state.dadosRota
        const { dadosRota } = newProps.navigation.state.params
    
        if (dadosRota[0].turno != oldDados[0].turno ||
          dadosRota[0].rota != oldDados[0].rota ||
          dadosRota[0].rua != oldDados[0].rua ||
          dadosRota[0].bairro != oldDados[0].bairro ||
          dadosRota[0].numero != oldDados[0].numero
        ) {
          this.setState({ dadosRota: dadosRota })
        }
        //alert("Iniciar view")
      }

    // Update Origin
    handleAnimation = () => {
        const data = this.state.polyline[this.index];
        console.log(data);
        const markerCoord = data;
        console.log("data ==>", data);
        this.index = this.index + 1;
        const region = {
            ...markerCoord,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
        };

        this.map.animateToRegion(region, 1000 * 2)
        this.state.coordinate.timing(markerCoord, 1000).start();
    }

    async getRoute() {
        try {
            let url = baseUrl + 'routes/2';
            const response = await fetch(url);
            this.setState({ polyline: await response.json() });
            console.log('rotas ok')
        }
        catch (err) {
            console.log('erro fetch rota ', err);
        }
    }

    async getBusStops() {
        try {
            let url = baseUrl + 'busstops/';
            const response = await fetch(url);
            this.setState({ busStops: await response.json() });
            console.log('pontos ok');
        }
        catch (err) {
            console.log('fetch failed', err);
        }
    }
    componentDidMount = async () => {
        await this.getBusStops();
        await this.getRoute();
        console.log('ola')
        this.setState({ ready: true });

        let geoOptions = {
            enableHighAccuracy: false,
            timeOut: 20000, //20 second  
            //  maximumAge: 1000 //1 second  
        };
        this.handleAnimation();
        setInterval(this.handleAnimation, 3000)
    }

    render() {
        alert(JSON.stringify(this.state.dadosRota))
        return (

            <View style={{ flex: 1 }}>

                <MapView
                    style={styles.container}
                    initialRegion={initCoordinates}
                    ref={ref => { this.map = ref; }}
                >

                    {

                        this.state.busStops.length > 0 ?
                            this.state.busStops.map((element, index) => {
                                return (
                                    <Marker
                                        key={index}
                                        coordinate={element}
                                        title={`PONTO ${index}`}
                                        description={element.description}
                                    />)
                            })
                            :
                            console.log('não há dados')
                    }
                    {this.state.polyline.length > 0 ?
                        // console.log(this.state.polyline)
                        <Polyline
                            coordinates={this.state.polyline}
                            strokeColor="#72bcd4" // fallback for when `strokeColors` is not supported by the map-provider
                            strokeWidth={6}

                        />
                        :
                        console.log('oi')

                    }
                    <MapView.Marker.Animated
                        coordinate={this.state.coordinate}
                        ref={marker => { this.marker = marker; }}
                    >
                        <Image
                            style={{
                                width: 40,
                                height: 40,
                                resizeMode: 'contain',
                                zIndex: 3
                            }}
                            source={busIcon}
                        />
                    </MapView.Marker.Animated>
                </MapView>
            </View>
        )
    }
}

var styles = StyleSheet.create({
    container: {
        // flex: 1,
        flex: 8,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        //justifyContent: 'flex-end'
    },
    panview: {
        position: "absolute",
    },
    box: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        height: height, // let's make panview height is equal to screen height
        width: width,
        borderRadius: 10,
        //position: 'absolute'
    },

});