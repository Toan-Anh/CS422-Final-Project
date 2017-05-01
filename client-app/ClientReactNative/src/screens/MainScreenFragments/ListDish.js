import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { Fab, Button, Icon,  } from 'native-base';
import FancyTable from '../../modules/FancyTable';
import CreateOrderFAB from '../../modules/CreateOrderFAB';


class ListDish extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <View style={{flex: 1, alignSelf: 'stretch'}}>
                <FancyTable/>
                <CreateOrderFAB/>
            </View>
        )
    }
}

module.exports = ListDish;