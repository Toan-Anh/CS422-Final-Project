import React, { Component } from 'react';
import {
	Modal,
	Form,
	FormControl,
	FormGroup,
	ControlLabel,
	Button,
} from 'react-bootstrap';
import * as firebase from 'firebase';


export default class AddIngredientModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showAddModal: false,
			nameValidState: null,
			amountValidState: null,
			errorMsg: '',
		}

		this._addIngredient = this._addIngredient.bind(this);
		this.open = this.open.bind(this);
		this.close = this.close.bind(this);
	}

	_addIngredient() {
		let name = this.newIngrName.value;
		let amount = this.newIngrAmount.value;

		if (!name || name === '') {
			this.setState({ errorMsg: 'Ingredient name cannot be empty', nameValidState: 'error', amountValidState: null });
		}
		else if (!amount || amount === '') {
			this.setState({ errorMsg: 'Amount cannot be empty', amountValidState: 'error', nameValidState: null });
		}
		else {
			firebase.database().ref(`/ingredientsAmountLeft`).once('value', (snapshot) => {
				if (!snapshot.hasChild(name)) {
					this.ingredientsRef = firebase.database().ref(`/ingredientsAmountLeft/${name}`).set(amount);
					this.close();
				}
				else {
					this.setState({ errorMsg: 'Ingredient already exists', nameValidState: 'error', amountValidState: null });
				}
			})
		}
	}

	open() {
		this.setState({ showAddModal: true });
	}

	close() {
		this.setState({ showAddModal: false, errorMsg: '', nameValidState: null, amountValidState: null });
	}

	render() {
		return (
			<Modal show={this.state.showAddModal} onHide={this.close}>
				<Modal.Header closeButton>
					<Modal.Title>Add new ingredient</Modal.Title>
				</Modal.Header>

				<Modal.Body>
					<p id='error-message'>{this.state.errorMsg}</p>
					<Form>
						<FormGroup controlId="formName" validationState={this.state.nameValidState}>
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
								{this.props.ingredientAmounts.map((amount, index) => {
									return (
										<option key={`amount_${amount.id}`} value={index}>{amount.value}</option>
									);
								})}
							</FormControl>
						</FormGroup>
					</Form>
				</Modal.Body>

				<Modal.Footer>
					<Button onClick={this.close}>Cancel</Button>
					<Button bsStyle='primary' onClick={() => this._addIngredient()}>Save</Button>
				</Modal.Footer>
			</Modal>
		);
	}
}