"use client";

import type { ComponentProps } from "react";
import type { TargetAndTransition, Transition } from "motion/react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

// Curve di easing stile Apple — morbide e naturali
const APPLE_EASE = [0.23, 1, 0.32, 1] as const;
const APPLE_EASE_IN = [0.55, 0, 1, 0.45] as const;
const APPLE_EASE_GENTLE = [0.42, 0, 0.58, 1] as const;

const initialProps: TargetAndTransition = {
  pathLength: 0,
  opacity: 0,
};

const animateProps: TargetAndTransition = {
  pathLength: 1,
  opacity: 1,
};

// Helper per costruire la transizione in modo coerente
function makeTransition(
  duration: number,
  delay: number = 0,
  ease: readonly number[] = APPLE_EASE
): Transition {
  return {
    duration,
    delay,
    ease,
    pathLength: {
      duration,
      delay,
      ease,
    },
    opacity: {
      // L'inchiostro appare subito, scompare lentamente
      duration: duration * 0.15,
      delay,
      ease: "linear",
    },
  };
}

type Props = ComponentProps<typeof motion.svg> & {
  speed?: number;
  onAnimationComplete?: () => void;
};

// Stile condiviso per tutti i path — simula la penna stilografica
const penStyle = {
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/* ─────────────────────────────────────────────
   XIN CHÀO (Vietnamita)
───────────────────────────────────────────── */
function AppleHelloVietnameseEffect({
  className,
  speed = 1,
  onAnimationComplete,
  ...props
}: Props) {
  const c = (x: number) => x / speed; // più speed → più veloce

  return (
    <motion.svg
      className={cn("h-20 select-none", className)}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1009 200"
      fill="none"
      stroke="currentColor"
      strokeWidth="14.8883"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: APPLE_EASE }}
      {...props}
    >
      <title>xin chào</title>

      {/* X — primo tratto diagonale */}
      <motion.path
        d="M102.233 96.2277C75.6823 127.245 45.1612 158.759 11.4143 190.521"
        style={penStyle}
        initial={initialProps}
        animate={animateProps}
        transition={makeTransition(c(0.35), c(0))}
      />

      {/* I — curva ondulata lunga */}
      <motion.path
        d="M7.69214 116.575C9.67725 105.16 16.8733 95.7311 28.5358 95.7311
           C40.4465 95.7311 46.8981 105.408 53.3497 124.019
           C56.7409 133.283 60.1322 142.547 63.5234 151.81
           C73.689 179.58 81.1988 191.513 100.855 191.513
           C128.722 191.513 154.043 159.148 161.595 118.502
           C162.929 111.321 164.774 103.736 166.043 96.2273"
        style={penStyle}
        initial={initialProps}
        animate={animateProps}
        transition={makeTransition(c(0.75), c(0.3))}
      />

      {/* N — secondo arco */}
      <motion.path
        d="M166.043 96.2273C163.191 113.101 160.565 126.997 158.92 139.404
           C157.989 147.592 157.544 154.54 157.596 161.488
           C157.729 179.354 164.764 191.513 182.695 191.513
           C209.39 191.513 236.181 159.123 243.73 118.5
           C245.064 111.321 247.012 103.759 248.139 96.2273"
        style={penStyle}
        initial={initialProps}
        animate={animateProps}
        transition={makeTransition(c(0.55), c(0.95), APPLE_EASE_GENTLE)}
      />

      {/* — discesa verticale */}
      <motion.path
        d="M248.139 96.2278C243.424 127.741 239.454 158.759 234.491 190.272"
        style={penStyle}
        initial={initialProps}
        animate={animateProps}
        transition={makeTransition(c(0.3), c(1.45))}
      />

      {/* C — tratto curvo principale */}
      <motion.path
        d="M237.873 167.951C244.704 121.32 265.508 94.2422 290.322 94.2422
           C307.692 94.2422 316.625 106.153 315.136 123.026
           C313.896 135.681 309.677 150.322 308.685 162.729
           C307.444 179.85 316.499 191.513 330.769 191.513
           C348.722 191.513 359.309 179.314 364.143 165.965"
        style={penStyle}
        initial={initialProps}
        animate={animateProps}
        transition={makeTransition(c(0.9), c(1.72), APPLE_EASE_GENTLE)}
      />

      {/* H — arco grande con discesa */}
      <motion.path
        d="M535.91 109.876C531.265 100.446 520.943 93.4984 505.459 93.4984
           C476.516 93.4984 462.044 117.816 462.044 143.374
           C462.044 171.503 482.265 192.506 511.307 192.506
           C559.762 192.506 592.902 136.708 621.581 97.8807
           C640.764 71.9101 649.874 49.2359 650.372 31.1674
           C650.62 17.7684 644.168 7.60362 632.01 7.60362
           C618.61 7.60362 610.173 17.7684 604.963 41.1011
           C599.255 66.7441 595.037 96.1684 584.367 190.521"
        style={penStyle}
        initial={initialProps}
        animate={animateProps}
        transition={makeTransition(c(1.15), c(2.55))}
      />

      {/* À — secondo arco */}
      <motion.path
        d="M585.413 181.299C590.677 135.025 611.663 98.2125 638.213 98.2125
           C654.094 98.2125 664.187 110.868 661.321 128.982
           C659.708 139.652 656.794 152.059 655.128 164.217
           C653.102 179.602 658.89 191.513 676.813 191.513
           C702.178 191.513 717.375 164.077 725.613 135.196"
        style={penStyle}
        initial={initialProps}
        animate={animateProps}
        transition={makeTransition(c(1.0), c(3.55), APPLE_EASE_GENTLE)}
      />

      {/* O — loop curvo */}
      <motion.path
        d="M803.871 112.995C799.007 101.8 788.666 94.2423 772.207 94.2423
           C744.912 94.2423 724.398 121.538 723.052 150.818
           C721.878 177.617 734.244 192.681 751.857 192.505
           C776.858 192.255 795.234 167.699 803.437 115.742
           C804.449 109.332 805.498 102.638 806.51 96.2274"
        style={penStyle}
        initial={initialProps}
        animate={animateProps}
        transition={makeTransition(c(0.85), c(4.5))}
      />

      {/* Fine O + decorazione finale */}
      <motion.path
        d="M806.51 96.2274C805.486 102.73 804.461 109.232 803.436 115.735
           C798.955 144.175 796.887 155.395 797.109 162.729
           C797.628 179.85 803.785 191.513 820.064 191.513
           C842.563 191.513 860.966 164.721 870.266 138.289
           C879.653 111.612 891.315 94.9867 915.633 94.9867
           C935.732 94.9867 951.613 109.875 951.613 137.915
           C951.613 168.932 931.489 192.257 906.059 192.505
           C883.681 192.753 868.983 174.639 870.471 147.344
           C872.208 117.071 890.571 94.9867 914.64 94.9867
           C928.536 94.9867 940.207 101.164 949.38 107.89
           C974.247 126.031 993.407 114.82 1000.74 96.8832"
        style={penStyle}
        initial={initialProps}
        animate={animateProps}
        transition={makeTransition(c(1.55), c(5.25))}
      />

      {/* Accento giallo — tocco finale */}
      <motion.path
        className="stroke-yellow-400"
        d="M763.027 19.3039C768.734 34.6886 780.397 48.3362 792.059 55.5322"
        style={penStyle}
        initial={initialProps}
        animate={animateProps}
        transition={{
          ...makeTransition(c(0.55), c(6.7)),
          // L'accento "scatta" con un leggero rimbalzo
          pathLength: {
            duration: c(0.55),
            delay: c(6.7),
            ease: APPLE_EASE,
          },
        }}
        onAnimationComplete={onAnimationComplete}
      />
    </motion.svg>
  );
}

