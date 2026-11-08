CREATE TABLE IF NOT EXISTS "favorites" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL REFERENCES "users"("id") ON DELETE cascade,
	"escort_profile_id" integer NOT NULL REFERENCES "escort_profiles"("id") ON DELETE cascade,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "favorites_user_profile_unique" ON "favorites" USING btree ("user_id", "escort_profile_id");
