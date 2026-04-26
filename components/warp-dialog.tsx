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
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

// ── Constants ─────────────────────────────────────────────────────────────────

const ENTER  = 0.82;
const EXIT   = 0.36;
const EASE   = [0.22, 1, 0.36, 1] as const;
const EASE_IN = [0.4, 0, 1, 1] as const;

// ── Context ───────────────────────────────────────────────────────────────────

type WarpDialogContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const WarpDialogContext = createContext<WarpDialogContextValue | null>(null);

export function useWarpDialogContext() {
  const ctx = useContext(WarpDialogContext);
  if (!ctx) throw new Error("useWarpDialogContext must be used inside WarpDialog");
  return ctx;
}

// ── Root ──────────────────────────────────────────────────────────────────────

export function WarpDialog({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const value = useMemo(() => ({ open, setOpen }), [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onEsc);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  return (
    <WarpDialogContext.Provider value={value}>
      {children}
    </WarpDialogContext.Provider>
  );
}

// ── Trigger ───────────────────────────────────────────────────────────────────

type WarpDialogTriggerProps = {
  asChild?: boolean;
  children: ReactNode;
};

export function WarpDialogTrigger({
  asChild = false,
  children,
}: WarpDialogTriggerProps) {
  const { setOpen } = useWarpDialogContext();
  const open = useCallback(() => setOpen(true), [setOpen]);

  if (asChild) {
    const child = Children.only(children);
    if (!isValidElement(child)) return null;
    const el = child as ReactElement<{
      onClick?: (e: MouseEvent<HTMLElement>) => void;
    }>;
    return cloneElement(el, {
      onClick: (e: MouseEvent<HTMLElement>) => {
        el.props.onClick?.(e);
        if (!e.defaultPrevented) open();
      },
    });
  }

  return (
    <button type="button" onClick={open}>
      {children}
    </button>
  );
}

// ── Content ───────────────────────────────────────────────────────────────────

type WarpDialogContentProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export function WarpDialogContent({
  children,
  className = "",
  style,
}: WarpDialogContentProps) {
  const { open, setOpen } = useWarpDialogContext();
  const [mounted, setMounted] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<Element | null>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (open) {
      triggerRef.current = document.activeElement;
      requestAnimationFrame(() => dialogRef.current?.focus());
    } else {
      (triggerRef.current as HTMLElement | null)?.focus();
    }
  }, [open]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
          data-lenis-prevent=""
          onWheelCapture={(e) => e.stopPropagation()}
          onTouchMoveCapture={(e) => e.stopPropagation()}
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
          className={`fixed inset-0 z-[80] overflow-hidden bg-black outline-none ${className}`}
          style={style}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.26, ease: EASE }}
        >
          <WarpAnimations />

          <motion.div
            className="relative z-10 h-full w-full"
            initial={{ y: 18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: ENTER, ease: EASE }}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

// ── Warp animations ───────────────────────────────────────────────────────────

function orb(overrides: HTMLMotionProps<"div">): HTMLMotionProps<"div"> {
  return { transition: { duration: ENTER, ease: EASE }, ...overrides };
}

function WarpAnimations() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">

      {/* ── Large central glow — sits low, barely peeks in ── */}
      <motion.div
        className="absolute bottom-0 left-1/2 h-[38vh] w-[90%] -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at 50% 100%, color-mix(in srgb, var(--ambient-2) 55%, var(--ambient-3) 45%) 0%, transparent 72%)",
          filter: "blur(48px)",
          willChange: "opacity, transform",
        }}
        {...orb({
          initial: { opacity: 0, y: 40 },
          animate: { opacity: 0.55, y: 0 },
          exit: { opacity: 0, y: 28, transition: { duration: EXIT, ease: EASE_IN } },
          transition: { duration: ENTER * 1.1, ease: EASE },
        })}
      />

      {/* ── Soft left accent — dim, cool, low ── */}
      <motion.div
        className="absolute -left-16 bottom-0 h-[28vh] w-72 rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at 30% 100%, var(--ambient-1) 0%, transparent 70%)",
          filter: "blur(56px)",
          willChange: "opacity, transform",
        }}
        {...orb({
          initial: { opacity: 0, x: -40 },
          animate: { opacity: 0.32, x: 0 },
          exit: { opacity: 0, x: -28, transition: { duration: EXIT, ease: EASE_IN } },
          transition: { duration: ENTER, ease: EASE, delay: 0.06 },
        })}
      />

      {/* ── Soft right accent — dim, warm, low ── */}
      <motion.div
        className="absolute -right-16 bottom-0 h-[28vh] w-72 rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at 70% 100%, var(--ambient-3) 0%, transparent 70%)",
          filter: "blur(56px)",
          willChange: "opacity, transform",
        }}
        {...orb({
          initial: { opacity: 0, x: 40 },
          animate: { opacity: 0.28, x: 0 },
          exit: { opacity: 0, x: 28, transition: { duration: EXIT, ease: EASE_IN } },
          transition: { duration: ENTER, ease: EASE, delay: 0.08 },
        })}
      />

      {/* ── Hair-line bottom edge ── */}
      <motion.div
        className="absolute inset-x-0 bottom-0 h-px origin-center"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, color-mix(in srgb, var(--ambient-2) 70%, white) 50%, transparent 100%)",
          willChange: "transform, opacity",
        }}
        {...orb({
          initial: { scaleX: 0, opacity: 0 },
          animate: { scaleX: 1, opacity: 0.6 },
          exit: { scaleX: 0, opacity: 0, transition: { duration: EXIT * 0.7, ease: EASE_IN } },
          transition: { duration: ENTER * 0.5, ease: EASE, delay: 0.1 },
        })}
      />

    </div>
  );
}