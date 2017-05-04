import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Picker,
    TouchableNativeFeedback
} from 'react-native';
import { Container, Content, Tab, Tabs, Header, Body, Title, StyleProvider, getTheme, Left, Button, Icon, Right, Thumbnail, Item, Input } from 'native-base';
import { Actions } from 'react-native-router-flux';
import variables from '../../native-base-theme/variables/platform';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as firebase from 'firebase';
import CustomizedActivityIndicator from './CustomizedActivityIndicator';

export default class AddDishModalContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dishes: [
                {
                    name: 'Phở tái',
                    price: 35000
                },
                {
                    name: 'Phở bò',
                    price: 35000
                },
                {
                    name: 'Bún bò',
                    price: 35000
                }],
            quantity: 1,
            selectedDish: 0
        }
        this._renderDishPicker = this._renderDishPicker.bind(this);
        this._renderQuantityTextbox = this._renderQuantityTextbox.bind(this);
        this._onDishChange = this._onDishChange.bind(this);
    }

    render() {
        return (
            <View style={styles.addDishContainer}>
                {this._renderTitle('Add dish')}
                {this._renderSmallTitle('Dish')}
                {this._renderDishPicker()}
                {this._renderSmallTitle('Quantity')}
                {this._renderQuantityTextbox()}
            </View>
        )
    }

    _renderDishPicker() {
        var _renderedDishItems = this.state.dishes.map(function (dish, idx) {
            return <Picker.Item label={dish.name} value={idx} key={idx} />
        });
        return (
            <View
                style={{ borderColor: 'gray', borderWidth: 1, borderRadius: 5 }}
            >
                <Picker
                    selectedValue={this.state.dishes[this.state.selectedDish].name}
                    mode={'dropdown'}
                    onValueChange={this._onDishChange}>
                    {
                        _renderedDishItems
                    }
                </Picker>
            </View>
        )
    }

    _onDishChange(idx) {
        this.setState({
            selectedDish: idx
        })
    }

    _renderQuantityTextbox() {
        return (
            <TextInput style={{ borderWidth: 1, borderRadius: 5, borderColor: 'gray' }}
                placeholder='Input quantity here'
                onChangeText={(quantity) => { this.setState({ quantity: quantity }) }}
                value={this.state.quantity}
                multiline
                caretHidden
                keyboardType={'numeric'}
            />
        );
    }

    _renderTitle(title) {
        return (
            <Text style={styles.titleText}>
                {title}
            </Text>
        )
    }
    _renderSmallTitle(title) {
        return (
            <Text style={styles.smallTitleText}>
                {title}
            </Text>
        )
    }
}

const styles = StyleSheet.create({
    addDishContainer: {

    },
    titleText: {
        color: variables.mainColor,
        fontSize: 20,
        paddingBottom: 15,
        fontWeight: 'bold'
    },
    smallTitleText: {
        color: variables.mainColor,
        fontSize: 16,
        paddingBottom: 5,
    },
});

