/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useSpring, AnimatePresence, useMotionValue, useTransform } from "motion/react";
import { 
  Mail, 
  MapPin, 
  Phone, 
  User, 
  Cpu, 
  Truck, 
  Users, 
  Briefcase,
  ChevronRight,
  Monitor,
  ArrowUpRight,
  Zap,
  Globe,
  Award,
  Instagram
} from "lucide-react";
import React, { useState, useEffect, useRef } from "react";

// --- Custom Hooks & Helpers ---

const useMousePosition = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return { mouseX, mouseY };
};

// --- Animation Components ---

const CustomCursor = () => {
  const { mouseX, mouseY } = useMousePosition();
  const cursorSize = 20;
  
  const springX = useSpring(mouseX, { stiffness: 500, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 500, damping: 30 });

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 rounded-full border border-brand z-[9999] pointer-events-none mix-blend-difference hidden lg:block"
      style={{
        x: springX,
        y: springY,
        translateX: "-50%",
        translateY: "-50%",
      }}
    />
  );
};

const Magnetic = ({ children }: { children: React.ReactElement }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current!.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    x.set(clientX - centerX);
    y.set(clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className="magnetic-area"
    >
      {children}
    </motion.div>
  );
};

const FadeIn = ({ children, delay = 0, y = 30 }: { children: React.ReactNode; delay?: number; y?: number }) => (
  <motion.div
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.div>
);

const LineReveal = ({ text, delay = 0, className = "" }: { text: string; delay?: number; className?: string }) => (
  <div className={`text-reveal ${className}`}>
    <motion.div
      initial={{ y: "100%" }}
      whileInView={{ y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {text}
    </motion.div>
  </div>
);

// --- Section Components ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Profil", id: "about" },
    { label: "Pengalaman", id: "experience" },
    { label: "Keahlian", id: "skills" }
  ];

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 px-6 lg:px-12 py-6 ${
        isScrolled ? "glass py-4 translate-y-2 mx-4 rounded-2xl shadow-xl shadow-black/5" : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Magnetic>
          <a href="#" className="font-display font-black text-2xl tracking-tight flex items-center gap-2">
            <motion.span 
              whileHover={{ rotate: 180 }}
              className="w-10 h-10 bg-brand text-accent rounded-xl flex items-center justify-center text-lg font-bold"
            >
              D
            </motion.span>
            ISNAWAN.
          </a>
        </Magnetic>
        <div className="hidden md:flex gap-10 text-[10px] uppercase font-black tracking-[0.2em]">
          {navItems.map((item, idx) => (
            <motion.a 
              key={item.id} 
              href={`#${item.id}`} 
              className="hover:text-accent transition-colors relative group py-2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx + 0.5 }}
            >
              <span className="relative z-10">{item.label}</span>
              <motion.span 
                className="absolute inset-0 bg-accent/20 rounded-lg -z-10 scale-0 group-hover:scale-100 transition-transform duration-500"
              />
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-accent group-hover:w-full transition-all duration-300" />
            </motion.a>
          ))}
        </div>
        <Magnetic>
             <a 
              href="https://wa.me/qr/6Z3RRQMOGBGQH1"
              target="_blank"
              rel="noreferrer"
              className="bg-brand text-white px-8 py-3 rounded-full text-[10px] font-black tracking-widest uppercase hover:bg-accent hover:text-brand transition-all duration-500 shadow-lg shadow-brand/10"
             >
               Kontak
             </a>
        </Magnetic>
      </div>
    </motion.nav>
  );
};

