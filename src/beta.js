// The "Join the Beta" CTA opens our Instagram DMs. Instagram has no URL
// parameter to prefill DM text, so we copy the message to the clipboard on
// click — the user just pastes it and hits send.
const cta = document.querySelector('.beta-badge')

cta?.addEventListener('click', () => {
  const message = cta.dataset.betaMessage
  if (message && navigator.clipboard) {
    navigator.clipboard.writeText(message).catch(() => {})
  }
})
