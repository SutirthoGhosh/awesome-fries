import { useCallback, useEffect, useRef, useState } from "react";
import { SiFacebook, SiInstagram, SiWhatsapp, SiX } from "react-icons/si";
import "./index.css";

// ─── Types ───────────────────────────────────────────────────────────────────
interface WhyItemData {
  icon: string;
  title: string;
  description: string;
}

interface MenuCategoryItem {
  name: string;
  price: string;
}

interface MenuCategory {
  id: string;
  heading: string;
  emoji: string;
  image: string;
  items: MenuCategoryItem[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const MENU_CATEGORIES: MenuCategory[] = [
  {
    id: "starters",
    heading: "Starters",
    emoji: "🍟",
    image: "/assets/generated/menu-starters.dim_600x400.jpg",
    items: [
      { name: "Crispy Fries (Classic)", price: "₹60" },
      { name: "Masala Fries", price: "₹70" },
      { name: "Peri Peri Fries", price: "₹80" },
    ],
  },
  {
    id: "main",
    heading: "Main",
    emoji: "🍔",
    image: "/assets/generated/menu-loaded-fries.dim_600x400.jpg",
    items: [
      { name: "Loaded Cheese Fries", price: "₹120" },
      { name: "Awesome Burger + Fries", price: "₹150" },
      { name: "Fries Platter (Serves 2)", price: "₹200" },
    ],
  },
  {
    id: "drinks",
    heading: "Drinks",
    emoji: "🥤",
    image: "/assets/generated/menu-drinks.dim_600x400.jpg",
    items: [
      { name: "Cold Drink (Can)", price: "₹40" },
      { name: "Fresh Lime Soda", price: "₹50" },
      { name: "Mango Shake", price: "₹70" },
    ],
  },
];

const WHY_ITEMS: WhyItemData[] = [
  {
    icon: "🌿",
    title: "Fresh Ingredients",
    description:
      "We source only the freshest potatoes and spices, cooked to order every single time.",
  },
  {
    icon: "⚡",
    title: "Quick Service",
    description:
      "Hot food in minutes. We respect your time as much as your taste buds.",
  },
  {
    icon: "💰",
    title: "Affordable Pricing",
    description:
      "Premium taste at ₹60–200 per person. Delicious shouldn't break the bank.",
  },
  {
    icon: "🧼",
    title: "Hygienic Kitchen",
    description:
      "Our kitchen maintains the highest hygiene standards, certified and spotless.",
  },
];

const SOCIAL_LINKS = [
  { Icon: SiFacebook, label: "Facebook", href: "https://facebook.com" },
  { Icon: SiInstagram, label: "Instagram", href: "https://instagram.com" },
  { Icon: SiX, label: "Twitter", href: "https://x.com" },
];

// ─── Scroll Reveal Hook ───────────────────────────────────────────────────────
function useReveal() {
  const observerRef = useRef<IntersectionObserver | null>(null);

  const initReveal = useCallback(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );
    const elements = document.querySelectorAll(
      ".reveal, .reveal-left, .reveal-right",
    );
    for (const el of elements) {
      observerRef.current?.observe(el);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(initReveal, 100);
    return () => {
      clearTimeout(timer);
      observerRef.current?.disconnect();
    };
  }, [initReveal]);
}

// ─── Smooth scroll helper ────────────────────────────────────────────────────
function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

// ─── App ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  useReveal();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
      setScrolled(scrollTop > 60);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sections = ["home", "about", "menu", "why-us", "contact"];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { threshold: 0.35 },
    );
    for (const id of sections) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  const navLinks = [
    { label: "Home", href: "home" },
    { label: "Menu", href: "menu" },
    { label: "Why Us", href: "why-us" },
    { label: "Order Now", href: "contact", special: true },
    { label: "Contact", href: "contact" },
  ];

  return (
    <div
      className="dark"
      style={{
        minHeight: "100vh",
        backgroundColor: "oklch(0.09 0.005 250)",
        fontFamily: "'Poppins', sans-serif",
        // Bottom padding for sticky CTA bar on mobile
        paddingBottom: "72px",
      }}
    >
      <style>{`
        @media (min-width: 768px) {
          .page-bottom-pad { padding-bottom: 0 !important; }
          .sticky-bottom-bar { display: none !important; }
        }
        @media (max-width: 767px) {
          .page-bottom-pad { padding-bottom: 72px !important; }
        }
      `}</style>

      {/* ── Scroll Progress Bar ── */}
      <div
        className="scroll-progress"
        style={{ width: `${scrollProgress}%` }}
        data-ocid="scroll.loading_state"
      />

      {/* ── Sticky Navbar ── */}
      <nav
        className={`navbar ${scrolled ? "scrolled" : ""}`}
        data-ocid="nav.panel"
      >
        <button
          type="button"
          onClick={() => scrollTo("home")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          <span style={{ fontSize: "28px" }}>🍟</span>
          <span
            style={{
              fontWeight: 700,
              fontSize: "16px",
              color: "oklch(0.96 0.005 250)",
              letterSpacing: "-0.01em",
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            Awesome <span style={{ color: "oklch(0.82 0.145 75)" }}>Fries</span>
          </span>
        </button>

        <div
          className="nav-links"
          style={{ display: "flex", alignItems: "center", gap: "28px" }}
        >
          {navLinks.map((link) => (
            <button
              type="button"
              key={link.label}
              onClick={() => {
                setMenuOpen(false);
                scrollTo(link.href);
              }}
              className={`nav-link ${activeSection === link.href ? "active" : ""}`}
              style={
                link.special
                  ? {
                      background: "oklch(0.54 0.19 25)",
                      color: "oklch(0.98 0 0)",
                      padding: "8px 20px",
                      borderRadius: "999px",
                      fontWeight: 600,
                      fontSize: "14px",
                      transition: "all 0.2s",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "'Poppins', sans-serif",
                    }
                  : {
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "'Poppins', sans-serif",
                    }
              }
              data-ocid={`nav.${link.label.toLowerCase().replace(" ", "_")}.link`}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Hamburger */}
        <button
          type="button"
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
          data-ocid="nav.toggle"
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* ── Info Strip ── */}
      <div
        style={{
          position: "sticky",
          top: "64px",
          zIndex: 90,
          background: "oklch(0.28 0.14 25)",
          borderBottom: "1px solid oklch(0.4 0.15 25 / 0.5)",
          padding: "8px 16px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "20px",
          flexWrap: "wrap",
        }}
        data-ocid="info.strip.panel"
      >
        <span
          style={{
            fontSize: "13px",
            color: "oklch(0.97 0.02 80)",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          📍 1091 Barrackpore Road, Arifbari, Nabapally, Barasat
        </span>
        <span style={{ color: "oklch(0.6 0.1 25)", fontSize: "12px" }}>•</span>
        <span
          style={{
            fontSize: "13px",
            color: "oklch(0.97 0.02 80)",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          🕐 Open: 11am – 11pm Daily
        </span>
        <span style={{ color: "oklch(0.6 0.1 25)", fontSize: "12px" }}>•</span>
        <a
          href="tel:09073639433"
          style={{
            fontSize: "13px",
            color: "oklch(0.95 0.15 80)",
            fontWeight: 700,
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
          data-ocid="info.phone.link"
        >
          📞 09073639433
        </a>
      </div>

      {/* ── Mobile Menu ── */}
      <div
        className={`mobile-menu ${menuOpen ? "open" : ""}`}
        data-ocid="nav.modal"
      >
        <button
          type="button"
          onClick={() => setMenuOpen(false)}
          style={{
            position: "absolute",
            top: 24,
            right: 24,
            background: "none",
            border: "none",
            color: "oklch(0.96 0.005 250)",
            fontSize: 28,
            cursor: "pointer",
          }}
          data-ocid="nav.close_button"
        >
          ✕
        </button>
        {navLinks.map((link) => (
          <button
            type="button"
            key={link.label}
            onClick={() => {
              setMenuOpen(false);
              scrollTo(link.href);
            }}
            style={{
              background: "none",
              border: "none",
              fontSize: "24px",
              fontWeight: 600,
              color: "oklch(0.96 0.005 250)",
              cursor: "pointer",
              fontFamily: "'Poppins', sans-serif",
            }}
            data-ocid={`nav.mobile.${link.label.toLowerCase().replace(" ", "_")}.link`}
          >
            {link.label}
          </button>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════════════ */}
      <section
        id="home"
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
          padding: "120px 24px 80px",
        }}
      >
        {/* Ambient glows */}
        <div className="hero-glow-red" style={{ top: "10%", left: "-5%" }} />
        <div
          className="hero-glow-gold"
          style={{ bottom: "20%", right: "5%" }}
        />

        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            width: "100%",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "48px",
            alignItems: "center",
          }}
          className="hero-grid"
        >
          {/* Left: Text */}
          <div>
            <div className="reveal" style={{ marginBottom: "16px" }}>
              <span className="section-label">Barasat's #1 Fries Spot</span>
            </div>

            <h1
              className="reveal"
              style={{
                fontSize: "clamp(48px, 7vw, 80px)",
                fontWeight: 900,
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                color: "oklch(0.96 0.005 250)",
                marginBottom: "8px",
              }}
            >
              Crispy.
            </h1>
            <h1
              className="reveal reveal-delay-1"
              style={{
                fontSize: "clamp(48px, 7vw, 80px)",
                fontWeight: 900,
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                marginBottom: "8px",
              }}
            >
              <span className="text-gradient-gold">Golden.</span>
            </h1>
            <h1
              className="reveal reveal-delay-2"
              style={{
                fontSize: "clamp(48px, 7vw, 80px)",
                fontWeight: 900,
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                color: "oklch(0.96 0.005 250)",
                marginBottom: "28px",
              }}
            >
              Awesome.
            </h1>

            <p
              className="reveal reveal-delay-3"
              style={{
                fontSize: "clamp(16px, 2vw, 20px)",
                fontWeight: 600,
                color: "oklch(0.82 0.145 75)",
                marginBottom: "12px",
              }}
            >
              Barasat's Favorite Fries Spot
            </p>
            <p
              className="reveal reveal-delay-3"
              style={{
                fontSize: "15px",
                color: "oklch(0.72 0.018 250)",
                maxWidth: 440,
                lineHeight: 1.7,
                marginBottom: "36px",
              }}
            >
              Experience the crispiest fries in West Bengal. Made fresh, served
              hot, right here on Barrackpore Road.
            </p>

            <div
              className="reveal reveal-delay-4"
              style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}
            >
              <button
                type="button"
                onClick={() => scrollTo("menu")}
                className="btn-primary"
                data-ocid="hero.primary_button"
              >
                🍟 View Our Menu
              </button>
              <a
                href="tel:09073639433"
                className="btn-secondary btn-pulse-anim"
                style={{
                  minHeight: "56px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  textDecoration: "none",
                }}
                data-ocid="hero.call.primary_button"
              >
                📞 Call to Order
              </a>
            </div>

            <div
              className="reveal"
              style={{
                display: "flex",
                gap: "24px",
                marginTop: "48px",
                flexWrap: "wrap",
              }}
            >
              {["Dine-in", "Drive-through", "Delivery"].map((s) => (
                <div
                  key={s}
                  style={{
                    fontSize: "13px",
                    color: "oklch(0.72 0.018 250)",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <span style={{ color: "oklch(0.82 0.145 75)" }}>✓</span> {s}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Image */}
          <div
            className="reveal"
            style={{
              position: "relative",
              borderRadius: "20px",
              overflow: "hidden",
            }}
          >
            <img
              src="/assets/generated/fries-hero.dim_800x600.jpg"
              alt="Crispy Golden Fries at Awesome Fries Barasat"
              className="hero-image-float"
              style={{
                width: "100%",
                maxWidth: "520px",
                height: "380px",
                objectFit: "cover",
                display: "block",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, oklch(0.09 0.005 250 / 0.3) 0%, transparent 60%)",
              }}
            />
            {/* Price badge */}
            <div
              style={{
                position: "absolute",
                bottom: 20,
                left: 20,
                background: "oklch(0.13 0.008 260 / 0.85)",
                backdropFilter: "blur(12px)",
                border: "1px solid oklch(0.22 0.012 255 / 0.6)",
                borderRadius: "12px",
                padding: "10px 16px",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  color: "oklch(0.72 0.018 250)",
                  marginBottom: "2px",
                }}
              >
                Starting from
              </div>
              <div
                style={{
                  fontSize: "22px",
                  fontWeight: 700,
                  color: "oklch(0.82 0.145 75)",
                }}
              >
                ₹60
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .hero-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>

      {/* ═══════════════════════════════════════════════════
          TRUST BADGE
      ═══════════════════════════════════════════════════ */}
      <div
        style={{
          background:
            "linear-gradient(135deg, oklch(0.82 0.16 80), oklch(0.75 0.18 65))",
          padding: "18px 24px",
          textAlign: "center",
        }}
        data-ocid="trust.banner.panel"
      >
        <p
          style={{
            fontSize: "clamp(15px, 2.5vw, 20px)",
            fontWeight: 800,
            color: "oklch(0.18 0.04 50)",
            letterSpacing: "0.01em",
            margin: 0,
          }}
        >
          ⭐ Family Favorite in Barasat — Serving Happiness Since Day One ⭐
        </p>
        <p
          style={{
            fontSize: "13px",
            color: "oklch(0.28 0.05 50)",
            margin: "4px 0 0",
            fontWeight: 500,
          }}
        >
          Hundreds of happy customers • Fresh daily • Made with love
        </p>
      </div>

      {/* ═══════════════════════════════════════════════════
          ABOUT SECTION
      ═══════════════════════════════════════════════════ */}
      <section
        id="about"
        style={{ padding: "100px 24px", position: "relative" }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "64px",
              alignItems: "center",
            }}
            className="about-grid"
          >
            {/* Left: Text */}
            <div>
              <div className="reveal">
                <span className="section-label">Our Story</span>
              </div>
              <h2
                className="reveal"
                style={{
                  fontSize: "clamp(28px, 4vw, 44px)",
                  fontWeight: 800,
                  lineHeight: 1.15,
                  marginBottom: "20px",
                  letterSpacing: "-0.02em",
                }}
              >
                Crafted with <span className="text-gradient-gold">Passion</span>
                , Served with Pride
              </h2>
              <div className="section-divider" style={{ margin: "0 0 24px" }} />
              <p
                className="reveal"
                style={{
                  fontSize: "14px",
                  color: "oklch(0.72 0.018 250)",
                  lineHeight: 1.8,
                  marginBottom: "20px",
                }}
              >
                Awesome Fries has been serving Barasat's crunchiest, most
                flavorful fries since day one. Located at the heart of
                Barrackpore Road, we bring you the best fast-food experience at
                pocket-friendly prices.
              </p>
              <p
                className="reveal"
                style={{
                  fontSize: "14px",
                  color: "oklch(0.72 0.018 250)",
                  lineHeight: 1.8,
                  marginBottom: "32px",
                }}
              >
                Every fry is made fresh with premium ingredients, cooked to
                golden perfection. Come hungry, leave happy — that's the Awesome
                Fries promise.
              </p>
              <div
                className="reveal"
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <div
                  style={{
                    background: "oklch(0.82 0.145 75 / 0.12)",
                    border: "1px solid oklch(0.82 0.145 75 / 0.35)",
                    borderRadius: "10px",
                    padding: "10px 18px",
                    fontSize: "13px",
                    color: "oklch(0.82 0.145 75)",
                    fontWeight: 600,
                  }}
                >
                  ₹60 – ₹200 per person
                </div>
                <div
                  style={{
                    background: "oklch(0.54 0.19 25 / 0.12)",
                    border: "1px solid oklch(0.54 0.19 25 / 0.35)",
                    borderRadius: "10px",
                    padding: "10px 18px",
                    fontSize: "13px",
                    color: "oklch(0.75 0.15 25)",
                    fontWeight: 600,
                  }}
                >
                  Open Daily 11am–11pm
                </div>
              </div>
            </div>

            {/* Right: Service Badges */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              {[
                {
                  icon: "🍽️",
                  title: "Dine-In",
                  desc: "Enjoy your fries fresh at our cozy in-house seating",
                },
                {
                  icon: "🚗",
                  title: "Drive-Through",
                  desc: "Grab your order without leaving the comfort of your car",
                },
                {
                  icon: "📦",
                  title: "No-Contact Delivery",
                  desc: "Safe, fast delivery straight to your door",
                },
              ].map((item, i) => (
                <div
                  key={item.title}
                  className={`service-badge reveal reveal-delay-${i + 1}`}
                >
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      background: "oklch(0.54 0.19 25 / 0.15)",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "26px",
                      flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: "15px",
                        marginBottom: "4px",
                      }}
                    >
                      {item.title}
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        color: "oklch(0.72 0.018 250)",
                      }}
                    >
                      {item.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .about-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          }
        `}</style>
      </section>

      {/* ═══════════════════════════════════════════════════
          MENU SECTION — REDESIGNED
      ═══════════════════════════════════════════════════ */}
      <section
        id="menu"
        style={{
          padding: "80px 0 100px",
          background: "oklch(0.11 0.006 255 / 0.5)",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "800px",
            height: "400px",
            background:
              "radial-gradient(ellipse, oklch(0.54 0.19 25 / 0.06) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 20px" }}>
          <div
            className="reveal"
            style={{ textAlign: "center", marginBottom: "56px" }}
          >
            <span className="section-label">What We Serve</span>
            <h2
              style={{
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                marginBottom: "16px",
              }}
            >
              Our Legendary <span className="text-gradient-red">Menu</span>
            </h2>
            <div className="section-divider" />
            <p
              style={{
                fontSize: "14px",
                color: "oklch(0.72 0.018 250)",
                maxWidth: 480,
                margin: "0 auto",
              }}
            >
              Every item crafted with care, served piping hot, and priced to
              keep you coming back.
            </p>
          </div>

          {/* Category Sections */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "56px" }}
          >
            {MENU_CATEGORIES.map((cat, ci) => (
              <div
                key={cat.id}
                className="reveal"
                data-ocid={`menu.${cat.id}.panel`}
                style={{
                  background: "oklch(0.13 0.008 260)",
                  borderRadius: "20px",
                  overflow: "hidden",
                  border: "1px solid oklch(0.22 0.012 255 / 0.5)",
                }}
              >
                {/* Category Image */}
                <div
                  style={{
                    position: "relative",
                    height: "clamp(160px, 30vw, 240px)",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={cat.image}
                    alt={cat.heading}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(to top, oklch(0.13 0.008 260) 0%, oklch(0.13 0.008 260 / 0.3) 60%, transparent 100%)",
                    }}
                  />
                  {/* Category heading overlaid on image */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: 20,
                      left: 24,
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <span style={{ fontSize: "36px" }}>{cat.emoji}</span>
                    <h3
                      style={{
                        fontSize: "clamp(26px, 5vw, 36px)",
                        fontWeight: 900,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        color: "oklch(0.92 0.16 80)",
                        margin: 0,
                        lineHeight: 1,
                        textShadow: "0 2px 12px oklch(0 0 0 / 0.6)",
                      }}
                    >
                      {cat.heading}
                    </h3>
                  </div>
                </div>

                {/* Items list */}
                <div style={{ padding: "8px 24px 24px" }}>
                  {cat.items.map((item, ii) => (
                    <div
                      key={item.name}
                      data-ocid={`menu.${cat.id}.item.${ii + 1}`}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "16px 0",
                        borderBottom:
                          ii < cat.items.length - 1
                            ? "1px solid oklch(0.22 0.012 255 / 0.4)"
                            : "none",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "clamp(16px, 3vw, 20px)",
                          fontWeight: 600,
                          color: "oklch(0.93 0.01 250)",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {item.name}
                      </span>
                      <span
                        style={{
                          fontSize: "clamp(17px, 3vw, 22px)",
                          fontWeight: 800,
                          color: "oklch(0.82 0.16 80)",
                          flexShrink: 0,
                          marginLeft: "16px",
                          background: "oklch(0.82 0.16 80 / 0.1)",
                          border: "1px solid oklch(0.82 0.16 80 / 0.3)",
                          borderRadius: "8px",
                          padding: "4px 12px",
                        }}
                      >
                        {item.price}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA inside card */}
                <div style={{ padding: "0 24px 24px" }}>
                  <a
                    href="tel:09073639433"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      minHeight: "52px",
                      background:
                        ci === 0
                          ? "oklch(0.54 0.19 25)"
                          : "oklch(0.54 0.19 25 / 0.15)",
                      border: "1px solid oklch(0.54 0.19 25 / 0.7)",
                      borderRadius: "12px",
                      color:
                        ci === 0 ? "oklch(0.98 0 0)" : "oklch(0.75 0.15 25)",
                      fontWeight: 700,
                      fontSize: "15px",
                      textDecoration: "none",
                      transition: "all 0.2s",
                      cursor: "pointer",
                    }}
                    data-ocid={`menu.${cat.id}.call.primary_button`}
                  >
                    📞 Call to Order This
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          WHY CHOOSE US SECTION
      ═══════════════════════════════════════════════════ */}
      <section
        id="why-us"
        style={{ padding: "100px 24px", position: "relative" }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div
            className="reveal"
            style={{ textAlign: "center", marginBottom: "60px" }}
          >
            <span className="section-label">Our Promise</span>
            <h2
              style={{
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                marginBottom: "16px",
              }}
            >
              Why <span className="text-gradient-gold">Awesome Fries?</span>
            </h2>
            <div className="section-divider" />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "24px",
            }}
            className="why-grid"
          >
            {WHY_ITEMS.map((item, i) => (
              <div
                key={item.title}
                className={`why-card reveal reveal-delay-${i + 1}`}
                data-ocid={`why.item.${i + 1}`}
              >
                <span className="why-icon">{item.icon}</span>
                <h3
                  style={{
                    fontSize: "17px",
                    fontWeight: 700,
                    marginBottom: "12px",
                    color: "oklch(0.96 0.005 250)",
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    fontSize: "13px",
                    color: "oklch(0.72 0.018 250)",
                    lineHeight: 1.7,
                  }}
                >
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <style>{`
          @media (max-width: 1024px) {
            .why-grid { grid-template-columns: repeat(2, 1fr) !important; }
          }
          @media (max-width: 520px) {
            .why-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>

      {/* ═══════════════════════════════════════════════════
          CONTACT & ORDER SECTION
      ═══════════════════════════════════════════════════ */}
      <section
        id="contact"
        style={{
          padding: "100px 24px",
          background: "oklch(0.11 0.006 255 / 0.5)",
          position: "relative",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div
            className="reveal"
            style={{ textAlign: "center", marginBottom: "60px" }}
          >
            <span className="section-label">Visit Us</span>
            <h2
              style={{
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                marginBottom: "16px",
              }}
            >
              Find Us &amp; <span className="text-gradient-red">Order Now</span>
            </h2>
            <div className="section-divider" />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1.3fr 1fr",
              gap: "24px",
              alignItems: "stretch",
            }}
            className="contact-grid"
          >
            {/* Left: Contact Info */}
            <div className="contact-card reveal-left">
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  marginBottom: "28px",
                  color: "oklch(0.82 0.145 75)",
                }}
              >
                📍 Contact Info
              </h3>

              {[
                {
                  icon: "📍",
                  label: "Address",
                  value:
                    "1091 Barrackpore Road, Arifbari, Nabapally, Barasat, West Bengal 700126",
                  link: undefined as string | undefined,
                },
                {
                  icon: "📞",
                  label: "Phone",
                  value: "09073639433",
                  link: "tel:09073639433",
                },
                {
                  icon: "🕐",
                  label: "Hours",
                  value: "Mon–Sun: 11:00 AM – 11:00 PM",
                  link: undefined as string | undefined,
                },
                {
                  icon: "💰",
                  label: "Price Range",
                  value: "₹60–200 per person",
                  link: undefined as string | undefined,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    display: "flex",
                    gap: "12px",
                    marginBottom: "20px",
                    paddingBottom: "20px",
                    borderBottom: "1px solid oklch(0.22 0.012 255 / 0.4)",
                  }}
                >
                  <span
                    style={{
                      fontSize: "20px",
                      flexShrink: 0,
                      marginTop: "2px",
                    }}
                  >
                    {item.icon}
                  </span>
                  <div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "oklch(0.55 0.015 250)",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        marginBottom: "3px",
                      }}
                    >
                      {item.label}
                    </div>
                    {item.link ? (
                      <a
                        href={item.link}
                        style={{
                          fontSize: "14px",
                          color: "oklch(0.82 0.145 75)",
                          fontWeight: 600,
                          textDecoration: "none",
                        }}
                      >
                        {item.value}
                      </a>
                    ) : (
                      <div
                        style={{
                          fontSize: "14px",
                          color: "oklch(0.82 0.005 250)",
                          fontWeight: 500,
                        }}
                      >
                        {item.value}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Big tappable call buttons */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  marginTop: "8px",
                }}
              >
                <a
                  href="tel:09073639433"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    minHeight: "56px",
                    background: "oklch(0.54 0.19 25)",
                    borderRadius: "12px",
                    color: "oklch(0.98 0 0)",
                    fontWeight: 700,
                    fontSize: "16px",
                    textDecoration: "none",
                    transition: "all 0.2s",
                  }}
                  data-ocid="contact.call.primary_button"
                >
                  📞 Call Now
                </a>
                <a
                  href="https://wa.me/919073639433"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    minHeight: "56px",
                    background: "oklch(0.5 0.17 148)",
                    borderRadius: "12px",
                    color: "oklch(0.98 0 0)",
                    fontWeight: 700,
                    fontSize: "16px",
                    textDecoration: "none",
                    transition: "all 0.2s",
                  }}
                  data-ocid="contact.whatsapp.primary_button"
                >
                  <SiWhatsapp size={18} /> WhatsApp
                </a>
              </div>
            </div>

            {/* Center: Map */}
            <div className="reveal" style={{ minHeight: 360 }}>
              <div
                className="map-frame"
                style={{ height: "100%", minHeight: 360 }}
              >
                <iframe
                  title="Awesome Fries Location Map"
                  src="https://www.google.com/maps?q=1091+Barrackpore+Road+Arifbari+Nabapally+Barasat+West+Bengal+700126&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: "none", minHeight: 360, display: "block" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            {/* Right: Order CTA */}
            <div
              className="contact-card reveal-right"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ fontSize: "52px", marginBottom: "16px" }}>🍟</div>
              <h3
                style={{
                  fontSize: "24px",
                  fontWeight: 800,
                  marginBottom: "10px",
                  color: "oklch(0.96 0.005 250)",
                }}
              >
                Ready to Order?
              </h3>
              <p
                style={{
                  fontSize: "13px",
                  color: "oklch(0.72 0.018 250)",
                  marginBottom: "32px",
                  lineHeight: 1.6,
                }}
              >
                Craving crispy golden fries? Give us a call or come right in!
              </p>

              <a
                href="tel:09073639433"
                className="btn-primary btn-pulse-anim"
                style={{
                  width: "100%",
                  justifyContent: "center",
                  marginBottom: "12px",
                  fontSize: "16px",
                  padding: "14px 24px",
                  minHeight: "56px",
                  display: "flex",
                  alignItems: "center",
                  textDecoration: "none",
                }}
                data-ocid="contact.call2.primary_button"
              >
                📞 Call to Order
              </a>

              <a
                href="https://wa.me/919073639433"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: "100%",
                  justifyContent: "center",
                  marginBottom: "12px",
                  fontSize: "15px",
                  padding: "14px 24px",
                  minHeight: "56px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "oklch(0.5 0.17 148)",
                  borderRadius: "12px",
                  color: "oklch(0.98 0 0)",
                  fontWeight: 700,
                  textDecoration: "none",
                }}
                data-ocid="contact.whatsapp2.primary_button"
              >
                <SiWhatsapp size={18} /> WhatsApp Us
              </a>

              <a
                href="https://maps.app.goo.gl/734fQC9LMLFjkP8s7"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
                style={{
                  width: "100%",
                  justifyContent: "center",
                  marginBottom: "12px",
                  display: "flex",
                  alignItems: "center",
                  textDecoration: "none",
                  minHeight: "48px",
                }}
                data-ocid="contact.directions.secondary_button"
              >
                🗺️ Get Directions
              </a>

              <button
                type="button"
                onClick={() => scrollTo("menu")}
                className="btn-secondary"
                style={{
                  width: "100%",
                  justifyContent: "center",
                  color: "oklch(0.75 0.15 25)",
                  borderColor: "oklch(0.54 0.19 25 / 0.6)",
                  minHeight: "48px",
                  display: "flex",
                  alignItems: "center",
                }}
                data-ocid="contact.menu.secondary_button"
              >
                🍟 View Full Menu
              </button>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 1024px) {
            .contact-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>

      {/* ═══════════════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════════════ */}
      <footer
        style={{
          background: "oklch(0.08 0.005 255)",
          borderTop: "1px solid oklch(0.22 0.012 255 / 0.4)",
          padding: "60px 24px 24px",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.5fr 1fr 1fr",
              gap: "48px",
              marginBottom: "48px",
            }}
            className="footer-grid"
          >
            {/* Brand */}
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "16px",
                }}
              >
                <span style={{ fontSize: "32px" }}>🍟</span>
                <span
                  style={{
                    fontWeight: 800,
                    fontSize: "20px",
                    color: "oklch(0.96 0.005 250)",
                  }}
                >
                  Awesome{" "}
                  <span style={{ color: "oklch(0.82 0.145 75)" }}>Fries</span>
                </span>
              </div>
              <p
                style={{
                  fontSize: "13px",
                  color: "oklch(0.72 0.018 250)",
                  lineHeight: 1.7,
                  maxWidth: 280,
                  marginBottom: "20px",
                }}
              >
                Barasat's favorite fries spot. Crispy, golden, and absolutely
                awesome — served fresh every day.
              </p>
              <a
                href="tel:09073639433"
                style={{
                  fontSize: "14px",
                  color: "oklch(0.82 0.145 75)",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
                data-ocid="footer.phone.link"
              >
                📞 09073639433
              </a>
            </div>

            {/* Links */}
            <div>
              <h4
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  marginBottom: "20px",
                  color: "oklch(0.96 0.005 250)",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                Quick Links
              </h4>
              {[
                { label: "Home", href: "home" },
                { label: "Our Menu", href: "menu" },
                { label: "Why Us", href: "why-us" },
                { label: "Contact & Order", href: "contact" },
              ].map((link) => (
                <button
                  type="button"
                  key={link.label}
                  onClick={() => scrollTo(link.href)}
                  style={{
                    display: "block",
                    fontSize: "14px",
                    color: "oklch(0.72 0.018 250)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    marginBottom: "10px",
                    transition: "color 0.2s",
                    textAlign: "left",
                    padding: 0,
                    fontFamily: "'Poppins', sans-serif",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "oklch(0.82 0.145 75)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "oklch(0.72 0.018 250)";
                  }}
                  data-ocid={`footer.${link.label.toLowerCase().replace(/ & ?/g, "_")}.link`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Hours & Social */}
            <div>
              <h4
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  marginBottom: "20px",
                  color: "oklch(0.96 0.005 250)",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                Hours & Social
              </h4>
              <div
                style={{
                  fontSize: "14px",
                  color: "oklch(0.72 0.018 250)",
                  marginBottom: "6px",
                }}
              >
                🕐 Mon–Sun
              </div>
              <div
                style={{
                  fontSize: "15px",
                  fontWeight: 700,
                  color: "oklch(0.82 0.145 75)",
                  marginBottom: "20px",
                }}
              >
                11:00 AM – 11:00 PM
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                {SOCIAL_LINKS.map(({ Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "8px",
                      background: "oklch(0.18 0.01 255)",
                      border: "1px solid oklch(0.25 0.012 255)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "oklch(0.72 0.018 250)",
                      transition: "all 0.2s",
                      textDecoration: "none",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color =
                        "oklch(0.82 0.145 75)";
                      (e.currentTarget as HTMLAnchorElement).style.borderColor =
                        "oklch(0.82 0.145 75 / 0.5)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color =
                        "oklch(0.72 0.018 250)";
                      (e.currentTarget as HTMLAnchorElement).style.borderColor =
                        "oklch(0.25 0.012 255)";
                    }}
                    data-ocid={`footer.${label.toLowerCase()}.link`}
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div
            style={{
              borderTop: "1px solid oklch(0.18 0.01 255)",
              paddingTop: "24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px",
            }}
            className="footer-bottom"
          >
            <p style={{ fontSize: "12px", color: "oklch(0.55 0.015 250)" }}>
              © {new Date().getFullYear()} Awesome Fries. All rights reserved.
            </p>
            <p style={{ fontSize: "12px", color: "oklch(0.45 0.012 250)" }}>
              Built with ❤️ using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "oklch(0.65 0.015 250)",
                  textDecoration: "none",
                }}
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .footer-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
            .footer-bottom { flex-direction: column; text-align: center; }
          }
        `}</style>
      </footer>

      {/* ═══════════════════════════════════════════════════
          STICKY BOTTOM CTA BAR (mobile only)
      ═══════════════════════════════════════════════════ */}
      <div
        className="sticky-bottom-bar"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 200,
          background: "oklch(0.1 0.007 255)",
          borderTop: "1px solid oklch(0.25 0.012 255 / 0.7)",
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          height: "64px",
        }}
        data-ocid="sticky.cta.panel"
      >
        <a
          href="tel:09073639433"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "3px",
            minHeight: "56px",
            color: "oklch(0.96 0.005 250)",
            fontWeight: 700,
            fontSize: "11px",
            textDecoration: "none",
            borderRight: "1px solid oklch(0.22 0.012 255 / 0.5)",
          }}
          data-ocid="sticky.call.primary_button"
        >
          <span style={{ fontSize: "22px" }}>📞</span>
          Call Now
        </a>
        <a
          href="https://wa.me/919073639433"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "3px",
            minHeight: "56px",
            color: "oklch(0.85 0.15 148)",
            fontWeight: 700,
            fontSize: "11px",
            textDecoration: "none",
            borderRight: "1px solid oklch(0.22 0.012 255 / 0.5)",
          }}
          data-ocid="sticky.whatsapp.primary_button"
        >
          <SiWhatsapp size={22} />
          WhatsApp
        </a>
        <button
          type="button"
          onClick={() => scrollTo("menu")}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "3px",
            minHeight: "56px",
            color: "oklch(0.98 0 0)",
            fontWeight: 700,
            fontSize: "11px",
            background: "oklch(0.54 0.19 25)",
            border: "none",
            cursor: "pointer",
            fontFamily: "'Poppins', sans-serif",
          }}
          data-ocid="sticky.order.primary_button"
        >
          <span style={{ fontSize: "22px" }}>🛒</span>
          Order Now
        </button>
      </div>
    </div>
  );
}
