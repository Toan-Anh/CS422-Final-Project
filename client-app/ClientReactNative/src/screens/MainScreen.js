import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    ScrollView
} from 'react-native';

import * as firebase from 'firebase';
import { Container, Content, Tab, Tabs, Header, Body, Title, StyleProvider, getTheme, Right, Button, Icon } from 'native-base';
import { Actions } from 'react-native-router-flux';
import ListOrder from './MainScreenFragments/ListOrder';
import variables from '../../native-base-theme/variables/platform';
import ModalDropdown from 'react-native-modal-dropdown';
import CustomizedActivityIndicator from '../modules/CustomizedActivityIndicator';
import CustomizedFAB from '../modules/CustomizedFAB';

class MainScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: null,
            isLoading: false,
        }
        this._onSelectModalDropdown = this._onSelectModalDropdown.bind(this);
        this._renderModalMenuRow = this._renderModalMenuRow.bind(this);
        this._signOut = this._signOut.bind(this);
        this._onFabClick = this._onFabClick.bind(this);
    }

    componentWillMount() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({ currentUser: user });

            } else {
                Actions.login();
            }
        });
    }

    _onFabClick() {
        Actions.createorder();
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
                <Tabs>
                    <Tab heading="List Order">
                        <ScrollView>
                            <ListOrder />
                        </ScrollView>
                        <CustomizedFAB onFabClick={this._onFabClick} />
                    </Tab>
                    <Tab heading="Notification">
                        <View />
                    </Tab>
                </Tabs>

            )
        return (
            <StyleProvider style={getTheme(variables)}>
                <Container>
                    <Header hasTabs>
                        <Body>
                            <Title>Main Menu</Title>
                        </Body>
                        <Right>
                            <ModalDropdown
                                options={['Sign Out']}
                                ref={el => this.menu_dropdown = el}
                                onSelect={this._onSelectModalDropdown}
                                dropdownStyle={styles.dropdownContainer}
                                renderRow={this._renderModalMenuRow}
                            >
                                <Button transparent onPress={() => { this.menu_dropdown.show() }}>
                                    <Icon name={'more'} fontSize={20} />
                                </Button>
                            </ModalDropdown>
                        </Right>
                    </Header>
                    {content}
                </Container>
            </StyleProvider>
        );
    }

    _onSelectModalDropdown(idx, value) {
        if (value == 'Sign Out')
            this._signOut();
    }

    _signOut() {
        this.setState({
            isLoading: true
        })
        firebase.auth().signOut().then(function () {
            Actions.login();
        }, function (error) {
            console.error('Sign Out Error', error);
        });

    }

    _renderModalMenuRow(rowData, rowId) {
        return (
            <TouchableHighlight>
                <View style={styles.menuRowContainer}>
                    <Text style={styles.menuRowText}>
                        {rowData}
                    </Text>
                </View>
            </TouchableHighlight>
        )
    }

}

const styles = StyleSheet.create({
    dropdownContainer: {
        flex: 1,
        height: 50,
        minWidth: 100
    },
    menuRowContainer: {
        padding: 10
    },
    menuRowText: {
        color: 'black',
        fontSize: 15
    }
});

module.exports = MainScreen;