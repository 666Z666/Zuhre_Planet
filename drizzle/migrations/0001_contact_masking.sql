DO $$ BEGIN
 CREATE TYPE "public"."contact_channel" AS ENUM('phone', 'whatsapp');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "escort_contacts" (
	"id" serial PRIMARY KEY NOT NULL,
	"escort_profile_id" integer NOT NULL REFERENCES "escort_profiles"("id") ON DELETE cascade,
	"phone_enc" text,
	"whatsapp_enc" text,
	"pending_phone_enc" text,
	"pending_whatsapp_enc" text,
	"has_pending_change" boolean DEFAULT false,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "escort_contacts_profile_unique" ON "escort_contacts" USING btree ("escort_profile_id");
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "contact_clicks" (
	"id" serial PRIMARY KEY NOT NULL,
	"escort_profile_id" integer NOT NULL REFERENCES "escort_profiles"("id") ON DELETE cascade,
	"channel" "contact_channel" NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "contact_clicks_profile_created_idx" ON "contact_clicks" USING btree ("escort_profile_id", "created_at");
