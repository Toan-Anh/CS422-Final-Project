import React, { Component } from 'react';
import logo from './logo.svg';
import {
	Link
} from 'react-router-dom';
import {
	Nav,
	Navbar,
	NavItem,
	MenuItem,
	NavDropdown,
} from 'react-bootstrap';
import * as firebase from 'firebase';

import './stylesheets/App.css';

class App extends Component {

	constructor(props) {
		super(props);
		this.state = {
			activeKey: 0,
			currentUser: null,
		}
	}

	componentWillMount() {
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				// // User is signed in.
				// var displayName = user.displayName;
				// var email = user.email;
				// var emailVerified = user.emailVerified;
				// var photoURL = user.photoURL;
				// var isAnonymous = user.isAnonymous;
				// var uid = user.uid;
				// var providerData = user.providerData;
				// // ...
				this.setState({ currentUser: user });
			} else {
				// User is signed out.
				// ...
				this.props.history.replace('/login');
			}
		});
	}

	_onNavSelect() {

	}

	render() {
		return (
			<div className="App">

				<Navbar collapseOnSelect>
					<Navbar.Header>
						<Navbar.Brand>
							<a href="#">MMS</a>
						</Navbar.Brand>

						<Navbar.Toggle />
					</Navbar.Header>

					<Navbar.Collapse>
						<Nav pullRight activeKey={this.state.activeKey} onSelect={this._onNavSelect}>

							<NavItem eventKey='1' href="/Login">Login</NavItem>
							<NavItem eventKey='2'>Sign out</NavItem>
							<NavDropdown eventKey='3' title="Dropdown" id="nav-dropdown">
								<MenuItem eventKey="4.1" onClick={() => {}}>Sign out</MenuItem>
							</NavDropdown>
							{/*
							<NavItem eventKey={1} href="/">Home</NavItem>
							<NavItem eventKey={2} href="#">Link</NavItem>
							<NavDropdown eventKey={3} title="Dropdown" id="basic-nav-dropdown">
								<MenuItem eventKey={3.1}>Action</MenuItem>
								<MenuItem eventKey={3.2}>Another action</MenuItem>
								<MenuItem eventKey={3.3}>Something else here</MenuItem>
								<MenuItem divider />
								<MenuItem eventKey={3.3}>Separated link</MenuItem>
							</NavDropdown>
							*/}
						</Nav>
					</Navbar.Collapse>
				</Navbar>

				<div className="container">
					<p>Insert other routes below.</p>

					{/* Stuff here */}
				</div>

			</div>
		);
	}
}

export default App;
