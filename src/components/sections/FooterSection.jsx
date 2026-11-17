export default function FooterSection() {
  return (
    <footer>
      <div className="wrap footer-inner">
        <span>
          <span className="foot-dot" aria-hidden="true" />
          maithresh.sh // Maithresh Vaddi — Hyderabad, Telangana
        </span>
        <span>
          Designed &amp; engineered solo · React 19 + Vite · © {new Date().getFullYear()}
        </span>
      </div>
    </footer>
  )
}
