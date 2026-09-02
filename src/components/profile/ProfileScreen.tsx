import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import type { BusinessKycProfile, KycProfile, PersonalKycProfile } from '@/types'

type KycKind = 'personal' | 'business'

const emptyPersonalKyc: PersonalKycProfile = {
  fullName: '',
  nin: '',
  bvn: '',
  phone: '',
  address: '',
  dob: '',
}

const emptyBusinessKyc: BusinessKycProfile = {
  businessName: '',
  rcNumber: '',
  cacNumber: '',
  tin: '',
  contactPerson: '',
  address: '',
}

function buildProfile(userName: string, existing?: KycProfile): KycProfile {
  return {
    personal: {
      ...emptyPersonalKyc,
      fullName: userName,
      ...(existing?.personal ?? {}),
    },
    business: {
      ...emptyBusinessKyc,
      ...(existing?.business ?? {}),
    },
  }
}

export default function ProfileScreen() {
  const navigate = useNavigate()
  const { user, setUser } = useAuthStore()
  const [kycKind, setKycKind] = useState<KycKind>('personal')

  const profile = useMemo(
    () => buildProfile(user?.name ?? '', user?.kycProfile),
    [user?.name, user?.kycProfile]
  )

  const [personal, setPersonal] = useState<PersonalKycProfile>(profile.personal)
  const [business, setBusiness] = useState<BusinessKycProfile>(profile.business)

  const saveProfile = (nextPersonal: PersonalKycProfile, nextBusiness: BusinessKycProfile) => {
    if (!user) return

    const nextProfile: KycProfile = {
      personal: nextPersonal,
      business: nextBusiness,
    }

    setUser({
      ...user,
      name: nextPersonal.fullName.trim() || user.name,
      kycProfile: nextProfile,
      kycStatus: user.kycStatus === 'verified' ? 'verified' : 'pending',
    })
  }

  const updatePersonal = (field: keyof PersonalKycProfile, value: string) => {
    setPersonal({ ...personal, [field]: value })
  }

  const updateBusiness = (field: keyof BusinessKycProfile, value: string) => {
    setBusiness({ ...business, [field]: value })
  }

  const handleSave = () => {
    saveProfile(personal, business)
  }

  return (
    <div className="min-h-dvh bg-surface-base flex flex-col max-w-md md:max-w-none mx-auto w-full">
      <div className="bg-surface-1 border-b border-border px-4 md:px-6 py-4 safe-top flex items-center gap-3">
        <button
          onClick={() => navigate('/')}
          className="w-8 h-8 flex items-center justify-center text-text-tertiary"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <p className="text-base font-medium text-text-primary">Profile</p>
          <p className="text-xs text-text-tertiary">Personal and business verification</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 safe-bottom flex flex-col gap-4">
        <div className="rounded-card border border-info/20 bg-info/10 p-3 text-sm text-info">
          Changes are saved when you click Save.
        </div>

        <div className="rounded-card border border-border bg-surface-1 p-2 flex gap-2">
          <button
            type="button"
            onClick={() => setKycKind('personal')}
            className={`flex-1 rounded-pill px-3 py-2 text-sm ${kycKind === 'personal' ? 'bg-brand text-black' : 'text-text-secondary'}`}
          >
            Personal KYC
          </button>
          <button
            type="button"
            onClick={() => setKycKind('business')}
            className={`flex-1 rounded-pill px-3 py-2 text-sm ${kycKind === 'business' ? 'bg-brand text-black' : 'text-text-secondary'}`}
          >
            Business KYC
          </button>
        </div>

        <div className="rounded-card border border-border bg-surface-1 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-text-tertiary mb-3">
            {kycKind === 'personal' ? 'Personal verification' : 'Business verification'}
          </p>

          {kycKind === 'personal' ? (
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-xs text-text-tertiary mb-1.5 block">Full name</label>
                <input
                  value={personal.fullName}
                  onChange={(e) => updatePersonal('fullName', e.target.value)}
                  className="w-full bg-surface-2 border border-border-strong rounded-card px-4 py-3 text-sm text-text-primary"
                />
              </div>
              <div>
                <label className="text-xs text-text-tertiary mb-1.5 block">NIN</label>
                <input
                  value={personal.nin}
                  onChange={(e) => updatePersonal('nin', e.target.value)}
                  className="w-full bg-surface-2 border border-border-strong rounded-card px-4 py-3 text-sm text-text-primary"
                />
              </div>
              <div>
                <label className="text-xs text-text-tertiary mb-1.5 block">BVN</label>
                <input
                  value={personal.bvn}
                  onChange={(e) => updatePersonal('bvn', e.target.value)}
                  className="w-full bg-surface-2 border border-border-strong rounded-card px-4 py-3 text-sm text-text-primary"
                />
              </div>
              <div>
                <label className="text-xs text-text-tertiary mb-1.5 block">Phone number</label>
                <input
                  value={personal.phone}
                  onChange={(e) => updatePersonal('phone', e.target.value)}
                  className="w-full bg-surface-2 border border-border-strong rounded-card px-4 py-3 text-sm text-text-primary"
                />
              </div>
              <div>
                <label className="text-xs text-text-tertiary mb-1.5 block">Residential address</label>
                <input
                  value={personal.address}
                  onChange={(e) => updatePersonal('address', e.target.value)}
                  className="w-full bg-surface-2 border border-border-strong rounded-card px-4 py-3 text-sm text-text-primary"
                />
              </div>
              <div>
                <label className="text-xs text-text-tertiary mb-1.5 block">Date of birth</label>
                <input
                  type="date"
                  value={personal.dob}
                  onChange={(e) => updatePersonal('dob', e.target.value)}
                  className="w-full bg-surface-2 border border-border-strong rounded-card px-4 py-3 text-sm text-text-primary"
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-xs text-text-tertiary mb-1.5 block">Business name</label>
                <input
                  value={business.businessName}
                  onChange={(e) => updateBusiness('businessName', e.target.value)}
                  className="w-full bg-surface-2 border border-border-strong rounded-card px-4 py-3 text-sm text-text-primary"
                />
              </div>
              <div>
                <label className="text-xs text-text-tertiary mb-1.5 block">RC number</label>
                <input
                  value={business.rcNumber}
                  onChange={(e) => updateBusiness('rcNumber', e.target.value)}
                  className="w-full bg-surface-2 border border-border-strong rounded-card px-4 py-3 text-sm text-text-primary"
                />
              </div>
              <div>
                <label className="text-xs text-text-tertiary mb-1.5 block">CAC number</label>
                <input
                  value={business.cacNumber}
                  onChange={(e) => updateBusiness('cacNumber', e.target.value)}
                  className="w-full bg-surface-2 border border-border-strong rounded-card px-4 py-3 text-sm text-text-primary"
                />
              </div>
              <div>
                <label className="text-xs text-text-tertiary mb-1.5 block">TIN</label>
                <input
                  value={business.tin}
                  onChange={(e) => updateBusiness('tin', e.target.value)}
                  className="w-full bg-surface-2 border border-border-strong rounded-card px-4 py-3 text-sm text-text-primary"
                />
              </div>
              <div>
                <label className="text-xs text-text-tertiary mb-1.5 block">Contact person</label>
                <input
                  value={business.contactPerson}
                  onChange={(e) => updateBusiness('contactPerson', e.target.value)}
                  className="w-full bg-surface-2 border border-border-strong rounded-card px-4 py-3 text-sm text-text-primary"
                />
              </div>
              <div>
                <label className="text-xs text-text-tertiary mb-1.5 block">Business address</label>
                <input
                  value={business.address}
                  onChange={(e) => updateBusiness('address', e.target.value)}
                  className="w-full bg-surface-2 border border-border-strong rounded-card px-4 py-3 text-sm text-text-primary"
                />
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="w-full rounded-card bg-brand text-black py-3 text-sm font-medium"
        >
          Save changes
        </button>

      </div>
    </div>
  )
}
