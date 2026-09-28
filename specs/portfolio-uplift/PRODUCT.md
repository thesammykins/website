# Portfolio uplift

## Summary

Improve loading, responsiveness, accessible navigation and motion across Samantha
Myers' six-page portfolio, then refresh the visual presentation and publish an
agent-readable profile. Performance, navigation, component/accessibility repairs,
dependency fixes and agent-readable content are authorized. New personal facts
and the broader visual direction still await owner review.

## Visual references

The existing mint, monospace, square-edged portfolio remains the starting point.
The first editorial/card-portrait concepts were rejected: they lost the site's
character. Preserve oversized typography, atmospheric pixel portraits, technical
readouts and the tactical grid. Do not implement those rejected layouts.
New desktop variants: https://ampcode.com/user-content/attachments/716e8899f8b1a29e3ece7bd877918dfaeb3684ad4accd848d1b821076f8283b4-file.png
New mobile variants: https://ampcode.com/user-content/attachments/64dae3882b494762c65c53d9a6fa1a27b00ca93bb4d5e94d77afda4655961ccb-file.png
These are exploratory references, not approved layouts or verified accessibility.

## Behavior

1. Home, About, Experience, Skills, Projects and Contact keep their routes and
   remain readable and navigable while decorative resources load or fail.
2. Performance work preserves the existing photographs and page composition.
   Smaller WebP derivatives are allowed; replacement photographs are deferred.
   No new framework or backend is required.
3. Pixel portraits retain their block geometry, color treatment and edge fades.
   Animation pace is consistent across refresh rates, without large jumps after
   returning to a background tab. Invisible decoration does not animate.
4. OS reduced-motion preference stops canvas motion as well as CSS motion,
   including live preference changes. Do not add a visible motion button or a
   site-specific stored override. Static artwork remains visible. Normal-mode
   decorative introductions settle within four seconds; switching preferences
   must not restart a completed introduction or duplicate drawing loops.
5. Keyboard users can bypass navigation, see focus, open and close the mobile
   navigation, and never focus links in a closed drawer. Escape closes the drawer
   and restores focus to its trigger. Resizing does not strand focus or scroll lock.
6. Light and dark themes remain available. Text, controls and focus indicators
   target WCAG 2.2 AA contrast; pages reflow at 320 CSS pixels without hiding
   essential information. Automated scores alone do not establish conformance.
7. Nonessential autoplay is brief rather than continuous. Removing decoration
   must not remove unique information. Functional hover/focus transitions remain.
8. Contact clearly explains that its action opens the visitor's email application,
   rather than claiming to deliver a message. Invalid fields have linked errors
   and focus moves to the first invalid field. No new message service is introduced.
9. Biography, role, employment dates, availability and professional metrics agree
   across pages. Unconfirmed facts are not invented or silently updated. Content
   review dates refer to real reviews, not merely a new build.
10. `/llms.txt` serves concise Markdown with Samantha's name, a factual summary,
    relevant profile/work/contact links and guidance distinguishing past work from
    current status. It follows the published llms.txt proposal, avoids fabricated
    endorsements or instructions to override agents' rules, and makes no promise
    of universal agent support. Reuse existing supported facts; new personal facts
    require owner confirmation. Do not call the current biography independently verified.
11. Shared visual treatments stay consistent across all six pages. The redesign
    retains the site's recognizable typography and palette while prioritizing
    legibility, clear hierarchy and fewer simultaneous decorative effects.

## Open questions

- Which visual direction should be developed beyond the comparison?
- What current role/availability, headline and professional metrics should the
  site publish? Removed the conflicting 10+ ticker claim and aligned Ferocia
  wording to the dated history, but the remaining 14+ claim needs confirmation.
- Is the Jamf credential still active, and are contact response-time commitments
  and listed projects still accurate?

## Image derivatives

The original `public/hero-*.png` files remain the sources. WebP derivatives retain
their dimensions and are generated with ImageMagick, for example:
`magick tasty-trappist/public/hero-home.png -quality 82 tasty-trappist/public/hero-home.webp`.
Regenerate the matching derivative when changing a photograph. Inspect it in the
rendered pixel portrait before shipping; this is lossy encoding, not a new image.