const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);

  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 lg:px-12 overflow-hidden bg-surface py-20">
      {/* Dynamic Background Elements */}
      <motion.div 
        style={{ y: y1 }}
        className="absolute top-20 -right-20 w-[40rem] h-[40rem] bg-accent/10 rounded-full blur-3xl -z-10"
      />
      <motion.div 
        style={{ y: y2 }}
        className="absolute bottom-0 -left-20 w-[30rem] h-[30rem] bg-brand/5 rounded-full blur-3xl -z-10"
      />
      
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          <div className="lg:col-span-8 order-2 lg:order-1">
            <FadeIn delay={0.2}>
              <div className="flex items-center gap-4 mb-10 overflow-hidden">
                 <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: 48 }}
                  transition={{ duration: 1.5, ease: "circOut" }}
                  className="h-[1px] bg-accent" 
                 />
                 <span className="text-[10px] uppercase tracking-[0.5em] font-black opacity-40 italic">Portofolio Profesional &apos;26</span>
              </div>
            </FadeIn>

            <h1 className="text-[12vw] md:text-[8vw] font-display font-black leading-[0.8] tracking-tighter mb-8">
              <LineReveal text="HELPER" />
              <div className="flex items-center gap-4 md:gap-8 flex-wrap">
                <LineReveal text="GUDANG" />
                <motion.div 
                  initial={{ width: 0, opacity: 0, x: -50 }}
                  animate={{ width: "auto", opacity: 1, x: 0 }}
                  transition={{ delay: 0.8, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  className="px-8 py-3 bg-accent/30 border border-accent/20 rounded-2xl text-[2.5vw] font-display font-bold italic text-brand"
                >
                  &amp; TEKNIK
                </motion.div>
              </div>
              <LineReveal text="KOMPUTER" delay={0.2} />
            </h1>
          </div>
          
          <div className="lg:col-span-4 order-1 lg:order-2 flex justify-center lg:justify-end">
            <FadeIn delay={0.4} y={50}>
              <div className="relative group">
                <motion.div 
                  whileHover={{ scale: 1.02, rotate: 1 }}
                  className="relative w-full max-w-[320px] aspect-[4/5] md:aspect-[3/4] rounded-[3rem] overflow-hidden border-[16px] border-white shadow-2xl shadow-black/10 bg-accent/5"
                >
                  <img 
                    src="input_file_0.png" 
                    alt="Dandi Isnawan" 
                    className="w-full h-full object-cover relative z-10 transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const img = e.currentTarget;
                      img.style.display = 'none';
                      const fallback = img.parentElement?.querySelector('.image-fallback');
                      if (fallback) {
                        fallback.classList.remove('hidden');
                        fallback.classList.add('flex');
                      }
                    }}
                  />
                  <div className="image-fallback hidden absolute inset-0 flex-col items-center justify-center p-6 text-center bg-accent/10 z-0">
                    <div className="w-24 h-24 rounded-full bg-accent/20 flex items-center justify-center mb-6 shadow-inner">
                      <User size={48} className="text-accent" />
                    </div>
                    <div className="space-y-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">
                        Dandi Isnawan
                      </p>
                      <p className="text-[11px] leading-relaxed text-brand/40 font-medium max-w-[180px] mx-auto italic">
                        Helper Gudang & Teknik Komputer
                      </p>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-brand/40 to-transparent pointer-events-none z-20" />
                </motion.div>
                
                {/* Floating Badge */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0, rotate: -20 }}
                  animate={{ opacity: 1, scale: 1, rotate: 12 }}
                  transition={{ delay: 1, type: "spring" }}
                  className="absolute -bottom-6 -right-6 w-24 h-24 bg-accent text-brand rounded-2xl flex items-center justify-center text-center p-2 shadow-xl shadow-accent/20 z-30 font-black text-[9px] uppercase leading-tight tracking-tighter"
                >
                  Tersedia <br /> Untuk <br /> Bekerja
                </motion.div>
              </div>
              
              <div className="mt-12 flex flex-col gap-4">
                <button 
                  onClick={() => window.print()}
                  className="bg-brand text-white px-8 py-4 rounded-2xl text-[10px] font-black tracking-[0.3em] uppercase hover:bg-accent hover:text-brand transition-all duration-500 shadow-xl shadow-brand/10 flex items-center justify-center gap-3 group"
                >
                  <Monitor size={14} className="group-hover:rotate-12 transition-transform" />
                  Cetak CV / Foto Profil
                </button>
                <div className="text-center bg-brand/[0.02] backdrop-blur-sm py-4 px-6 rounded-3xl border border-brand/5">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-brand/40 font-black">Dandi Isnawan • Portfolio 2026</p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-end pt-12 border-t border-black/5">
          <div className="md:col-span-4">
            <FadeIn delay={0.6}>
              <div className="text-[10px] uppercase tracking-widest font-black mb-4 opacity-50">Keahlian</div>
              <p className="text-xl text-brand/80 font-light leading-relaxed">
                Berpengalaman di bidang <span className="text-brand font-bold italic underline decoration-accent/50 underline-offset-8">Retail & Produksi</span>. Ahli dalam Teknik Komputer Jaringan dari Kediri.
              </p>
            </FadeIn>
          </div>
          <div className="md:col-span-3">
             <FadeIn delay={0.8}>
                <div className="flex gap-6">
                  <div className="flex -space-x-4">
                    {[1,2,3].map(i => (
                      <motion.div 
                        key={i} 
                        whileHover={{ y: -5, scale: 1.1 }}
                        className="w-12 h-12 rounded-2xl border-2 border-surface bg-white shadow-xl shadow-black/5 flex items-center justify-center text-brand"
                      >
                        {i === 1 ? <Briefcase size={18} /> : i === 2 ? <Cpu size={18} /> : <Zap size={18} />}
                      </motion.div>
                    ))}
                  </div>
                  <div className="text-[10px] uppercase tracking-widest font-black opacity-40 flex items-center leading-tight">
                    Pengalaman <br /> Multi-Sektor
                  </div>
                </div>
             </FadeIn>
          </div>
          <div className="md:col-span-5 flex md:justify-end">
            <Magnetic>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="relative w-36 h-36 rounded-2xl border border-black/5 bg-white/50 flex items-center justify-center group cursor-pointer overflow-hidden shadow-2xl shadow-black/[0.02]"
              >
                <motion.div 
                  className="absolute inset-0 bg-accent/20"
                  initial={{ y: "100%" }}
                  whileHover={{ y: 0 }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                />
                <div className="relative z-10 flex flex-col items-center gap-2">
                  <motion.div 
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <ChevronRight size={20} className="rotate-90 text-accent" />
                  </motion.div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-brand/60">
                    Gulir
                  </div>
                </div>
              </motion.div>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
};

