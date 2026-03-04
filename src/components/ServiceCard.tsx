import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface ServiceCardProps {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  buttonText?: string;
  onToggle?: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  description,
  image,
  imageAlt,
  buttonText = "View Details",
  onToggle,
}) => {
  // Reuse the same animation pattern as Products.tsx
  const itemVariants = {
    hidden: { opacity: 0, y: 14 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="group bg-white rounded-2xl shadow-md overflow-hidden transition-shadow hover:shadow-xl"
    >
      {/* Image */}
      <div className="aspect-[16/9] overflow-hidden">
        <img
          src={image}
          alt={imageAlt}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        <div className="flex flex-col h-full">
          <div className="flex-1">
            <h3 className="text-lg sm:text-xl font-semibold text-brand-blue-dark mb-2 sm:mb-3 transition-colors duration-300 group-hover:text-[#FFD700]">
              {title}
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>
          
          {/* View Details Button - Lower Right */}
          <div className="flex justify-end mt-4">
            <Button
              onClick={onToggle}
              variant="default"
              className="shrink-0"
            >
              {buttonText}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ServiceCard;
