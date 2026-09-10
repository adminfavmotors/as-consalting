# A.S. Consulting — automotive revision

## Reference study

Inspected the live Polish home pages of [Audi](https://www.audi.pl/pl/) and [Porsche](https://www.porsche.com/poland/) on 10 September 2026, including screenshots and rendered heading styles.

- Audi: plain sans-serif AudiType heading at weight 400, compact navigation, full-width automotive imagery and short functional calls to action.
- Porsche: Porsche Next at weight 400, large direct headlines over photographic/video backgrounds, strong scale difference between main image and supporting content.
- These observations informed the composition and restraint. Proprietary fonts, logos, photographs and source code were not copied.

## Implemented direction

- Saira regular for headings: upright, restrained technical letterforms. Barlow for readable body copy and controls. Font files and OFL licences are local.
- White `#ffffff`, graphite `#171a1e`, dark steel `#121519`, cool grey `#f1f2f3`. Secondary text `#5d636b`; dark-section text `#f5f6f7` / `#b7bdc5`.
- Full-width automotive-detail hero, with a scrim solely for text readability. No floating experience badge, serif quotation, ornamental monogram, coloured italic text, ambient circles or entrance choreography.
- Compact typographic wordmark; direct service navigation below the hero. Open columns for the service overview; a single dedicated section explaining the development programme.
- About page uses actual career dates and roles. Clients page uses factual rows of organisation, project and period instead of a decorative card wall.
- Page titles and copy describe the actual service. Decorative numbered section labels have been removed; numbers remain where they identify a service or a process step.
- Functional contact composer, FAQ, relative links, keyboard focus and mobile menu retained. All nine content pages and the 404 page use the revised styles.
- Responsive breakpoints: 1150, 900, 640 and 370px. Reduced-motion preferences disable transitions and smooth scrolling.

## Skill application

Used frontend-design and ui-ux-pro-max. The automotive query supported a full-width hero and darker technical palette. Its generic animation-heavy and monospaced recommendations were not adopted because this is an independent B2B consultancy and the user explicitly requested less generic styling.

## Assets and verification

`automotive-original.png` is an illustrative generated image, inspected before use. It does not depict a customer's actual car or premises. WebP variants at 960 and 1600px and a JPEG fallback ship with the site.

The previous editorial version is archived in `archive/editorial-v1.zip`. Old assets are retained in the archive rather than loaded by the current site.

Offline checks cover all page links, assets, metadata, form labels, ARIA references and CSS token contrast. Browser preview of `file://` was blocked by the browser URL policy. No workaround and no local HTTP server were used; visual and interactive checks await the separately requested server setup.
