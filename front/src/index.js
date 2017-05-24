import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
//import registerServiceWorker from './registerServiceWorker';
import './index.css';

let pathname = window.location.pathname;

switch (pathname) {
    case '/':
        ReactDOM.render(
            <App/>,
            document.getElementById('root')
        );
        break;
    default:
        break;
}

//registerServiceWorker();