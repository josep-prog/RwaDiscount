# Sequence Diagram — Customer browses and saves a deal

Participants
- Customer (User)
- Browser App (React)
- Supabase DB

Mermaid
```mermaid
sequenceDiagram
  autonumber
  participant U as Customer
  participant A as Browser App
  participant DB as Supabase DB

  U->>A: Open Home
  A->>DB: select deals(status='approved' ∧ end_date>now) join merchant_profiles
  DB-->>A: list<Deal>
  A-->>U: Render cards
  U->>A: Click Save
  A->>DB: upsert saved_deals{user_id, deal_id}
  DB-->>A: OK
  A-->>U: Update saves count
```

Notes
- The app uses the Supabase JS client; authentication context ensures user_id is available for save operations.
- Views count increments on DealCard click (update deals.views_count).
