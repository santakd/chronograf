import React, {SFC} from 'react'

import {RemoteDataState} from 'src/types'
import LoadingSpinner from 'src/flux/components/LoadingSpinner'

interface Props {
  rds: RemoteDataState
  children: JSX.Element
}

const DropdownLoadingPlaceholder: SFC<Props> = ({children, rds}) => {
  if (rds === RemoteDataState.Loading) {
    return (
      <div className="dropdown-placeholder">
        <LoadingSpinner />
      </div>
    )
  }

  return children
}

export default DropdownLoadingPlaceholder
