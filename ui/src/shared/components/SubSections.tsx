import React, {Component, ReactNode} from 'react'
import uuid from 'uuid'
import {withRouter, InjectedRouter} from 'react-router'

import SubSectionsTab from 'src/shared/components/SubSectionsTab'
import {ErrorHandling} from 'src/shared/decorators/errors'
import {PageSection} from 'src/types/shared'
import NotFound from './NotFound'

interface Props {
  sections: PageSection[]
  activeSection: string
  sourceID: string
  router: InjectedRouter
  parentUrl: string
  children?: ReactNode
}

@ErrorHandling
class SubSections extends Component<Props> {
  constructor(props) {
    super(props)
  }

  public render() {
    const {sections, activeSection} = this.props

    return (
      <div className="row subsection">
        <div className="col-md-2 subsection--nav" data-test="subsectionNav">
          <div className="subsection--tabs">
            {sections.map(
              section =>
                section.enabled && (
                  <SubSectionsTab
                    key={uuid.v4()}
                    section={section}
                    handleClick={this.handleTabClick(section.url)}
                    activeSection={activeSection}
                  />
                )
            )}
          </div>
        </div>
        <div
          className="col-md-10 subsection--content"
          data-test="subsectionContent"
        >
          {this.activeSectionComponent}
        </div>
      </div>
    )
  }

  private get activeSectionComponent(): ReactNode {
    const {sections, activeSection, children} = this.props
    const found = sections.find(section => section.url === activeSection)
    return found?.component || children || <NotFound />
  }

  public handleTabClick = (url: string) => () => {
    const {router, sourceID, parentUrl} = this.props
    router.push(`/sources/${sourceID}/${parentUrl}/${url}`)
  }
}

export default withRouter(SubSections)
