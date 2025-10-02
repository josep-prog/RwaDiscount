# Timing Diagram — Deal validity and user actions

Axes
- Time flows left → right
- Lifelines: Deal, Customer, Admin

Text timeline
```
|---- pending ----|----- approved -----| expired
t0               t1                  t2

Admin:   review @t1 (approve)
Deal:    visible to public in [t1, t2)
Customer: views/saves occur in [t1, t2)
```

Notes
- Expiry is determined by end_date; UI sorts by ending soon and filters expired deals out.
- Timing diagrams emphasize when interactions are permitted relative to state transitions.
