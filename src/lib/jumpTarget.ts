import gsap from "gsap";

// Sections fade up with GSAP (they start ~50px low and rise into place as they scroll in). A
// chip measured before that has played is lower than where it will finally rest, so add back
// whatever translate is still pending on it and its parents inside the section.
function pendingShift(el: HTMLElement, section: HTMLElement): number {
  let shift = 0;
  for (let node: HTMLElement | null = el; node && node !== section.parentElement; node = node.parentElement) {
    shift += Number(gsap.getProperty(node, "y")) || 0;
  }
  return shift;
}

// Where a jump link (#how-it-works, #faqs, #team) should land. The target is the section's chip
// (the pill above its title) when it has one, so the chip is what sits just below the navbar.
// The offset is measured from the live navbar, so it follows the screen size instead of a
// hard-coded number.
export function getJumpTarget(id: string): { el: HTMLElement; offset: number } | null {
  const section = document.getElementById(id);
  if (!section) return null;
  const el = (section.querySelector("[data-section-chip]") as HTMLElement | null) ?? section;
  const nav = document.querySelector("[data-site-navbar]") as HTMLElement | null;
  const navBottom = nav ? Math.max(nav.getBoundingClientRect().bottom, 0) : 0;
  const gap = Math.min(Math.max(window.innerHeight * 0.03, 16), 32);
  return { el, offset: -(navBottom + gap + pendingShift(el, section)) };
}
