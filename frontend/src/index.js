import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// The <Provider> component makes the Redux store available to any nested components that need to access the Redux store.
import {Provider} from "react-redux";
import store from "./store.js";

import { positions, transitions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";

const options = {
   timeout: 5000,
   position : positions.BOTTOM_CENTER, // niche ki taraf se show hota hua aaye alert message
   transition: transitions.SCALE,
};

// The Hooks and connect APIs can then access the provided store instance via React's Context mechanism.
ReactDOM.render(
  <Provider store={store}>
    <AlertProvider template={AlertTemplate} {...options}>
       <App />
    </AlertProvider>
  </Provider>,
  document.getElementById('root')
);


