import IceLine from "./IceLine";
export function SectionHead({ title, lead, id }: { title: string; lead?: string; id?: string }) {
  return (
    <div className="mb-8 max-w-3xl" id={id}>
      <h2>{title}</h2>
      {lead && <p className="mt-3 text-[17px] leading-relaxed text-ink/80">{lead}</p>}
      <IceLine className="mt-4" width={180} />
    </div>
  );
}
