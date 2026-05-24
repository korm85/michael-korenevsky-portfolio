"use client";

import { useEffect, useState } from "react";

interface NavItem {
  id: string;
  label: string;
  isSubItem?: boolean;
}

const navItems: NavItem[] = [
  { id: "about-me", label: "About Me" },
  { id: "career", label: "Experience" },
  { id: "amvero", label: "Senior PM (AI)", isSubItem: true },
  { id: "simulation", label: "PM (Simulation)", isSubItem: true },
  { id: "qa-lead", label: "QA Team Lead", isSubItem: true },
  { id: "qa-founding", label: "QA Founding", isSubItem: true },
  { id: "qa-cimatron", label: "QA Cimatron", isSubItem: true },
  { id: "architecture", label: "Site Build" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
];

export default function TimelineNav() {
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0px -55% 0px",
        threshold: 0.05,
      }
    );

    navItems.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    // Fallback scroll listener for top of page
    const handleScroll = () => {
      if (window.scrollY < 100) {
        setActiveSection("about-me");
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const headerOffset = 90; // account for sticky header height
      const elementPosition = el.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="fixed left-6 top-[50%] -translate-y-1/2 z-30 hidden xl:flex flex-col gap-5 pl-4 border-l border-slate-200 select-none max-w-[200px]">
      {/* Decorative Track Line overlay */}
      <div className="absolute left-0 top-1 bottom-1 w-[2px] bg-slate-200 -ml-[1px]" />
      
      {navItems.map((item) => {
        const isActive = activeSection === item.id;
        const isSub = item.isSubItem;
        return (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={(e) => handleClick(e, item.id)}
            className={`group relative flex items-center transition-all duration-300 ${
              isSub
                ? "pl-6 font-mono text-[9px] font-bold tracking-wider"
                : "pl-3 font-mono text-[10px] font-bold tracking-widest uppercase"
            } ${
              isActive
                ? "text-indigo-600 translate-x-1"
                : isSub
                  ? "text-slate-400 hover:text-slate-600"
                  : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {/* Nav Point Indicator */}
            <span
              className={`absolute left-0 transition-all duration-300 z-10 ${
                isSub
                  ? `-ml-[15px] w-1.5 h-1.5 rounded-full border ${
                      isActive
                        ? "bg-indigo-600 border-indigo-600 scale-110"
                        : "bg-white border-slate-300 group-hover:border-slate-400"
                    }`
                  : `-ml-[17px] w-2.5 h-2.5 rounded-full border-2 ${
                      isActive
                        ? "bg-indigo-600 border-indigo-600 scale-125 shadow-sm shadow-indigo-200"
                        : "bg-white border-slate-300 group-hover:border-slate-400"
                    }`
              }`}
            />
            <span>{item.label}</span>
          </a>
        );
      })}
    </div>
  );
}
