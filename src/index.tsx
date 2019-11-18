import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

import { createStore } from 'redux';
import { Provider } from 'react-redux';

import { rootReducer } from './reducers/rootReducer';
import { GlobalStyle } from './globalStyles';

const store = createStore(rootReducer);
ReactDOM.render(
    <Provider store={store}>
        <GlobalStyle />
        <App />
    </Provider>, document.getElementById('app')
);
