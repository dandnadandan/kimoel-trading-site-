// Services.tsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import InvoiceDialog from "./InvoiceDialog";
import ServiceCard from "./ServiceCard";

// Import category images
import engineeringImage from "@/assets/ENGINEERING SERVICES.jpg";
import machiningImage from "@/assets/MACHINING AND FABRICATION.jpg";
import civilWorksImage from "@/assets/CIVIL WORKS.jpeg";

// Sub-service images
import automationDesign from "@/assets/Automation and Machine Design.png";
import architecturalDesign from "@/assets/Architectural and Structural Design.jpg";
import electricalWorks from "@/assets/Electrical Works.png";
import sheetMetal from "@/assets/Sheet Metal Works.png";
import controlPanel from "@/assets/Fabrication of Electrical Control Panel.png";

import cncLaser from "@/assets/CNC Laser Cutting Machine.png";
import cncMilling from "@/assets/CNC Milling Machine.jpg";
import latheMachine from "@/assets/Lathe Machine.png";
import millingMachine from "@/assets/Milling Machine.png";
import pressBrake from "@/assets/Press Break Bending Machine.jpg";
import shearing from "@/assets/Shearing Machine.jpg";
import bandSaw from "@/assets/Band Saw Machine.jpg";

import backhoe from "@/assets/Rental of Backhoe.jpg";
import roadRehab from "@/assets/Road Rehabilitation.png";
import concreting from "@/assets/Concreting.png";
import structural from "@/assets/Structural.png.jpg";
import fireProtection from "@/assets/Fire Protection System.png";

const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10, transition: { duration: 0.18 } },
};

