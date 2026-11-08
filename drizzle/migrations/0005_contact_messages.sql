DO $$ BEGIN
 CREATE TYPE "public"."contact_message_status" AS ENUM('new', 'read', 'closed');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "contact_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"subject" text NOT NULL,
	"message" text NOT NULL,
	"user_id" integer REFERENCES "users"("id") ON DELETE set null,
	"status" "contact_message_status" DEFAULT 'new' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "contact_messages_status_created_idx" ON "contact_messages" USING btree ("status", "created_at");
