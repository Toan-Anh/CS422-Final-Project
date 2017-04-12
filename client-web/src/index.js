import React from 'react';
import ReactDOM from 'react-dom';
import {
	BrowserRouter as Router,
	Route,
	Switch,
} from 'react-router-dom'
import createHistory from 'history/createBrowserHistory';
import App from './App';
import { LogInPage, NoMatch } from './pages';
import './stylesheets/index.css';

import * as firebase from 'firebase';

var config = {
	apiKey: "AIzaSyChH5O7-ZtDqB53Qpv7dYo78co2RP5gyT8",
	authDomain: "mini-restaurant-management.firebaseapp.com",
	databaseURL: "https://mini-restaurant-management.firebaseio.com",
	projectId: "mini-restaurant-management",
	storageBucket: "mini-restaurant-management.appspot.com",
	messagingSenderId: "927567795857"
};
firebase.initializeApp(config);

let history = createHistory();

ReactDOM.render(
	<Router history={history}>
		<Switch>
			<Route path='/login' component={LogInPage} />
			<Route path='/' component={App} />
			<Route component={NoMatch} />
		</Switch>
	</Router>,
	document.getElementById('root')
);
