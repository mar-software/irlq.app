class SiteFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer class="site-footer">
        <nav class="footer-nav" aria-label="Footer">
          <a href="/impressum.html">Impressum</a>
          <a href="/datenschutz.html">Datenschutz</a>
          <a href="/nutzungsbedingungen.html">Nutzungsbedingungen</a>
          <a href="https://www.instagram.com/irlq.app" target="_blank" rel="noopener">Instagram</a>
        </nav>
      </footer>
    `
  }
}

customElements.define('site-footer', SiteFooter)
