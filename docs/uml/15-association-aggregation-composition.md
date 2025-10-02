# Associations vs Aggregation vs Composition — In this project

Associations
- Profile — SavedDeal — Deal: standard many-to-many association via a junction table.
- Profile — DealFeedback — Deal: another many-to-many association.

Aggregation (whole–part, weak ownership)
- AdminDashboard aggregates lists of pending entities (Merchants, Deals). Those lists exist independently in the DB.

Composition (whole–part, strong ownership / lifecycle bound)
- MerchantDashboard composes CreateDealModal at runtime. The modal cannot exist without its parent screen and is created/destroyed with it.
- A DealItem row in the UI is composed within the list; its lifecycle is bound to the list rendering.

Guidance
- Prefer composition in UI for encapsulated controls; use associations in the domain model and database.
