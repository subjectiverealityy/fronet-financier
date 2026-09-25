import GA4React from 'react-ga4'

const GA_ENABLED = () => !!import.meta.env.VITE_GA_MEASUREMENT_ID

export function trackPageView(pathname: string, title = document.title) {
  if (!GA_ENABLED()) return

  GA4React.send({
    hitType: 'pageview',
    page: pathname,
    title,
  })
}

export function trackEvent(category: string, action: string, label?: string, value?: number) {
  if (!GA_ENABLED()) return

  GA4React.event({
    category,
    action,
    label,
    value,
  })
}

export function trackSignupStarted() {
  trackEvent('account', 'signup_started')
}

export function trackSignupSuccess(email?: string) {
  trackEvent('account', 'signup_success', email)
}

export function trackLoginSuccess() {
  trackEvent('account', 'login_success')
}

export function trackLogout() {
  trackEvent('account', 'logout')
}

export function trackProfileViewed() {
  trackEvent('profile', 'profile_viewed')
}

export function trackProfileSaveStarted() {
  trackEvent('profile', 'profile_save_started')
}

export function trackProfileSaveSuccess() {
  trackEvent('profile', 'profile_save_success')
}

export function trackOfferClicked(offerId: string) {
  trackEvent('marketplace', 'offer_clicked', offerId)
}

export function trackMarketplaceBannerClicked() {
  trackEvent('marketplace', 'banner_clicked')
}

export function trackMarketplaceKycBannerClicked() {
  trackEvent('marketplace', 'kyc_banner_clicked')
}

export function trackKycSubmitted(residency: string) {
  trackEvent('kyc', 'kyc_form_submit', residency)
}

export function trackKycSuccess(residency: string) {
  trackEvent('kyc', 'kyc_form_success', residency)
}

export function trackResidencySelected(residency: string) {
  trackEvent('kyc', 'residency_selected', residency)
}

export function trackPayoutInitiated() {
  trackEvent('payout', 'payout_initiated')
}

export function trackPayoutButtonClicked() {
  trackEvent('payout', 'payout_button_clicked')
}

export function trackPayoutConfirmed() {
  trackEvent('payout', 'payout_confirmed')
}

export function trackPayoutCompleted() {
  trackEvent('payout', 'payout_completed')
}

export function trackDashboardTabClicked(tabId: string) {
  trackEvent('dashboard', 'tab_clicked', tabId)
}

export function trackDashboardLocationChanged(locationId: string) {
  trackEvent('dashboard', 'location_changed', locationId)
}

export function trackDashboardPeriodChanged(rangeId: string) {
  trackEvent('dashboard', 'period_changed', rangeId)
}

export function trackDashboardCustomRangeStart(date: string) {
  trackEvent('dashboard', 'custom_range_start', date)
}

export function trackDashboardCustomRangeEnd(date: string) {
  trackEvent('dashboard', 'custom_range_end', date)
}

export function trackScrollDepth(pathname: string, percent: number) {
  if (!GA_ENABLED()) return

  GA4React.event({
    category: 'engagement',
    action: 'scroll_depth',
    label: pathname,
    value: percent,
  })
}

export function trackDwellTime(pathname: string, dwellMs: number) {
  if (!GA_ENABLED()) return

  GA4React.event({
    category: 'engagement',
    action: 'dwell_time',
    label: pathname,
    value: Math.round(dwellMs),
  })
}
