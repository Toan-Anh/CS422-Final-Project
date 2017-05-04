import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Picker,
    TouchableNativeFeedback,
    TextInput
} from 'react-native';
import { Container, Content, Tab, Tabs, Header, Body, Title, StyleProvider, getTheme, Left, Button, Icon, Right, Thumbnail, Item, Input } from 'native-base';
import { Actions } from 'react-native-router-flux';
import variables from '../../native-base-theme/variables/platform';
import Dash from 'react-native-dash';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as firebase from 'firebase';
import CustomizedActivityIndicator from '../modules/CustomizedActivityIndicator';
import default_dish from '../resources/default_dish.jpg';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import FancyModal from '../modules/FancyModal';
import AddDishModalContent from '../modules/AddDishModalContent';

export default class CreateOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTable: 'ban 1',
            tables: ['ban 1', 'ban 2', 'ban 3'],
            dishes: [
                {
                    name: 'Phở tái',
                    quantity: 2,
                    price: 35000
                },
                {
                    name: 'Bún bò',
                    quantity: 5,
                    price: 35000
                }
            ],
            noteText: '',
            showModal: false
        }

        this._renderTitle = this._renderTitle.bind(this);
        this._renderTablePicker = this._renderTablePicker.bind(this);
        this._onTableChange = this._onTableChange.bind(this);
        this._renderDishItem = this._renderDishItem.bind(this);
        this._renderNoteTextbox = this._renderNoteTextbox.bind(this);
        this._handleDishModal = this._handleDishModal.bind(this);
    }

    render() {
        console.log('\n\n\n\n\n\n\nshowmodal');
        console.log(this.state.showModal);
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
                            <Button transparent>
                                <Icon name={'md-checkmark'} />
                            </Button>
                        </Right>
                    </Header>
                    <Content contentContainerStyle={{ flex: 1, alignSelf: 'stretch' }} scrollEnabled={false}>
                        <View style={styles.mainHeader}>
                            {this._renderTitle('Table')}
                            {this._renderTablePicker()}
                        </View>
                        <View style={styles.mainHeader}>
                            {this._renderTitle('Dishes')}
                            {this.state.dishes.map(this._renderDishItem)}
                            <Button style={{ backgroundColor: variables.mainColor }} onPress={() =>this._handleDishModal(true)}>
                                <Text style={{ color: 'white' }}>
                                    Add Dish
                                </Text>
                            </Button>
                        </View>
                        <View style={styles.mainHeader}>
                            {this._renderTitle('Note')}
                            {this._renderNoteTextbox()}
                        </View>
                        <FancyModal content={AddDishModalContent} onModalClose={this._handleDishModal} visible={this.state.showModal}/>
                        <KeyboardSpacer />
                    </Content>
                </Container>
            </StyleProvider>
        );
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

    _renderDishItem(item) {
        return (
            <View style={styles.dishItemContainer}>
                <View style={styles.dishThumbnailContainer}>
                    <Thumbnail square source={default_dish} />
                </View>
                <View style={styles.dishDetailContainer}>
                    <Text style={styles.dishNameText}>
                        {item.name}
                    </Text>
                    <Text style={styles.dishQuantityText}>
                        {item.quantity}
                    </Text>
                </View>

                <TouchableNativeFeedback>
                    <View style={styles.dishRemovalContainer}>
                        <Icon name={'md-close'} style={{ textAlign: 'center', color: 'gray' }} />
                    </View>
                </TouchableNativeFeedback>
            </View>
        );
    }

    _renderNoteTextbox() {
        return (
            <TextInput style={{ borderWidth: 1, borderRadius: 5, borderColor: 'gray' }}
                placeholder='Input note here'
                onChangeText={(text) => { this.setState({ noteText: text }) }}
                value={this.state.noteText}
                multiline
                caretHidden
            />
        );
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