const Services = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeTap, setActiveTap] = useState<string | null>(null); // mobile tap highlight (optional)
  const [selectedService, setSelectedService] = useState<{
    title: string;
    description: string;
  } | null>(null);
  const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false);

  // Main categories
  const categories = [
    {
      title: "Engineering Services",
      description:
        "Automation & design, electrical works, sheet metal, and control panels.",
      image: engineeringImage,
    },
    {
      title: "Machining & Fabrication",
      description:
        "CNC machining, milling, lathe, bending, shearing, and fabrication services.",
      image: machiningImage,
    },
    {
      title: "Civil Works",
      description:
        "Comprehensive construction and civil engineering services.",
      image: civilWorksImage,
    },
  ];

  // Sub-services for each category
  const subServices: Record<
    string,
    { title: string; description: string; image: string; imageAlt: string }[]
  > = {
    "Engineering Services": [
      {
        title: "Automation & Machine Design",
        description: "Custom automation and machine design solutions.",
        image: automationDesign,
        imageAlt: "Automation & Machine Design",
      },
      {
        title: "Architectural & Structural Design",
        description: "Designing functional and durable structures.",
        image: architecturalDesign,
        imageAlt: "Architectural & Structural Design",
      },
      {
        title: "Electrical Works",
        description: "Reliable electrical works for industrial and commercial use.",
        image: electricalWorks,
        imageAlt: "Electrical Works",
      },
      {
        title: "Sheet Metal Works",
        description: "Fabrication and processing of sheet metal components.",
        image: sheetMetal,
        imageAlt: "Sheet Metal Works",
      },
      {
        title: "Fabrication of Electrical Control Panel",
        description: "High-quality electrical control panel fabrication.",
        image: controlPanel,
        imageAlt: "Control Panel Fabrication",
      },
    ],
    "Machining & Fabrication": [
      {
        title: "CNC Laser Cutting Machine",
        description: "Precision cutting with advanced CNC laser technology.",
        image: cncLaser,
        imageAlt: "CNC Laser Cutting",
      },
      {
        title: "CNC Milling Machine",
        description: "High-precision CNC milling for complex components.",
        image: cncMilling,
        imageAlt: "CNC Milling",
      },
      {
        title: "Lathe Machine",
        description: "Turning solutions using high-grade lathe machines.",
        image: latheMachine,
        imageAlt: "Lathe Machine",
      },
      {
        title: "Milling Machine",
        description: "Reliable milling machine services for all industries.",
        image: millingMachine,
        imageAlt: "Milling Machine",
      },
      {
        title: "Press Brake Bending Machine",
        description:
          "Accurate sheet metal bending with press brake technology.",
        image: pressBrake,
        imageAlt: "Press Brake Bending",
      },
      {
        title: "Shearing Machine",
        description: "Efficient sheet metal cutting using shearing machines.",
        image: shearing,
        imageAlt: "Shearing Machine",
      },
      {
        title: "Band Saw Machine",
        description: "Versatile cutting services with band saw machines.",
        image: bandSaw,
        imageAlt: "Band Saw Machine",
      },
    ],
    "Civil Works": [
      {
        title: "Rental of Backhoe",
        description: "Reliable backhoe rental for construction projects.",
        image: backhoe,
        imageAlt: "Backhoe Rental",
      },
      {
        title: "Road Rehabilitation",
        description: "Comprehensive road rehabilitation and maintenance.",
        image: roadRehab,
        imageAlt: "Road Rehabilitation",
      },
      {
        title: "Concreting",
        description: "High-quality concreting for structural integrity.",
        image: concreting,
        imageAlt: "Concreting",
      },
      {
        title: "Structural",
        description: "Strong and reliable structural construction services.",
        image: structural,
        imageAlt: "Structural Works",
      },
      {
        title: "Fire Protection System",
        description: "Installation of reliable fire protection systems.",
        image: fireProtection,
        imageAlt: "Fire Protection",
      },
    ],
  };

  const handleServiceClick = (title: string, description: string) => {
    setSelectedService({ title, description });
    setIsInvoiceDialogOpen(true);
  };

  const closeInvoiceDialog = () => {
    setIsInvoiceDialogOpen(false);
    setSelectedService(null);
  };

  return (
    <section id="services" className="py-14 md:py-20 bg-muted/30 scroll-mt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-brand-blue-dark mb-3 md:mb-4">
            Our Services
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            We provide engineering, machining, and civil works services to support
            industrial and construction needs with precision and reliability.
            Click on any service to request an invoice.
          </p>
        </div>

        <AnimatePresence initial={false} mode="wait">
          {/* Category Grid */}
          {!activeCategory && (
            <motion.div
              key="categories"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={gridVariants}
              viewport={{ once: true, amount: 0.2 }}
            >
              {categories.map((category, i) => (
                <motion.button
                  key={category.title}
                  onClick={() => {
                    setActiveCategory(category.title);
                    setActiveTap(category.title);
                  }}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={itemVariants}
                  transition={{
                    delay: i * 0.03,
                    type: "spring",
                    stiffness: 220,
                    damping: 20,
                  }}
                  whileHover={{ y: -6 }}
                  whileTap={{ scale: 0.98 }}
                  className="group text-left bg-white rounded-2xl overflow-hidden shadow-md transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 md:hover:shadow-xl"
                >
                  <div className="aspect-[16/9] overflow-hidden">
                    <motion.img
                      src={category.image}
                      alt={category.title}
                      className="w-full h-full object-cover"
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.06 }}
                      transition={{ type: "spring", stiffness: 220 }}
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4 sm:p-5">
                    <h3
                      className={`text-lg sm:text-xl font-semibold transition-colors duration-300 ${
                        activeTap === category.title
                          ? "text-[#FFD700]"
                          : "text-brand-blue-dark md:group-hover:text-[#FFD700]"
                      }`}
                    >
                      {category.title}
                    </h3>
                    <p className="mt-1 text-sm sm:text-base text-gray-600">
                      {category.description}
                    </p>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}

          {/* Sub-services Grid */}
          {activeCategory && (
            <motion.div
              key={`services-${activeCategory}`}
              className="mt-8 md:mt-12"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.22 }}
            >
              <div className="flex flex-col sm:flex-row items-center justify-between flex-wrap gap-3 mb-6">
                <button
                  onClick={() => {
                    setActiveCategory(null);
                    setActiveTap(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm sm:text-base w-full sm:w-auto order-2 sm:order-1"
                  aria-label="Back to categories"
                >
                  ← Back to Categories
                </button>
                <h3 className="text-2xl sm:text-3xl font-bold text-brand-blue-dark text-center order-1 sm:order-2 w-full">
                  {activeCategory}
                </h3>
              </div>

              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={gridVariants}
              >
                {subServices[activeCategory].map((service, index) => (
                  <motion.div
                    key={service.title}
                    variants={itemVariants}
                    whileHover={{ y: -6 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{
                      delay: index * 0.02,
                      type: "spring",
                      stiffness: 220,
                      damping: 20,
                    }}
                    layout
                  >
                    <ServiceCard
                      title={service.title}
                      description={service.description}
                      image={service.image}
                      imageAlt={service.imageAlt}
                      onToggle={() => handleServiceClick(service.title, service.description)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Invoice Dialog */}
      {selectedService && (
        <InvoiceDialog
          open={isInvoiceDialogOpen}
          onOpenChange={closeInvoiceDialog}
          productTitle={selectedService.title}
          productDescription={selectedService.description}
          itemType="service"
        />
      )}
    </section>
  );
};

export default Services;
