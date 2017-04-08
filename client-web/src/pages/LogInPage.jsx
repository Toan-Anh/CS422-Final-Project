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
import * as firebase from 'firebase';

export default class LogInPage extends Component {

	constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: '',
		}
	}

	componentWillMount() {
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				// User is signed in.
				var displayName = user.displayName;
				var email = user.email;
				var emailVerified = user.emailVerified;
				var photoURL = user.photoURL;
				var isAnonymous = user.isAnonymous;
				var uid = user.uid;
				var providerData = user.providerData;
				// ...
				console.log(user);
			} else {
				// User is signed out.
				// ...
				console.log("No user currently signed in");
			}
		});

	}

	_logIn() {
		console.log(this.state.email)
		firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
			.then((a) => {
				console.log(a);
			})
			.catch(function (error) {
				// Handle Errors here.
				var errorCode = error.code;
				var errorMessage = error.message;

				if (errorCode || errorMessage) {
					console.log('errorCode', errorCode);
					console.log('errorMessage', errorMessage);
				}
			});
	}

	render() {
		return (
			<div className="full-screen center log-in-background">
				<div className="log-in-box">
					<img src={require("../res/logo.svg")} style={{ height: 100, marginTop: 32 }} />

					<div className='decoration-container'>
						<div className='decoration' />
						<h1>LOG IN</h1>
						<div className='decoration' />
					</div>

					<form style={{ alignSelf: 'stretch' }}>
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
					</form>

					<a id='reset-password'>Forgot your password?</a>

					<Button bsStyle='primary' style={{ alignSelf: 'stretch' }} onClick={() => this._logIn()}>Log In</Button>

					<div style={{ flex: 1 }} />

					<p style={{ fontSize: 12, color: 'rgba(0, 0, 0, 0.5)', margin: 0 }}>Blah blah blah copyright or something</p>
				</div>
			</div>
		);
	}

}