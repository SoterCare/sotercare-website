"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const NAV = [
  { key: "how-it-works", href: "#how-it-works", label: "How it works" },
  { key: "faqs", href: "#faqs", label: "FAQs" },
  { key: "team", href: "#team", label: "Team" },
  { key: "community", href: "/community", label: "Community" },
  { key: "news", href: "/news", label: "News" },
];

const Navbar = () => {
  const pathname = usePathname();
  const home = pathname === "/" ? "" : "/";
  const [isOpen, setIsOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [section, setSection] = useState<string | null>(null);

  // Which nav item is current: the page for /community and /news, otherwise (on the home page)
  // the section nearest the middle of the screen.
  const active =
    pathname.startsWith("/community") ? "community"
    : pathname.startsWith("/news") ? "news"
    : pathname === "/" ? section
    : null;

  useEffect(() => {
    if (pathname !== "/") return;
    const ids = ["how-it-works", "faqs", "team"];
    const update = () => {
      const mid = window.innerHeight * 0.4;
      let current: string | null = null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top <= mid && r.bottom > mid) current = id;
      }
      setSection(current);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [pathname]);
  const videoActiveRef = useRef(false); // Use ref so scroll handler sees latest state
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      // If video is active, hide nav ONLY when scrolled to the very bottom
      if (videoActiveRef.current) {
        const isNearBottom =
          window.innerHeight + scrollY >= document.documentElement.scrollHeight - 50;
        setIsHidden(isNearBottom);
      } else {
        setIsHidden(false);
      }
    };

    handleScroll(); // Check on initial mount
    window.addEventListener("scroll", handleScroll);

    const handleVideoStart = () => {
      videoActiveRef.current = true;
      setIsOpen(false); // Close mobile menu if open
      handleScroll(); // Check immediately
    };

    const handleVideoEnd = () => {
      videoActiveRef.current = false;
      handleScroll(); // Check immediately
    };

    window.addEventListener("video-view-start", handleVideoStart);
    window.addEventListener("video-view-end", handleVideoEnd);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("video-view-start", handleVideoStart);
      window.removeEventListener("video-view-end", handleVideoEnd);
    };
  }, []);

  useGSAP(() => {
    gsap.fromTo(
      navRef.current,
      {
        width: "85%", // Initial "Longer" state
        maxWidth: "1280px",
      },
      {
        width: "95%", // Mobile default basically, or constrained desktop
        maxWidth: "1080px", // Shorter state, wide enough for the full link set
        duration: 0.5,
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: document.body,
          start: "+=300",
          end: "+=390",
          scrub: 1, // Adds standard easing to catch up with the scroll
        },
      },
    );
  }, []);

  return (
    <nav
      ref={navRef}
      data-site-navbar
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isHidden ? "-translate-y-[150%]" : "translate-y-0"
        }`}
    >
      <div
        className="rounded-[1.5rem] px-6 py-4 flex justify-between items-center relative z-50 shadow-lg bg-bg-card shadow-m border border-white/10"
      >
        {/* Logo */}
        <div className="flex-shrink-0 flex items-center">
          <Link href={`${home}#`} className="flex items-center gap-2" scroll={false}>
            <Image
              src="/assets/SoterCare-Primary-logo-brandblue.webp"
              alt="SoterCare - smart care monitoring for care homes"
              width={0}
              height={0}
              sizes="180px"
              className="h-12 w-auto object-contain transition-opacity duration-700 ease-in-out"
              style={{ width: "auto", height: "48px" }}
              priority
            />
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {NAV.map(({ key, href, label }) => (
            <Link
              key={key}
              href={href.startsWith("#") ? `${home}${href}` : href}
              scroll={false}
              aria-current={active === key ? "page" : undefined}
              className={`relative py-1 transition-colors text-base font-medium ${active === key ? "text-black" : key === "news" ? "text-[#3d7e93] hover:text-black" : "text-[#797979] hover:text-black"}`}
            >
              {key === "news" ? <span className="news-heartbeat">{label}</span> : label}
              <span
                aria-hidden
                className={`absolute left-1/2 -bottom-1 h-[3px] -translate-x-1/2 rounded-full bg-[#3d7e93] transition-all duration-300 ${active === key ? "w-5 opacity-100" : "w-0 opacity-0"}`}
              />
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden md:flex items-center">
          <button
            onClick={() => window.dispatchEvent(new Event("open-contact-popup"))}
            className="px-6 py-2 rounded-[1rem] font-bold text-base transition-all hover:scale-105 active:scale-95 bg-bg-card shadow-m text-text"
          >
            Book a demo
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            className="p-2 transition-transform active:scale-95 text-[#797979] hover:text-black"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <div
        className={`absolute top-full mt-2 left-0 w-full bg-bg-card shadow-m border border-white/10 rounded-[2rem] p-6 flex flex-col gap-4 overflow-hidden transition-all duration-300 origin-top ${isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-4 pointer-events-none"}`}
      >
        {NAV.map(({ key, href, label }) => (
          <Link
            key={key}
            href={href.startsWith("#") ? `${home}${href}` : href}
            scroll={false}
            aria-current={active === key ? "page" : undefined}
            onClick={() => setIsOpen(false)}
            className={`hover:text-text hover:bg-black/5 px-4 py-3 rounded-xl transition-all font-medium text-lg text-center ${active === key ? "bg-black/5 text-text font-bold" : key === "news" ? "text-[#3d7e93]" : "text-text-muted"}`}
          >
            <span className="inline-flex items-center gap-2">
              {active === key && <span aria-hidden className="h-2 w-2 rounded-full bg-[#3d7e93]" />}
              {key === "news" ? <span className="news-heartbeat">{label}</span> : label}
            </span>
          </Link>
        ))}
        <button
          className="bg-bg-panel shadow-m text-text px-6 py-3 rounded-xl font-bold text-lg text-center mt-2 transition-all active:scale-95"
          onClick={() => {
            setIsOpen(false);
            window.dispatchEvent(new Event("open-contact-popup"));
          }}
        >
          Book a demo
        </button>
      </div>

    </nav>
  );

};

export default Navbar;
