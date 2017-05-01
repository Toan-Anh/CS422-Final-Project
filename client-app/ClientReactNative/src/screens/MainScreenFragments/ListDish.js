import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { Fab, Button, Icon, } from 'native-base';
import FancyTable from '../../modules/FancyTable';
import CreateOrderFAB from '../../modules/CreateOrderFAB';
import FancyModal from '../../modules/FancyModal';


class ListDish extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orderModalVisible: false
        }
        this._setOrderModalVisible = this._setOrderModalVisible.bind(this);
    }

    render() {
        var modalInstance = this.state.orderModalVisible
            ?
            <FancyModal visible={this.state.orderModalVisible} onModalClose={this._setOrderModalVisible} />
            : 
            <View/>
        return (
            <View style={{ flex: 1, alignSelf: 'stretch' }}>
                <FancyTable />
                <CreateOrderFAB onFabClick={this._setOrderModalVisible} />
                {modalInstance}
            </View>
        )
    }

    _setOrderModalVisible(visible) {
        this.setState({
            orderModalVisible: visible
        });
    }
}

module.exports = ListDish;