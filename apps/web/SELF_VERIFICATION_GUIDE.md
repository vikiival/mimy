# Self Protocol Verification Feature

## Overview

Added Self Protocol identity verification to gate access to exclusive links. Users must verify their identity (age 18+, nationality, gender) before accessing the linktree content.

## Features Implemented

### 1. **Homepage (`/`)**
- Shows user profile (avatar, username, wallet)
- Displays verification prompt card
- "Verify with Self Protocol" button opens modal
- Privacy notice about Self Protocol

### 2. **Verified Page (`/verified`)**
- Only accessible after successful verification
- Shows all links with LinkCard components
- Green "Verified" badge at top
- Same profile display as homepage
- Link details modal

### 3. **Self Verification Component**
- Styled to match existing Tailwind/shadcn theme
- QR code for mobile scanning
- "Copy Link" and "Open Self App" buttons
- Success/error toast notifications
- Download links for iOS/Android Self app
- Privacy-preserving verification (data stays on device)

## User Flow

1. User lands on homepage → sees verification prompt
2. Clicks "Verify with Self Protocol" → modal opens
3. Scans QR code with Self app or copies universal link
4. Completes verification (age 18+, nationality, gender)
5. Automatically redirected to `/verified` page
6. Can now access all exclusive links

## Environment Variables

Add to `.env.local`:

```env
NEXT_PUBLIC_SELF_APP_NAME="Decentralized Linktree"
NEXT_PUBLIC_SELF_SCOPE="linktree-verify"
NEXT_PUBLIC_SELF_ENDPOINT="https://your-endpoint.com/api/verify"
```

## Self Protocol Configuration

The verification requires:
- **Minimum Age**: 18+
- **Nationality**: Disclosed
- **Gender**: Disclosed

These can be customized in `src/components/self-verify.tsx`:

```typescript
disclosures: {
  minimumAge: 18,
  nationality: true,
  gender: true,
  // Add more as needed:
  // name: true,
  // date_of_birth: true,
  // etc.
}
```

## Components Created

### `src/components/self-verify.tsx`
Self Protocol verification component with QR code, adapted to match the app's design system.

### `src/app/verified/page.tsx`
Protected page showing links after verification with verified badge.

### `src/app/page.tsx` (Updated)
Homepage now shows verification gate instead of links directly.

## Design System

All components use:
- **Tailwind CSS** utility classes
- **shadcn/ui** Card, Button, Sheet components
- **Gradient backgrounds**: Purple-to-blue for verification theme
- **Glass morphism**: Backdrop blur effects
- **lucide-react** icons (Shield, CheckCircle, etc.)
- Smooth animations and transitions

## Key Files Modified

```
src/
├── app/
│   ├── page.tsx                 # Homepage with verification gate
│   └── verified/
│       └── page.tsx            # Protected linktree page
├── components/
│   ├── self-verify.tsx         # Self verification component
│   ├── link-card.tsx           # Existing link card (unchanged)
│   └── ui/
│       ├── button.tsx          # Used for verify buttons
│       ├── card.tsx            # Used in verification UI
│       └── sheet.tsx           # Modal for verification
└── types/
    └── links.ts                # Link types (unchanged)
```

## Next Steps

- [ ] Implement backend endpoint for Self Protocol verification
- [ ] Store verification status (localStorage, database, or on-chain)
- [ ] Add verification expiration/re-verification flow
- [ ] Custom verification requirements per user
- [ ] Analytics for verification completion rate
- [ ] Add more identity disclosure options

## Testing

1. **Development**: Run `npm run dev`
2. **Verification Flow**:
   - Visit homepage
   - Click "Verify with Self Protocol"
   - Use Self app to scan QR code
   - Complete verification
   - Should redirect to `/verified` page

## Self Protocol Resources

- [Self Protocol Docs](https://docs.self.xyz/)
- [iOS App](https://apps.apple.com/app/self-protocol/id6443896588)
- [Android App](https://play.google.com/store/apps/details?id=com.selfxyz.app)
- [Dashboard](https://self.xyz/)
