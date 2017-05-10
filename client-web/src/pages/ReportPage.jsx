import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import {
	Button,
	Row,
	Col,
	Form,
	FormGroup,
	FormControl,
	ControlLabel,
	Tabs,
	Tab,
	// ControlLabel,
} from 'react-bootstrap';
import { HorizontalBar } from 'react-chartjs-2';
import DatePicker from 'react-bootstrap-date-picker';
import * as firebase from 'firebase';

export default class ReportPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			records: null,
			currentDate: new Date(),
			currentTab: 1,
			newExpensePurpose: '',
			newExpenseValue: 0,
		};

		this._onRecordsReceived = this._onRecordsReceived.bind(this);
		this._onAddExpense = this._onAddExpense.bind(this);
	}

	_onRecordsReceived(snapshot) {
		this.setState({ records: snapshot.val(), loading: false });
	}

	componentWillMount() {
		this.recordRef = firebase.database().ref(`/records/`);
		this.recordRef.on('value', this._onRecordsReceived);
	}

	componentWillUnmount() {
		this.recordRef.off('value', this._onRecordsReceived);
	}

	_renderLoading() {
		return (
			<div className='loading-box'>
				<i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
				<p id='loading'>Loading...</p>
			</div>
		);
	}

	_renderContent() {
		return (
			<div>
				<Tabs activeKey={this.state.key} onSelect={(key) => { this.setState({ currentTab: key }) }} id="tab">
					<Tab eventKey={1} title="Daily Report">
						{this._renderDailyReport()}
					</Tab>
					<Tab eventKey={2} title="Monthly Report">
						{this._renderMonthlyReport()}
					</Tab>
					<Tab eventKey={3} title="Annual Report">
						{this._renderYearlyReport()}
					</Tab>
				</Tabs>
			</div>
		);
	}

	_renderDailyReport(date) {
		if (!date || !date.day || !date.month || !date.year) {
			let currentDate = this.state.currentDate;
			date = {
				day: currentDate.getDate(),
				month: currentDate.getMonth() + 1,
				year: currentDate.getFullYear(),
			};
		}

		try {
			let records = this.state.records[date.year][date.month][date.day];
			let { orderData, income } = this._processDailyIncomeData(date, records.orders);
			let { expenseData, expense } = this._processDailyExpenseData(date, records.expenses);
			let balance = income - expense

			return (
				<div>
					<FormGroup controlId="formDate">
						<DatePicker id="datepicker"
							value={this.state.currentDate.toISOString()}
							onChange={(v, f) => { this.setState({ currentDate: new Date(v) }) }} />
					</FormGroup>
					{this._renderBalance(date, balance)}
					{this._renderIncomes(date, orderData, income)}
					{this._renderExpenses(date, expenseData, expense)}
				</div>
			);
		} catch (err) {
			// console.log(err);
			return (
				<div>
					<p>There is no data for this date!</p>
					<p>Please choose another date.</p>
					<FormGroup controlId="formDate">
						<DatePicker id="datepicker"
							value={this.state.currentDate.toISOString()}
							onChange={(v, f) => { this.setState({ currentDate: new Date(v) }) }} />
					</FormGroup>
				</div>
			);
		}
	}

	_renderMonthlyReport(date) {
		if (!date || !date.month || !date.year) {
			let currentDate = this.state.currentDate;
			date = {
				day: currentDate.getDate(),
				month: currentDate.getMonth() + 1,
				year: currentDate.getFullYear(),
			};
		}

		try {
			let records = this.state.records[date.year][date.month];
			let { mOrderData, mIncome, mExpenseData, mExpense } = this._processMonthlyData(date, records);
			let mBalance = mIncome - mExpense;

			return (
				<div>
					{this._renderMonthInput(date)}
					<h2>Balance: {mBalance.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</h2>
					{this._renderMonthChart(date, { income: mOrderData, expense: mExpenseData })}
				</div>
			);
		} catch (err) {
			// console.log(err);
			return (
				<div>
					<p>There is no data for this year and/or month!</p>
					<p>Please choose another year and/or month.</p>
					{this._renderMonthInput(date)}
				</div>
			);
		}
	}

	_renderMonthInput(date) {
		return (
			<Form inline>
				<FormGroup controlId="formMonth">
					<ControlLabel>Month</ControlLabel>
					<FormControl
						type="number"
						value={this.state.currentDate.getMonth() + 1}
						placeholder="Month"
						onChange={(e) => {
							let month = e.target.value ? parseInt(e.target.value, 10) : date.month;
							month = Math.min(Math.max(month - 1, 0), 11);
							this.setState({
								currentDate: new Date(date.year, month, 1),
							});
						}}
					/>
				</FormGroup>

				<FormGroup controlId="formMonthYear">
					<ControlLabel>Year</ControlLabel>
					<FormControl
						type="number"
						value={this.state.currentDate.getFullYear()}
						placeholder="Year"
						onChange={(e) => {
							let year = e.target.value ? parseInt(e.target.value, 10) : date.year;
							this.setState({
								currentDate: new Date(year, date.month, 1),
							});
						}}
					/>
				</FormGroup>
			</Form>
		);
	}

	_renderYearlyReport(date) {
		if (!date || !date.day || !date.month || !date.year) {
			let currentDate = this.state.currentDate;
			date = {
				day: currentDate.getDate(),
				month: currentDate.getMonth() + 1,
				year: currentDate.getFullYear(),
			};
		}

		try {
			let records = this.state.records[date.year];
			let { yOrderData, yIncome, yExpenseData, yExpense } = this._processYearlyData(date, records);
			let yBalance = yIncome - yExpense;

			return (
				<div>
					<FormGroup controlId="formYear">
						<ControlLabel>Year</ControlLabel>
						<FormControl
							type="number"
							value={this.state.currentDate.getFullYear()}
							placeholder="Year"
							onChange={(e) => {
								let year = e.target.value ? parseInt(e.target.value, 10) : date.year;
								this.setState({
									currentDate: new Date(year, date.month, 1),
								});
							}}
						/>
					</FormGroup>
					<h2>Balance: {yBalance.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</h2>
					{this._renderAnnualChart(date, { income: yOrderData, expense: yExpenseData })}
				</div>
			);
		} catch (err) {
			console.log(err);
			return (
				<div>
					<p>There is no data for this year!</p>
					<p>Please choose another year.</p>
					<FormGroup controlId="formYear">
						<ControlLabel>Year</ControlLabel>
						<FormControl
							type="number"
							value={this.state.currentDate.getFullYear()}
							placeholder="Year"
							onChange={(e) => {
								let year = e.target.value ? parseInt(e.target.value, 10) : date.year;
								this.setState({
									currentDate: new Date(year, date.month, 1),
								});
							}}
						/>
					</FormGroup>
				</div>
			);
		}
	}

	_renderMonthChart(date, data) {
		let chartData = {
			labels: Array(31).fill().map((e, i) => i + 1).reverse(),
			datasets: [{
				label: 'Income',
				data: data.income.reverse(),
				backgroundColor: 'rgba(75, 192, 192, 0.2)',
				borderColor: 'rgba(75, 192, 192, 1)',
				borderWidth: 1
			},
			{
				label: 'Expense',
				data: data.expense.reverse(),
				backgroundColor: 'rgba(255, 99, 132, 0.2)',
				borderColor: 'rgba(255,99,132,1)',
				borderWidth: 1
			}]
		}

		const options = {
			scales: {
				yAxes: [{
					scaleLabel: {
						display: true,
						labelString: 'Day',
					}
				}]
			}
		}

		return (
			<HorizontalBar data={chartData}
				options={options}
				height={620} />
		);
	}

	_renderAnnualChart(date, data) {
		let chartData = {
			labels: Array(12).fill().map((e, i) => i + 1).reverse(),
			datasets: [{
				label: 'Income',
				data: data.income.reverse(),
				backgroundColor: 'rgba(75, 192, 192, 0.2)',
				borderColor: 'rgba(75, 192, 192, 1)',
				borderWidth: 1
			},
			{
				label: 'Expense',
				data: data.expense.reverse(),
				backgroundColor: 'rgba(255, 99, 132, 0.2)',
				borderColor: 'rgba(255,99,132,1)',
				borderWidth: 1
			}]
		}

		const options = {
			scales: {
				yAxes: [{
					scaleLabel: {
						display: true,
						labelString: 'Month',
					}
				}]
			}
		}

		return (
			<HorizontalBar data={chartData}
				options={options}
				height={240} />
		);
	}

	_renderBalance(date, balance) {
		return (
			<h2>Balance: {balance.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</h2>
		);
	}

	_processDailyIncomeData(date, data) {
		let total = 0;
		let tableData = [];
		// let d = `0${date.day}/0${date.month}/${date.year}`;

		if (data)
			Object.keys(data).forEach((orderID, index) => {
				let orderTotal = 0;
				let dishes = [];
				data[orderID].dishes.forEach((dish) => {
					orderTotal += (dish.price * dish.quantity);
					dishes.push({
						dish: dish.dish,
						quantity: dish.quantity,
					});
				});

				tableData.push({
					orderID,
					dishes,
					orderTotal,
					// date: d,
				})
				total += orderTotal;
			});

		return { orderData: tableData, income: total };
	}

	_processDailyExpenseData(date, data) {
		let total = 0;
		let tableData = [];
		// let d = `0${date.day}/0${date.month}/${date.year}`;

		if (data)
			Object.keys(data).forEach((key, index) => {
				total += data[key].value;
				// tableData.push({ index, date: d, ...data[key] });
				tableData.push({
					index: index + 1, ...data[key]
				});
			});

		return { expenseData: tableData, expense: total };
	}

	_processMonthlyData(date, data) {
		let mOrderData = [], mExpenseData = [];
		let mIncome = 0, mExpense = 0;
		let d = {
			year: date.year,
			month: date.month,
		}

		if (data)
			for (let day = 1; day < 32; ++day) {
				if (!data[day]) {
					mOrderData.push(0);
					mExpenseData.push(0);
					continue;
				}

				d.day = day;
				let { income } = this._processDailyIncomeData(d, data[day].orders);
				let { expense } = this._processDailyExpenseData(d, data[day].expenses);
				mOrderData.push(income)
				mExpenseData.push(-expense);
				mIncome += income;
				mExpense += expense;
			}

		return { mOrderData, mIncome, mExpenseData, mExpense };
	}

	_processYearlyData(date, data) {
		let yOrderData = [], yExpenseData = [];
		let yIncome = 0, yExpense = 0;
		let d = {
			year: date.year,
		}

		if (data)
			for (let month = 1; month < 13; ++month) {
				if (!data[month]) {
					yOrderData.push(0);
					yExpenseData.push(0);
					continue;
				}

				let { mIncome, mExpense } = this._processMonthlyData(d, data[month]);
				yOrderData.push(mIncome)
				yExpenseData.push(-mExpense);
				yIncome += mIncome;
				yExpense += mExpense;
			}

		return { yOrderData, yIncome, yExpenseData, yExpense };
	}

	_renderIncomes(date, data, income) {
		const styles = {
			headerStyle: {
				backgroundColor: 'white',
			},
			tableStyle: {
				margin: 0,
			},
		};

		return (
			<div>
				<h2 style={{ display: 'flex' }}>
					Incomes: {income.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
				</h2>


				<BootstrapTable ref={(ref) => this.incomeTable = ref}
					data={data}
					{...styles}>

					<TableHeaderColumn isKey
						dataField="orderID"
						dataAlign="left"
						dataSort>
						Order ID
					</TableHeaderColumn>

					<TableHeaderColumn
						dataField="dishes"
						dataAlign="left"
						dataSort
						dataFormat={this._renderDishes}>
						Dishes
					</TableHeaderColumn>

					<TableHeaderColumn
						dataField="orderTotal"
						dataAlign="right"
						dataSort
						dataFormat={this._renderMoney}>
						Total
					</TableHeaderColumn>
				</BootstrapTable>
			</div>
		)
	}

	_renderDishes(cell, row, extra, index) {
		return (
			<div>
				{cell.map((dish) => {
					return <div key={`${index}_${dish.dish}`}>{`- ${dish.quantity} ${dish.dish}`}</div>;
				})}
			</div>
		);
	}

	_renderMoney(cell, row) {
		return cell.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
	}

	_renderExpenses(date, data, expense) {
		const styles = {
			headerStyle: {
				backgroundColor: 'white',
			},
			tableStyle: {
				margin: 0,
			},
		};

		return (
			<div>
				<h2 style={{ display: 'flex' }}>
					Expenses: {expense.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
				</h2>

				{date.day ? this._renderExpenseInput() : null}

				<BootstrapTable ref={(ref) => this.expenseTable = ref}
					data={data}
					{...styles}>

					<TableHeaderColumn isKey
						dataField="index"
						dataAlign="left"
						dataSort>
						#
					</TableHeaderColumn>

					<TableHeaderColumn
						dataField="purpose"
						dataAlign="left"
						dataSort>
						Purpose
					</TableHeaderColumn>

					<TableHeaderColumn
						dataField="value"
						dataAlign="right"
						dataSort
						dataFormat={this._renderMoney}>
						Value
					</TableHeaderColumn>
				</BootstrapTable>
			</div>
		)
	}

	_renderExpenseInput(date) {
		return (
			<div>
				<p>Added expense cannot be editted or removed! Please check twice before adding any expense.</p>
				
				<Row>
					<Col xs={8} sm={6}>
						<FormGroup controlId="formPurpose">
							<FormControl
								type="text"
								placeholder="Expense purpose"
								value={this.state.newExpensePurpose}
								onChange={(e) => this.setState({ newExpensePurpose: e.target.value })}
							/>
						</FormGroup>
					</Col>

					<Col xs={4} sm={4}>
						<FormGroup controlId="formValue">
							<FormControl
								type="number"
								placeholder="Expense value"
								value={this.state.newExpenseValue}
								onChange={(e) => this.setState({ newExpenseValue: e.target.value !== '' ? parseInt(e.target.value, 10) : 0 })}
							/>
						</FormGroup>
					</Col>

					<Col xs={12} sm={2} style={{ display: 'flex', justifyContent: 'flex-end' }}>
						<Button bsStyle='primary' onClick={this._onAddExpense}>Enter expense</Button>
					</Col>
				</Row>
			</div>
		);
	}

	_onAddExpense() {
		if (this.state.newExpensePurpose === '' || this.state.newExpenseValue === 0) {
			alert(`Please enter expense information before submitting.`);
			return;
		}

		let date = this.state.currentDate;
		firebase.database().ref(`/records/${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}/expenses`)
			.push({
				purpose: this.state.newExpensePurpose,
				value: this.state.newExpenseValue,
			});

		this.setState({
			newExpensePurpose: '',
			newExpenseValue: 0,
		});
	}

	render() {
		if (!this.props.user)
			return this._renderLoading();
		if (this.props.user && this.props.user.level <= this.props.level)
			return (
				<div className='form-container'>

					<h1 id='title'>Report</h1>
					{this.state.loading ? this._renderLoading() : this._renderContent()}

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