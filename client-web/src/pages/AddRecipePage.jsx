import React, { Component } from 'react';
import * as firebase from 'firebase';
import {
	FormGroup,
	FormControl,
	Button,
} from 'react-bootstrap';
import "../stylesheets/font-awesome-4.7.0/css/font-awesome.min.css";

export default class AddRecipePage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			ingredientsAvailable: [],
			loading: true,
		}

		this._onIngredientsReceived = this._onIngredientsReceived.bind(this);
	}

	componentWillMount() {
		this.ingredientsRef = firebase.database().ref('/ingredients/');
		this.ingredientsRef.on('value', this._onIngredientsReceived);
	}

	componentWillUnmount() {
		this.ingredientsRef.off('value', this._onIngredientsReceived);
	}

	_onIngredientsReceived(snapshot) {
		let data = snapshot.val();
		let ingredients = [];
		Object.keys(data).forEach((ingredientName, index) => {
			ingredients.push({
				name: ingredientName,
				amount: data[ingredientName],
			});
		})

		this.setState({ ingredientsAvailable: ingredients, loading: false });
	}

	_renderForm() {
		return (
			<form className="form-container">
				<FormGroup controlId="formEmail">
					<FormControl
						type="text"
						value={this.state.email}
						placeholder="Enter your email"
						onChange={(e) => { this.setState({ email: e.target.value }) }}
					/>
				</FormGroup>

				<FormGroup controlId="formPassword">
					<FormControl
						type="password"
						value={this.state.password}
						placeholder="Enter your password"
						onChange={(e) => { this.setState({ password: e.target.value }) }}
					/>
				</FormGroup>

				<Button>Save recipe</Button>
			</form>
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
			<div>
				{this.state.loading ? this._renderLoading() : this._renderForm()}
			</div>
		);
	}
}