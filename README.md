# Arcana Wiki — Demo (Vanilla HTML/CSS/JS)

A dark-first, fandom-style wiki demo built with semantic HTML, modern CSS, and vanilla JavaScript. Designed to be lightweight, accessible, and easy to extend.

## Quick start
- Open `index.html` in your browser (double-click) or serve with a simple HTTP server for full routing support:

```bash
# Python 3
python -m http.server 8000
# then open http://localhost:8000
```

## Project structure
- `index.html` — Main app scaffold and markup
- `styles.css` — Theme, layout, responsive rules, animations
- `app.js` — Client rendering, search, routing, accessibility behaviors
- `data/articles.js` — Sample article data (client-side)
- `assets/` — (optional) place thumbnails and icons here

## Key features
- Dark-first, glassmorphism-inspired UI with polished card components
- Client-side search and tab filtering (live)
- Accessible article panel (keyboard, ESC to close, focus trap)
- Mobile navigation overlay and responsive layout
- Subtle motion with `prefers-reduced-motion` support

## Keyboard shortcuts
- `/` — Focus search input
- `Esc` — Close article panel or mobile menu
- `Tab` / `Shift+Tab` — Standard keyboard navigation
- `Enter` or `Space` — Open focused card

## How to add content
Edit `data/articles.js` and add objects using the model:
```js
{
  id: 'slug-id',
  title: 'Title',
  category: 'Lore',
  excerpt: 'Short summary...',
  body: '<p>HTML content</p>',
  author: { name: 'Author' },
  date: '2026-03-26',
  tags: ['tag1','tag2'],
  thumbnail: null,
  related: ['other-id']
}
```

Notes: Bodies are rendered as HTML in this demo. Sanitize inputs before using untrusted content.

## Accessibility
- Skip link to jump to main content
- `aria` attributes for dialogs and navigation
- Focus-visible outlines and reduced-motion support

## Next steps (suggested)
- Add lazy-loaded thumbnails under `assets/` and update each article's `thumbnail`
- Replace inline sample data with a JSON endpoint when backend is available
- Add edit/contribute UI and simple markdown support

If you want, I can add thumbnails, wire up markdown parsing, or create a tiny build script. Which should I do next?
# hello