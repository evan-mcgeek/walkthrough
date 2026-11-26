# README banners

Walky and the name, for the top of the repository's README and for the social preview. The name is outlined, so no font is needed to show it.

| File | Size | Use |
|---|---|---|
| `banner-light.svg`, `banner-dark.svg` | 1280 × 320 | Top of the README (fixed colours) |
| `banner.svg` | 1280 × 320 | Follows the viewer's light or dark setting; Walky waves once on load (still under reduced motion) |
| `banner-light.png`, `banner-dark.png` | 2560 × 640 | Where SVG is not shown |
| `social-light.png`, `social-dark.png` | 2560 × 1280 | The repository's social preview (Settings → Social preview takes the light one) |
| `social*.svg` | 1280 × 640 | Sources for the above |

## In the README

GitHub shows the dark banner to people in dark mode with `<picture>`:

```html
<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/design/brand/banner/banner-dark.svg">
    <img alt="Walkthrough" src="docs/design/brand/banner/banner-light.svg" width="100%">
  </picture>
</p>
```

## Rules

The banner is Walky and the name only: no tagline, no accent, no props. Ink and the surface tone, as in the mascot's own rules (`../mascot/README.md`). Do not stretch it; crop the sides if a shorter banner is needed, never the figure.
