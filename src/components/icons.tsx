type Props = { className?: string };

/** WhatsApp glyph, taken from the prototype's Cotizar button. */
export function WhatsappIcon({ className }: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M17.42 14.38c-.3-.15-1.76-.86-2.03-.96-.28-.1-.48-.15-.67.15-.2.29-.77.96-.95 1.16-.17.2-.34.22-.64.07-.3-.15-1.25-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.18-.3-.02-.46.13-.61.13-.13.3-.34.44-.52.15-.17.2-.29.3-.49.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51-.17-.01-.37-.01-.57-.01s-.52.07-.79.37c-.27.3-1.04 1.02-1.04 2.48s1.06 2.88 1.21 3.08c.15.19 2.1 3.2 5.08 4.48.71.31 1.26.49 1.69.63.72.22 1.36.19 1.88.12.57-.09 1.75-.72 2-1.42.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.56-.35Zm-5.43 7.41a9.9 9.9 0 0 1-5.03-1.38l-.36-.22-3.74.99.99-3.65-.23-.38a9.86 9.86 0 0 1-1.51-5.26C2.11 6.44 6.54 2.01 12 2.01c2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.89 6.99c0 5.45-4.44 9.89-9.89 9.89Zm8.42-18.3A11.81 11.81 0 0 0 11.99 0C5.44 0 .1 5.34.1 11.89c0 2.1.55 4.14 1.59 5.95L0 24l6.3-1.65a11.88 11.88 0 0 0 5.69 1.44c6.56 0 11.89-5.33 11.9-11.89 0-1.56-.3-3.11-.9-4.55a11.82 11.82 0 0 0-2.58-3.86Z" />
    </svg>
  );
}

export function PersonIcon({ className }: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm0 2c-4.42 0-8 2.24-8 5v1.5h16V19c0-2.76-3.58-5-8-5Z" />
    </svg>
  );
}

export function MenuIcon({ className }: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden className={className}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function CloseIcon({ className }: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden className={className}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function ChevronLeftIcon({ className }: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className}>
      <path d="m15 6-6 6 6 6" />
    </svg>
  );
}

export function PinIcon({ className }: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
    </svg>
  );
}
