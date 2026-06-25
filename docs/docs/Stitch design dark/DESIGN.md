---
name: Obsidian Industry
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#c3c6d7'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#8d90a0'
  outline-variant: '#434655'
  surface-tint: '#b4c5ff'
  primary: '#b4c5ff'
  on-primary: '#002a78'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#0053db'
  secondary: '#b7c8e1'
  on-secondary: '#213145'
  secondary-container: '#3a4a5f'
  on-secondary-container: '#a9bad3'
  tertiary: '#ffb596'
  on-tertiary: '#581e00'
  tertiary-container: '#bc4800'
  on-tertiary-container: '#ffede6'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#ffdbcd'
  tertiary-fixed-dim: '#ffb596'
  on-tertiary-fixed: '#360f00'
  on-tertiary-fixed-variant: '#7d2d00'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-md:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
  container-max-width: 1440px
---

## Brand & Style

The design system is engineered for high-performance industrial and technical environments. It targets engineers, system administrators, and data analysts who require high information density and unwavering reliability.

The aesthetic blends **Modern Corporate** structure with **Minimalist** precision. It evokes a sense of "digital machinery"—robust, utilitarian, and focused. The interface prioritizes clarity and efficiency, utilizing a strict grid and logical information architecture to reduce cognitive load during complex tasks. The emotional response is one of controlled authority and professional-grade stability.

## Colors

The palette is anchored in a "Deep Navy" dark mode, optimized for low-light environments and long-duration focus. 

- **Primary Blue (#2563eb):** Used exclusively for interactive states, progress indicators, and primary actions. It acts as the "active" signal within the machine.
- **Surfaces:** We utilize a tiered charcoal and navy scale. The base background is the darkest shade, while UI "containers" use progressively lighter values of navy to indicate elevation and grouping.
- **Contrast:** Typography is strictly light gray to pure white, ensuring AAA accessibility against the deep backgrounds.
- **Outline Variant:** Used for subtle structural borders to define the grid without creating visual noise.

## Typography

Typography in the design system is functional and hierarchical. 

1. **Headlines:** Uses **Hanken Grotesk** for a sharp, contemporary feel that remains legible at large scales.
2. **Body:** Uses **Inter** for its neutral, systematic character and exceptional readability in data-heavy contexts.
3. **Data/Technical:** Uses **JetBrains Mono** for labels, status codes, and numerical data. This reinforces the industrial, technical nature of the system and ensures numbers align perfectly in tables.

Large display type should use tighter letter spacing, while small labels benefit from slight tracking increases to ensure legibility against dark backgrounds.

## Layout & Spacing

The system follows a strict **8px grid** (with 4px sub-steps). The layout philosophy is a **fixed-fluid hybrid**:

- **Grid:** A 12-column system is used for desktop. 
- **Gutters:** Standardized at 16px to maintain a dense, professional information density.
- **Margins:** 32px on desktop, scaling down to 16px on mobile.
- **Alignment:** All elements must snap to the grid. Use consistent padding within containers (e.g., 16px or 24px) to create a rhythmic vertical flow.

On mobile, the 12-column grid collapses to a 4-column layout. Technical data tables should allow for horizontal scrolling rather than aggressive stacking to maintain data integrity.

## Elevation & Depth

Elevation is communicated through **Tonal Layers** rather than heavy shadows. In this dark mode environment:

- **Level 0 (Background):** The base layer (`#020617`).
- **Level 1 (Cards/Sections):** Uses `surface` (`#0f172a`). 
- **Level 2 (Modals/Overlays):** Uses `surface-container` (`#1e293b`) with a subtle 1px `outline-variant` border.
- **Accents:** Instead of shadows, use a subtle 1px inner stroke or a very faint "accent-glow" (primary blue at 15% opacity) to highlight active or focused elements. This maintains the flat, industrial aesthetic while providing clear depth cues.

## Shapes

The shape language is **Soft** but disciplined. 

- **Standard Elements:** Buttons, inputs, and cards use a 0.25rem (4px) radius. This provides a hint of modern refinement without losing the technical, structural "edge" required by the brand.
- **Large Containers:** Modals and main content areas can use 0.5rem (8px) to distinguish them from smaller UI components.
- **Status Indicators:** Small dots or status chips may use pill-shaping (fully rounded) to contrast against the otherwise rectilinear grid.

## Components

### Buttons
- **Primary:** Solid `#2563eb` with white text. No gradient. 
- **Secondary:** Transparent background with a `primary` 1px stroke.
- **Tertiary:** Ghost style, using `on-surface-variant` text that shifts to `primary` on hover.

### Input Fields
- Background uses `surface-container`. 
- Border uses `outline-variant`. 
- On focus, the border changes to `primary` blue with a subtle outer glow of the same color.

### Cards
- Background: `surface`.
- Border: 1px solid `outline-variant`.
- No box-shadow. Depth is achieved via the color contrast between the background and the card surface.

### Chips & Tags
- Used for status indicators (e.g., "Active", "Pending"). 
- Use `jetbrainsMono` for text. 
- Backgrounds should be low-opacity versions of the status color (e.g., Green for success) to remain legible in dark mode.

### Lists & Tables
- Table headers use `label-md` in `on-surface-variant`.
- Rows are separated by 1px `outline-variant` dividers.
- Hover states on rows use a slight tint increase to `surface-container-high`.