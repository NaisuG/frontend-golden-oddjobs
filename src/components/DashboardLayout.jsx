const ACCENTS = {
  rust: 'bg-rust',
  teal: 'bg-teal',
  navy: 'bg-navy'
};

export default function DashboardLayout({ roleLabel, roleColor, email, onLogout, children }) {
  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-ink/10 bg-white">
        <div className="mx-auto max-w-4xl px-6 py-4 flex items-center justify-between">
          <div>
            <p className="font-display text-xl text-ink">Golden-Oddjobs</p>
            <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-semibold text-white rounded ${ACCENTS[roleColor]}`}>
              {roleLabel}
            </span>
          </div>
          <div className="text-right">
            <p className="text-sm text-ink/70">{email}</p>
            <button
              onClick={onLogout}
              className="mt-1 text-sm text-ink/60 hover:text-ink underline underline-offset-2"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-10">{children}</main>
    </div>
  );
}
