ALTER TABLE "events" DROP CONSTRAINT "events_search_code_format_check";--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_search_code_format_check" CHECK ("events"."search_code" is null or "events"."search_code" ~ '^[a-z]+-[a-z]+-[0-9]{2}$');
