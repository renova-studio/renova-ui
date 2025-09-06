import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTransition } from "../context/TransitionContext";
import EmailIcon from "@mui/icons-material/Email";
import InstagramIcon from "@mui/icons-material/Instagram";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import juniperHero from "../assets/projects/juniper-a (4).jpg";
import mcKnightHero from "../assets/projects/mcknight-a (1).png";
import juniperImage1 from "../assets/projects/juniper-a (4).jpg";
import juniperImage2 from "../assets/projects/juniper-b (3).jpg";
import juniperImage3 from "../assets/projects/juniper-a (1).jpg";
import juniperImage4 from "../assets/projects/juniper-b (4).jpg";
import Logo from "../assets/logo.svg?react";

interface Project {
  id: string;
  number: string;
  title: string;
  image: string;
  image360: string;
  description: string;
  variants?: { [key: string]: string[] };
}
interface HomeProps {
  projects: Project[];
}

const Home: React.FC<HomeProps> = ({ projects }) => {
  const [headerTextColor, setHeaderTextColor] = useState("text-white");
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { startTransition } = useTransition();

  // Set these to your actual section IDs and desired colors
  const SECTION_IDS = ["hero", "about", "portfolio", "process", "contact"] as const;
  const COLOR_BY_ID: Record<(typeof SECTION_IDS)[number], string> = {
    hero: "text-white",
    about: "text-primary",
    portfolio: "text-white",
    process: "text-primary",
    contact: "text-white",
  };

  const HEADER_OFFSET_PX = 40; // e.g., 72 if you have a fixed header

  useEffect(() => {
    let sections: Array<{ id: string; top: number }> = [];
    let resizeTimer: number | undefined;

    const computeSectionTops = () => {
      sections = SECTION_IDS.map((id) => {
        const el = document.getElementById(id);
        const top =
          el?.getBoundingClientRect().top != null
            ? Math.round(el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET_PX)
            : Number.POSITIVE_INFINITY;
        return { id, top };
      }).sort((a, b) => a.top - b.top);
    };

    const onResize = () => {
      // Debounce recompute to avoid thrashing during resize
      if (resizeTimer) window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        computeSectionTops();
        onScroll(); // update color immediately after recompute
      }, 120);
    };

    const onScroll = () => {
      const y = window.scrollY;
      // find the last section whose top is <= y
      let currentId = SECTION_IDS[0];
      for (let i = 0; i < sections.length; i++) {
        if (y >= sections[i].top) currentId = sections[i].id as typeof currentId;
        else break;
      }
      setHeaderTextColor(COLOR_BY_ID[currentId] ?? "text-white");
    };

    // initial compute + initial paint
    computeSectionTops();
    onScroll();

    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("orientationchange", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      if (resizeTimer) window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const handleViewProject = (projectId: string, e: React.MouseEvent) => {
    e.preventDefault();
    startTransition("in", () => navigate(`/portfolio/${projectId}`));
  };

  const scrollToSection = (
    id: string,
    {
      offset = 0,
      duration = 700,
      easing = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
      updateHash = true,
    } = {}
  ) => {
    const el = document.getElementById(id);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const startY = window.scrollY || window.pageYOffset;
    const targetY = startY + rect.top - offset;
    const startTime = performance.now();
    const htmlEl = document.documentElement;
    const prev = htmlEl.style.scrollBehavior;
    htmlEl.style.scrollBehavior = "auto";
    const step = (now: number) => {
      const p = Math.min((now - startTime) / duration, 1);
      const y = startY + (targetY - startY) * easing(p);
      window.scrollTo(0, y);
      if (p < 1) requestAnimationFrame(step);
      else {
        htmlEl.style.scrollBehavior = prev;
        if (updateHash) {
          const url = new URL(window.location.href);
          url.hash = id;
          history.replaceState({}, "", url.toString());
        }
      }
    };
    requestAnimationFrame(step);
  };

  const location = useLocation();
  useEffect(() => {
    const st = (location.state as any)?.scrollTo;
    if (st === "portfolio") {
      requestAnimationFrame(() =>
        scrollToSection("portfolio", {
          offset: 0,
          duration: 900,
          updateHash: false,
        })
      );
      navigate(".", { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  return (
    <div className="text-primary">
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div
          className={`mx-auto p-2 md:p-4 lg:p-8 flex items-center justify-between ${headerTextColor}`}
        >
          <Logo fill="currentColor" className="h-8 w-auto shrink-0" />
          {/* Desktop Nav */}
          <nav className="hidden sm:flex items-center gap-x-6">
            {/* <a
              href="/our-vision"
              onClick={(e) => {
                e.preventDefault();
                startTransition("in", () => {
                  navigate("/our-vision");
                });
              }}
              className="text-xs sm:text-sm font-sans uppercase tracking-wider"
            >
              Our Mission
            </a> */}
            <a
              href="#/portfolio"
              className="text-xs sm:text-sm font-sans uppercase tracking-wider"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("portfolio", { offset: 0, duration: 800 });
              }}
            >
              Portfolio
            </a>
            <a
              href="materials"
              className="text-xs sm:text-sm font-sans uppercase tracking-wider"
              onClick={(e) => {
                e.preventDefault();
                startTransition("out", () => navigate("/materials"));
              }}
            >
              Materials
            </a>
            <button
              className="text-xs sm:text-sm font-sans uppercase tracking-wider"
              onClick={() => scrollToSection("contact")}
            >
              Contact
            </button>
          </nav>

          {/* Mobile Hamburger */}
          <button
            className="sm:hidden inline-flex items-center justify-center rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
          {/* Mobile Menu (smooth slide + fade, always mounted for exit animation) */}
          <div
            aria-hidden={!mobileOpen}
            className={`sm:hidden fixed inset-0 z-40 transition-[opacity,backdrop-filter] duration-[360ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${mobileOpen
              ? "opacity-100 backdrop-blur-[2px]"
              : "opacity-0 pointer-events-none backdrop-blur-0"
              }`}
          >
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setMobileOpen(false)}
            />
            <div
              className={`absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-xl p-6 flex flex-col gap-4 will-change-transform transform transition-transform duration-[360ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${mobileOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
              <div className="flex items-center justify-between mb-2 text-primary">
                <span className="font-title text-2xl">Renova</span>
                <button
                  aria-label="Close menu"
                  onClick={() => setMobileOpen(false)}
                  className="p-2"
                >
                  <CloseIcon />
                </button>
              </div>
              {/* <a
                href="#/our-vision"
                className="py-2 text-sm uppercase tracking-wider text-primary"
                onClick={() => setMobileOpen(false)}
              >
                Our Mission
              </a> */}
              <a
                href="#/portfolio"
                className="py-2 text-sm uppercase tracking-wider text-primary"
                onClick={(e) => {
                  e.preventDefault();
                  setMobileOpen(false);
                  scrollToSection("portfolio", { offset: 0, duration: 800 });
                }}
              >
                Portfolio
              </a>
              <a
                href="materials"
                className="py-2 text-sm uppercase tracking-wider text-primary"
                onClick={(e) => {
                  e.preventDefault();
                  setMobileOpen(false);
                  startTransition("out", () => navigate("/materials"));
                }}
              >
                Materials
              </a>
              <button
                className="py-2 text-sm uppercase tracking-wider text-primary text-left"
                onClick={() => {
                  setMobileOpen(false);
                  scrollToSection("contact");
                }}
              >
                Contact
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section id={`${SECTION_IDS[0]}`} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url("${juniperHero}")`,
              filter: "brightness(0.5) contrast(1.1)",
            }}
          />
        </div>
        <div className="relative text-white w-full">
          <div className="mx-auto container px-6 sm:px-8 py-24 sm:py-32 md:py-40">
            <h1 className="font-title leading-tight text-center select-none text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl">
              RENOVA
            </h1>
            <p className="mt-6 text-base sm:text-lg md:text-xl font-sans text-center opacity-95">
              We craft virtual experiences that align with your vision —
            </p>
            <p className="mt-2 text-base sm:text-lg md:text-xl font-sans text-center opacity-95">
              turning your imagination into immersive realities.
            </p>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id={`${SECTION_IDS[1]}`} className="relative bg-base-200 min-h-screen flex items-center">
        <div className="mx-auto container px-10 sm:px-20 lg:px-16 xl:px-0 py-16 sm:py-20 md:py-24 w-full">
          <div className="grid gap-10 md:grid-cols-12 md:gap-16 items-center">
            <div className="md:col-span-5">
              <h2 className="text-4xl sm:text-2xl md:text-3xl font-tiempos font-normal text-primary pb-6 md:pb-8 leading-tight">
                <span className="block font-title uppercase">
                  Building Spaces,
                </span>
                <span className="block text-right font-title uppercase">
                  Shaping Stories
                </span>
              </h2>
              <p className="text-base font-sans text-neutral leading-relaxed max-w-prose pb-6 md:pb-8">
                At Renova, we believe that architectural visualization is not
                just about how a space looks — it's about how it makes you feel.
                We approach each project as a layered composition of light,
                form, and purpose, where clarity meets quiet beauty.
              </p>
              <button className="group text-primary uppercase tracking-wider text-xs sm:text-sm font-sans hover:text-accent transition-all duration-300 inline-flex items-center gap-2 border-b border-primary pb-1">
                LEARN MORE
                <ArrowForwardIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
            <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
              <div className="grid gap-4 md:gap-6">
                <div className="relative overflow-hidden shadow-sm">
                  <img
                    src={juniperImage1}
                    alt="Interior design project"
                    className="w-full h-full object-cover aspect-[4/5] md:aspect-[3/4] hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
              <div className="grid gap-4 md:gap-6">
                <div className="relative overflow-hidden shadow-sm">
                  <img
                    src={juniperImage2}
                    alt="Interior design project"
                    className="w-full h-full object-cover aspect-[16/10] sm:aspect-[4/3] hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="relative overflow-hidden shadow-sm">
                  <img
                    src={juniperImage4}
                    alt="Interior design project"
                    className="w-full h-full object-cover aspect-[16/10] sm:aspect-[4/3] hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="relative overflow-hidden shadow-sm">
                  <img
                    src={juniperImage3}
                    alt="Interior design project"
                    className="w-full h-full object-cover aspect-[16/10] sm:aspect-[4/3] hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PORTFOLIO */}
      <section id={`${SECTION_IDS[2]}`}
        className="relative bg-base-200 min-h-screen flex items-center"
      >
        <div className="mx-auto container px-10 sm:px-10 lg:px-16 xl:px-0 py-16 sm:py-20 md:py-24 w-full">
          <div className="absolute inset-0">
            <div
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url("${mcKnightHero}")`,
                filter: "brightness(0.5) contrast(1.1)",
              }}
            />
          </div>
          <div className="w-full">
            <div className="absolute inset-0 -z-10">
              <div
                className="w-full h-full bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url("${mcKnightHero}")`,
                  filter: "brightness(0.6) contrast(1.1)",
                }}
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
              <div className="text-white self-center z-10">
                <div className="text-sm sm:text-md font-sans uppercase tracking-wider text-gray-300 mb-3 sm:mb-4">
                  PORTFOLIO
                </div>
                <h2 className="font-tiempos font-normal leading-tight mb-6 sm:mb-8">
                  <span className="block font-title text-4xl sm:text-5xl md:">
                    Design that
                  </span>
                  <span className="block font-title uppercase text-5xl sm:text-6xl md:text-7xl">
                    Resonates
                  </span>
                </h2>
                <p className="text-base sm:text-lg font-sans text-gray-200/90 leading-relaxed max-w-prose mb-8 sm:mb-12">
                  Discover how we transform your designs into immersive,
                  emotionally engaging experiences.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 self-center">
                {projects.slice(0, 4).map((project, index) => (
                  <article
                    key={project.id}
                    className="bg-white/95 backdrop-blur-sm shadow-lg cursor-pointer transition-transform duration-500 hover:scale-[1.02] p-4"
                    onClick={(e) => handleViewProject(project.id, e)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="text-xs sm:text-sm font-sans text-gray-600">
                        {String(index + 1).padStart(2, "0")}
                      </div>
                      <div className="relative overflow-hidden grow">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover aspect-[4/5] sm:aspect-[3/4]"
                        />
                      </div>
                    </div>
                    <h3 className="mt-3 sm:mt-4 text-right font-title text-primary uppercase tracking-wide font-medium text-xl sm:text-2xl">
                      {project.title}
                    </h3>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section id={`${SECTION_IDS[3]}`}
        className="relative bg-white to-primary min-h-screen flex items-center"
      >
        <div className="mx-auto container px-6 sm:px-8 py-20 sm:py-24 md:py-28 w-full">
          <div className="mb-10 sm:mb-12 text-center">
            <div className="text-xs sm:text-sm font-sans uppercase tracking-wider text-primary/70">
              Our Process
            </div>
            <h2 className="mt-2 text-4xl sm:text-5xl md:text-6xl font-title text-primary leading-tight">
              Clarity. Craft. Consistency.
            </h2>
            <p className="mt-4 text-base sm:text-lg font-sans text-neutral max-w-prose mx-auto">
              A simple, reliable path from concept to photoreal. Designed to
              keep momentum and reduce friction.
            </p>
          </div>
          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-4 items-stretch">
            {[
              {
                n: "01",
                t: "Discover",
                d: "Share plans, dimensions, and references. We align on scope, schedule, and desired mood.",
                s: "1–2 days",
              },
              {
                n: "02",
                t: "Design",
                d: "Block out geometry and lighting; establish composition and materials with first looks.",
                s: "3–5 days",
              },
              {
                n: "03",
                t: "Refine",
                d: "Iterate on angles, materials, and styling; subtle lighting passes and detail polish.",
                s: "1–3 days",
              },
              {
                n: "04",
                t: "Deliver",
                d: "Final exports (stills + 360s); optional configurator variants packaged and ready to share.",
                s: "Same day",
              },
            ].map((step) => (
              <article
                key={step.n}
                className="group border border-neutral/15 bg-white shadow-sm p-5 sm:p-6 transition-transform duration-300 hover:-translate-y-0.5 flex flex-col"
              >
                <div className="flex items-center justify-between">
                  <span className="text-primary font-title text-xl sm:text-2xl">
                    {step.n}
                  </span>
                  <span className="text-[10px] sm:text-xs font-sans uppercase tracking-wider text-neutral">
                    {step.s}
                  </span>
                </div>
                <h3 className="mt-3 sm:mt-4 text-xl sm:text-2xl font-title text-primary uppercase">
                  {step.t}
                </h3>
                <p className="mt-2 sm:mt-3 text-sm font-sans text-neutral">
                  {step.d}
                </p>
              </article>
            ))}
          </div>
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/[0.03] via-transparent to-transparent" />
      </section>

      {/* CONTACT */}
      <section id={`${SECTION_IDS[4]}`}
        className="bg-primary min-h-1/2 flex items-center"
      >
        <div className="mx-autocontainer px-6 sm:px-8 py-16 sm:py-20 md:py-24 text-center text-white w-full">
          <h2 className="font-title font-normal mb-6 sm:mb-8 text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
            Let's Create Together
          </h2>
          <p className="mx-auto max-w-2xl text-base sm:text-lg md:text-xl font-sans leading-relaxed mb-8 sm:mb-12 opacity-90">
            Ready to visualize your remodeling vision? Contact us to discuss how
            we can help bring your project to life with purpose and depth.
          </p>
          <div className="space-y-5 sm:space-y-6">
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              <EmailIcon className="text-xl sm:text-2xl" />
              <a
                href="mailto:info@renovavisuals.com"
                className="text-lg sm:text-xl font-sans hover:text-accent transition-colors duration-300"
              >
                info@renovavisuals.com
              </a>
            </div>
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              <InstagramIcon className="text-xl sm:text-2xl" />
              <a
                href="https://instagram.com/renova.visuals"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg sm:text-xl font-sans hover:text-accent transition-colors duration-300"
              >
                renova.visuals
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
