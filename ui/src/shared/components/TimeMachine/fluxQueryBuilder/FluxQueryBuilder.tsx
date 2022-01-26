// Libraries
import React, {useEffect, useMemo, useState} from 'react'

import BuilderCard from './BuilderCard'
import BucketsSelector from './BucketsSelector'
import FancyScrollbar from '../../FancyScrollbar'
import {RemoteDataState, Source, TimeRange} from 'src/types'
import {getBuckets} from 'src/flux/components/DatabaseList'
import {
  Button,
  ButtonShape,
  ComponentColor,
  ComponentSize,
  IconFont,
} from 'src/reusable_ui'
import AggregationSelector from './AggregationSelector'
import TagSelector from './TagSelector'
import {fluxPeriodFromRangeSeconds} from 'src/tempVars/utils/replace'
import moment from 'moment'

interface State {
  selectedBucket?: string
  sortedBucketNames: string[]
  bucketsStatus: RemoteDataState
}
interface Props {
  source: Source
  timeRange: TimeRange
  onSubmit: () => void
  onShowEditor: () => void
}
const FluxQueryBuilder = ({
  source,
  onSubmit,
  onShowEditor,
  timeRange,
}: Props) => {
  const [state, setState] = useState({
    selectedBucket: '',
    sortedBucketNames: [],
    bucketsStatus: RemoteDataState.Loading,
  } as State)
  const defaultPeriod = useMemo(() => {
    if (timeRange) {
      if (timeRange.seconds) {
        return fluxPeriodFromRangeSeconds(timeRange.seconds)
      }
      // calculate from upper / lower
      const seconds = Math.round(
        moment(timeRange.upper).diff(moment(timeRange.lower)) / 1000
      )
      return fluxPeriodFromRangeSeconds(seconds)
    }
  }, [timeRange])

  useEffect(() => {
    getBuckets(source)
      .then(buckets => {
        setState({
          ...state,
          sortedBucketNames: buckets,
          bucketsStatus: RemoteDataState.Done,
        })
      })
      .catch(e => {
        console.error(e)
        setState({
          ...state,
          bucketsStatus: RemoteDataState.Error,
        })
      })
  }, [])

  // TODO demo selectors are to be replaced by a real implementation
  const [tagSelectors, setTagSelectors] = useState(1)
  const [activeTagSelectors, setActiveTagSelectors] = useState([0])

  const {selectedBucket, sortedBucketNames, bucketsStatus} = state
  return (
    <div className="flux-query-builder" data-testid="flux-query-builder">
      <div className="flux-query-builder--cards">
        <FancyScrollbar>
          <div className="builder-card--list">
            <BuilderCard testID="bucket-selector">
              <BuilderCard.Header title="From" />
              <BucketsSelector
                bucketsStatus={bucketsStatus}
                sortedBucketNames={sortedBucketNames}
                selectedBucket={selectedBucket}
                onSelectBucket={bucket =>
                  setState({...state, selectedBucket: bucket})
                }
              />
            </BuilderCard>
            {activeTagSelectors.map(i => (
              <TagSelector
                key={i}
                index={i}
                onRemoveTagSelector={ix =>
                  setActiveTagSelectors(
                    activeTagSelectors.filter(x => x !== ix)
                  )
                }
              />
            ))}
            <Button
              size={ComponentSize.Large}
              customClass="flux-query-builder--add-card-button"
              icon={IconFont.PlusSkinny}
              onClick={() => {
                setActiveTagSelectors([...activeTagSelectors, tagSelectors])
                setTagSelectors(tagSelectors + 1)
              }}
              shape={ButtonShape.Square}
            />
          </div>
        </FancyScrollbar>
        <AggregationSelector defaultPeriod={defaultPeriod}>
          <div className="flux-query-builder--actions">
            <Button
              size={ComponentSize.ExtraSmall}
              onClick={onShowEditor}
              text="Query Editor"
              titleText="Switch to Flux Query Editor"
            />
            <Button
              size={ComponentSize.ExtraSmall}
              color={ComponentColor.Primary}
              onClick={onSubmit}
              text="Submit"
            />
          </div>
        </AggregationSelector>
      </div>
    </div>
  )
}

export default FluxQueryBuilder
