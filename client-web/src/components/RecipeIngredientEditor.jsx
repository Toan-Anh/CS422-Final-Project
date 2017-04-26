import React, { Component } from 'react';
import {
	FormGroup,
	FormControl,
	ControlLabel,
	Row,
	Col,
} from 'react-bootstrap';
import "../stylesheets/font-awesome-4.7.0/css/font-awesome.min.css";

export default class RecipeIngredientEditor extends Component {

	constructor(props) {
		super(props);
		this.state = {
			name: this.props.name,
			amount: this.props.amount,
		};

		this._onNameChange = this._onNameChange.bind(this);
		this._onAmountChange = this._onAmountChange.bind(this);
	}

	hasData() {
		return this.state.description !== '';
	}

	getData() {

	}

	_onNameChange(e) {
		if (this.props.onChange({ name: e.target.value, amount: this.state.amount }))
			this.setState({ name: e.target.value });
	}

	_onAmountChange(e) {
		if (this.props.onChange({ name: this.state.name, amount: e.target.value }))
			this.setState({ amount: e.target.value });
	}

	render() {
		return (
			<div style={{ display: 'flex', alignItems: 'center' }}>
				<Row style={{ flex: 1 }}>
					<Col xs={6}>
						<FormGroup controlId={`formIngredientName`}>
							<ControlLabel>Name</ControlLabel>
							<FormControl
								componentClass="select"
								value={this.state.name}
								inputRef={ref => this.nameSelect = ref}
								onChange={this._onNameChange}>
								{this.props.ingredientsAvailable.map((ingr, index) => {
									return (
										<option key={`ingr_${ingr}`} value={ingr}>{ingr}</option>
									);
								})}
							</FormControl>
						</FormGroup>
					</Col>

					<Col xs={6}>
						<FormGroup controlId={`formIngredientAmount`}>
							<ControlLabel>Amount</ControlLabel>
							<FormControl
								type="text"
								value={this.state.amount}
								onChange={this._onAmountChange}
								inputRef={ref => this.amountText = ref} />
						</FormGroup>
					</Col>
				</Row>

				<i className='clickable fa fa-times'
					style={{ fontSize: 24, marginLeft: 12 }}
					onClick={this.props.onDelete} />
			</div>
		);
	}

}