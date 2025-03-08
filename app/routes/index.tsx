import { store } from "@/store";
import { Maps } from "@/components/maps";
import { Search } from "@/components/search";
import { ChatWidget } from "@/components/chat";
import { MapProvider } from "@/components/ui/maps";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Features,
});

function Features() {
  const messageLength = store((s) => s.messages.length);

  return (
    <MapProvider>
      {messageLength === 0 && <Search />}
      <div className="relative h-svh w-full">
        <Maps />
      </div>
      {messageLength > 0 && <ChatWidget />}
    </MapProvider>
  );
}
