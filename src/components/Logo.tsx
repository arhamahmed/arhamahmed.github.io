// logos are served from /public/logos, taken from each organisation's own brand assets where one exists;
// a domain that isn't listed falls back to its favicon
const LOCAL: Record<string, string> = {
  'linkedin.com': '/logos/linkedin.png',
  'microsoft.com': '/logos/microsoft.svg',
  'amazon.com': '/logos/amazon.png',
  'google.com': '/logos/google.png',
  'shopify.com': '/logos/shopify.svg',
  'shopify.engineering': '/logos/shopify.svg',
  'innovasium.com': '/logos/innovasium.png',
  'symcor.com': '/logos/symcor.svg',
  'cloud.google.com': '/logos/google-cloud.svg',
  'uwaterloo.ca': '/logos/waterloo.png',
  'illinois.edu': '/logos/illinois.svg',
}

export function Logo({ domain, alt, size = 16, className = '' }: { domain: string; alt: string; size?: number; className?: string }) {
  return (
    <img
      src={LOCAL[domain] ?? `https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
      alt={alt}
      width={size}
      height={size}
      className={`block rounded-xs object-contain ${className}`}
    />
  )
}
