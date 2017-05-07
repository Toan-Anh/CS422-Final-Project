import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableNativeFeedback
} from 'react-native';
import { Fab, Button, Icon, } from 'native-base';
import CustomizedFAB from '../../modules/CustomizedFAB';
import GiftedListView from 'react-native-gifted-listview';
import moment from 'moment';
import { Actions } from 'react-native-router-flux';
require('moment/locale/vi');
import * as firebase from 'firebase';
import CustomizedActivityIndicator from '../../modules/CustomizedActivityIndicator';
import DeliverDishModal from '../../modules/DeliverDishModal';
import AnnouncementModal from '../../modules/AnnouncementModal';

class ListOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            isLoading: true,
            showDeliverDishModal: false,
            pickedIndex: null,
            showAnnouncementModal: false,
            announcementTitle: 'Delivery',
            announcementContent: '',
        }
        moment.locale('vi');
        this._onFetch = this._onFetch.bind(this);
        this._renderRowView = this._renderRowView.bind(this);
        this._renderPaginationWaitingView = this._renderPaginationWaitingView.bind(this);
        this._onDeliverDishModalClose = this._onDeliverDishModalClose.bind(this);
        this._onRowClick = this._onRowClick.bind(this);
        this._onAcceptDeliver = this._onAcceptDeliver.bind(this);
        this._onAnnouncementModalClose = this._onAnnouncementModalClose.bind(this);
        this.DELIVER_ACCEPTED = 'Deliver accepted!';
        this.DELIVER_NOT_ACCEPTED = 'Dishes delivery was accepted by another employee!';
    }

    componentDidMount() {
        var that = this;
        var ordersRef = firebase.database().ref('orders');
        ordersRef.on('value', function (snapshot) {
            var processedData = that._preprocessListOrders(snapshot.val());
            that.setState({
                data: processedData,
                isLoading: false
            });
        });
    }

    componentWillUnmount() {
        var ordersRef = firebase.database().ref('orders');
        ordersRef.off();
    }

    componentDidUpdate() {
        this.refs.giftedListView._refresh();
    }

    _preprocessListOrders(myObject) {
        var result = [];
        for (x in myObject) {
            for (let i = 0; i < myObject[x].length; i++) {
                var item = myObject[x][i];
                var temp = {
                    table: x,
                    time: (moment.unix(item.time)).fromNow(),
                    state: item.state,
                    tableIndex: i
                };
                if ('assigned' in item) {
                    temp['assigned'] = item['assigned'];
                }
                result.push(temp);
            }
        }
        return result;
    }

    _onFetch(page = 1, callback, options) {
        var rows = this.state.data;
        callback(rows, {
            allLoaded: true, // the end of the list is reached
        });
    }

    _renderRowView(rowData, idx, a) {
        var icon = 'md-checkmark-circle-outline';
        if (rowData.state === 'ready') {
            icon = 'md-checkmark-circle';
        }
        else if (rowData.state === 'served') {
            icon = 'md-done-all';
        }
        return (
            <TouchableNativeFeedback onPress={() => { this._onRowClick(a) }}>
                <View style={styles.rowItemContainer}>
                    <View style={styles.leftRowItemContainer}>
                        <Text style={styles.tableText}>
                            {rowData.table}
                        </Text>
                        <Text style={styles.orderTimeText}>
                            {rowData.time}
                        </Text>
                    </View>
                    <View style={styles.rightRowItemContainer}>
                        <Icon name={icon} style={styles.iconText} />
                    </View>
                </View>
            </TouchableNativeFeedback>
        );
    }

    _onAcceptDeliver(idx) {
        var that = this;
        firebase.database().ref(`orders/${this.state.data[idx].table}/${this.state.data[idx].tableIndex}`).once('value').then(function (snapshot) {
            if (!('assigned' in snapshot.val())) {
                var user = firebase.auth().currentUser;
                if (user != null) {
                    var updatedSnap = snapshot.val();

                    console.log('\n\n\n\n\n\n\nuser:' + user.email);
                    updatedSnap['assigned'] = user.email;
                    updatedSnap['state'] = 'served';
                    firebase.database().ref(`orders/${that.state.data[idx].table}/${that.state.data[idx].tableIndex}`).set(updatedSnap).then((a) => {
                        that.setState({
                            showDeliverDishModal: false,
                            showAnnouncementModal: true,
                            announcementContent: that.DELIVER_ACCEPTED
                        })
                    }, (error) => { alert(error.message) });
                }
                else {
                    alert('Cannot identify this user!');
                }
            }
            else {
                that.setState({
                    showDeliverDishModal: false,
                    showAnnouncementModal: true,
                    announcementContent: that.DELIVER_NOT_ACCEPTED
                });
            }
        }, (error) => { alert(error.message) });
    }

    _onRowClick(idx) {
        var tempTable = this.state.data[idx].table;
        var flag = true;
        for (let i = 0; i < this.state.data.length; i++) {
            if (this.state.data[i].table == tempTable && !('assigned' in this.state.data[i])) {
                flag = false;
                break;
            }
        }
        if (flag == true) {
            Actions.orderdetail({ table: this.state.data[idx].table });
        }
        else if (this.state.data[idx]['state'] == 'ready') {
            this.setState({
                pickedIndex: idx,
                showDeliverDishModal: true
            })
        }

    }

    _renderPaginationWaitingView(paginateCallback) {
        return (
            <TouchableNativeFeedback
                onPress={paginateCallback}
            >
                <View style={styles.paginationView}>
                    <Text style={styles.loadMoreText}>
                        Load more
                    </Text>
                </View>
            </TouchableNativeFeedback>
        );
    }

    _renderEmptyView(refreshCallback) {
        return (
            <View style={{
                flex: 1,
                alignSelf: 'stretch',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <CustomizedActivityIndicator />
            </View>
        )
    }

    render() {
        var activityIndicator = this.state.isLoading
            ?
            (
                <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}>
                    <CustomizedActivityIndicator />
                </View>
            )
            :
            (<View />);
        return (
            <View style={{ flex: 1, alignSelf: 'stretch' }}>
                {activityIndicator}
                <GiftedListView
                    ref={'giftedListView'}
                    rowView={this._renderRowView}
                    onFetch={this._onFetch}
                    firstLoader={true} // display a loader for the first fetching
                    pagination={true} // enable infinite scrolling using touch to load more
                    refreshable={true} // enable pull-to-refresh for iOS and touch-to-refresh for Android
                    withSections={false} // enable sections
                    customStyles={{
                        paginationView: {
                            backgroundColor: '#eee',
                        },
                    }}
                    emptyView={this._renderEmptyView}
                    paginationWaitingView={this._renderPaginationWaitingView}
                    refreshableTintColor="blue"
                    style={{ flex: 1, alignSelf: 'stretch' }}
                    enableEmptySections
                />
                <DeliverDishModal visible={this.state.showDeliverDishModal} onModalClose={this._onDeliverDishModalClose} pickedIndex={this.state.pickedIndex} acceptDeliver={this._onAcceptDeliver} />
                <AnnouncementModal visible={this.state.showAnnouncementModal} onModalClose={this._onAnnouncementModalClose} title={this.state.announcementTitle} content={this.state.announcementContent}/>
            </View>
        )
    }

    _onDeliverDishModalClose() {
        this.setState({
            showDeliverDishModal: false
        })
    }

    _onAnnouncementModalClose() {
        this.setState({
            showAnnouncementModal: false
        })
    }

}

var styles = {
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    navBar: {
        height: 64,
        backgroundColor: '#CCC'
    },
    rowItemContainer: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ededed'
    },
    leftRowItemContainer: {
        flex: 9,
    },
    rightRowItemContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    tableText: {
        color: 'black',
        fontSize: 18
    },
    orderTimeText: {
        fontSize: 14
    },
    iconText: {
        color: 'green'
    },
    paginationView: {
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF',
    },
    loadMoreText: {
        fontSize: 13,
        color: '#007aff',
    },
};

module.exports = ListOrder;