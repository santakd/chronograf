import React, {PureComponent} from 'react'
import {withRouter, WithRouterProps} from 'react-router'
import _ from 'lodash'

import WizardFullScreen from 'src/reusable_ui/components/wizard/WizardFullScreen'
import WizardStep from 'src/reusable_ui/components/wizard/WizardStep'
import SourceStep from 'src/sources/components/SourceStep'
import KapacitorStep from 'src/sources/components/KapacitorStep'
import CompletionStep from 'src/sources/components/CompletionStep'

import {ErrorHandling} from 'src/shared/decorators/errors'

import {Kapacitor, Source} from 'src/types'

interface State {
  source: Partial<Source>
  sourceError: boolean
  kapacitor: Kapacitor
  kapacitorError: boolean
}

@ErrorHandling
class OnboardingWizard extends PureComponent<WithRouterProps, State> {
  public sourceStepRef: any
  public kapacitorStepRef: any
  public completionStepRef: any
  constructor(props) {
    super(props)

    this.state = {
      source: null,
      sourceError: false,
      kapacitor: null,
      kapacitorError: false,
    }
  }

  public render() {
    const {source, sourceError, kapacitorError} = this.state

    return (
      <>
        <WizardFullScreen title={'Welcome to Influx'}>
          <WizardStep
            title="Add a New InfluxDB Connection"
            tipText=""
            isComplete={this.isSourceComplete}
            isErrored={sourceError}
            isBlockingStep={true}
            onNext={this.handleSourceNext}
            nextLabel={source ? 'Update Connection' : 'Add Connection'}
            previousLabel="Cancel"
            onPrevious={this.handleKapacitorPrev}
          >
            <SourceStep
              ref={c => (this.sourceStepRef = c && c.getWrappedInstance())}
              setError={this.handleSetSourceError}
              source={source}
              gotoPurgatory={this.gotoPurgatory}
              onBoarding={true}
            />
          </WizardStep>
          <WizardStep
            title="Add a Kapacitor Connection"
            tipText="this step is optional"
            isComplete={this.isKapacitorComplete}
            isErrored={kapacitorError}
            isBlockingStep={true}
            onNext={this.handleKapacitorNext}
            onPrevious={this.handleKapacitorPrev}
            nextLabel="Continue"
            previousLabel="Go Back"
          >
            <KapacitorStep
              ref={c => (this.kapacitorStepRef = c && c.getWrappedInstance())}
              setError={this.handleSetKapacitorError}
              source={source}
            />
          </WizardStep>
          <WizardStep
            title="You are complete"
            tipText="yay"
            isComplete={this.isCompletionComplete}
            isErrored={false}
            onNext={this.handleCompletionNext}
            onPrevious={this.handleCompletionPrev}
            nextLabel="Connect to this source"
            previousLabel="Go Back"
          >
            <CompletionStep
              ref={c => (this.completionStepRef = c && c.getWrappedInstance())}
            />
          </WizardStep>
        </WizardFullScreen>
      </>
    )
  }

  private handleSourceNext = async () => {
    const response = await this.sourceStepRef.next()
    this.setState({source: response.payload})
    return response
  }
  private isSourceComplete = () => {
    const {source} = this.state
    return !_.isNull(source)
  }
  private handleSetSourceError = (b: boolean) => {
    this.setState({sourceError: b})
  }

  private isKapacitorComplete = () => {
    const {kapacitor} = this.state
    return !_.isNull(kapacitor)
  }
  private handleKapacitorNext = async () => {
    const response = await this.kapacitorStepRef.next()
    this.setState({kapacitor: response.payload})
    return response
  }
  private handleKapacitorPrev = () => {}
  private handleSetKapacitorError = (b: boolean) => {
    this.setState({kapacitorError: b})
  }

  private isCompletionComplete = () => {
    return false
  }
  private handleCompletionNext = () => {
    const {router} = this.props
    const {source} = this.state
    this.resetWizardState()
    if (source) {
      router.push(`/sources/${source.id}/manage-sources`)
    }
    return {status: true, payload: null}
  }
  private handleCompletionPrev = () => {}

  private resetWizardState = () => {
    this.setState({
      source: null,
      kapacitor: null,
    })
  }

  private gotoPurgatory = (): void => {
    const {router} = this.props
    router.push('/purgatory')
  }
}

export default withRouter(OnboardingWizard)