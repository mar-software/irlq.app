class SiteFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer class="site-footer">
        <nav class="footer-nav" aria-label="Footer">
          <a href="/">Home</a>
          <a href="/impressum.html">Impressum</a>
          <a href="/datenschutz.html">Datenschutz</a>
          <a href="/agb.html">AGB</a>
        </nav>
      </footer>
    `
  }
}

customElements.define('site-footer', SiteFooter)
