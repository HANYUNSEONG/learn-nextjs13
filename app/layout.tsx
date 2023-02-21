export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head>
        <title>Next.js 13 learn</title>
      </head>
      <body>
        <header>Header</header>
        <section>{children}</section>
        <footer>Footer</footer>
      </body>
    </html>
  );
}
