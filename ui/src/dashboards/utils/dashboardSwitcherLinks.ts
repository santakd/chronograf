import {Source} from 'src/types/sources'
import {Dashboard, DashboardSwitcherLinks} from 'src/types/dashboards'

export const EMPTY_LINKS = {
  links: [],
  active: null,
}

export const linksFromDashboards = (
  dashboards: Dashboard[],
  source: Source
): DashboardSwitcherLinks => {
  const links = dashboards.map(d => {
    return {
      key: String(d.id),
      text: d.name,
      to: `/sources/${source.id}/dashboards/${d.id}`,
    }
  })

  return {links, active: null}
}

export const updateActiveDashboardLink = (
  dashboardLinks: DashboardSwitcherLinks,
  dashboard: Dashboard
) => {
  if (!dashboard) {
    return {...dashboardLinks, active: null}
  }

  const active = dashboardLinks.links.find(
    link => link.key === String(dashboard.id)
  )

  return {...dashboardLinks, active}
}

export const updateDashboadLinkName = (
  dashboardLinks: DashboardSwitcherLinks,
  dashboard: Dashboard
): DashboardSwitcherLinks => {
  const {name} = dashboard
  let active = dashboardLinks.active

  const links = dashboardLinks.links.map(link => {
    if (link.key === String(dashboard.id)) {
      const newLink = {...link, text: name}

      if (link === active) {
        active = newLink
      }

      return newLink
    }

    return link
  })

  return {links, active}
}