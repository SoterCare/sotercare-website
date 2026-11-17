"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

const IN_MS = 300;
const OUT_MS = 420;
const MIN_COVER_MS = 650; // the logo is always seen for at least this long
const EASE = "cubic-bezier(0.65, 0, 0.35, 1)";

// Brand-blue panel with the logo that drops down over the screen the moment a link to another
// page is clicked, then drops away once the new page has painted. Hash-only links (#faqs,
// #team) and modified clicks (new tab, etc.) are left alone, so those stay plain jumps.
//
// Uses the Web Animations API (runs on the compositor, so a busy main thread can't delay the
// start) and starts the route change at the same moment as the slide-in, so the page is usually
// ready by the time the panel has covered the screen.
export default function PageTransition() {
  const pathname = usePathname();
  const router = useRouter();
  const panelRef = useRef<HTMLDivElement>(null);
  const lastPathRef = useRef(pathname);
  const activeRef = useRef(false); // a transition is in progress
  const coveredRef = useRef(false); // panel fully over the screen
  const arrivedRef = useRef(false); // new route has committed
  const startedAtRef = useRef(0);
  const fallbackRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cover = (animate: boolean) => {
    const panel = panelRef.current;
    if (!panel) return;
    activeRef.current = true;
    coveredRef.current = !animate;
    arrivedRef.current = false;
    startedAtRef.current = performance.now();
    panel.style.visibility = "visible";
    if (!animate) {
      panel.style.transform = "translateY(0)";
    } else {
      const anim = panel.animate(
        [{ transform: "translateY(-100%)" }, { transform: "translateY(0)" }],
        { duration: IN_MS, easing: EASE, fill: "forwards" },
      );
      anim.onfinish = () => {
        panel.style.transform = "translateY(0)";
        anim.cancel();
        coveredRef.current = true;
        if (arrivedRef.current) void reveal();
      };
    }
    // Never leave the screen covered if navigation stalls.
    if (fallbackRef.current) clearTimeout(fallbackRef.current);
    fallbackRef.current = setTimeout(() => {
      arrivedRef.current = true;
      if (coveredRef.current) void reveal();
    }, 6000);
  };

  // Resolves once the page behind the panel has painted: two frames, fonts, and the images in
  // the first screen (lazy ones are skipped, they haven't started loading). Capped at 0.8s so a slow image can't hold the panel up.
  const whenPageReady = async () => {
    const frame = () => new Promise<void>((r) => requestAnimationFrame(() => r()));
    await frame();
    await frame();
    const imgs = Array.from(document.images).filter((img) => {
      const rect = img.getBoundingClientRect();
      return rect.top < window.innerHeight && rect.bottom > 0 && !img.complete && img.loading !== "lazy";
    });
    const settle = Promise.all([
      document.fonts?.ready ?? Promise.resolve(),
      ...imgs.map((img) => img.decode().catch(() => undefined)),
    ]);
    await Promise.race([settle, new Promise((r) => setTimeout(r, 800))]);
    await frame();
  };

  const reveal = async () => {
    const panel = panelRef.current;
    if (!activeRef.current || !panel) return;
    activeRef.current = false;
    coveredRef.current = false;
    arrivedRef.current = false;
    if (fallbackRef.current) clearTimeout(fallbackRef.current);

    await whenPageReady();
    const shown = performance.now() - startedAtRef.current;
    if (shown < MIN_COVER_MS) await new Promise((r) => setTimeout(r, MIN_COVER_MS - shown));

    const anim = panel.animate(
      [{ transform: "translateY(0)" }, { transform: "translateY(100%)" }],
      { duration: OUT_MS, easing: EASE, fill: "forwards" },
    );
    anim.onfinish = () => {
      panel.style.visibility = "hidden";
      panel.style.transform = "translateY(-100%)";
      anim.cancel();
    };
  };

  // New page has arrived.
  useEffect(() => {
    lastPathRef.current = pathname;
    if (!activeRef.current) return;
    arrivedRef.current = true;
    if (coveredRef.current) void reveal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || (a.target && a.target !== "_self") || a.hasAttribute("download")) return;

      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return; // same page / hash jump
      if (activeRef.current) return;

      e.preventDefault();
      e.stopPropagation(); // keep next/link from navigating on its own
      cover(true);
      router.push(url.pathname + url.search + url.hash);
    };

    // Back/forward buttons: cover instantly, the new route's effect then reveals it.
    const onPop = () => {
      if (activeRef.current || window.location.pathname === lastPathRef.current) return;
      cover(false);
    };

    // Capture phase: runs before next/link's own handler, which would otherwise navigate first.
    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPop);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPop);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <div
      ref={panelRef}
      aria-hidden
      className="fixed inset-0 z-[2147483647] flex items-center justify-center pointer-events-none"
      style={{
        background: "#a0cbdb",
        transform: "translateY(-100%)",
        visibility: "hidden",
        willChange: "transform",
      }}
    >
      <Image
        src="/assets/SoterCare-Primary-logo-brandblue.webp"
        alt=""
        width={0}
        height={0}
        sizes="240px"
        priority
        className="h-14 sm:h-16 w-auto object-contain"
        style={{ width: "auto" }}
      />
    </div>
  );
}
