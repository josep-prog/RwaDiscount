# Collaboration Diagram — Creating a deal with image upload

Objects
- Merchant : User
- CreateDealModal : Component
- SupabaseStorage : External service
- SupabaseDB : External service

Numbered messages
1. Merchant → CreateDealModal: select image file
2. CreateDealModal → CreateDealModal: validateImageFile(file)
3. CreateDealModal → SupabaseStorage: upload(file, userId)
4. SupabaseStorage → CreateDealModal: publicUrl, path
5. Merchant → CreateDealModal: submit form
6. CreateDealModal → SupabaseDB: insert deals{..., image_url}
7. SupabaseDB → CreateDealModal: OK
8. CreateDealModal → MerchantDashboard: onSuccess() (refresh list)

This is equivalent in content to a communication diagram but emphasizes the collaborative roles.
