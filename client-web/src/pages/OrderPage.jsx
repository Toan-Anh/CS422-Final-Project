import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import {
} from 'react-bootstrap';
import * as firebase from 'firebase';
import moment from 'moment';
import 'moment/locale/vi';
import '../stylesheets/pages/OrderPage.css';
import "../stylesheets/react-bootstrap-table/react-bootstrap-table.css";
moment.locale('vi');

export default class OrderPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			orders: [],
			loading: true,
		};

		this._onOrderReceived = this._onOrderReceived.bind(this);
		this._renderTime = this._renderTime.bind(this);
		this._renderDishes = this._renderDishes.bind(this);
		this._renderState = this._renderState.bind(this);
	}

	componentWillMount() {
		this.orderRef = firebase.database().ref(`/orders/`);
		this.orderRef.on('value', this._onOrderReceived);
	}

	componentWillUnmount() {
		this.orderRef.off('value', this._onOrderReceived);
	}

	_onOrderReceived(snapshot) {
		let orders = [];
		let count = 0;
		snapshot.forEach((child) => {
			child.val().forEach((order, index) => {
				if (order.state === 'preparing')
					orders.push({
						tableOrderIndex: index,
						index: ++count,
						table: child.key,
						dishes: order.dishes,
						time: order.time,
						state: order.state,
					});
			});
		});
		this.setState({ orders: orders, loading: false });
	}

	_onOrderReady(e, row) {
		firebase.database().ref(`/orders/${row.table}/${row.tableOrderIndex}/state`).set(`ready`);
	}

	_renderTime(cell, row) {
		return moment.unix(cell).fromNow();
	}

	_renderDishes(cell, row, extra, index) {
		return (
			<div>
				{cell.map((dish) => {
					return <div key={`${index}_${dish.name}`}>{`- ${dish.quantity} ${dish.name}`}</div>;
				})}
			</div>
		);
	}

	_renderState(cell, row) {
		return (
			<i className={`clickable fa ${cell !== `preparing` ? "fa-check-square" : "fa-square-o"}`}
				onClick={e => this._onOrderReady(e, row)} />
		);
	}

	_renderLoading() {
		return (
			<div className='loading-box'>
				<i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
				<p id='loading'>Loading...</p>
			</div>
		);
	}

	_renderTable() {
		const styles = {
			headerStyle: {
				backgroundColor: 'white',
			},

			tableStyle: {
				margin: 0,
			},

			containerStyle: {
			}
		};

		return (
			<div>

				<BootstrapTable ref={(ref) => this.table = ref}
					data={this.state.orders}
					{...styles}>

					<TableHeaderColumn isKey
						dataField="index"
						dataAlign="center"
						dataSort
						width='48px'>
						#
					</TableHeaderColumn>

					<TableHeaderColumn
						dataField="table"
						dataAlign="center"
						dataSort
						width="20%">
						Name
					</TableHeaderColumn>

					<TableHeaderColumn
						dataField="time"
						dataAlign="center"
						dataSort
						dataFormat={this._renderTime}
						width='20%'>
						Time
					</TableHeaderColumn>

					<TableHeaderColumn
						dataField="dishes"
						dataAlign="left"
						dataSort
						dataFormat={this._renderDishes}
						width='50%'>
						Dishes
					</TableHeaderColumn>

					<TableHeaderColumn
						dataField="state"
						dataAlign="center"
						dataSort
						dataFormat={this._renderState}
						width='10%'>
						State
					</TableHeaderColumn>

				</BootstrapTable>
			</div>
		);
	}

	render() {
		if (!this.props.user)
			return this._renderLoading();
		if (this.props.user && this.props.user.level <= this.props.level)
			return (
				<div className='form-container'>

					<h1 id='title'>Orders</h1>
					{this.state.loading ? this._renderLoading() : this._renderTable()}

				</div>
			);
		else
			return (
				<div className="full-screen center">
					<p>You don't have permission to access this page</p>
				</div>
			);
	}
}