import React, { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo.svg?react";
import { useTransition } from "../context/TransitionContext";
import { getImages } from "../utils/imageImports";
import juniperHero from "../assets/projects/juniper-a (4).jpg";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface Material {
  name: string;
  category: string;
  imagePath: string;
  originalName?: string;
}

const Materials: React.FC = () => {
  const [materials, setMaterials] = useState<Record<string, Material[]>>({});
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selected, setSelected] = useState<Material | null>(null);
  const [headerTextColor, setHeaderTextColor] = useState("text-white");
  const [heroImage, setHeroImage] = useState<string | null>(null);

  const { startTransition } = useTransition();
  const navigate = useNavigate();
  const pageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const organize = async () => {
      const images = await getImages();
      const grouped: Record<string, Material[]> = {};

      Object.entries(images).forEach(([base, mod]) => {
        // base is like "Brick_ConcretePavers"
        const [category, itemRaw] = base.split("_");
        if (!category || !itemRaw) return;

        // Insert spaces before capital letters → "Concrete Pavers"
        const name = itemRaw.replace(/([a-z])([A-Z])/g, "$1 $2");

        if (!grouped[category]) grouped[category] = [];
        grouped[category].push({
          name,
          category,
          imagePath: (mod as any).default,
          originalName: mod.originalName,
        });
      });

      setMaterials(grouped);

      // Hero = first image if available
      const firstCat = Object.keys(grouped)[0];
      const firstImg = firstCat && grouped[firstCat]?.[0]?.imagePath;
      setHeroImage(firstImg ?? null);
    };

    organize();
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const h = window.innerHeight;
      setHeaderTextColor(y < h - 10 ? "text-white" : "text-primary");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const categories = useMemo(() => Object.keys(materials), [materials]);
  const allMaterials = useMemo(
    () =>
      activeCategory === "all"
        ? Object.values(materials).flat()
        : materials[activeCategory] || [],
    [materials, activeCategory]
  );

  // modal handlers
  const openPreview = (m: Material) => {
    setSelected(m);
    document.body.style.overflow = "hidden";
  };
  const closePreview = () => {
    setSelected(null);
    document.body.style.overflow = "auto";
  };

  return (
    <div ref={pageRef} className="bg-white min-h-screen">
      {/* Header */}
      <section className="relative overflow-hidden bg-primary">
        {/* Background image pinned to this section, clipped by overflow-hidden */}
        <img
          src={juniperHero}
          alt=""
          aria-hidden
          className="absolute inset-0 z-9 h-full w-full object-cover"
          style={{ filter: "brightness(0.5) contrast(1.1)" }}
        />

        {/* Content drives the section’s height; set your desired paddings */}
        <div className="p-4 lg:p-8">
          <div className="flex items-center justify-center text-white">
            <nav className="absolute left-4 lg:left-8 z-10">
              <div className="flex items-center text-2xl md:text-3xl text-white cursor-pointer">
                <ArrowBackIcon onClick={(e) => {
                  e.preventDefault();
                  startTransition("in", () => navigate("/"));
                }} sx={{ fontSize: 'inherit' }} />
              </div>
            </nav>
            <Logo fill="currentColor" className="h-8 text-white self-center z-10 cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                startTransition("in", () => navigate("/"));
              }} />
          </div>

          <section className="relative z-10 flex flex-col p-8 items-center justify-center">
            <div className="text-3xl md:text-4xl lg:text-6xl xl:text-8xl font-title leading-tight text-white">
              Materials & Finishes
            </div>
            <p className="mt-6 font-sans text-white/85 max-w-3xl text-center">
              A curated collection of surfaces and textures for your spaces.
            </p>
          </section>
        </div>
      </section>

      {/* Hero */}


      {/* Category filter */}
      <section className="py-12 px-6 md:px-12 lg:px-24 bg-base-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center gap-3 md:gap-4">
            <button
              onClick={() => setActiveCategory("all")}
              className={`cursor-pointer uppercase text-xs md:text-sm font-sans tracking-wider px-3 py-1 border rounded-full ${activeCategory === "all"
                ? "bg-secondary text-white border-primary"
                : "bg-white text-primary border-primary hover:bg-secondary hover:text-white"
                }`}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`cursor-pointer uppercase text-xs md:text-sm font-sans tracking-wider px-3 py-1 border rounded-full ${activeCategory === c
                  ? "bg-secondary text-white border-primary"
                  : "bg-white text-primary border-primary hover:bg-secondary hover:text-white"
                  }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="pb-28 px-6 md:px-12 lg:px-24 bg-base-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {allMaterials.map((m) => (
            <article
              key={`${m.category}-${m.name}`}
              className="group cursor-pointer transition-transform duration-500 hover:scale-[1.015] rounded-lg"
              onClick={() => openPreview(m)}
            >
              <div className="relative overflow-hidden">
                <img
                  src={m.imagePath}
                  alt={m.originalName || m.name}
                  className="w-full h-full object-contain transform transition-transform duration-700 group-hover:scale-105"
                  style={{
                    filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.35))",
                  }}
                />
                <div className="absolute top-4 left-4 px-3 py-1 bg-secondary text-xs font-sans tracking-wider uppercase p-2 rounded lg text-white">
                  {m.category}
                </div>
              </div>
              <div className="flex p-5 justify-center text-center">
                <h3 className="text-xl font-title text-primary tracking-wide">
                  {m.name}
                </h3>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closePreview}
        >
          <div
            className="bg-white max-w-7xl w-full grid md:grid-cols-2 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative overflow-hidden">
              <img
                src={selected.imagePath}
                alt={selected.originalName || selected.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-8 flex flex-col justify-center">
              <div>
                <div className="bg-secondary text-xs font-sans uppercase tracking-wider mb-2 w-fit p-2 rounded lg text-white">
                  {selected.category}
                </div>
                <h3 className="text-5xl font-title text-primary tracking-wide">
                  {selected.name}
                </h3>
              </div>
              <div className="mt-12">
                <button
                  onClick={closePreview}
                  className="uppercase text-xs font-sans tracking-wider border border-primary text-primary px-4 py-2 hover:bg-secondary hover:text-white transition-colors duration-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Materials;
