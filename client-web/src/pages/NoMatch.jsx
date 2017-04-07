import React, { Component } from 'react';
import {
	Link
} from 'react-router-dom';
import '../stylesheets/index.css';

export default class NoMatch extends Component {
	render() {
		return (
			<div className="full-screen center">
				<p>Whoopsie! This page doesn't exist!</p>
				<p>Please go back to the <Link to='/'>Home page</Link></p>
			</div>
		);
	}
}