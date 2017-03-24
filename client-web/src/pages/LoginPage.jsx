import React, { Component } from 'react';

export default class LoginPage extends Component {

	constructor(props) {
		super(props);
		this.state = {
			username: null,
			password: null
		}
	}

	render() {
		return (
			<div className="container">
				<p>Login page</p>
			</div>
		);
	}

}