import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    ActivityIndicator
} from 'react-native';
import variables from '../../native-base-theme/variables/platform';

export default class CustomizedActivityIndicator extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        return (
            <ActivityIndicator size="large" color={variables.toolbarDefaultBg}/>
        )
    }
}