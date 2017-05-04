import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Picker,
    TouchableNativeFeedback
} from 'react-native';
import { Container, Content, Tab, Tabs, Header, Body, Title, StyleProvider, getTheme, Left, Button, Icon, Right, Thumbnail } from 'native-base';
import { Actions } from 'react-native-router-flux';
import variables from '../../native-base-theme/variables/platform';
import Dash from 'react-native-dash';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as firebase from 'firebase';
import CustomizedActivityIndicator from '../modules/CustomizedActivityIndicator';
import default_dish from '../resources/default_dish.jpg';

export default class CreateOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTable: 'ban 1',
            tables: ['ban 1', 'ban 2', 'ban 3']
        }

        this._renderTitle = this._renderTitle.bind(this);
        this._renderTablePicker = this._renderTablePicker.bind(this);
        this._onTableChange = this._onTableChange.bind(this);
    }

    render() {
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
                    <Content contentContainerStyle={{ flex: 1, alignSelf: 'stretch' }}>
                        <View style={styles.mainHeader}>
                            {this._renderTitle('Table')}
                            {this._renderTablePicker()}
                        </View>
                        <View style={styles.mainHeader}>
                            {this._renderTitle('Dishes')}
                            {this._renderDishItem()}
                        </View>
                    </Content>
                </Container>
            </StyleProvider>
        );
    }

    _renderTablePicker() {
        var _renderedTableItems = this.state.tables.map(function (table, idx) {
            return <Picker.Item label={table} value={table} key={idx} />
        });
        return (
            <Picker
                selectedValue={this.state.selectedTable}
                mode={'dropdown'}
                onValueChange={this._onTableChange}>
                {
                    _renderedTableItems
                }
            </Picker>
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
            <TouchableNativeFeedback>
                <View style={styles.dishItemContainer}>
                    <View style={styles.dishThumbnailContainer}>
                    <Thumbnail square source={default_dish} />
                    </View>
                </View>
            </TouchableNativeFeedback>
        );
    }
}

const styles = StyleSheet.create({
    titleText: {
        color: variables.mainColor,
        fontSize: 20
    },
    mainHeader: {
        paddingHorizontal: 15,
        paddingVertical: 5
    },
    dishItemContainer: {
        flexDirection: 'row'
    },
    dishThumbnailContainer: {
        flex: 2
    }
});