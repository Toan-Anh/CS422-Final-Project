import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    ActivityIndicator
} from 'react-native';
import { Fab, Button, Icon,  } from 'native-base';

export default class CreateOrderFAB extends Component {
    constructor(props) {
        super(props);
        this.state = {
            active: false
        }
    }

    render() {
        return (
            <View>
                <Fab
                    active={this.state.active}
                    containerStyle={{ marginLeft: 10 }}
                    style={{ backgroundColor: '#5067FF' }}
                    onPress={() => this.setState({ active: !this.state.active })}>
                    <Icon name="md-create" />
                </Fab>
            </View>
        );
    }
}

const styles = StyleSheet.create({

});