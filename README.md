# MammoAssist

An AI-assisted radiology "second-reader" dashboard for screening mammography. This is a **demo prototype** for educational purposes only, not a real medical device.

## 🚀 Stage 1 Complete: Scaffold & Base Layout

### ✅ What's Been Implemented

#### Project Setup

- ✅ Next.js 14 with App Router
- ✅ TypeScript configuration
- ✅ Tailwind CSS with shadcn/ui theme
- ✅ shadcn/ui components installed (button, card, badge, table, input)

#### Dashboard Shell

- ✅ **Responsive layout** with collapsible sidebar
- ✅ **Left sidebar navigation** with:
  - Dashboard overview
  - Queue
  - Audit Log
  - Bias & Monitoring
  - Settings
- ✅ **Top bar** featuring:
  - Global "AI Advisory" badge with pulse animation
  - Demo Mode toggle
  - Search input with keyboard accessibility
  - Voice command button (UI ready)
  - User information display

#### Design & Accessibility

- ✅ Clean, clinical dashboard style
- ✅ Consistent spacing and typography
- ✅ Keyboard navigation support
- ✅ ARIA labels for screen readers
- ✅ Focus states on interactive elements
- ✅ Clear disclaimers in footer

#### Pages Created

- ✅ Landing page with feature overview
- ✅ Dashboard overview with statistics cards
- ✅ Queue page (placeholder)
- ✅ Audit log page (placeholder)
- ✅ Bias monitoring page (placeholder)
- ✅ Settings page (placeholder)

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **Icons**: lucide-react

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🌐 Deployment

This project is configured for Vercel deployment:

- No window usage during SSR (all client components properly marked)
- Optimized build configuration
- Static generation where appropriate

## 🎯 Next Steps (Stage 2+)

### To Be Implemented:

1. **Mock Data & Types**

   - Case data structures
   - Patient information models
   - AI recommendation schemas

2. **Queue Functionality**

   - Case list with sorting/filtering
   - Priority indicators
   - AI risk scores

3. **Case Viewer**

   - Image display (mock mammogram images)
   - AI overlay with findings
   - Side-by-side comparison views

4. **Multimodal Interactions**

   - Voice commands (Web Speech API)
   - Chat assistant with visual updates
   - Real-time UI highlighting

5. **Decision & Feedback**

   - Decision capture interface
   - Confidence scoring
   - Feedback mechanism

6. **Error Recovery**

   - Confirmation dialogs for high-risk actions
   - Fallback modes when voice unavailable
   - Uncertainty warnings
   - Manual review mode

7. **Bias Monitoring**

   - Demographic analysis
   - Performance metrics by group
   - Fairness indicators

8. **API Integration**
   - Optional OpenAI chat integration
   - Mock AI fallback
   - Environment variable configuration

## ⚠️ Important Disclaimer

This is a **demonstration prototype only**. AI recommendations are advisory. All clinical decisions must be made by qualified healthcare professionals. **Not for use in actual patient care.**

## 📋 Project Structure

```
app/
  layout.tsx              # Root layout
  page.tsx                # Landing page
  globals.css             # Global styles with shadcn theme
  dashboard/
    layout.tsx            # Dashboard layout wrapper
    page.tsx              # Dashboard overview
    queue/page.tsx        # Case queue
    audit/page.tsx        # Audit log
    bias/page.tsx         # Bias monitoring
    settings/page.tsx     # Settings

components/
  ui/                     # shadcn/ui components
    button.tsx
    card.tsx
    badge.tsx
    table.tsx
    input.tsx
  dashboard/
    dashboard-shell.tsx   # Main layout shell
    sidebar-nav.tsx       # Left sidebar navigation
    top-bar.tsx           # Top bar with search & controls

lib/
  utils.ts                # Utility functions (cn helper)

tailwind.config.ts        # Tailwind + shadcn config
tsconfig.json             # TypeScript config
components.json           # shadcn/ui config
```

## 🎨 Design Principles

- **Clinical & Professional**: Clean interface suitable for medical environment
- **Accessible**: WCAG compliant, keyboard navigable, screen reader friendly
- **Responsive**: Works on desktop, tablet, and mobile devices
- **Clear Disclaimers**: Prominent warnings about AI advisory nature
- **Consistent**: Unified design language throughout

## 📝 License

Demo prototype for educational purposes only.

---

Built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui
