"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import { Menu, X, ChevronDown, Search, MapPin } from "lucide-react";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import ConsultationModal from "@/components/common/ConsultationModal";

/*
  Brand palette
  Espresso Brown #593719 | Warm Gold #C18A35 | Ivory Cream #F7F3ED
  Soft Beige #E8DED0     | Charcoal #292622  | White #FFFFFF

  Logo has WHITE lettering -> bar sits on Charcoal.
  Gold = interactive accent. Ivory/Beige = dropdown + drawer surfaces.
*/

// How long (ms) before the consultation popup appears (once per session).
const CONSULTATION_DELAY = 8000;
// Small delay before a dropdown closes, so a slightly off mouse path doesn't kill it.
const DROPDOWN_CLOSE_DELAY = 140;

const navLinks = [
  {
    name: "Design Ideas",
    href: "/services/design-ideas",
    submenu: [
      { name: "Living Room Designs", href: "/services/design-ideas/living-room-design" },
      { name: "Kids Room Designs", href: "/services/design-ideas/kids-room-design" },
      { name: "Modular Kitchen Designs", href: "/services/design-ideas/kitchen-design-ideas" },
      { name: "Mandir Designs", href: "/services/design-ideas/mandir-design" },
      { name: "Dining Room Designs", href: "/services/design-ideas/dining-room-design" },
      { name: "Bedroom Designs", href: "/services/design-ideas/bedroom-design" },
      { name: "Bathroom Designs", href: "/services/design-ideas/bathroom-design" },
      { name: "Home Office Design", href: "/services/design-ideas/home-office-design" },
      { name: "Balcony & Terrace Designs", href: "/services/design-ideas/balcony-terrace-design" },
    ],
  },
  {
    name: "Modular Kitchen",
    href: "/kitchen-design",
    submenu: [
      { name: "Modular Kitchens", href: "/kitchen-design" },
      { name: "Kitchen Cost Calculator", href: "/kitchen-calculator" },
    ],
  },
  {
    name: "Wardrobes",
    href: "/services/wardrobes",
    submenu: [
      { name: "Custom Wardrobe", href: "/services/wardrobes" },
      { name: "Wardrobe Cost Calculator", href: "/wardrobe-calculator" },
    ],
  },
  { name: "Portfolio", href: "/portfolio" },
  { name: "Contact", href: "/contact" },
  { name: "Blog", href: "/blog" },
  // { name: "About", href: "/about" },
];

