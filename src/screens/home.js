import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Platform,
  Alert,
  Text,
  PermissionsAndroid,
  ActivityIndicator,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {getUserProfile} from '../services/profilestorage';
import {mapStyle} from '../config/mapconfig';
import config from '../config/deviceconfig';
import Geolocation from '@react-native-community/geolocation';
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  AnimatedRegion,
  Polyline,
} from 'react-native-maps';
import {
  distanceBetweenPoints,
  getPositionWithOffset,
  getRotationAngle,
} from '../utils/MapHelper';

const ASPECT_RATIO = config.deviceWidth / config.deviceHeight;
const LATITUDE = 11.8091167;
const LONGITUDE = 77.8355491;
const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class Home extends Component {
  state = {
    prevLatitude: LATITUDE,
    prevLongitude: LONGITUDE,
    latitude: LATITUDE,
    longitude: LONGITUDE,
    curAngle: 45,
    coordinateRegion: new AnimatedRegion({
      latitude: LATITUDE,
      longitude: LONGITUDE,
      latitudeDelta: 0,
      longitudeDelta: 0,
    }),
    busStops: [
      {
        title: 'Sampalli',
        latlng: {latitude: 11.8091167, longitude: 77.8355491},
        description: 'Pudusampalli-636403',
      },
      {
        title: 'Karumalaikoodal',
        latlng: {latitude: 11.8078782, longitude: 77.8291293},
        description: 'Karumalaikoodal-636402',
      },
      {
        title: 'RS',
        latlng: {latitude: 11.8071712, longitude: 77.8244763},
        description: 'RS-636401',
      },
      {
        title: '16 Bridge',
        latlng: {latitude: 11.8029392, longitude: 77.8163673},
        description: '16 bridge-636400',
      },
    ],
    error: null,
    isLoading: false,
    isMapReady: false,
    driverData: null,
  };

  stoplatlng = [
    {latitude: this.state.latitude, longitude: this.state.longitude},
    {latitude: 11.8091167, longitude: 77.8355491},
    {latitude: 11.8078782, longitude: 77.8291293},
    {latitude: 11.8071712, longitude: 77.8244763},
    {latitude: 11.8029392, longitude: 77.8163673},
  ];

  getCurrentLocation = async () => {
    this.setState({isLoading: true});
    await Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        this.setState({
          latitude,
          longitude,
          coordinate: {latitude, longitude},
          isLoading: false,
        });
      },
      error => {
        this.setState({error: error.message});
        alert(error.message);
      },
      {enableHighAccuracy: true, timeout: 200000, maximumAge: 1000},
    );
  };

  getMapPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message:
            'This Apps need access to your location. please enable your location',
          buttonPositive: 'ok',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.getCurrentLocation();
        console.log('Location permission granted');
      } else {
        console.log('Location permission denied');
      }
    } catch (err) {
      console.log(err);
    }
  };

  watchLocation = async () => {
    this.watchID = await Geolocation.watchPosition(
      position => {
        const {
          coordinateRegion: coordinate,
          latitude: statlat,
          longitude: statlong,
          curAngle,
        } = this.state;

        this.setState({prevLatitude: statlat, prevLongitude: statlong});

        const newCoordinate = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        };

        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        coordinate.timing({newCoordinate, duration: 1000}).start();
      },
      error => console.log(error),
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000,
        distanceFilter: 1,
      },
    );
  };

  async componentDidMount() {
    try {
      this.getMapPermission();
      this.watchLocation();
      const data = await getUserProfile('userProfile');
      this.setState({driverData: JSON.parse(data)});
      await firestore()
        .collection('location')
        .doc(this.state.driverData.EmailID)
        .set({
          coordinates: new firestore.GeoPoint(
            this.state.latitude,
            this.state.longitude,
          ),
        });
    } catch (error) {
      console.log(error);
    }
  }

  async componentDidUpdate(prevProps, prevState) {
    const {
      prevLatitude,
      prevLongitude,
      latitude,
      longitude,
      curAngle,
    } = this.state;
    try {
      if (this.props.latitude !== prevState.latitude) {
        await firestore()
          .collection('location')
          .doc(this.state.driverData.EmailID)
          .update({
            coordinates: new firestore.GeoPoint(
              this.state.latitude,
              this.state.longitude,
            ),
          });
      }
      this.stoplatlng = [
        {latitude: this.state.latitude, longitude: this.state.longitude},
        {latitude: 11.8091167, longitude: 77.8355491},
        {latitude: 11.8078782, longitude: 77.8291293},
        {latitude: 11.8071712, longitude: 77.8244763},
        {latitude: 11.8029392, longitude: 77.8163673},
      ];
    } catch (error) {
      console.log(error);
    }
  }

  getMapRegion = () => ({
    latitude: this.state.latitude,
    longitude: this.state.longitude,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });

  onMapReady = () => {
    if (this.mapView) {
      this.setState({isMapReady: true});
      this.mapView.animateCamera(
        {
          center: {
            latitude: this.state.latitude,
            longitude: this.state.longitude,
          },
          zoom: 16,
        },
        2000,
      );
    }
  };

  render() {
    const {latitude, longitude, isLoading, isMapReady} = this.state;
    return (
      <SafeAreaView style={styles.container}>
        {isLoading && <ActivityIndicator />}
        {!isLoading && (
          <MapView
            ref={ref => {
              this.mapView = ref;
            }}
            rotateEnabled={false}
            maxZoomLevel={16}
            minZoomLevel={12}
            zoomEnabled={true}
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            onMapReady={this.onMapReady}
            customMapStyle={mapStyle}
            region={this.getMapRegion()}
            followsUserLocation={true}
            loadingEnabled={true}>
            {this.state.busStops.map(stop => (
              <Marker
                key={stop.title}
                coordinate={stop.latlng}
                title={stop.title}
                description={stop.description}
              />
            ))}
            {isMapReady && (
              <Marker.Animated
                key="Bus"
                ref={marker => {
                  this.marker = marker;
                }}
                flat={true}
                anchor={{x: 0.5, y: 0.5}}
                title="School Bus"
                description={`Driver:${this.state.driverData.FirstName}`}
                coordinate={{latitude, longitude}}
                pinColor="yellow"
                image={require('../assets/busmarker.png')}
              />
            )}
            <Polyline
              coordinates={this.stoplatlng}
              strokeColor="black"
              strokeWidth={6}
            />
          </MapView>
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: config.deviceHeight * 0.6,
    width: config.deviceWidth,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default Home;
