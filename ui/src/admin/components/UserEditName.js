import React, {Component} from 'react'
import PropTypes from 'prop-types'

import {ErrorHandling} from 'src/shared/decorators/errors'

class UserEditName extends Component {
  constructor(props) {
    super(props)
  }

  handleKeyPress = user => {
    return e => {
      if (e.key === 'Enter') {
        this.props.onSave(user)
      }
    }
  }

  handleEdit = user => {
    return e => {
      this.props.onEdit(user, {[e.target.name]: e.target.value})
    }
  }

  render() {
    const {user} = this.props
    return (
      <input
        className="form-control input-xs"
        name="name"
        type="text"
        value={user.name || ''}
        placeholder="Username"
        onChange={this.handleEdit(user)}
        onKeyPress={this.handleKeyPress(user)}
        autoFocus={true}
        spellCheck={false}
        autoComplete="false"
      />
    )
  }
}

const {func, shape} = PropTypes

UserEditName.propTypes = {
  user: shape().isRequired,
  onEdit: func.isRequired,
  onSave: func.isRequired,
}

export default ErrorHandling(UserEditName)