// Shortcuts shown under the search box
const quickLinks = [
  { name: "Modular Kitchen", href: "/kitchen-design" },
  { name: "Wardrobes", href: "/services/wardrobes" },
  { name: "Living Room", href: "/services/design-ideas/living-room-design" },
  { name: "Bedroom", href: "/services/design-ideas/bedroom-design" },
  { name: "Mandir", href: "/services/design-ideas/mandir-design" },
  { name: "Cost Calculator", href: "/kitchen-calculator" },
];

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C18A35] focus-visible:ring-offset-2 focus-visible:ring-offset-[#292622]";

const iconBtn = `flex h-10 w-10 items-center justify-center rounded-full border border-[#F7F3ED]/20 text-[#F7F3ED] transition-colors hover:border-[#C18A35] hover:text-[#C18A35] ${focusRing}`;

/* Dark-theme search pill */
function SearchBox({ onSearch, autoFocus = false, light = false }) {
  const [q, setQ] = useState("");
  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        if (q.trim()) onSearch?.(q.trim());
      }}
      className={`flex h-11 w-full items-center gap-2 rounded-full border pl-4 pr-1 transition-colors focus-within:border-[#C18A35] ${
        light
          ? "border-[#E8DED0] bg-white"
          : "border-[#F7F3ED]/25 bg-[#F7F3ED]/10 focus-within:bg-[#F7F3ED]/15"
      }`}
    >
      <input
        type="search"
        value={q}
        autoFocus={autoFocus}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search kitchens, wardrobes, rooms..."
        aria-label="Search designs"
        className={`min-w-0 flex-1 bg-transparent text-[14px] focus:outline-none ${
          light
            ? "text-[#292622] placeholder:text-[#292622]/50"
            : "text-[#F7F3ED] placeholder:text-[#F7F3ED]/55"
        }`}
      />
      <button
        type="submit"
        aria-label="Search"
        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#C18A35] text-[#292622] transition-colors hover:bg-[#593719] hover:text-[#F7F3ED]"
      >
        <Search size={16} />
      </button>
    </form>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const headerRef = useRef(null);
  const closeTimer = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showConsultationModal, setShowConsultationModal] = useState(false);
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState({});
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);

  const isActive = (item) =>
    pathname === item.href ||
    (item.href !== "/" && pathname?.startsWith(item.href + "/")) ||
    item.submenu?.some((s) => pathname === s.href);

  /* ── dropdown hover-intent ── */
  const openDropdown = (name) => {
    clearTimeout(closeTimer.current);
    setActiveDropdown(name);
  };
  const scheduleClose = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setActiveDropdown(null), DROPDOWN_CLOSE_DELAY);
  };
  useEffect(() => () => clearTimeout(closeTimer.current), []);

  /* ── scroll: bar stays pinned; it just shrinks + gains a shadow ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── consultation popup: once per session ── */
  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("consultationShown") === "1";
    } catch {}
    if (seen) return;
    const timer = setTimeout(() => {
      setShowConsultationModal(true);
      try {
        sessionStorage.setItem("consultationShown", "1");
      } catch {}
    }, CONSULTATION_DELAY);
    return () => clearTimeout(timer);
  }, []);

  /* ── lock body scroll while drawer is open ── */
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  /* ── ESC closes everything ── */
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setActiveDropdown(null);
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  /* ── click outside header closes search + dropdowns ── */
  useEffect(() => {
    const onDown = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setSearchOpen(false);
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  /* ── close everything on route change ── */
  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
    setSearchOpen(false);
  }, [pathname]);

  // NOTE: needs a /search page that reads ?q= . Change this line if your search lives elsewhere.
  const handleSearch = useCallback(
    (query) => {
      setSearchOpen(false);
      setIsOpen(false);
      router.push(`/search?q=${encodeURIComponent(query)}`);
    },
    [router]
  );

  const toggleMobileSubmenu = (name) =>
    setMobileSubmenuOpen((prev) => ({ ...prev, [name]: !prev[name] }));

  return (
    <MotionConfig reducedMotion="user">
      {/* ───────────── HEADER ───────────── */}
      <header
        ref={headerRef}
        className={`sticky top-0 z-40 w-full border-b transition-[background-color,box-shadow] duration-300 ${
          scrolled
            ? "bg-[#292622]/95 backdrop-blur-md border-[#C18A35]/30 shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
            : "bg-[#292622] border-[#C18A35]/15"
        }`}
      >
        <div className="mx-auto max-w-[1680px] px-4 sm:px-6 xl:px-12">
          <div
            className={`flex items-center justify-between gap-3 transition-[height] duration-300 ${
              scrolled ? "h-16 lg:h-[72px]" : "h-[72px] lg:h-20"
            }`}
          >
            {/* LOGO */}
            <Link
              href="/"
              aria-label="Divine Interio – home"
              className={`flex-shrink-0 lg:mr-6 xl:mr-12 rounded-sm transition-opacity hover:opacity-90 ${focusRing}`}
            >
              <Image
                src="/divine_logo_trimmed.png"
                alt="Divine Interio"
                width={804}
                height={253}
                priority
                className={`w-auto object-contain transition-all duration-300 ${
                  scrolled ? "h-9 sm:h-10 lg:h-11" : "h-10 sm:h-11 lg:h-12"
                }`}
              />
            </Link>

            {/* DESKTOP NAV */}
            <nav aria-label="Main" className="hidden lg:flex flex-1 items-center justify-center min-w-0">
              <ul className="flex items-center gap-0.5 xl:gap-1">
                {navLinks.map((item) => {
                  const active = isActive(item);
                  const open = activeDropdown === item.name;
                  const wide = item.submenu && item.submenu.length > 5;

                  return (
                    <li
                      key={item.name}
                      className="relative"
                      onMouseEnter={() => (item.submenu ? openDropdown(item.name) : setActiveDropdown(null))}
                      onMouseLeave={() => item.submenu && scheduleClose()}
                      onBlur={(e) => {
                        if (!e.currentTarget.contains(e.relatedTarget)) setActiveDropdown(null);
                      }}
                    >
                      <Link
                        href={item.href}
                        aria-haspopup={item.submenu ? "true" : undefined}
                        aria-expanded={item.submenu ? open : undefined}
                        onFocus={() => item.submenu && openDropdown(item.name)}
                        onKeyDown={(e) => {
                          if (item.submenu && e.key === "ArrowDown") {
                            e.preventDefault();
                            openDropdown(item.name);
                            e.currentTarget.parentElement?.querySelector("ul a")?.focus();
                          }
                        }}
                        className={`group relative flex items-center gap-1 whitespace-nowrap rounded-sm px-2.5 py-2 xl:px-3.5 text-[13px] xl:text-sm font-medium transition-colors duration-200 ${focusRing} ${
                          active || open ? "text-[#C18A35]" : "text-[#F7F3ED]/85 hover:text-[#C18A35]"
                        }`}
                      >
                        {item.name}
                        {item.submenu && (
                          <ChevronDown
                            size={14}
                            className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                          />
                        )}
                        <span
                          className={`absolute inset-x-2.5 xl:inset-x-3.5 -bottom-0.5 h-0.5 origin-left bg-[#C18A35] transition-transform duration-300 ${
                            active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                          }`}
                        />
                      </Link>

                      <AnimatePresence>
                        {item.submenu && open && (
                          <motion.div
                            initial={{ opacity: 0, y: -12, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.98, transition: { duration: 0.12 } }}
                            transition={{ type: "spring", stiffness: 420, damping: 30, mass: 0.7 }}
                            style={{ transformOrigin: "top left" }}
                            className="absolute left-0 top-full z-50 pt-3"
                          >
                            <div
                              className={`relative overflow-hidden rounded-md border border-[#E8DED0] bg-[#F7F3ED] shadow-[0_20px_40px_rgba(41,38,34,0.25)] ${
                                wide ? "w-[480px]" : "w-[250px]"
                              }`}
                            >
                              {/* gold bar sweeps in from the left */}
                              <motion.div
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: 0.35, ease: "easeOut" }}
                                style={{ transformOrigin: "left" }}
                                className="h-[3px] bg-[#C18A35]"
                              />
                              <ul className={`p-2 ${wide ? "grid grid-cols-2 gap-x-1" : ""}`}>
                                {item.submenu.map((sub, idx) => {
                                  const subActive = pathname === sub.href;
                                  return (
                                    <motion.li
                                      key={sub.name}
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ duration: 0.22, delay: 0.05 + idx * 0.035, ease: "easeOut" }}
                                    >
                                      <Link
                                        href={sub.href}
                                        className={`group/sub flex items-center justify-between rounded px-3.5 py-2.5 text-[13px] transition-all duration-200 hover:pl-5 focus-visible:outline-none focus-visible:bg-[#E8DED0] ${
                                          subActive
                                            ? "bg-[#E8DED0] font-semibold text-[#593719]"
                                            : "text-[#292622] hover:bg-[#E8DED0] hover:text-[#593719]"
                                        }`}
                                      >
                                        {sub.name}
                                        <span className="h-1.5 w-1.5 rounded-full bg-[#C18A35] opacity-0 scale-0 transition-all duration-200 group-hover/sub:opacity-100 group-hover/sub:scale-100" />
                                      </Link>
                                    </motion.li>
                                  );
                                })}
                              </ul>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* DESKTOP ACTIONS */}
            <div className="hidden lg:flex items-center gap-2 xl:gap-3 flex-shrink-0">
              <button
                type="button"
                onClick={() => {
                  setSearchOpen((v) => !v);
                  setActiveDropdown(null);
                }}
                aria-label={searchOpen ? "Close search" : "Open search"}
                aria-expanded={searchOpen}
                className={`${iconBtn} ${searchOpen ? "!border-[#C18A35] !text-[#C18A35]" : ""}`}
              >
                {searchOpen ? <X size={18} /> : <Search size={18} />}
              </button>

              <Link href="/locations" aria-label="Our locations" className={iconBtn}>
                <MapPin size={18} />
              </Link>

              <button
                type="button"
                onClick={() => setShowConsultationModal(true)}
                className={`whitespace-nowrap rounded-sm bg-[#C18A35] px-5 xl:px-6 py-2.5 text-[13px] font-semibold tracking-wide text-[#292622] transition-all duration-300 hover:bg-[#F7F3ED] hover:shadow-lg ${focusRing}`}
              >
                Book consultation
              </button>
            </div>

            {/* MOBILE / TABLET ACTIONS: primary CTA stays visible */}
            <div className="lg:hidden flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowConsultationModal(true)}
                className={`whitespace-nowrap rounded-sm bg-[#C18A35] px-3.5 h-10 text-[13px] font-semibold text-[#292622] transition-colors hover:bg-[#F7F3ED] ${focusRing}`}
              >
                Book now
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(true)}
                aria-label="Open menu"
                aria-expanded={isOpen}
                className={iconBtn}
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* DESKTOP SEARCH PANEL */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="hidden lg:block overflow-hidden border-t border-[#F7F3ED]/10 bg-[#292622]"
            >
              <div className="mx-auto max-w-2xl px-6 pt-4 pb-5">
                <SearchBox onSearch={handleSearch} autoFocus />
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="text-[12px] text-[#F7F3ED]/60">Popular:</span>
                  {quickLinks.map((l) => (
                    <Link
                      key={l.name}
                      href={l.href}
                      className="rounded-full border border-[#F7F3ED]/20 px-3 py-1 text-[12px] text-[#F7F3ED]/85 transition-colors hover:border-[#C18A35] hover:text-[#C18A35] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C18A35]"
                    >
                      {l.name}
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TABLET SEARCH ROW (sm–md) */}
        <div className="hidden sm:block lg:hidden border-t border-[#F7F3ED]/10 px-6 py-3">
          <SearchBox onSearch={handleSearch} />
        </div>
      </header>

      {/* ───────────── MOBILE DRAWER (outside <header> so blur/transform can't break `fixed`) ───────────── */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-[#292622]/70 backdrop-blur-[2px] lg:hidden"
              aria-hidden="true"
            />

            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label="Site menu"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed right-0 top-0 z-50 flex h-[100dvh] w-[88vw] max-w-[360px] flex-col bg-[#F7F3ED] shadow-2xl lg:hidden"
            >
              <div className="flex h-[72px] flex-shrink-0 items-center justify-between bg-[#292622] px-4">
                <Image
                  src="/divine_logo_trimmed.png"
                  alt="Divine Interio"
                  width={804}
                  height={253}
                  className="h-9 w-auto object-contain"
                />
                <button
                  type="button"
                  autoFocus
                  onClick={() => setIsOpen(false)}
                  aria-label="Close menu"
                  className={iconBtn}
                >
                  <X size={20} />
                </button>
              </div>
              <div className="h-[3px] flex-shrink-0 bg-[#C18A35]" />

              <div className="flex-1 overflow-y-auto">
                {/* Search lives in the drawer so phones have it too */}
                <div className="px-4 pt-4 sm:hidden">
                  <SearchBox onSearch={handleSearch} light />
                </div>

                <nav aria-label="Mobile" className="px-3 py-3">
                  <ul className="flex flex-col">
                    {navLinks.map((item) => {
                      const active = isActive(item);
                      const expanded = !!mobileSubmenuOpen[item.name];

                      return (
                        <li key={item.name} className="border-b border-[#E8DED0]">
                          <div className="flex items-center">
                            <Link
                              href={item.href}
                              onClick={() => setIsOpen(false)}
                              className={`flex min-h-[52px] flex-1 items-center px-3 text-[15px] font-medium transition-colors ${
                                active ? "text-[#593719]" : "text-[#292622] hover:text-[#593719]"
                              }`}
                            >
                              {active && <span className="mr-2.5 h-5 w-[3px] rounded-full bg-[#C18A35]" />}
                              {item.name}
                            </Link>

                            {item.submenu && (
                              <button
                                type="button"
                                onClick={() => toggleMobileSubmenu(item.name)}
                                aria-label={`${expanded ? "Collapse" : "Expand"} ${item.name} submenu`}
                                aria-expanded={expanded}
                                className="flex h-11 w-11 items-center justify-center rounded-full text-[#593719] transition-colors hover:bg-[#E8DED0]"
                              >
                                <ChevronDown
                                  size={18}
                                  className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
                                />
                              </button>
                            )}
                          </div>

                          <AnimatePresence initial={false}>
                            {item.submenu && expanded && (
                              <motion.ul
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="mb-3 ml-3 overflow-hidden border-l-2 border-[#C18A35]/60 pl-2"
                              >
                                {item.submenu.map((sub) => (
                                  <li key={sub.name}>
                                    <Link
                                      href={sub.href}
                                      onClick={() => setIsOpen(false)}
                                      className={`flex min-h-[44px] items-center rounded px-3 text-[14px] transition-colors hover:bg-[#E8DED0] hover:text-[#593719] ${
                                        pathname === sub.href ? "font-semibold text-[#593719]" : "text-[#292622]/80"
                                      }`}
                                    >
                                      {sub.name}
                                    </Link>
                                  </li>
                                ))}
                              </motion.ul>
                            )}
                          </AnimatePresence>
                        </li>
                      );
                    })}

                    <li>
                      <Link
                        href="/locations"
                        onClick={() => setIsOpen(false)}
                        className="flex min-h-[52px] items-center gap-2.5 px-3 text-[15px] font-medium text-[#292622] transition-colors hover:text-[#593719]"
                      >
                        <MapPin size={18} className="text-[#C18A35]" />
                        Find a showroom
                      </Link>
                    </li>
                  </ul>
                </nav>
              </div>

              <div className="flex-shrink-0 border-t border-[#E8DED0] bg-[#F7F3ED] p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                <button
                  type="button"
                  onClick={() => {
                    setShowConsultationModal(true);
                    setIsOpen(false);
                  }}
                  className="flex min-h-[48px] w-full items-center justify-center rounded-sm bg-[#593719] text-[14px] font-semibold tracking-wide text-[#F7F3ED] transition-colors hover:bg-[#C18A35] hover:text-[#292622] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C18A35] focus-visible:ring-offset-2"
                >
                  Book free consultation
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <ConsultationModal
        isOpen={showConsultationModal}
        onClose={() => setShowConsultationModal(false)}
      />
    </MotionConfig>
  );
}