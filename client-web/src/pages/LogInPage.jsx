import React, { Component } from 'react';
import '../stylesheets/index.css';
import "../stylesheets/font-awesome-4.7.0/css/font-awesome.min.css";
import '../stylesheets/pages/LogInPage.css';
import {
	Button,
	FormGroup,
	FormControl,
	// ControlLabel,
	// HelpBlock,
	Modal,
} from 'react-bootstrap';
import * as firebase from 'firebase';

export default class LogInPage extends Component {

	constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: '',
			loading: true,
			showModal: false,
		}
	}

	componentDidMount() {
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				// User is signed in.
				// var displayName = user.displayName;
				// var email = user.email;
				// var emailVerified = user.emailVerified;
				// var photoURL = user.photoURL;
				// var isAnonymous = user.isAnonymous;
				// var uid = user.uid;
				// var providerData = user.providerData;
				// ...
				this.props.history.replace('/');
			} else {
				// User is signed out.
				// ...
				// console.log("No user currently signed in");
				this.setState({ loading: false });
			}
		});

	}

	_logIn() {
		this.setState({ loading: true });
		firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
			.then((a) => {
				this.props.history.replace('/');
			})
			.catch((error) => {
				// Handle Errors here.
				var errorCode = error.code;
				var errorMessage = error.message;

				if (errorCode || errorMessage) {
					console.log('errorCode', errorCode);
					console.log('errorMessage', errorMessage);
					this.setState({ loading: false });
					this._alertError(errorMessage);
				}
			});
	}

	_resetPassword() {
		firebase.auth().sendPasswordResetEmail(this.state.email)
		.then(()=>{
			alert(`A password reset email has been sent to ${this.state.email}. Please set your new password as instructed in the email and come back here to log in`);
		})
		.catch((e) => {
			alert(e);
		});
	}

	_alertError(message) {
		this.setState({ errorMessage: message, showModal: true });
	}

	_closeAlert() {
		this.setState({ errorMessage: '', showModal: false });
	}

	_renderLoading() {
		return (
			<div className='loading-box'>
				<i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
				<p id='loading'>Loading...</p>
			</div>
		);
	}

	_renderAlertModal() {
		return (
			<Modal show={this.state.showModal} onHide={() => this._closeAlert()}>
				<Modal.Header closeButton>
					<Modal.Title>Error</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<p>{this.state.errorMessage}</p>
				</Modal.Body>
				<Modal.Footer>
					<Button onClick={() => this._closeAlert()}>OK</Button>
				</Modal.Footer>
			</Modal>
		);
	}

	_renderLogInForm() {
		return (
			<div className="log-in-box">
				<img alt='logo' src={require("../res/logo.svg")} style={{ height: 100, marginTop: 32 }} />

				<div className='decoration-container'>
					<div className='decoration' />
					<h1 id='log-in-header'>LOG IN</h1>
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

				{this.state.email !== '' ? <a id='reset-password' onClick={() => { this._resetPassword() }}>Forgot your password?</a> : null}

				<Button bsStyle='primary' style={{ alignSelf: 'stretch' }} onClick={() => this._logIn()}>Log In</Button>

				<div style={{ flex: 1 }} />

				<p id='copyright'>&copy; 2017 Exampe Mini-restaurant Manament System</p>

				{this._renderAlertModal()}
			</div>
		);
	}

	render() {
		return (
			<div className="full-screen center log-in-background">
				{this.state.loading ? this._renderLoading() : this._renderLogInForm()}
			</div>
		);
	}

}