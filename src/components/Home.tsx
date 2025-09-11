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
import juniperDemo from "../assets/juniper-demo-compressed.mp4"
import { ArchitectureOutlined, Launch, RedeemOutlined, WorkspacesOutlined } from "@mui/icons-material";

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
  const demoLink = "https://app.renovavisuals.com/demo";
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
            <a
              href={demoLink}
              target="_blank"
              rel="noreferrer noopener"
              className={`btn ${headerTextColor == 'text-white' ? "btn-accent" : "btn-accent"} btn-md opacity-95 `}>
              Explore Demo
              <Launch />
            </a>

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
              <a target="_blank"
                rel="noreferrer noopener"
                className="btn-primary btn btn-sm sm:md:btn-lg lg:btn-lg xl:btn-xl text-sm p-6 uppercase">Explore the Demo</a>
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

        <div className="relative z-10 container text-white w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center lg:gap-8 px-6 sm:px-8 py-24 sm:py-16 md:py-40">

            {/* Left: Heading + Copy + CTA */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left mx-auto max-w-prose">
              <div className="flex flex-row items-center justify-center lg:justify-start font-title leading-tight text-6xl lg:text-7xl xl:text-8xl mb-12 gap-2">
                <Logo fill="currentColor" className="h-[1em] w-[1em]" />
                <div className="divider divider-primary divider-horizontal before:bg-white after:bg-white"></div>
                Renova
              </div>

              <p className="mb-10 text-white/80 text-base md:text-lg font-sans">
                At Renova, we turn your renovation ideas into stunning visuals you can explore. <br/> <br/>
                We help homeowners and designers bring ideas to life with photorealistic 3D renders and 360° panoramic material configurators.
              </p>

             
            </div>

            {/* Right: Video */}
            <div className="w-full flex flex-col gap-4 justify-center lg:justify-end">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full max-w-3xl rounded-2xl shadow-xl ring-1 ring-white/10"
              >
                <source src={juniperDemo} type="video/mp4" />
              </video>
               <a
                href={demoLink}
                target="_blank"
                rel="noreferrer noopener"
                className="btn btn-accent btn-md"
              >
                Explore Demo
                <Launch />
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id={`${SECTION_IDS[1]}`} className="relative bg-base-200 min-h-screen flex items-center">
        <div className="mx-auto container px-10 sm:px-20 lg:px-16 xl:px-0 py-16 sm:py-20 md:py-24 w-full">
          <div className="grid gap-10 md:grid-cols-12 md:gap-16 items-center">
            <div className="md:col-span-5">
              <div className="text-4xl sm:text-2xl md:text-3xl lg:text-5xl xl:text-6xl font-tiempos font-normal text-primary pb-6 md:pb-8 leading-tight">
                <span className="block font-title uppercase">
                  Design
                </span>
                <span className="block font-title uppercase">
                  With Confidence
                </span>
              </div>
              <p className="text-lg font-sans text-neutral leading-relaxed pb-2 md:pb-4">
                At Renova, we believe your home should feel like you.
              </p>
              <p className="text-lg font-sans text-neutral leading-relaxed pb-6 md:pb-8">
                With your exact measurements and material preferences, we help you picture every detail before any construction begins.
              </p>
              <a
                href={demoLink}
                target="_blank"
                rel="noreferrer noopener"
                className="group text-primary uppercase tracking-wider text-xs sm:text-sm font-sans hover:scale-105 transition-all duration-300 inline-flex items-center gap-2 border-b border-primary pb-1">
                Explore the Demo
                <Launch className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </a>
            </div>
            <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-5 gap-2 md:gap-4 lg:gap-4">
              <div className="grid gap-4 col-span-3 md:gap-4 ">
                <div className="relative overflow-hidden shadow-sm">
                  <img
                    src={juniperImage1}
                    alt="Interior design project"
                    className="w-full h-full object-cover aspect-[4/5] md:aspect-[3/4] hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
              <div className="grid gap-2 col-span-2 md:gap-4">
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
              <div className="text-white self-center pr-10 z-10">
                <div className="text-sm sm:text-md font-sans uppercase tracking-wider text-gray-300 mb-3 sm:mb-4">
                  PORTFOLIO
                </div>
                <div className="flex flex-col text-4xl sm:text-2xl md:text-3xl lg:text-5xl xl:text-6xl font-tiempos font-normal text-white pb-6 md:pb-8 leading-tight">
                  <span className="font-title uppercase">
                    Made by Us,
                  </span>
                  <span className=" font-title uppercase">
                    Inspired by You
                  </span>
                </div>
                <p className="text-lg sm:text-xl font-sans text-gray-200/90 leading-relaxed mb-8 sm:mb-12">
                  Explore remodel designs we've brought to life.
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
            <h2 className="mt-2 text-5xl sm:text-6xl md:text-7xl font-title text-primary leading-tight">
              Reveal. Reimagine. Results.
            </h2>
            <p className="mt-4 text-lg sm:text-xl font-sans text-neutral max-w-prose mx-auto">
              A simple, reliable path from concept to photoreal. Designed to
              keep momentum and reduce friction.
            </p>
          </div>
          <div className="grid gap-6 sm:gap-8 md:grid-cols-3 lg:grid-cols-3 items-stretch">
            {[
              {
                n: "01",
                t: "Reflect",
                d: "We begin by understanding your goals, style, and vision. This phase sets the foundation, making sure every detail reflects what you want for your space.",
                s: "1-2 days",
                i: () => <WorkspacesOutlined sx={{ fontSize: 'inherit' }} />
              },
              {
                n: "02",
                t: "Reimagine",
                d: "Next, we turn ideas into visuals. With high-quality renderings and 360° views, you can select different materials and finishes before making decisions.",
                s: "3-5 days",
                i: () => <ArchitectureOutlined sx={{ fontSize: 'inherit' }} />
              },
              {
                n: "03",
                t: "Results",
                d: "Once you're confident in the design, we deliver a finalized version you can share with contractors - your roadmap to a remodel done right.",
                s: "1-2 days",
                i: () => <RedeemOutlined sx={{ fontSize: 'inherit' }} />
              },
            ].map((step) => (
              <article
                key={step.n}
                className="card border border-neutral/15 bg-white shadow-sm p-5 sm:p-6 transition-transform duration-300 hover:-translate-y-0.5 flex flex-col"
              >
                <div className="flex items-center justify-between">
                  <span className="text-primary font-title text-xl sm:text-2xl">
                    {step.n}
                  </span>
                  <span className="text-[10px] sm:text-xs font-sans uppercase tracking-wider text-neutral">
                    {step.s}
                  </span>
                </div>
                <div className="flex items-center mt-3 sm:mt-4 text-2xl sm:text-4xl md:text-2xl lg:text-4xl font-title text-primary uppercase gap-2 py-3">
                  {step.i()} {step.t}
                </div>
                <p className="mt-2 sm:mt-3 text-base font-sans text-neutral">
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
