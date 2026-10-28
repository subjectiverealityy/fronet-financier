import SubPageLayout from '@/components/layout/SubPageLayout'
import { ReferralsTab } from '@/components/dashboard/tabs/RevenueTab'

export default function ReferralsPage() {
  return (
    <SubPageLayout title="Referrals">
      <ReferralsTab />
    </SubPageLayout>
  )
}