const SectionHeader = ({ num, title, subtitle }: any) => (
  <div className="mb-20">
    <div className="flex items-center gap-6 mb-6">
      <motion.span 
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-xs font-mono font-bold text-brand"
      >
        {num}
      </motion.span>
      <div className="h-[1px] flex-grow bg-black/5" />
    </div>
    <h3 className="text-5xl md:text-7xl font-display font-black tracking-tight mb-4">
      {title}
    </h3>
    <p className="text-muted font-light text-xl italic max-w-2xl leading-relaxed">{subtitle}</p>
  </div>
);

const WorkCard = ({ company, role, period, details }: any) => (
  <motion.div 
    className="group relative grid grid-cols-1 md:grid-cols-12 gap-8 py-20 border-b border-black/5 hover:bg-black/[0.01] transition-colors duration-500 rounded-3xl"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
  >
    <div className="md:col-span-4 px-6">
      <div className="inline-block px-3 py-1 bg-accent/10 rounded-full text-[10px] font-mono font-bold text-accent mb-6">
        {period}
      </div>
      <h4 className="text-4xl font-display font-black mb-3 group-hover:translate-x-3 transition-transform duration-700">
        {company}
      </h4>
      <p className="text-xs font-black uppercase tracking-[0.2em] opacity-30 italic">{role}</p>
    </div>
    <div className="md:col-span-8 flex flex-col justify-center px-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8">
        {details.map((detail: string, idx: number) => (
          <motion.div 
            key={idx} 
            className="flex gap-4 items-start group/item"
            whileHover={{ x: 10 }}
          >
            <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0 group-hover/item:scale-150 transition-transform" />
            <p className="text-brand/70 leading-relaxed text-sm font-semibold">{detail}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </motion.div>
);

const SkillsGrid = () => {
  const categories = [
    {
      name: "IT & TEKNIS",
      items: ["Instalasi Sistem Operasi", "Perakitan PC", "Troubleshooting Komputer", "Networking"],
      icon: <Monitor size={40} strokeWidth={1.5} />
    },
    {
      name: "DOKUMENTASI",
      items: ["Microsoft Word", "Microsoft Excel", "Administrasi Gudang"],
      icon: <Briefcase size={40} strokeWidth={1.5} />
    },
    {
      name: "KOMUNIKASI",
      items: ["Pelayanan Pelanggan", "Kerja Tim", "Komunikasi Publik"],
      icon: <Users size={40} strokeWidth={1.5} />
    }
  ];

  return (
    <section id="skills" className="py-32 px-6 lg:px-12 bg-surface">
      <div className="max-w-7xl mx-auto">
        <SectionHeader num="02" title="KEAHLIAN" subtitle="Kemampuan teknis dan interpersonal yang teruji di berbagai bidang operasional." />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat, i) => (
            <motion.div 
              key={i} 
              className="relative p-12 bg-white rounded-[3rem] border border-black/5 hover:border-accent hover:shadow-2xl shadow-black/5 transition-all duration-700 group overflow-hidden"
              whileHover={{ y: -10 }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-accent/20 transition-colors" />
              <div className="mb-12 text-accent group-hover:scale-110 transition-all duration-700 origin-left">
                {cat.icon}
              </div>
              <h5 className="text-[11px] font-black tracking-[0.4em] mb-12 opacity-40 group-hover:opacity-100 transition-opacity">{cat.name}</h5>
              <div className="flex flex-wrap gap-3">
                {cat.items.map(item => (
                  <span key={item} className="text-[10px] font-black uppercase tracking-widest border border-black/5 px-5 py-3 rounded-2xl group-hover:bg-accent group-hover:text-brand group-hover:border-accent transition-all duration-500">
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FeaturedEducation = () => (
  <section className="py-32 px-6 lg:px-12 bg-brand text-white overflow-hidden relative">
    <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/10" />
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-20">
      <div className="lg:col-span-5 h-full flex flex-col justify-between">
        <div>
          <SectionHeader num="03" title="PENDIDIKAN" subtitle="Riwayat pendidikan formal dan kompetensi keahlian." />
          <div className="mt-12">
            <h4 className="text-5xl font-display font-black mb-6 tracking-tighter">SMK ARAHMAH</h4>
            <p className="text-accent text-2xl font-bold italic mb-6">Kab. Kediri</p>
            <p className="text-xl opacity-80 mb-12">Teknik Komputer Jaringan | 2021 - 2023</p>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-6 p-10 bg-white/5 border border-white/10 rounded-[2rem] w-fit"
            >
               <Award className="text-accent" size={48} />
               <div>
                  <div className="text-[10px] uppercase tracking-widest opacity-40 font-bold mb-1">Nilai Kelulusan</div>
                  <div className="text-4xl font-display font-black text-accent">85.38</div>
               </div>
            </motion.div>
          </div>
        </div>
      </div>
      <div className="lg:col-span-7">
        <motion.div 
          className="relative aspect-[4/3] bg-surface rounded-[3.5rem] overflow-hidden p-12 md:p-20 text-brand group shadow-2xl"
          whileInView={{ scale: [0.95, 1], rotate: [-1, 0] }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-accent/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10">
            <div className="text-[10px] uppercase tracking-[0.4em] font-black text-accent mb-10 italic">Latar Belakang Keahlian</div>
            <h5 className="text-4xl font-display font-black mb-10 leading-snug tracking-tighter">PKL DI VICOM SERVICE.</h5>
            <p className="text-lg font-medium leading-relaxed opacity-80 mb-12">
              Lulusan SMK Teknik Komputer dan Jaringan dengan nilai 85,38, serta memiliki pengalaman PKL selama 3 bulan di VICOM Service dalam perbaikan komputer, instalasi software, dan troubleshooting perangkat.
            </p>
            <div className="flex gap-6 items-center">
              <div className="w-16 h-16 rounded-3xl bg-brand text-accent flex items-center justify-center font-black text-xl shadow-xl">3</div>
              <div className="text-xs uppercase font-black tracking-widest flex items-center opacity-40">Bulan Pengalaman</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="py-32 px-6 lg:px-12 bg-surface">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-16 mb-32">
        <div className="max-w-2xl">
          <motion.h3 
            className="text-6xl md:text-[8vw] font-display font-black tracking-tighter mb-12 italic leading-[0.8]"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            AYO BEKERJA <br /><span className="text-accent underline underline-offset-[20px] decoration-8">SAMA!</span>
          </motion.h3>
          <p className="text-brand/60 text-2xl font-light leading-relaxed">
            Mencari peluang kerja di bidang retail, gudang, produksi, atau teknisi komputer di wilayah Kediri dan sekitarnya.
          </p>
        </div>
        <div className="flex gap-6">
          <Magnetic>
             <a 
              href="https://wa.me/qr/6Z3RRQMOGBGQH1"
              target="_blank"
              rel="noreferrer"
              className="w-48 h-48 rounded-full bg-accent flex flex-col items-center justify-center text-brand font-black text-sm uppercase tracking-widest shadow-2xl shadow-accent/40 hover:scale-110 transition-all duration-700 cursor-pointer group"
             >
               <div className="mb-2 text-brand/30 group-hover:text-brand transition-colors">
                  <Mail size={24} />
               </div>
               Hubungi Saya
             </a>
          </Magnetic>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 py-20 border-t border-black/5">
        <div>
          <div className="text-[10px] font-black uppercase tracking-widest mb-8 opacity-40">Informasi Kontak</div>
          <div className="space-y-4 font-bold text-lg">
            <p className="hover:text-accent transition-colors">+62 822 4500 8243</p>
            <a href="mailto:dandiisnawan08@gmail.com" className="hover:text-accent transition-colors block">dandiisnawan08@gmail.com</a>
          </div>
        </div>
        <div>
          <div className="text-[10px] font-black uppercase tracking-widest mb-8 opacity-40">Media Sosial</div>
          <div className="space-y-4 font-bold text-lg">
            <a 
              href="https://wa.me/qr/6Z3RRQMOGBGQH1" 
              target="_blank" 
              rel="noreferrer" 
              className="flex items-center gap-3 hover:text-accent transition-colors group/link"
            >
              <div className="p-2 bg-accent/5 rounded-lg group-hover/link:bg-accent group-hover/link:text-brand transition-colors">
                <Phone size={18} />
              </div>
              <span>WhatsApp</span>
              <ArrowUpRight size={14} className="opacity-30" />
            </a>
            <a 
              href="https://www.instagram.com/dandiisnawan_?igsh=MXR3NTdlYmx4MHB0aw==" 
              target="_blank" 
              rel="noreferrer" 
              className="flex items-center gap-3 hover:text-accent transition-colors group/link"
            >
              <div className="p-2 bg-accent/5 rounded-lg group-hover/link:bg-accent group-hover/link:text-brand transition-colors">
                <Instagram size={18} />
              </div>
              <span>Instagram</span>
              <ArrowUpRight size={14} className="opacity-30" />
            </a>
          </div>
        </div>
        <div className="lg:col-span-2 flex lg:justify-end items-end">
           <div className="font-display font-black text-6xl md:text-8xl opacity-[0.03] pointer-events-none select-none">
             DANDI ISNAWAN
           </div>
        </div>
      </div>

      <div className="pt-12 border-t border-black/5 flex flex-col md:flex-row justify-between gap-6 text-[10px] font-black uppercase tracking-widest opacity-40 italic">
        <div>&copy; 2026 Dandi Isnawan. Dibuat dengan presisi tinggi.</div>
        <div>Berbasis di Kediri, Jawa Timur</div>
      </div>
    </div>
  </footer>
);

export default function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="relative">
      <div className="grain-overlay" />
      <CustomCursor />
      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 bg-accent z-[1000] origin-left"
        style={{ scaleX }}
      />
      
      <Navbar />
      
      <main className="relative z-10">
        <Hero />
        
        <section id="about" className="py-40 px-6 lg:px-12 bg-white">
          <div className="max-w-7xl mx-auto">
             <SectionHeader num="01" title="PROFIL" subtitle="Memiliki pengalaman kerja di bidang retail, produksi, dan lapangan." />
             <div className="max-w-5xl">
               <FadeIn>
                 <h2 className="text-4xl md:text-7xl font-display font-black leading-[1.05] tracking-tighter text-brand mb-12">
                   BERKOMITMEN PADA <span className="text-accent italic">KUALITAS</span> & <span className="text-accent italic">DISIPLIN</span> KERJA.
                 </h2>
                 <p className="text-xl md:text-2xl text-brand/80 font-light max-w-4xl leading-relaxed">
                   Memiliki pengalaman kerja di bidang retail, produksi, dan lapangan. Terbiasa menangani operasional harian seperti pelayanan, pengelolaan barang, proses produksi, hingga pekerjaan fisik dengan presisi tinggi.
                 </p>
                 <div className="mt-12 flex flex-wrap gap-8 items-center">
                    <div className="flex flex-col">
                      <span className="text-4xl font-display font-black text-brand">3+</span>
                      <span className="text-[10px] uppercase tracking-widest font-black opacity-40">Tahun Pengalaman</span>
                    </div>
                    <div className="w-[1px] h-10 bg-black/5 hidden md:block" />
                    <div className="flex flex-col">
                      <span className="text-4xl font-display font-black text-brand">100%</span>
                      <span className="text-[10px] uppercase tracking-widest font-black opacity-40">Dedikasi Kerja</span>
                    </div>
                    <div className="w-[1px] h-10 bg-black/5 hidden md:block" />
                    <div className="flex flex-col">
                      <span className="text-4xl font-display font-black text-brand">Kediri</span>
                      <span className="text-[10px] uppercase tracking-widest font-black opacity-40">Basis Lokasi</span>
                    </div>
                 </div>
               </FadeIn>
             </div>
          </div>
        </section>

        <section id="experience" className="py-32 px-6 lg:px-12 bg-surface">
          <div className="max-w-7xl mx-auto">
            <WorkCard 
              company="CV RIDHO AMANAH" 
              role="Pramuniaga & Gudang" 
              period="Januari 2025 - April 2026"
              details={[
                "Melayani pelanggan dengan baik", 
                "Mengelola dan mengecek stok barang", 
                "Packing dan persiapan pengiriman", 
                "Bongkar muat barang",
                "Teliti, disiplin, dan bertanggung jawab"
              ]}
            />
            <WorkCard 
              company="PRODUKSI KARTON (UMKM)" 
              role="Helper Gudang" 
              period="MARET 2024 - JANUARI 2025"
              details={[
                "Melakukan proses produksi karton (potong, rakit, finishing)", 
                "Menjaga kualitas dan kerapihan hasil produksi", 
                "Bekerja sesuai target produksi", 
                "Bekerja sama dalam tim maupun individu",
                "Disiplin dan bertanggung jawab"
              ]}
            />
            <WorkCard 
              company="FARM WORKER" 
              role="Helper Kandang" 
              period="MARET 2023 - MARET 2024"
              details={[
                "Perawatan dan pemeliharaan puyuh", 
                "Pemberian pakan dan minum secara rutin", 
                "Menjaga kebersihan kandang", 
                "Pengambilan dan sortasi telur",
                "Memantau kesehatan dan produktivitas ternak",
                "Disiplin, teliti, dan bertanggung jawab"
              ]}
            />
          </div>
        </section>

        <SkillsGrid />
        <FeaturedEducation />
      </main>
      
      <Footer />
    </div>
  );
}