/* ─────────────────────────────────────────────
   HELLO (Inglese)
───────────────────────────────────────────── */
function AppleHelloEnglishEffect({
  className,
  speed = 1,
  onAnimationComplete,
  ...props
}: Props) {
  const c = (x: number) => x / speed;

  return (
    <motion.svg
      className={cn("h-20 select-none", className)}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 638 200"
      fill="none"
      stroke="currentColor"
      strokeWidth="14.8883"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: APPLE_EASE }}
      {...props}
    >
      <title>hello</title>

      {/* H — discesa con arco iniziale */}
      <motion.path
        d="M8.69214 166.553C36.2393 151.239 61.3409 131.548 89.8191 98.0295
           C109.203 75.1488 119.625 49.0228 120.122 31.0026
           C120.37 17.6036 113.836 7.43883 101.759 7.43883
           C88.3598 7.43883 79.9231 17.6036 74.7122 40.9363
           C69.005 66.5793 64.7866 96.0036 54.1166 190.356"
        style={penStyle}
        initial={initialProps}
        animate={animateProps}
        transition={makeTransition(c(0.85), c(0))}
      />

      {/* ELLO — tutto in un colpo solo, come la vera scrittura corsiva */}
      <motion.path
        d="M55.1624 181.135C60.6251 133.114 81.4118 98.0479 107.963 98.0479
           C123.844 98.0479 133.937 110.703 131.071 128.817
           C129.457 139.487 127.587 150.405 125.408 163.06
           C122.869 178.941 130.128 191.348 152.122 191.348
           C184.197 191.348 219.189 173.523 237.097 145.915
           C243.198 136.509 245.68 128.073 245.928 119.884
           C246.176 104.996 237.739 93.8296 222.851 93.8296
           C203.992 93.8296 189.6 115.17 189.6 142.465
           C189.6 171.745 205.481 192.341 239.208 192.341
           C285.066 192.341 335.86 137.292 359.199 75.8585
           C365.788 58.513 368.26 42.4065 368.26 31.1512
           C368.26 17.8057 364.042 7.55823 352.131 7.55823
           C340.469 7.55823 332.777 16.6141 325.829 30.9129
           C317.688 47.4967 311.667 71.4162 309.203 98.4549
           C303 166.301 316.896 191.348 349.936 191.348
           C390 191.348 434.542 135.534 457.286 75.6686
           C463.803 58.513 466.275 42.4065 466.275 31.1512
           C466.275 17.8057 462.057 7.55823 450.146 7.55823
           C438.484 7.55823 430.792 16.6141 423.844 30.9129
           C415.703 47.4967 409.682 71.4162 407.218 98.4549
           C401.015 166.301 414.911 191.348 444.416 191.348
           C473.874 191.348 489.877 165.67 499.471 138.402
           C508.955 111.447 520.618 94.8221 544.935 94.8221
           C565.035 94.8221 580.916 109.71 580.916 137.75
           C580.916 168.768 560.792 192.093 535.362 192.341
           C512.984 192.589 498.285 174.475 499.774 147.179
           C501.511 116.907 519.873 94.8221 543.943 94.8221
           C557.839 94.8221 569.51 100.999 578.682 107.725
           C603.549 125.866 622.709 114.656 630.047 96.7186"
        style={penStyle}
        initial={initialProps}
        animate={animateProps}
        transition={makeTransition(c(2.9), c(0.65), APPLE_EASE_GENTLE)}
        onAnimationComplete={onAnimationComplete}
      />
    </motion.svg>
  );
}

