import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import { signOut, getMyProfile, updateMyProfile } from '@/lib/api'
import ChangePasswordModal from './ChangePasswordModal'
import { trackProfileSaveStarted, trackProfileSaveSuccess, trackProfileViewed } from '@/lib/ga'
import type {
  ApiProfile,
  BusinessKycProfile,
  KycProfile,
  PersonalKycProfile,
  User,
} from '@/types'

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

// Name, phone and date of birth come from the backend profile. NIN, address and
// business details have no backend field yet, so they stay local (reset on reload).
function buildProfile(user: User | null, apiProfile?: ApiProfile): KycProfile {
  const local = user?.kycProfile
  return {
    personal: {
      ...emptyPersonalKyc,
      ...(local?.personal ?? {}),
      fullName: apiProfile
        ? `${apiProfile.first_name} ${apiProfile.last_name}`.trim()
        : user?.name ?? '',
      phone: apiProfile?.phone_number ?? local?.personal.phone ?? '',
      dob: apiProfile?.date_of_birth ?? local?.personal.dob ?? '',
    },
    business: {
      ...emptyBusinessKyc,
      ...(local?.business ?? {}),
    },
  }
}

// The backend stores first and last name separately: first word is the first
// name, the rest is the last name. Change if the provider handles it differently. Both backend and frontend should match in the final implementation.
function splitFullName(fullName: string) {
  const [first = '', ...rest] = fullName.trim().split(/\s+/)
  return { first_name: first, last_name: rest.join(' ') }
}

export default function ProfileScreen() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user, updateUser } = useAuthStore()

  // Keyed by user id so a different account signing in never sees a cached profile.
  const profileKey = ['profile', user?.id]
  const { data: apiProfile, isLoading, isError } = useQuery({
    queryKey: profileKey,
    queryFn: getMyProfile,
    enabled: !!user,
  })

  const profile = useMemo(() => buildProfile(user, apiProfile), [user, apiProfile])

  const [personal, setPersonal] = useState<PersonalKycProfile>(profile.personal)
  const [business, setBusiness] = useState<BusinessKycProfile>(profile.business)
  const kycStatus = user?.kycStatus ?? 'none'

  useEffect(() => {
    trackProfileViewed()
  }, [])

  // Refill the form when the backend profile arrives or after a save.
  useEffect(() => {
    setPersonal(profile.personal)
    setBusiness(profile.business)
  }, [profile])

  const saveMutation = useMutation({
    mutationFn: updateMyProfile,
    onSuccess: (updated) => {
      queryClient.setQueryData(profileKey, updated)
      updateUser({
        name: `${updated.first_name} ${updated.last_name}`.trim(),
        firstName: updated.first_name,
        lastName: updated.last_name,
        kycProfile: { personal, business },
        kycStatus: user?.kycStatus === 'verified' ? 'verified' : 'pending',
        kycRejectionReason: undefined,
      })
      trackProfileSaveSuccess()
    },
  })

  const updatePersonal = (field: keyof PersonalKycProfile, value: string) => {
    setPersonal({ ...personal, [field]: value })
  }

  const updateBusiness = (field: keyof BusinessKycProfile, value: string) => {
    setBusiness({ ...business, [field]: value })
  }

  const handleSave = () => {
    if (!user || saveMutation.isPending) return
    trackProfileSaveStarted()
    saveMutation.mutate({
      ...splitFullName(personal.fullName),
      phone_number: personal.phone.trim(),
      date_of_birth: personal.dob || null, // the backend rejects '' for a date
    })
  }

  // Clearing the session makes ProtectedRoute redirect to /login.
  const [signingOut, setSigningOut] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)
  const handleSignOut = async () => {
    setSigningOut(true)
    await signOut()
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

        {isError && (
          <p role="alert" className="text-sm text-danger">
            We couldn't load your saved profile. Changes you save will still be sent.
          </p>
        )}

        {saveMutation.isError && (
          <p role="alert" className="text-sm text-danger">
            {saveMutation.error.message}
          </p>
        )}

        {saveMutation.isSuccess && (
          <p className="text-sm text-text-tertiary">Changes saved.</p>
        )}

        <button
          type="button"
          onClick={handleSave}
          disabled={isLoading || saveMutation.isPending}
          className="w-full rounded-card bg-brand text-black py-3 text-sm font-medium disabled:opacity-50"
        >
          {saveMutation.isPending ? 'Saving…' : 'Save changes'}
        </button>

        <div className="flex items-center justify-center gap-2 py-1 text-xs text-text-tertiary">
          <button type="button" onClick={() => setChangingPassword(true)}>
            Change password
          </button>
          <span aria-hidden="true">·</span>
          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            className="disabled:opacity-50"
          >
            {signingOut ? 'Logging out…' : 'Log out'}
          </button>
        </div>

      </div>

      <ChangePasswordModal open={changingPassword} onClose={() => setChangingPassword(false)} />
    </div>
  )
}
