import { askAI } from "@/store";
import { useState } from "react";
import { PREDEFINED_QUERY } from "@/data";
import { Button } from "@/components/ui/button";
import { LoaderIcon, SendHorizonalIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea-auto-expand";

export const Search = () => {
  const [search, setSearch] = useState("");

  const ask = askAI();

  return (
    <div className="absolute top-0 left-0 z-50 flex h-svh w-full items-center justify-center bg-black/75">
      <div className="w-full max-w-2xl space-y-4 p-4">
        <h1 className="pb-4 text-center font-bold text-5xl">
          What can I help you?
        </h1>
        <div className="relative">
          <Textarea
            rows={4}
            autoFocus
            value={search}
            disabled={ask.isPending}
            className="bg-background p-2"
            placeholder="Ask Gen AI to search"
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button
            size="sm"
            disabled={ask.isPending}
            onClick={() => ask.mutate({ text: "Search" })}
            className="absolute right-2 bottom-2 h-7 space-x-1 text-xs"
          >
            <span>Search</span>
            {!ask.isPending && <SendHorizonalIcon className="size-3" />}
            {ask.isPending && <LoaderIcon className="size-3 animate-spin" />}
          </Button>
        </div>
        <div className="flex flex-row flex-wrap items-stretch justify-center gap-2">
          {PREDEFINED_QUERY.map((item) => (
            <Button
              size="sm"
              key={item.id}
              variant="outline"
              disabled={ask.isPending}
              className="h-7 space-x-1 rounded-full text-xs"
              onClick={() => {
                setSearch(item.text);

                ask.mutate({ predefinedId: item.id, text: item.text });
              }}
            >
              {item.text}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
