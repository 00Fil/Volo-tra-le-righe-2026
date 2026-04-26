"use client";

import { AnimatePresence, motion } from "motion/react";
import { AppleHelloDenuvoEffect } from "@/components/apple-hello-effect";

type IntroSplashProps = {
  visible: boolean;
};

export function IntroSplash({ visible }: IntroSplashProps) {
  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="fixed inset-0 z-[120] overflow-hidden bg-black"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.75, ease: "easeOut" } }}
        >
          <div className="relative flex h-full w-full items-center justify-center px-6 text-white">
            <motion.div
              className="w-full max-w-[44rem]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <AppleHelloDenuvoEffect speed={0.8} className="h-auto w-full" />
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
