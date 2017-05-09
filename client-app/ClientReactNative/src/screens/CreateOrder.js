import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Picker,
    TouchableNativeFeedback,
    TextInput,
    InteractionManager
} from 'react-native';
import { Container, Content, Tab, Tabs, Header, Body, Title, StyleProvider, getTheme, Left, Button, Icon, Right, Thumbnail, Item, Input } from 'native-base';
import { Actions } from 'react-native-router-flux';
import variables from '../../native-base-theme/variables/platform';
import Dash from 'react-native-dash';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as firebase from 'firebase';
import CustomizedActivityIndicator from '../modules/CustomizedActivityIndicator';
import default_dish from '../resources/default_dish.jpg';
import AddDishModal from '../modules/AddDishModal';
require('moment/locale/vi');
import moment from 'moment';

export default class CreateOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTable: '',
            tables: [],
            dishes: [],
            noteText: '',
            showModal: false,
            isLoading: true
        }
        moment.locale('vi');

        this._renderTitle = this._renderTitle.bind(this);
        this._renderTablePicker = this._renderTablePicker.bind(this);
        this._onTableChange = this._onTableChange.bind(this);
        this._renderDishItem = this._renderDishItem.bind(this);
        this._renderNoteTextbox = this._renderNoteTextbox.bind(this);
        this._handleDishModal = this._handleDishModal.bind(this);
        this._getNewDish = this._getNewDish.bind(this);
        this._onDeleteDish = this._onDeleteDish.bind(this);
        this._onSendNewOrder = this._onSendNewOrder.bind(this);
    }

    componentDidMount() {
        var that = this;
        InteractionManager.runAfterInteractions(() => {
            var tablesRef = firebase.database().ref('tables');
            tablesRef.on('value', function (snapshot) {
                var tables = [];
                for (let x in snapshot.val()) {
                    tables.push(x);
                }

                that.setState({
                    tables: tables,
                    isLoading: false,
                    selectedTable: tables[0]
                });
            });
        })

    }

    render() {
        var content = this.state.isLoading
            ? (
                <Content contentContainerStyle={{ flex: 1, alignSelf: 'stretch' }}>
                    <View style={{
                        flex: 1,
                        alignSelf: 'stretch',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <CustomizedActivityIndicator />
                    </View>
                </Content>
            )
            : (
                <Content>
                    <View style={styles.mainHeader}>
                        {this._renderTitle('Table')}
                        {this._renderTablePicker()}
                    </View>
                    <View style={styles.mainHeader}>
                        {this._renderTitle('Dishes')}
                        {this.state.dishes.map(this._renderDishItem)}
                        <Button style={{ backgroundColor: variables.mainColor }} onPress={() => this._handleDishModal(true)}>
                            <Text style={{ color: 'white' }}>
                                Add Dish
                                </Text>
                        </Button>
                    </View>
                    <View style={styles.mainHeader}>
                        {this._renderTitle('Note')}
                        {this._renderNoteTextbox()}
                    </View>
                    <AddDishModal onModalClose={this._handleDishModal} visible={this.state.showModal} getDish={this._getNewDish} />
                </Content>
            )
        return (
            <StyleProvider style={getTheme(variables)}>
                <Container>
                    <Header>
                        <Left>
                            <Button transparent onPress={() => Actions.pop()}>
                                <Icon name={'md-close'} />
                            </Button>
                        </Left>
                        <Body>
                            <Title>New Order</Title>
                        </Body>
                        <Right>
                            <Button transparent onPress={this._onSendNewOrder}>
                                <Icon name={'md-checkmark'} />
                            </Button>
                        </Right>
                    </Header>
                    {content}
                </Container>
            </StyleProvider>
        );
    }

    _onSendNewOrder() {
        if (this.state.dishes.length == 0) {
            alert('No dish was chosen!');
            return;
        }
        var that = this;
        var ordersRef = firebase.database().ref('orders/' + this.state.selectedTable);
        ordersRef.once('value', function (snapshot) {
            var newOrders = snapshot.val() ? snapshot.val() : [];
            newOrders.push({
                dishes: that.state.dishes,
                state: 'preparing',
                time: moment().format('X'),
                note: that.state.noteText
            });
            ordersRef.set(newOrders);
            Actions.pop();
        });
    }

    componentWillUnmount() {
        firebase.database().ref('tables').off();
        var ordersRef = firebase.database().ref('orders/' + this.state.selectedTable);
        ordersRef.off();
    }

    _handleDishModal(value) {
        this.setState({
            showModal: value
        });
    }

    _renderTablePicker() {
        var _renderedTableItems = this.state.tables.map(function (table, idx) {
            return <Picker.Item label={table} value={table} key={idx} />
        });
        return (
            <View
                style={{ borderColor: 'gray', borderWidth: 1, borderRadius: 5 }}
            >
                <Picker
                    selectedValue={this.state.selectedTable}
                    mode={'dropdown'}
                    onValueChange={this._onTableChange}>
                    {
                        _renderedTableItems
                    }
                </Picker>
            </View>
        )
    }

    _onTableChange(value) {
        this.setState({
            selectedTable: value
        });
    }

    _renderTitle(title) {
        return (
            <Text style={styles.titleText}>
                {title}
            </Text>
        )
    }

    _renderDishItem(item, idx) {
        return (
            <View style={styles.dishItemContainer} key={item.name}>
                <View style={styles.dishThumbnailContainer}>
                    <Thumbnail square source={{ uri: item.image }} />
                </View>
                <View style={styles.dishDetailContainer}>
                    <Text style={styles.dishNameText}>
                        {item.name}
                    </Text>
                    <Text style={styles.dishQuantityText}>
                        {'quantity: ' + item.quantity}
                    </Text>
                </View>

                <TouchableNativeFeedback onPress={(e) => this._onDeleteDish(e, idx)}>
                    <View style={styles.dishRemovalContainer}>
                        <Icon name={'md-close'} style={{ textAlign: 'center', color: 'gray' }} />
                    </View>
                </TouchableNativeFeedback>
            </View>
        );
    }

    _onDeleteDish(e, idx) {
        var newDishes = this.state.dishes;
        newDishes.splice(idx, 1);
        console.log(idx);
        this.setState({
            dishes: newDishes
        });
    }

    _renderNoteTextbox() {
        return (
            <TextInput style={{ borderWidth: 1, borderRadius: 5, borderColor: 'gray' }}
                placeholder='Input note here'
                onChangeText={(text) => { this.setState({ noteText: text }) }}
                value={this.state.noteText}
                multiline
                underlineColorAndroid={'transparent'}
            />
        );
    }

    _getNewDish(newDish) {
        var dishesClone = this.state.dishes;
        for (let i = 0; i < dishesClone.length; i++) {
            if (dishesClone[i].name === newDish.name) {
                dishesClone[i].quantity = parseInt(dishesClone[i].quantity) + parseInt(newDish.quantity);
                this.setState({
                    dishes: dishesClone
                });
                return;
            }
        }

        dishesClone.push(newDish);
        this.setState({
            dishes: dishesClone
        });
    }
}

const styles = StyleSheet.create({
    titleText: {
        color: variables.mainColor,
        fontSize: 20,
        paddingBottom: 5
    },
    mainHeader: {
        paddingHorizontal: 15,
        paddingTop: 15
    },
    dishItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 10
    },
    dishThumbnailContainer: {
        flex: 1
    },
    dishDetailContainer: {
        flex: 5,
        flexDirection: 'column',
        paddingHorizontal: 15
    },
    dishNameText: {
        color: 'black',
        fontSize: 18
    },
    dishQuantityText: {
        fontSize: 14
    },
    dishRemovalContainer: {
        flex: 1
    }
});
