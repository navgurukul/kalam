import React from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'

export default class Root extends React.PureComponent {
  get content() {
    const { routes, history } = this.props

    return <Router history={history}>{routes}</Router>
  }

  render() {
    const { store } = this.props

    return (
      <Provider store={store}>{this.content}</Provider>
    )
  }
}