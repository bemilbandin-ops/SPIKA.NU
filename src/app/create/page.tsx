import type { Metadata } from "next";

import { CreateEventForm } from "@/components/CreateEventForm";

export const metadata: Metadata = {
  title: "Skapa planering",
  description: "Skapa en privat planering i Spika."
};

export default function CreateEventPage() {
  return (
    <section className="page-frame grid max-w-3xl content-start gap-7">
      <div className="grid max-w-2xl gap-4">
        <h1 className="text-3xl font-extrabold tracking-[-0.045em] text-[var(--foreground)] sm:text-5xl">
          Skapa en planering
        </h1>
        <p className="text-base leading-7 text-[var(--foreground)]/80 sm:text-lg sm:leading-8">
          Ge planeringen en titel, valfria detaljer, ditt namn och det första
          datumet och tiden som gruppen kan ta ställning till.
        </p>
      </div>

      <CreateEventForm />
    </section>
  );
}
