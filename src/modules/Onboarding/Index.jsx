import './style.less'

import classNames from 'classnames'
import React, { Component, PropTypes } from 'react'

import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'

import { code } from '../../config'

import First from './First'
import Second from './Second'
import Third from './Third'
import Fourth from './Fourth'

const style = {

}

class Welcome extends Component {
  constructor(props) {
    super(props)
    this.stepComponents = [
      <First />,
      <Second />,
      <Third />,
      <Fourth />
    ]
    this.state = {
      finished: false,
      step: 1,
      total: this.stepComponents.length
    }
  }
  skip = () => {
    const welcome = this.refs.welcome
    welcome.classList.add('hide')
    localStorage.setItem('code', code)
  }
  previousStep = () => {
    const step = this.state.step - 1
    this.setState({ step })
  }
  nextStep = () => {
    const { step, total } = this.state
    if (step !== total) {
      this.setState({ step: step + 1 })
    } else {
      this.skip()
    }
  }
  render() {
    const { step, total } = this.state
    return (
      <div className="welcome-sec" ref="welcome">
        <header>
          <div className="logo"></div>
          <FlatButton
            label="跳过"
            primary={true}
            onTouchTap={this.skip}
          />
        </header>
        <div className="content-wrap">
          {this.stepComponents[step - 1]}
          <div className="btn-box">
            <RaisedButton
              label="上一步"
              disabled={step == 1}
              style={{ marginRight: 48 }}
              onTouchTap={this.previousStep}
            />
            <RaisedButton
              label={step === total ? '开始使用' : '下一步'}
              onTouchTap={this.nextStep}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default Welcome