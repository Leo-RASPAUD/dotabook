import React from 'react';
import ReactDOM from 'react-dom';
import Amplify from 'aws-amplify';
import amplifyConfig from './config/amplify';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { initSimpleImg } from 'react-simple-img';

initSimpleImg();
Amplify.configure(amplifyConfig);

const render = Component => {
  return ReactDOM.render(<Component />, document.getElementById('root'));
};

render(App);

if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default;
    render(NextApp);
  });
}

serviceWorker.unregister();
