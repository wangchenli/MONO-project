import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import App from './app.js';

import './index.css';
import './base.css';

let data = [
    {
        id: Math.random(),
        title: 'hello',
        isSelected: false
    },
    {
        id: Math.random(),
        title: 'hahaha',
        isSelected: true
    }
]

ReactDOM.render(
    <App data={data} />, 
    document.getElementById('root')
);
registerServiceWorker();
