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
import CustomizedActivityIndicator from '../modules/CustomizedActivityIndicator';

export default class AnnouncementModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: true,
            title: '',
            content: ''
        }

        this._setModalVisible = this._setModalVisible.bind(this);
        this._renderContent = this._renderContent.bind(this);
    }

    componentDidMount() {
        this.setState({
            modalVisible: this.props.visible,
        });
    }

    componentWillUnmount() {
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ modalVisible: nextProps.visible, title: nextProps.title, content: nextProps.content });
    }

    render() {
        var content = (
            <View style={styles.innerContainer}>
                {this._renderContent()}
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1 }} />
                    <Button transparent onPress={() => { this.props.onModalClose() }}>
                        <Text style={{ color: variables.mainColor, fontWeight: 'bold' }}> Close </Text>
                    </Button>
                </View>
            </View>
        )
        return (
            <Modal
                animationType={'fade'}
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => { this.props.onModalClose() }}
            >
                <View style={[styles.container, styles.modalBackgroundStyle]}>
                    {content}
                </View>
            </Modal>
        )
    }

    _setModalVisible(visible) {
        this.setState({
            modalVisible: visible
        })
    }

    _renderContent() {
        return (
            <View style={styles.contentContainer}>
                {this._renderTitle(this.state.title)}
                <View>
                    <Text style={styles.normalText}>
                        {this.state.content}
                    </Text>
                </View>
                <View style={{ padding: 5 }} />
            </View>
        )
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
    titleText: {
        color: variables.mainColor,
        fontSize: 20,
        paddingBottom: 15,
        fontWeight: 'bold'
    },
    normalText: {
        color: 'black',
        fontSize: 16,
    },

    contentContainer: {
        width: '100%',
        paddingHorizontal: 10
    },
});