import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Modal,
    Picker,
    TextInput
} from 'react-native';
import { Button, Icon, } from 'native-base';
import variables from '../../native-base-theme/variables/platform';
import * as firebase from 'firebase';
import CustomizedActivityIndicator from '../modules/CustomizedActivityIndicator';

export default class FancyModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: true,
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
            selectedDish: 0,
            isLoading: true
        }

        this._setModalVisible = this._setModalVisible.bind(this);
        this._renderAddDishContent = this._renderAddDishContent.bind(this);
        this._renderDishPicker = this._renderDishPicker.bind(this);
        this._renderQuantityTextbox = this._renderQuantityTextbox.bind(this);
        this._onPressAdd = this._onPressAdd.bind(this);
        this._onDishChange = this._onDishChange.bind(this);
    }

    componentDidMount() {
        var that = this;
        var dishesRef = firebase.database().ref('dishes');
        dishesRef.on('value', function (snapshot) {
            console.log(snapshot.val());
            var dishes = [];
            var temp = snapshot.val();
            for (let x in temp) {
                dishes.push({
                    price: temp[x]['price'],
                    name: temp[x]['name'],
                    image: temp[x]['image']
                });
            }

            that.setState({
                dishes: dishes,
                isLoading: false,
                modalVisible: that.props.visible
            });
        });
    }

    componentWillUnmount() {
        var dishesRef = firebase.database().ref('dishes');
        dishesRef.off();
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ modalVisible: nextProps.visible });
    }

    render() {
        var content = this.state.isLoading
            ? (
                <View style={{
                    flex: 1,
                    alignSelf: 'stretch',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <CustomizedActivityIndicator />
                </View>
            )
            : (
                <View style={styles.innerContainer}>
                    {this._renderAddDishContent()}
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 1 }} />
                        <Button transparent onPress={() => { this.props.onModalClose(false) }}>
                            <Text style={{ color: variables.mainColor, fontWeight: 'bold' }}> Cancel </Text>
                        </Button>
                        <Button transparent onPress={this._onPressAdd}>
                            <Text style={{ color: variables.mainColor, fontWeight: 'bold' }}> Add </Text>
                        </Button>
                    </View>
                </View>
            )
        return (
            <Modal
                animationType={'fade'}
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => { this.props.onModalClose(false) }}
            >
                <View style={[styles.container, styles.modalBackgroundStyle]}>
                    {content}
                </View>
            </Modal>
        )
    }

    _onPressAdd() {
        var newDish = JSON.parse(JSON.stringify(this.state.dishes[this.state.selectedDish]));
        newDish['quantity'] = this.state.quantity;
        console.log('\n\n\n\n\n\n\nnewdishAdd');
        console.log(newDish);
        this.props.getDish(newDish);
        this.setState({
            quantity: 0,
            selectedDish: 0
        })
        this.props.onModalClose(false);
    }

    _setModalVisible(visible) {
        this.setState({
            modalVisible: visible
        })
    }

    _renderAddDishContent() {
        return (
            <View style={styles.addDishContainer}>
                {this._renderTitle('Add dish')}
                {this._renderSmallTitle('Dish')}
                {this._renderDishPicker()}
                <View style={{ padding: 5 }} />
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
                    selectedValue={this.state.selectedDish}
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
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 10,
    },
    modalBackgroundStyle: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    innerContainer: {
        borderRadius: 10,
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 10
    },
    addDishContainer: {
        width: '100%',
        paddingHorizontal: 10
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