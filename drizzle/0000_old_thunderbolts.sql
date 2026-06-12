CREATE TABLE "date_suggestions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"date" date NOT NULL,
	"time" time,
	"suggested_by" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "date_suggestions_suggested_by_length_check" CHECK (char_length("date_suggestions"."suggested_by") between 1 and 80)
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "events_title_length_check" CHECK (char_length("events"."title") between 1 and 120),
	CONSTRAINT "events_description_length_check" CHECK ("events"."description" is null or char_length("events"."description") <= 500)
);
--> statement-breakpoint
CREATE TABLE "votes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"suggestion_id" uuid NOT NULL,
	"voter_name" text NOT NULL,
	"choice" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "votes_suggestion_id_voter_name_unique" UNIQUE("suggestion_id","voter_name"),
	CONSTRAINT "votes_voter_name_length_check" CHECK (char_length("votes"."voter_name") between 1 and 80),
	CONSTRAINT "votes_choice_check" CHECK ("votes"."choice" in ('yes', 'maybe', 'no'))
);
--> statement-breakpoint
ALTER TABLE "date_suggestions" ADD CONSTRAINT "date_suggestions_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "votes" ADD CONSTRAINT "votes_suggestion_id_date_suggestions_id_fk" FOREIGN KEY ("suggestion_id") REFERENCES "public"."date_suggestions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "date_suggestions_event_id_idx" ON "date_suggestions" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "date_suggestions_date_idx" ON "date_suggestions" USING btree ("date");--> statement-breakpoint
CREATE INDEX "events_created_at_idx" ON "events" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "events_deleted_at_idx" ON "events" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "votes_suggestion_id_idx" ON "votes" USING btree ("suggestion_id");