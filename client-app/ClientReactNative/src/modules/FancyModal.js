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
        console.log('\n\n\n\n\n\n\n\n\nvisible');
        console.log(this.props.visible);
        this.setState({modalVisible: this.props.visible})
    }

    componentWillReceiveProps(nextProps) {
        console.log('\n\n\n\n\n\n\n\n\nvisiblenextprops');
        console.log(nextProps.visible);
        this.setState({modalVisible: nextProps.visible});
    }

    render() {
        return (
            <Modal
                animationType={'fade'}
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => {this.props.onModalClose(false)}}
            >
                <View style={[styles.container, styles.modalBackgroundStyle]}>
                    <View style={styles.innerContainer}>
                        {this.props.content ? this.props.content : null}
                        <Button transparent style={{float: 'right' }} onPress={()=>{this.props.onModalClose(false)}}>
                            <Text style={{ color: variables.mainColor }}> Close </Text>
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