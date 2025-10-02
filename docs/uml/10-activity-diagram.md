# Activity Diagram — Merchant creates a deal

Mermaid
```mermaid
flowchart TD
  A[Open MerchantDashboard] --> B[Click Create Deal]
  B --> C[Fill form fields]
  C -->|Select image| D[validateImageFile]
  D -->|invalid| E[Show error]
  D -->|valid| F[uploadDealImage -> Storage]
  F --> G[Set imageUrl]
  C --> H[Submit]
  H --> I{discounted_price < original_price?}
  I -->|no| E
  I -->|yes| J[insert into deals status='pending']
  J --> K[Show success]
  K --> L[Admin reviews]
  L -->|Approve| M[status='approved']
  L -->|Reject| N[status='rejected']
```

Notes
- Form validation happens both client-side (price constraint) and server-side (DB constraints and policies).
- Image upload is independent of form submission; the modal stores storage path for cleanup.
