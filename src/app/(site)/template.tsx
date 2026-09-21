// Re-mounts on every navigation, which gives each page a short fade-in.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-in">{children}</div>;
}
