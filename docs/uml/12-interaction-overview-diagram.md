# Interaction Overview — End-to-end onboarding to deal discovery

Sub-activities (refer to their own sequence/activity diagrams)
- A1: Sign Up / Sign In
- A2: Register as Merchant
- A3: Create Deal (see activity diagram)
- A4: Admin Approval (see communication diagram)
- A5: Browse and Save (see sequence diagram)

Mermaid (simplified)
```mermaid
flowchart TD
  A1[Sign Up / Sign In] -->|Customer chooses merchant role| A2[Register as Merchant]
  A2 --> A3[Create Deal]
  A3 --> A4[Admin Approval]
  A4 -->|Approved| A5[Public Browse & Save]
  A4 -->|Rejected| R[Fix and Resubmit]
  R --> A3
```

Notes
- This diagram ties together the main flows that appear separately in other diagrams.
