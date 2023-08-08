interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <main className="bg-white flex justify-center items-center gap-8">
      <div className="max-w-screen-md mx-auto py-8 px-4 w-full">{children}</div>
    </main>
  );
}
