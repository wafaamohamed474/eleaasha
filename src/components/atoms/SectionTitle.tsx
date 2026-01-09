export default function SectionTitle({ title }: { title: string }) {
  return (
    <h2 className="text-sm font-medium text-(--item-text)">
      {title}
    </h2>
  );
}
