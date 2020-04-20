import React from 'react'
import ReactDOM from 'react-dom'

import Provider from './libs/jass-react-redux'
import App from './container/app/app'
import store from './redux/store'

ReactDOM.render(
  (
    <Provider store={store}>
      <App />
    </Provider>
  ),
  document.getElementById('root')
)
