import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { Fab, Button, Icon,  } from 'native-base';


class ListDish extends Component {
    constructor(props) {
        super(props);
        this.state = {
            active: false
        }
    }

    render() {
        return (
            <View style={{flex: 1, alignSelf: 'stretch'}}>
                <Fab
                    active={this.state.active}
                    containerStyle={{ marginLeft: 10 }}
                    style={{ backgroundColor: '#5067FF' }}
                    onPress={() => this.setState({ active: !this.state.active })}>
                    <Icon name="md-share" />
                    <Button style={{ backgroundColor: '#34A34F' }}>
                        <Icon name="logo-whatsapp" />
                    </Button>
                    <Button style={{ backgroundColor: '#3B5998' }}>
                        <Icon name="logo-facebook" />
                    </Button>
                    <Button disabled style={{ backgroundColor: '#DD5144' }}>
                        <Icon name="ios-mail" />
                    </Button>
                </Fab>
            </View>
        )
    }
}

module.exports = ListDish;