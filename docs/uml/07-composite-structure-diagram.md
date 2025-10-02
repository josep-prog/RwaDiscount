# Composite Structure Diagram — Merchant Dashboard internals

Context: The MerchantDashboard page composes several parts and interacts with CreateDealModal.

Parts
- MerchantDashboard (composite)
  - merchantProfile: MerchantProfile (state fetched from DB)
  - deals: Deal[] (state)
  - Stats widgets: Total Deals, Active Deals, Total Views, Total Saves
  - List of DealItem (rendered rows)
  - CreateDealModal (conditional child)

Ports/Interfaces
- Uses supabase query interfaces: deals, merchant_profiles
- Emits callbacks to CreateDealModal: onClose, onSuccess

Run-time collaboration
- MerchantDashboard fetches merchant profile → loads deals → renders list → opens CreateDealModal for create/update.
- CreateDealModal composes: form fields + image upload sub-flow using uploadDealImage/deleteDealImage.

ASCII sketch
```
[MerchantDashboard]
  |-- state: merchantProfile, deals
  |-- Stats
  |-- DealList
  |     |-- DealItem x N
  |-- [CreateDealModal] (shown when creating/editing)
         |-- uploadDealImage() -> Supabase Storage
         |-- insert/update deals -> Supabase DB
```

Notes
- This view focuses on internal composition rather than external dependencies (covered by the component diagram).
