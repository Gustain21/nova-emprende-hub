# AGENTS.md

- Paddle webhook writes go only through SECURITY DEFINER RPCs (record_paddle_payment, apply_paddle_refund, mark_paddle_payment_failed); any RPC error returns 500 so Paddle retries — there is no durable queue of our own.
- Refunds never revoke by product or source_purchase_id alone: recompute_entitlements_for_purchase rechecks every valid purchase (paid / partially_refunded, including bundle_items) before deactivating 'lifetime' entitlements; manual grants are never touched.
- Partial refunds keep access (status partially_refunded); only full refunds revoke. Adjustment idempotency key is the Paddle adjustment id in payment_adjustments.
- Buyer identity for purchases comes from auth.users email (find_auth_user_id_by_email), never from editable profiles.email.
- Ebook promo end date has a single source (EBOOK_OFFER_END) evaluated as end of day Europe/Madrid; products.sale_ends_at must mirror it. UI never states a discount percentage for it.
- Contact form posts to the submit-contact function, which stores in private contact_messages (RLS on, no policies); success is shown only after server acceptance and email notification stays pending until an email provider exists.
