ALTER TABLE "escort_contacts" ADD COLUMN IF NOT EXISTS "phone_hash" text;
--> statement-breakpoint
ALTER TABLE "escort_contacts" ADD COLUMN IF NOT EXISTS "whatsapp_hash" text;
--> statement-breakpoint
ALTER TABLE "escort_contacts" ADD COLUMN IF NOT EXISTS "pending_phone_hash" text;
--> statement-breakpoint
ALTER TABLE "escort_contacts" ADD COLUMN IF NOT EXISTS "pending_whatsapp_hash" text;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "escort_contacts_phone_hash_idx" ON "escort_contacts" ("phone_hash");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "escort_contacts_whatsapp_hash_idx" ON "escort_contacts" ("whatsapp_hash");
--> statement-breakpoint
ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "content_hash" text;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "media_content_hash_idx" ON "media" ("content_hash");
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "signup_ip_hash" text;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "users_signup_ip_hash_idx" ON "users" ("signup_ip_hash", "created_at");
