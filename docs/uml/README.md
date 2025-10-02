# RwaDiscount UML Documentation

This folder contains project-specific UML documentation for the RwaDiscount platform, a discount discovery PWA for Rwanda.

What RwaDiscount is built with
- Frontend: React 18 + TypeScript, Vite, TailwindCSS
- PWA: Service Worker, install prompt, online/offline detection (src/lib/sw.ts)
- Routing and auth guards: React Router + ProtectedRoute (src/App.tsx)
- State/context: AuthContext (src/contexts/AuthContext.tsx)
- Backend: Supabase (Auth, Postgres, Storage)
- Data model: see RwaDscount-database.sql

How the app is structured (src/)
- pages/: Home, SignIn, SignUp, MerchantRegister, CustomerDashboard, MerchantDashboard, AdminDashboard
- components/: Header, DealCard, CreateDealModal
- contexts/: AuthContext
- lib/: supabase client + image upload utils; sw.ts for PWA features

What’s in this documentation
Each .md file focuses on one UML diagram and explains how it applies to this project.

Structural diagrams
1. 02-class-diagram.md
2. 03-object-diagram.md
3. 04-component-diagram.md
4. 05-deployment-diagram.md
5. 06-package-diagram.md
6. 07-composite-structure-diagram.md
7. 14-profile-diagram.md

Behavioral diagrams
1. 01-use-case-diagram.md
2. 08-sequence-diagram.md
3. 09-communication-diagram.md
4. 10-activity-diagram.md
5. 11-state-machine-diagram.md
6. 12-interaction-overview-diagram.md
7. 13-timing-diagram.md
8. 16-collaboration-diagram.md

Reference notes
- 15-association-aggregation-composition.md

Reading tips
- The diagrams are simple and text-first to keep focus on the concepts (“simple notes”).
- Mermaid snippets are included where useful; open the .md files in a Mermaid-enabled viewer to render them.
