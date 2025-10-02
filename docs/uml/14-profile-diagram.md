# Profile Diagram — Project-specific stereotypes

Purpose: Introduce lightweight stereotypes to annotate model elements.

Stereotypes
- <<react-component>> for UI components (Header, DealCard, CreateDealModal)
- <<react-page>> for routeable pages (Home, SignIn, SignUp, MerchantRegister, MerchantDashboard, AdminDashboard)
- <<context>> for React Context providers (AuthContext)
- <<supabase>> for external services (Auth, DB, Storage)
- <<pwa>> for PWA artifacts (Service Worker, Manifest)

Example annotations
- DealCard: <<react-component>>
- MerchantDashboard: <<react-page>> uses <<supabase>> DB and Storage
- sw.ts: <<pwa>> module
- supabase.ts: <<supabase>> client

Use
- These stereotypes help quickly convey roles of parts without altering the underlying UML semantics.
