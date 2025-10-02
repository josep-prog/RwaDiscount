# Deployment Diagram — Runtime Nodes

Nodes and artifacts
- User Device
  - Mobile/Desktop Browser
  - PWA installed app (optional)
  - Artifact: RwaDiscount static bundle from Vite
- Hosting
  - Vercel (or similar static hosting) serving index.html, assets, sw.js, manifest
- Backend (Supabase)
  - Auth service
  - Postgres database
  - Storage bucket: deal-images

Mermaid
```mermaid
flowchart TB
  subgraph Device[User Device]
    Browser
    PWA[Installed PWA]
  end
  subgraph Hosting[Vercel / Static Hosting]
    Bundle[index.html + assets + sw.js]
  end
  subgraph Supabase
    Auth
    DB[(Postgres)]
    Storage[(Storage: deal-images)]
  end

  Browser --> Bundle
  PWA --> Bundle
  Bundle --> Auth
  Bundle --> DB
  Bundle --> Storage
```

Notes
- The client communicates directly with Supabase; there is no custom backend server in this project.
- Service Worker provides caching and update prompts; manifest enables install.
