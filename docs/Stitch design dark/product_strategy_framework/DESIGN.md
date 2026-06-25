---
name: Product Strategy Framework
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#434655'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d0e1fb'
  on-secondary-container: '#54647a'
  tertiary: '#4d556b'
  on-tertiary: '#ffffff'
  tertiary-container: '#656d84'
  on-tertiary-container: '#eef0ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#dae2fd'
  tertiary-fixed-dim: '#bec6e0'
  on-tertiary-fixed: '#131b2e'
  on-tertiary-fixed-variant: '#3f465c'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
  enterprise-blue: '#1E40AF'
  muted-steel: '#94A3B8'
  surface-border: '#E2E8F0'
  success-teal: '#0D9488'
typography:
  headline-xl:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 28px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Roboto Flex
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Roboto Flex
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.05em
  button:
    fontFamily: Space Grotesk
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.0'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 24px
  margin-mobile: 20px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
  section-gap: 80px
---

## Brand & Style

This design system is engineered for a Senior B2B Product Manager portfolio, balancing high-level strategic thinking with technical execution. The aesthetic is **Modern Minimalist with Corporate Precision**, designed to evoke a sense of reliability, systematic order, and enterprise-grade sophistication.

The interface prioritizes content clarity and data visualization, utilizing generous white space and a structured hierarchy to demonstrate the ability to navigate complex product ecosystems. It avoids decorative flourishes in favor of functional elegance, signaling a "product-first" mindset where every design choice serves the narrative of growth, scale, and user value.

## Colors

The palette is anchored in **Muted Blues and Architectural Grays**. The primary blue provides a professional focal point for actions and key metrics, while the secondary slate tones create a sophisticated, low-fatigue environment for reading long-form case studies.

- **Primary Blue:** Used for primary CTAs and active states. It is a stable, trustworthy hue that signals enterprise stability.
- **Secondary Slate:** Handles metadata, labels, and secondary supporting text.
- **Tertiary Navy:** Reserved for high-contrast typography and deep backgrounds.
- **Surface Neutrals:** A range of cool-toned whites and off-whites are used to define content areas without relying on heavy borders.

## Typography

The typography strategy pairs technical precision with modern editorial flair.

- **Headlines (Space Grotesk):** A bold, geometric sans-serif that feels engineered and futuristic. It provides the "bold accent" required to break the minimalist layout and command attention to key results.
- **Body (Roboto Flex):** Chosen for its exceptional readability in long-form B2B documentation. The variable nature allows for fine-tuning weights for optimal legibility across devices.
- **Data/Labels (JetBrains Mono):** Used for technical specifications, versioning, and performance metrics to reinforce the "Product Manager" persona’s proximity to development and data.

## Layout & Spacing

The layout follows a **Fixed-Width Systematic Grid** on desktop to ensure content remains readable and focused, transitioning to a fluid single-column stack on mobile.

- **The Grid:** A 12-column grid with a 24px gutter. Case studies should typically span 8 columns for the narrative, with a 4-column sidebar for "Quick Facts" (Role, Timeline, Tools).
- **Vertical Rhythm:** Strict adherence to a 8px baseline grid ensures that all elements—from buttons to data visualizations—feel aligned and intentional.
- **Sectioning:** Large vertical gaps (80px+) are used to clearly separate distinct projects, preventing the portfolio from feeling cluttered.

## Elevation & Depth

This design system uses **Tonal Layering and Low-Contrast Outlines** rather than heavy shadows to maintain a clean, professional aesthetic.

- **Surfaces:** Main content sits on the lightest neutral surface. Secondary information (like sidebars or "Key Takeaway" boxes) uses a slightly darker neutral tint to create subtle separation.
- **Outlines:** Use 1px solid borders in `surface-border` color for cards and input fields. This provides structure without the "mushiness" of shadows.
- **Hover States:** Subtle elevation is achieved via background color shifts (e.g., moving from a white surface to a very faint blue-gray tint) rather than a rising shadow effect.

## Shapes

The shape language is **Soft yet Structured**. A 0.25rem (4px) corner radius is applied to all interactive elements and containers. This creates a modern, accessible feel while maintaining enough "sharpness" to look professional and enterprise-ready. 

Pill shapes are reserved strictly for status indicators (e.g., "In Production", "Beta") to differentiate them from functional buttons.

## Components

### Buttons
- **Primary:** Solid `primary-color` with white text. High-contrast, no shadow, 4px rounded corners.
- **Ghost:** `primary-color` outline and text. Used for secondary actions to maintain hierarchy.

### Cards (Project Previews)
- Use a white background with a 1px `surface-border`.
- Image headers should have no padding, sitting flush against the top border.
- Text content within cards uses `headline-md` for titles and `label-sm` for categories.

### Data Chips
- Small, 4px rounded containers using a light blue tint background with `secondary-slate` text. 
- Used for listing skills (e.g., "SQL", "Agile", "User Research").

### Input Fields
- Understated style with a 1px border. Focus state changes border color to `primary-blue` and adds a subtle 2px blue "glow" (ring) with 20% opacity.

### Lists (Case Study Progression)
- Use "Technical Bullet Points"—standard bullets replaced by small, `primary-blue` square icons or JetBrains Mono numbered lists to imply a methodical process.