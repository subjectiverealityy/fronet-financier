import SubPageLayout from '@/components/layout/SubPageLayout'
import { DeploymentsTab } from '@/components/dashboard/tabs/RevenueTab'

export default function DeploymentsPage() {
  return (
    <SubPageLayout title="Deployments">
      <DeploymentsTab />
    </SubPageLayout>
  )
}
