import { store } from "@/store";
import { lazy, Suspense } from "react";
import { Search } from "@/components/search";
import { ChatWidget } from "@/components/chat";
import { useShallow } from "zustand/react/shallow";
import { motion, AnimatePresence } from "framer-motion";
import { createFileRoute } from "@tanstack/react-router";
import { MapProvider } from "@/components/ui/maps-context";

const Maps = lazy(() => import("@/components/maps"));

const DeckGLLayers = lazy(() => import("@/components/deckgl"));

export const Route = createFileRoute("/")({
  component: Features,
});

function Features() {
  const messageLength = store(useShallow((state) => state.messages.length));

  return (
    <MapProvider>
      <div className="relative h-svh w-full">
        <Suspense>
          <DeckGLLayers />
        </Suspense>
        <Suspense>
          <Maps />
        </Suspense>
      </div>
      <AnimatePresence mode="wait">
        {messageLength === 0 ? (
          <motion.div
            key="search"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Search />
          </motion.div>
        ) : (
          <motion.div
            key="chat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ChatWidget />
          </motion.div>
        )}
      </AnimatePresence>
    </MapProvider>
  );
}
