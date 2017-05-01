import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    ActivityIndicator
} from 'react-native';
import { Fab, Button, Icon, } from 'native-base';
import variables from '../../native-base-theme/variables/platform';

export default class CreateOrderFAB extends Component {
    constructor(props) {
        super(props);
        this.state = {
            active: false
        }
    }

    render() {
        return (
            <Fab
                active={this.state.active}
                containerStyle={{ marginLeft: 10 }}
                style={{ backgroundColor: variables.toolbarDefaultBg }}
                onPress={() => {this.setState({ active: !this.state.active }); this.props.onFabClick(true)}}>
                <Icon name="md-create" />
            </Fab>
        );
    }
}

const styles = StyleSheet.create({

});