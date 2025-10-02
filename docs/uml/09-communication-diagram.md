# Communication Diagram — Admin approves a deal

Objects
- Admin : Profile(role='admin')
- AdminDashboard : Page
- Deal : Deal(status='pending')
- DB : Supabase Postgres

Links with message numbering
1. AdminDashboard → DB: fetch pending deals (select status='pending' join merchant_profiles)
2. Admin → AdminDashboard: click Approve(dealId)
3. AdminDashboard → DB: update deals set status='approved', approved_by=admin.id, approved_at=now
4. DB → AdminDashboard: OK
5. AdminDashboard → DB: refresh counts and pending lists

ASCII sketch
```
[Admin]--(2 Approve)-->[AdminDashboard]--(3 update)-->[DB]
[AdminDashboard]--(1 select pending)-->[DB]
[DB]--(4 OK)-->[AdminDashboard]--(5 refresh)-->[DB]
```

Notes
- Communication diagrams emphasize object links and numbered messages over time ordering.
