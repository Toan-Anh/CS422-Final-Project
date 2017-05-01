import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Modal,
} from 'react-native';
import { Button, Icon, } from 'native-base';
import variables from '../../native-base-theme/variables/platform';

export default class FancyModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: true
        }

        this._setModalVisible = this._setModalVisible.bind(this);
    }

    componentDidMount() {
    }

    render() {
        return (
            <Modal
                animationType={'fade'}
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => {this._setModalVisible(false); this.props.onModalClose(false)}}
            >
                <View style={[styles.container, styles.modalBackgroundStyle]}>
                    <View style={styles.innerContainer}>
                        
                        <Button block style={{ backgroundColor: 'white', borderWidth: 1, borderColor: 'black', borderRadius: 5 }} onPress={()=>{this._setModalVisible(false); this.props.onModalClose(false)}}>
                            <Text style={{ color: 'black' }}> Close </Text>
                        </Button>
                    </View>
                </View>
            </Modal>
        )
    }

    _setModalVisible(visible) {
        this.setState({
            modalVisible: visible
        })
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
});