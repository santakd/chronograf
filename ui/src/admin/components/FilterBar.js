import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {ErrorHandling} from 'src/shared/decorators/errors'

class FilterBar extends Component {
  constructor(props) {
    super(props)

    this.state = {
      filterText: '',
    }
  }

  handleText = e => {
    this.setState(
      {filterText: e.target.value},
      this.props.onFilter(e.target.value)
    )
  }

  componentWillUnmount() {
    this.props.onFilter('')
  }

  render() {
    const {type, isEditing, onClickCreate} = this.props
    const placeholderText = type.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    })
    return (
      <div className="panel-heading">
        <div className="search-widget" style={{width: '250px'}}>
          <input
            type="text"
            className="form-control input-sm"
            placeholder={`Filter ${placeholderText}...`}
            value={this.state.filterText}
            onChange={this.handleText}
          />
          <span className="icon search" />
        </div>
        <div className="panel-heading--right">
          <button
            className="btn btn-sm btn-primary"
            disabled={isEditing}
            onClick={onClickCreate}
          >
            <span className="icon plus" /> Create{' '}
            {placeholderText.substring(0, placeholderText.length - 1)}
          </button>
        </div>
      </div>
    )
  }
}

const {bool, func, string} = PropTypes

FilterBar.propTypes = {
  onFilter: func.isRequired,
  type: string,
  isEditing: bool,
  onClickCreate: func,
}

export default ErrorHandling(FilterBar)
