import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import {
	Row,
	Col,
} from 'react-bootstrap';
import * as firebase from 'firebase';
import moment from 'moment';
import 'moment/locale/vi';
import '../stylesheets/pages/OrderPage.css'
moment.locale('vi');

export default class OrderPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			orders: [],
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
		this.setState({ orders: orders });
	}

	_onOrderReady(e, row) {
		firebase.database().ref(`/orders/${row.table}/${row.tableOrderIndex}/state`).set(`ready`)
	}

	_renderTime(cell, row) {
		return moment(moment.unix(cell)).fromNow();
	}

	_renderDishes(cell, row) {
		console.log(cell);
		return (
			<div>
				<Row className='dish-header-row'>
					<Col xs={8} className="dish-left-column">Dish</Col>
					<Col xs={4}>Quantity</Col>
				</Row>

				{
					Object.keys(cell).map((dish, index) => {
						return (
							<Row key={dish} className='dish-entry-row'>
								<Col xs={8} className="dish-left-column">{dish}</Col>
								<Col xs={4}>{cell[dish].quantity}</Col>
							</Row>
						);
					})
				}
			</div>
		);
	}

	_renderState(cell, row) {
		return (
			<i className={`clickable fa ${cell !== `processing` ? "fa-check-square" : "fa-square-o"}`}
				onClick={e => this._onOrderReady(e, row)} />
		);
	}

	_renderTable() {
		return (
			<div>

				<BootstrapTable ref={(ref) => this.table = ref}
					data={this.state.orders}>

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
						dataAlign="center"
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
		return (
			<div className='form-container'>

				<h1 id='title'>Orders</h1>
				{this._renderTable()}

			</div>
		);
	}
}