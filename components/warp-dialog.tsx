"use client";

import {
  AnimatePresence,
  motion,
  type HTMLMotionProps,
} from "motion/react";
import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  type CSSProperties,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createPortal } from "react-dom";

type WarpDialogContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const WarpDialogContext = createContext<WarpDialogContextValue | null>(null);

export function useWarpDialogContext() {
  const context = useContext(WarpDialogContext);

  if (!context) {
    throw new Error("useWarpDialogContext must be used inside WarpDialog");
  }

  return context;
}

type WarpDialogProps = {
  children: ReactNode;
};

export function WarpDialog({ children }: WarpDialogProps) {
  const [open, setOpen] = useState(false);
  const value = useMemo(() => ({ open, setOpen }), [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <WarpDialogContext.Provider value={value}>
      {children}
    </WarpDialogContext.Provider>
  );
}

type TriggerChildProps = {
  onClick?: (event: MouseEvent<HTMLElement>) => void;
};

type WarpDialogTriggerProps = {
  asChild?: boolean;
  children: ReactNode;
};

export function WarpDialogTrigger({
  asChild = false,
  children,
}: WarpDialogTriggerProps) {
  const { setOpen } = useWarpDialogContext();

  if (asChild) {
    const child = Children.only(children);

    if (!isValidElement(child)) {
      return null;
    }

    const element = child as ReactElement<TriggerChildProps>;

    return cloneElement(element, {
      onClick: (event: MouseEvent<HTMLElement>) => {
        element.props.onClick?.(event);

        if (!event.defaultPrevented) {
          setOpen(true);
        }
      },
    });
  }

  return (
    <button type="button" onClick={() => setOpen(true)}>
      {children}
    </button>
  );
}

type WarpDialogContentProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export function WarpDialogContent({
  children,
  className,
  style,
}: WarpDialogContentProps) {
  const { open } = useWarpDialogContext();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const content = (
    <AnimatePresence>
      {open ? (
        <motion.div
          role="dialog"
          aria-modal="true"
          className={`fixed inset-0 z-[80] overflow-hidden bg-black ${
            className ?? ""
          }`}
          style={style}
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: { duration: 0.28, ease: "easeOut" },
          }}
          exit={{
            opacity: 0,
            transition: { duration: 0.2, ease: "easeIn" },
          }}
        >
          <WarpAnimations />
          <motion.div
            className="relative z-10 h-full w-full"
            initial={{ scale: 1.04, filter: "blur(16px)" }}
            animate={{
              scale: 1,
              filter: "blur(0px)",
              transition: { duration: 0.62, ease: [0.16, 1, 0.3, 1] },
            }}
            exit={{
              scale: 0.98,
              filter: "blur(10px)",
              transition: { duration: 0.24, ease: "easeIn" },
            }}
          >
            {children}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );

  return createPortal(content, document.body);
}

type WarpAnimationsProps = {
  enterDuration?: number;
  exitDuration?: number;
};

function WarpAnimations({
  enterDuration = 0.9,
  exitDuration = 0.42,
}: WarpAnimationsProps) {
  const expandingOrb: HTMLMotionProps<"div"> = {
    className:
      "absolute left-[25%] top-[100%] h-1/2 w-1/2 origin-center rounded-full blur-lg will-change-transform",
    initial: {
      scale: 0,
      opacity: 1,
      backgroundColor: "var(--ambient-3)",
    },
    animate: {
      scale: 10,
      opacity: 0.25,
      backgroundColor: "var(--ambient-2)",
      transition: {
        duration: enterDuration,
        opacity: { duration: enterDuration, ease: "easeInOut" },
      },
    },
    exit: {
      scale: 0,
      opacity: 1,
      backgroundColor: "var(--ambient-3)",
      transition: { duration: exitDuration },
    },
  };

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <motion.div {...expandingOrb} />
      <motion.div
        className="absolute -right-20 top-1/4 h-80 w-80 rounded-full blur-3xl will-change-transform"
        style={{ backgroundColor: "var(--ambient-1)" }}
        initial={{ opacity: 0, scale: 0.75 }}
        animate={{
          opacity: 0.42,
          scale: 1.3,
          transition: { duration: enterDuration, ease: "easeOut" },
        }}
        exit={{
          opacity: 0,
          scale: 0.72,
          transition: { duration: exitDuration },
        }}
      />
      <motion.div
        className="absolute -left-24 bottom-10 h-72 w-72 rounded-full blur-3xl will-change-transform"
        style={{ backgroundColor: "var(--ambient-3)" }}
        initial={{ opacity: 0, x: -80, y: 80 }}
        animate={{
          opacity: 0.36,
          x: 0,
          y: 0,
          transition: { duration: enterDuration, ease: [0.16, 1, 0.3, 1] },
        }}
        exit={{
          opacity: 0,
          x: -60,
          y: 60,
          transition: { duration: exitDuration },
        }}
      />
      <motion.div
        className="absolute inset-x-0 bottom-0 h-1"
        style={{ backgroundColor: "var(--ambient-2)" }}
        initial={{ scaleX: 0, opacity: 0.7 }}
        animate={{
          scaleX: 1,
          opacity: 0.95,
          transition: { duration: enterDuration * 0.6, ease: "easeOut" },
        }}
        exit={{
          scaleX: 0,
          opacity: 0,
          transition: { duration: exitDuration * 0.8 },
        }}
      />
    </div>
  );
}
