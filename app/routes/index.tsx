import { store } from "@/store";
import { Maps } from "@/components/maps";
import { Search } from "@/components/search";
import { ChatWidget } from "@/components/chat";
import { useShallow } from "zustand/react/shallow";
import { MapProvider } from "@/components/ui/maps";
import { motion, AnimatePresence } from "framer-motion";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Features,
});

function Features() {
  const messageLength = store(useShallow((state) => state.messages.length));

  return (
    <MapProvider>
      <div className="relative h-svh w-full">
        <Maps />
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
