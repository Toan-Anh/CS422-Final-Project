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

let history = createHistory();

ReactDOM.render(
	<Router history={history}>
		<Switch>
			<Route exact path='/' component={App} />
			<Route path='/login' component={LogInPage} />
			<Route component={NoMatch} />
		</Switch>
	</Router>,
	document.getElementById('root')
);