/* ─────────────────────────────────────────────
   DENUVO — testo mascherato
───────────────────────────────────────────── */
function AppleHelloDenuvoEffect({
  className,
  speed = 1,
  onAnimationComplete,
  ...props
}: Props) {
  const c = (x: number) => x / speed;

  return (
    <motion.svg
      className={cn("h-20 select-none", className)}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 820 220"
      fill="none"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: APPLE_EASE }}
      {...props}
    >
      <title>Denuvo</title>

      <defs>
        <mask id="denuvo-write-mask" maskUnits="userSpaceOnUse">
          <motion.rect
            x="-30"
            y="0"
            height="220"
            fill="white"
            initial={{ width: 0 }}
            animate={{ width: 900 }}
            transition={{
              duration: c(3.25),
              // Accelera all'inizio, decelera morbidamente — come una firma
              ease: APPLE_EASE_GENTLE,
            }}
            onAnimationComplete={onAnimationComplete}
          />
        </mask>
      </defs>

      <motion.text
        x="58"
        y="155"
        fill="currentColor"
        mask="url(#denuvo-write-mask)"
        style={{
          fontFamily: '"Bumbbled", "Brush Script MT", cursive',
          fontSize: 176,
          fontWeight: 400,
          letterSpacing: 0,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: c(0.2),
          ease: "linear",
        }}
      >
        Denuvo
      </motion.text>
    </motion.svg>
  );
}

export {
  AppleHelloDenuvoEffect,
  AppleHelloEnglishEffect,
  AppleHelloVietnameseEffect,
};