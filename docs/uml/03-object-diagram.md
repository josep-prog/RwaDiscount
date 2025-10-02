# Object Diagram — Snapshot

Scenario: Alice (customer) saved a Pizza Deal from ABC Pizzeria.

Objects (example values)
- Profile alice: Profile
  - id = 7b9a...1
  - role = 'customer'
- MerchantProfile mp_abc: MerchantProfile
  - id = 55af...9
  - business_name = 'ABC Pizzeria'
  - approval_status = 'approved'
- Deal d_pizza: Deal
  - id = 9c21...3
  - title = '50% Off All Pizzas'
  - discounted_price = 5000
  - status = 'approved'
- SavedDeal sd1: SavedDeal
  - id = 2f8e...7
  - user_id = alice.id
  - deal_id = d_pizza.id

ASCII sketch
```
[alice:Profile] --(user_id)--> [sd1:SavedDeal] --(deal_id)--> [d_pizza:Deal]
[d_pizza] --(merchant_id)--> [mp_abc:MerchantProfile]
```

Use
- This shows runtime instances and their links at a particular moment.
- It complements the class diagram by illustrating concrete data.
