# Component Diagram — High Level

Components
- Web Client (React App)
  - Pages: Home, AdminDashboard, MerchantDashboard, MerchantRegister, SignIn, SignUp
  - Components: Header, DealCard, CreateDealModal
  - Context: AuthContext (session, profile, auth ops)
  - Lib: supabase client + upload utilities; sw.ts for PWA
- Supabase Services (external components)
  - Auth
  - Postgres (DB)
  - Storage (bucket deal-images)

Mermaid
```mermaid
flowchart LR
  subgraph Web[Web Client (React + TS)]
    subgraph Pages
      Home
      Admin
      Merchant
      Register
      SignIn
      SignUp
    end
    subgraph Components
      Header
      DealCard
      CreateDealModal
    end
    AuthContext
    SupabaseJS[Supabase JS Client]
    SW[Service Worker / PWA]
  end

  subgraph Supabase[Supabase]
    Auth
    DB[(Postgres DB)]
    Storage[(Storage: deal-images)]
  end

  Home --> SupabaseJS
  Admin --> SupabaseJS
  Merchant --> SupabaseJS
  Register --> SupabaseJS
  SignIn --> AuthContext
  SignUp --> AuthContext
  AuthContext --> Auth
  SupabaseJS --> Auth
  SupabaseJS --> DB
  SupabaseJS --> Storage
  SW -.-> Web
```

Notes
- The web client depends on the Supabase JS client, which in turn talks to Auth/DB/Storage over HTTPS.
- PWA features are orthogonal and enhance the client runtime (install, offline, updates).
