import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import type { BusinessKycProfile, KycProfile, PersonalKycProfile } from '@/types'

const emptyPersonalKyc: PersonalKycProfile = {
  fullName: '',
  nin: '',
  phone: '',
  address: '',
  dob: '',
}

const emptyBusinessKyc: BusinessKycProfile = {
  businessName: '',
  rcNumber: '',
  businessType: '',
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

  const profile = useMemo(
    () => buildProfile(user?.name ?? '', user?.kycProfile),
    [user?.name, user?.kycProfile]
  )

  const [personal, setPersonal] = useState<PersonalKycProfile>(profile.personal)
  const [business, setBusiness] = useState<BusinessKycProfile>(profile.business)
  const kycStatus = user?.kycStatus ?? 'none'
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    setPersonal(profile.personal)
    setBusiness(profile.business)
  }, [profile])

  const saveProfile = (
    nextPersonal: PersonalKycProfile,
    nextBusiness: BusinessKycProfile
  ) => {
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
      kycRejectionReason: undefined,
    })
  }

  const updatePersonal = (field: keyof PersonalKycProfile, value: string) => {
    setPersonal({ ...personal, [field]: value })
  }

  const updateBusiness = (field: keyof BusinessKycProfile, value: string) => {
    setBusiness({ ...business, [field]: value })
  }

  const handleSave = async () => {
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
        <div className="rounded-card border border-border bg-surface-1 p-4">
          <p className="text-sm font-medium text-text-primary">
            Personal KYC
          </p>

          <p className="text-xs text-text-tertiary mt-1">
            Status:{' '}
            {kycStatus === 'none' && 'Not Submitted'}
            {kycStatus === 'pending' && 'Pending'}
            {kycStatus === 'verified' && 'Verified'}
            {kycStatus === 'rejected' && 'Rejected'}
          </p>

          {kycStatus === 'rejected' && user?.kycRejectionReason && (
            <p className="text-xs text-danger mt-2">
              Reason: {user.kycRejectionReason}
            </p>
          )}
        </div>

        <div className="rounded-card border border-border bg-surface-1 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-text-tertiary mb-3">
            Personal verification
          </p>

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

          {kycStatus === 'verified' ? ( // later, this should be read from what the backend set in the 'user' object e.g 'user?.kycProfile?.personalStatus'
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-xs uppercase tracking-[0.2em] text-text-tertiary mb-3">
                Business verification
              </p>

              <div className="flex flex-col gap-3">
                <div>
                  <label className="text-xs text-text-tertiary mb-1.5 block">
                    Business name
                  </label>
                  <input
                    value={business.businessName}
                    onChange={(e) => updateBusiness('businessName', e.target.value)}
                    className="w-full bg-surface-2 border border-border-strong rounded-card px-4 py-3 text-sm text-text-primary"
                  />
                </div>

                <div>
                  <label className="text-xs text-text-tertiary mb-1.5 block">
                    RC number
                  </label>
                  <input
                    value={business.rcNumber}
                    onChange={(e) => updateBusiness('rcNumber', e.target.value)}
                    className="w-full bg-surface-2 border border-border-strong rounded-card px-4 py-3 text-sm text-text-primary"
                  />
                </div>

                <div>
                  <label className="text-xs text-text-tertiary mb-1.5 block">
                    Nature of Business
                  </label>
                  <input
                    value={business.businessType}
                    onChange={(e) => updateBusiness('businessType', e.target.value)}
                    className="w-full bg-surface-2 border border-border-strong rounded-card px-4 py-3 text-sm text-text-primary"
                  />
                </div>

                <div>
                  <label className="text-xs text-text-tertiary mb-1.5 block">
                    Contact person
                  </label>
                  <input
                    value={business.contactPerson}
                    onChange={(e) => updateBusiness('contactPerson', e.target.value)}
                    className="w-full bg-surface-2 border border-border-strong rounded-card px-4 py-3 text-sm text-text-primary"
                  />
                </div>

                <div>
                  <label className="text-xs text-text-tertiary mb-1.5 block">
                    Business address
                  </label>
                  <input
                    value={business.address}
                    onChange={(e) => updateBusiness('address', e.target.value)}
                    className="w-full bg-surface-2 border border-border-strong rounded-card px-4 py-3 text-sm text-text-primary"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-sm font-medium text-text-secondary">
                Business verification
              </p>

              <p className="text-xs text-text-tertiary mt-1">
                Business KYC will be unlocked once your personal KYC has been verified.
              </p>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="w-full rounded-card bg-brand text-black py-3 text-sm font-medium"
        >
          {isSaving ? 'Saving...' : 'Save changes'}
        </button>

        {saveError && (
          <p className="text-xs text-danger text-center">
            {saveError}
          </p>
        )}

      </div>
    </div>
  )
}
