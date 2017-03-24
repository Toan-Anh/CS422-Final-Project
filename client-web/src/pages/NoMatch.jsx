import React, { Component } from 'react';
import {
	Link
} from 'react-router-dom';

export default class NoMatch extends Component {
	render() {
		return (
			<div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
				<p>Whoopsie! This page doesn't exist!</p>
				<p>Please go back to the <Link to='/'>Home page</Link></p>
			</div>
		);
	}
}