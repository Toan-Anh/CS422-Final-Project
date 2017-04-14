import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import {
	Button,
	Modal,
	FormGroup,
	FormControl,
	ControlLabel,
} from 'react-bootstrap';
import { Route } from 'react-router';
import * as firebase from 'firebase';
import "../stylesheets/font-awesome-4.7.0/css/font-awesome.min.css";
import "../stylesheets/react-bootstrap-table/react-bootstrap-table.css";

export default class IngredientManagementPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			ingredients: [],
			ingredientAmounts: [],
			loading: true,
			showAddModal: false,
			errorMsg: '',
		}

		this._onIngredientsReceived = this._onIngredientsReceived.bind(this);
		this._onIngredientAmountReceived = this._onIngredientAmountReceived.bind(this);
		this._onRowClick = this._onRowClick.bind(this);
	}

	componentWillMount() {
		this.ingredientsRef = firebase.database().ref('/ingredients/');
		this.ingredientsRef.on('value', this._onIngredientsReceived);

		this.ingredientAmountRef = firebase.database().ref('/ingredient_amount/');
		this.ingredientAmountRef.on('value', this._onIngredientAmountReceived);
	}

	componentWillUnmount() {
		this.ingredientsRef.off('value', this._onIngredientsReceived);
		this.ingredientAmountRef.off('value', this._onIngredientAmountReceived);
	}

	_onIngredientsReceived(snapshot) {
		let data = snapshot.val();
		let ingredients = [];
		Object.keys(data).forEach((ingredientName, index) => {
			ingredients.push({
				id: index + 1,
				name: ingredientName,
				amount: data[ingredientName],
			});
		})

		this.setState({ ingredients: ingredients, loading: false });
	}

	_onIngredientAmountReceived(snapshot) {
		let data = snapshot.val();
		let amounts = [];
		Object.keys(data).forEach((id, index) => {
			amounts.push({
				id: id,
				value: data[id],
			});
		})

		this.setState({ ingredientAmounts: amounts, loading: false });
	}

	_onRowClick(row) {
		console.log(row);
		this.props.history.push(`/ingredient_management/${row.name}`);
	}

	_addIngredient() {
		let name = this.newIngrName.value;
		let amount = this.newIngrAmount.value;

		if (!name || name === '') {
			this.setState({ errorMsg: 'Ingredient name cannot be empty' })
		}
		else if (!amount || amount === '') {
			this.setState({ errorMsg: 'Amount cannot be empty' })
		}
		else {
			this.ingredientsRef = firebase.database().ref(`/ingredients/${name}`).set(amount);
			this.setState({ showAddModal: false, errorMsg: '' });
		}
	}

	_renderHelp() {
		return (null);
	}

	_renderAddModal() {
		return (
			<Modal show={this.state.showAddModal} onHide={() => this.setState({ showAddModal: false })}>
				<Modal.Header closeButton>
					<Modal.Title>Add new ingredient</Modal.Title>
				</Modal.Header>

				<Modal.Body>
					<p id='error-message'>{this.state.errorMsg}</p>
					<form>
						<FormGroup controlId="formName">
							<ControlLabel>Ingredient name</ControlLabel>
							<FormControl
								type="text"
								inputRef={ref => this.newIngrName = ref}
							/>
						</FormGroup>

						<FormGroup controlId="formAmount">
							<ControlLabel>Amount</ControlLabel>
							<FormControl
								componentClass="select"
								inputRef={ref => this.newIngrAmount = ref}
							>
								{this.state.ingredientAmounts.map((amount, index) => {
									return (
										<option key={`amount_${amount.id}`} value={amount.value}>{amount.value}</option>
									);
								})}
							</FormControl>
						</FormGroup>
					</form>
				</Modal.Body>

				<Modal.Footer>
					<Button onClick={() => this.setState({ showAddModal: false })}>Cancel</Button>
					<Button bsStyle='primary' onClick={() => this._addIngredient()}>Save</Button>
				</Modal.Footer>
			</Modal>
		);
	}

	_renderTable() {
		const styles = {
			headerStyle: {
				// backgroundColor: 'white',
			},

			tableStyle: {
				margin: 0,
			},

			containerStyle: {
				// display: 'flex',
				// flexDirection: 'column',
				// alignItems: 'flex-start',
			}
		};

		const options = {
			// onRowClick: this._onRowClick,
			afterInsertRow: (row) => {
				alert(row);
			}
		};

		const selectRow = {
			mode: 'checkbox',  // multi select
			clickToSelectAndEditCell: true,
			className: '',
		};

		const cellEdit = {
			mode: 'click' // double click cell to edit
		};

		return (
			<div>
				<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
					<Button onClick={() => this.setState({ showAddModal: true })}>Add new ingredients</Button>
					<Button>Delete ingredients</Button>
				</div>

				<BootstrapTable ref={(ref) => this.table = ref}
					data={this.state.ingredients}
					hover
					options={options}
					selectRow={selectRow}
					cellEdit={cellEdit}
					{...styles}>
					<TableHeaderColumn isKey dataField="name" dataAlign="center" dataSort>Ingredient</TableHeaderColumn>
					<TableHeaderColumn dataField="amount" dataAlign="center" dataSort>Amount</TableHeaderColumn>
				</BootstrapTable>
			</div>
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

	render() {
		return (
			<div className='form-container'>

				<h1 id='title'>Ingredients</h1>

				{this.state.loading ? this._renderLoading() : this._renderTable()}

				{/*{this.state.ingredients.map((item, index) => {
					return (
						<Route path='/ingredient_management/:ingredient_name' component={({ match }) => <p>{match.params.ingredient_name}</p>} />
					);
				})}*/}

				{this._renderAddModal()}

			</div>
		);
	}
}