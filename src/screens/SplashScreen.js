import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import config from '../config/deviceconfig';
import * as Animatable from 'react-native-animatable';

const imageSource = '../assets/schoolbus.png';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Animatable.Image
          animation="bounceIn"
          duration={1500}
          source={require(imageSource)}
          style={styles.logo}
          resizeMode="stretch"
        />
      </View>
    </View>
  );
};

const height = config.deviceHeight;
const height_logo = height * 0.28;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },

  logo: {
    width: height_logo,
    height: height_logo,
  },
});

export default SplashScreen;
