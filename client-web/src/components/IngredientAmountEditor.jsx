import React, { Component } from 'react';
import {
	FormGroup,
	FormControl,
	Button,
	Row,
	Col,
} from 'react-bootstrap';

export default class IngredientAmountEditor extends Component {

	constructor(props) {
		super(props);
		this.state = {
			amount: props.defaultValue,
		};

		this.updateData = this.updateData.bind(this);
	}

	focus() {
		this.amountSelect.focus();
	}

	updateData() {
		this.props.onUpdate(this.state.amount);
	}

	render() {
		return (
			<Row>
				<Col xs={12} sm={8}>
					<FormGroup controlId="formAmountEditor" style={{ margin: 'auto' }}>
						<FormControl
							inputRef={ref => this.amountSelect = ref}
							componentClass="select"
							onKeyDown={this.props.onKeyDown}
							onChange={(e) => { this.setState({ amount: e.target.value }); }}
							defaultValue={this.props.defaultValue}
						>
							{this.props.ingredientAmounts.map((amount, index) => {
								return (
									<option key={`amount_${amount.id}`} value={amount.value}>{amount.value}</option>
								);
							})}
						</FormControl>
					</FormGroup>
				</Col>

				<Col xs={12} sm={4}>
					<Button bsStyle='primary' style={{ margin: 'auto' }} onClick={this.updateData}>Update</Button>
				</Col>
			</Row>
		);
	}
}