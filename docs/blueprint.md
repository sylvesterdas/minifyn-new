# **App Name**: MiniFyn

## Core Features:

- URL Shortening: Generate shortened mnfy.in/[shortCode] links from long URLs
- URL Validation: Validates the shortened URL, specifically it's syntax, and comparing it against blocked domains.
- URL expiration and Rate Limiting: Automatically expires URLs, in this MVP URLs expire 7 days from creation. Rate limiting for unauthenticated users (5 URLs per day)
- SEO metadata extraction: The LLM tool determines reasonable SEO metadata from target web page for social sharing.
- Custom slug support: Allows customization of shortened URLs, i.e., custom slug

## Style Guidelines:

- Primary color: Dark Blue (#1e40af) for a professional and trustworthy feel.
- Background color: Dark Grey (#0f172a) for a consistent dark theme.
- Accent color: Light Blue (#3b82f6) to highlight interactive elements.
- Body and headline font: 'Inter' (sans-serif) via Google Fonts for clean readability.
- Minimalist layout with a single-column centered design. Mobile-first approach with responsive design.
- Subtle fade-out animation before redirecting the user. The interaction creates user-friendly transitions.