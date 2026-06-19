CREATE TABLE "event_subscribers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"email" text NOT NULL,
	"interval_hours" integer DEFAULT 24 NOT NULL,
	"last_digest_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_seen_activity_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "event_subscribers_event_id_email_unique" UNIQUE("event_id","email"),
	CONSTRAINT "event_subscribers_email_length_check" CHECK (char_length("event_subscribers"."email") between 3 and 254),
	CONSTRAINT "event_subscribers_email_format_check" CHECK ("event_subscribers"."email" ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
	CONSTRAINT "event_subscribers_interval_check" CHECK ("event_subscribers"."interval_hours" in (24, 48, 72))
);
--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "notification_activity_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "event_subscribers" ADD CONSTRAINT "event_subscribers_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;