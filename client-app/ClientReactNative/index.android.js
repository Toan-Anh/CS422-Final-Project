/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

import LogInScreen from './src/screens/LogIn/LogInScreen';
import MainScreen from './src/screens/MainScreen';
import OrderDetail from './src/screens/OrderDetail';
import { Scene, Router, ActionConst } from 'react-native-router-flux';

import * as firebase from 'firebase';

var config = {
  apiKey: "AIzaSyChH5O7-ZtDqB53Qpv7dYo78co2RP5gyT8",
  authDomain: "mini-restaurant-management.firebaseapp.com",
  databaseURL: "https://mini-restaurant-management.firebaseio.com",
  projectId: "mini-restaurant-management",
  storageBucket: "mini-restaurant-management.appspot.com",
  messagingSenderId: "927567795857"
};
firebase.initializeApp(config);

export default class ClientReactNative extends Component {
  render() {
    return (
      <Router>
        <Scene key="root" hideNavBar>
          <Scene key="login" component={LogInScreen} type={ActionConst.REPLACE}/>
          <Scene key="mainscreen" component={MainScreen} type={ActionConst.REPLACE}/>
          <Scene key="orderdetail" component={OrderDetail} />
        </Scene>
      </Router>)
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('ClientReactNative', () => ClientReactNative);
