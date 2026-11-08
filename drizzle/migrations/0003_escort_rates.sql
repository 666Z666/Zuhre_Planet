DO $$ BEGIN
 CREATE TYPE "public"."rate_location" AS ENUM('own_place', 'visit');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "escort_rates" (
	"id" serial PRIMARY KEY NOT NULL,
	"escort_profile_id" integer NOT NULL REFERENCES "escort_profiles"("id") ON DELETE cascade,
	"duration_minutes" integer NOT NULL,
	"location" "rate_location" NOT NULL,
	"price" integer NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "escort_rates_profile_duration_location_unique" ON "escort_rates" USING btree ("escort_profile_id", "duration_minutes", "location");
