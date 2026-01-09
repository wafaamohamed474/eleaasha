export default function SectionHeader({ title }: { title: string }) {
  return <h2 className="text-base font-bold text-(--primary) mb-2 hidden text-center lg:block">{title}</h2>;
}