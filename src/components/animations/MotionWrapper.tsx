import { motion, HTMLMotionProps, Variants } from "framer-motion";
import { ReactNode } from "react";

interface FadeInUpProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  delay?: number;
  duration?: number;
}

// Animation d'entrée par fade + slide up
export const FadeInUp = ({ children, delay = 0, duration = 0.5, ...props }: FadeInUpProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration, delay, ease: "easeOut" }}
    {...props}
  >
    {children}
  </motion.div>
);

// Animation d'entrée par fade + scale
export const FadeInScale = ({ children, delay = 0, duration = 0.5, ...props }: FadeInUpProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration, delay, ease: "easeOut" }}
    {...props}
  >
    {children}
  </motion.div>
);

interface StaggerContainerProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  staggerDelay?: number;
}

// Variants pour le stagger
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
} as const;

export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
} as const;

// Animation stagger pour les listes
export const StaggerContainer = ({ children, staggerDelay = 0.1, ...props }: StaggerContainerProps) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-50px" }}
    variants={{
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: staggerDelay },
      },
    }}
    {...props}
  >
    {children}
  </motion.div>
);

interface StaggerItemProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
}

export const StaggerItem = ({ children, ...props }: StaggerItemProps) => (
  <motion.div
    variants={staggerItem}
    {...props}
  >
    {children}
  </motion.div>
);

// Animation scale pour les cartes au hover
interface ScaleOnHoverProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  scale?: number;
}

export const ScaleOnHover = ({ children, scale = 1.02, ...props }: ScaleOnHoverProps) => (
  <motion.div
    whileHover={{ scale, transition: { duration: 0.2 } }}
    whileTap={{ scale: 0.98 }}
    {...props}
  >
    {children}
  </motion.div>
);

// Slide in from left/right
interface SlideInProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  direction?: "left" | "right";
  delay?: number;
}

export const SlideIn = ({ children, direction = "left", delay = 0, ...props }: SlideInProps) => (
  <motion.div
    initial={{ opacity: 0, x: direction === "left" ? -30 : 30 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.5, delay, ease: "easeOut" }}
    {...props}
  >
    {children}
  </motion.div>
);

// Counter animation hook helper
export const useCounterAnimation = (end: number, duration: number = 2) => {
  return {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true },
    transition: { duration: 0.5 },
  };
};
