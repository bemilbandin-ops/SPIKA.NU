import { notFound } from "next/navigation";

import { unsubscribeAction } from "./actions";
import { validateUuid } from "@/lib/validation";

type UnsubscribePageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ done?: string }>;
};

export default async function UnsubscribePage({
  params,
  searchParams
}: UnsubscribePageProps) {
  const { id } = await params;
  const validation = validateUuid(id, "Prenumerations-ID");

  if (!validation.ok) notFound();

  const done = (await searchParams)?.done === "1";

  return (
    <main className="page-frame">
      <section className="ui-panel mx-auto grid max-w-lg gap-4 p-5 sm:p-7">
        <h1 className="text-2xl font-extrabold tracking-[-0.04em]">
          {done ? "Aviseringar avslutade" : "Avsluta aviseringar?"}
        </h1>
        <p className="ui-field-copy">
          {done
            ? "Adressen kommer inte att få fler aviseringar."
            : "Bekräfta att adressen inte längre ska få aviseringar för planeringen."}
        </p>
        {!done ? (
          <form action={unsubscribeAction}>
            <input type="hidden" name="id" value={validation.value} />
            <button className="ui-button ui-button-primary" type="submit">
              Avsluta aviseringar
            </button>
          </form>
        ) : null}
      </section>
    </main>
  );
}
