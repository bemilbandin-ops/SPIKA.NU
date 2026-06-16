import type { Metadata } from "next";

import { CreateEventForm } from "@/components/CreateEventForm";

export const metadata: Metadata = {
  title: "Skapa planering",
  description: "Skapa en privat planering i PickADay."
};

export default function CreateEventPage() {
  return (
    <section className="page-frame grid max-w-3xl content-start gap-5">
      <div className="grid max-w-2xl gap-3">
        <h1 className="text-2xl font-extrabold tracking-[-0.045em] text-[var(--foreground)] sm:text-4xl">
          Skapa en planering
        </h1>
        <p className="text-sm leading-6 text-[var(--foreground)]/80 sm:text-base sm:leading-7">
          Ge planeringen en titel, valfria detaljer, ditt namn och det första
          datumet och tiden som gruppen kan ta ställning till.
        </p>
      </div>

      <CreateEventForm />
    </section>
  );
}
