import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableHighlight
} from 'react-native';

import * as firebase from 'firebase';
import { Container, Content, Tab, Tabs, Header, Body, Title, StyleProvider, getTheme, Right, Button, Icon } from 'native-base';
import { Actions } from 'react-native-router-flux';
import ListOrder from './MainScreenFragments/ListOrder';
import variables from '../../native-base-theme/variables/platform';
import ModalDropdown from 'react-native-modal-dropdown';

class MainScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: null
        }
        this._onSelectModalDropdown = this._onSelectModalDropdown.bind(this);
        this._renderModalMenuRow = this._renderModalMenuRow.bind(this);
        this._signOut =this._signOut.bind(this);
    }

    componentWillMount() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({ currentUser: user });

            } else {
                Actions.pop();
            }
        });
    }

    render() {
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
                                <Button transparent onPress={()=> {this.menu_dropdown.show()}}>
                                    <Icon name={'md-menu'} />
                                </Button>
                            </ModalDropdown>
                        </Right>
                    </Header>
                    <Tabs>
                        <Tab heading="List Order">
                            <ListOrder />
                        </Tab>
                        <Tab heading="Notification">
                            <View />
                        </Tab>
                    </Tabs>
                </Container>
            </StyleProvider>
        );
    }

    _onSelectModalDropdown(idx, value) {
        if (value == 'Sign Out')
            this._signOut();
    }

    _signOut() {
		firebase.auth().signOut();
        Actions.pop();
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