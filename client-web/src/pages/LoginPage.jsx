import React, { Component } from 'react';
import '../stylesheets/index.css';
import '../stylesheets/pages/LogInPage.css';
import {
	Button,
	FormGroup,
	FormControl,
	ControlLabel,
	HelpBlock,
} from 'react-bootstrap';
// import firebase from 'firebase';

export default class LogInPage extends Component {

	constructor(props) {
		super(props);
		this.state = {
			username: null,
			password: null
		}
	}

	_logIn() {
		// firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
		// 	// Handle Errors here.
		// 	var errorCode = error.code;
		// 	var errorMessage = error.message;
		// 	// ...
		// });
	}

	render() {
		return (
			<div className="full-screen center log-in-background">
				<div className="log-in-box">
					<img src={require("../res/logo.svg")} style={{ height: 100, marginTop: 32 }} />

					<h1>LOG IN</h1>

					<form style={{ alignSelf: 'stretch' }}>
						<FormGroup controlId="formUsername">
							<FormControl
								type="text"
								value={this.state.username}
								placeholder="Enter your username"
								onChange={() => { }}
							/>
						</FormGroup>

						<FormGroup controlId="formPassword">
							<FormControl
								type="text"
								value={this.state.password}
								placeholder="Enter your password"
								onChange={() => { }}
							/>
						</FormGroup>
					</form>

					<a id='reset-password'>Forgot your password?</a>

					<Button bsStyle='primary' style={{ alignSelf: 'stretch' }}>Log In</Button>

					<div style={{ flex: 1 }} />

					<p style={{ fontSize: 12, color: 'rgba(0, 0, 0, 0.5)', margin: 0 }}>Blah blah blah copyright or something</p>
				</div>
			</div>
		);
	}

}