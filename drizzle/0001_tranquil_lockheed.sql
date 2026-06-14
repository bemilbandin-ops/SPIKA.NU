ALTER TABLE "events" ADD COLUMN "search_code" text;--> statement-breakpoint
CREATE INDEX "events_search_code_idx" ON "events" USING btree ("search_code");--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_search_code_unique" UNIQUE("search_code");--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_search_code_format_check" CHECK ("events"."search_code" is null or "events"."search_code" ~ '^[a-z]+-[a-z]+$');