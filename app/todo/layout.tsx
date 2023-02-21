export default function TodoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <h1>Todo Layout</h1>
      {children}
    </div>
  );
}
