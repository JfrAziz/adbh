import { useState } from "react";
import { store, askAI } from "@/store";
import { cn } from "@/utils/classnames";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea-auto-expand";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Drawer, DrawerTrigger, DrawerContent } from "@/components/ui/drawer";
import {
  XIcon,
  BotIcon,
  MapIcon,
  LoaderIcon,
  CircleDotIcon,
  SendHorizonalIcon,
} from "lucide-react";

const ChatHistory = () => {
  const [search, setSearch] = useState("");

  const ask = askAI();

  const active = store((state) => state.active);

  const messages = store((state) => state.messages);

  return (
    <Card className="flex flex-col overflow-hidden p-0">
      <CardHeader className="flex flex-row items-center justify-between gap-2 p-2">
        <h1 className="flex flex-row items-center gap-2 font-bold text-lg">
          <BotIcon />
          <div>Gen AI</div>
        </h1>
        <Button
          size="sm"
          variant="outline"
          className="h-7 gap-1 text-xs"
          onClick={() =>
            store.setState((state) => {
              state.messages = [];
            })
          }
        >
          <div>Close</div>
          <XIcon className="size-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col overflow-hidden p-0">
        <div className="flex-1 space-y-2 overflow-auto p-2">
          {messages.map((message, i) => (
            <div
              key={i}
              className={cn(
                "flex gap-y-2",
                message.role === "user" && "justify-end",
                message.role === "ai" && "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] space-y-2 rounded-sm p-3",
                  message.role === "user"
                    ? "ml-auto rounded-br-none border bg-muted text-foreground"
                    : "mr-auto rounded-bl-none bg-muted text-foreground"
                )}
              >
                <div className="text-sm">{message.content}</div>
                {!!message.data && (
                  <div
                    className={cn(
                      "rounded-sm text-xs",
                      message.role === "ai" &&
                        "bg-background text-muted-foreground",
                      message.role === "user" && "border text-muted-foreground"
                    )}
                  >
                    <div className="flex flex-row items-center justify-between gap-x-2 border-border/50 border-b px-2 py-1">
                      <div>Maps Data</div>
                      <Button
                        size="sm"
                        className="h-6 px-2 font-mono text-xs"
                        variant={active === message.id ? "ghost" : "default"}
                        onClick={() => {
                          store.setState((state) => {
                            state.active = message.id;
                          });
                        }}
                      >
                        view
                      </Button>
                    </div>
                    <ul className="space-y-2 px-2 py-1 text-xs">
                      {message.data.data_points && (
                        <li className="flex flex-row items-center gap-x-2">
                          <CircleDotIcon className="size-4" />
                          <div className="line-clamp-1 flex-1">Data Points</div>
                        </li>
                      )}
                      {message.data.data_polygon && (
                        <li className="flex flex-row items-center gap-x-2">
                          <MapIcon className="size-4" />
                          <div className="line-clamp-1 flex-1">Polygon Map</div>
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="relative flex-1 p-2">
          <Textarea
            autoFocus
            value={search}
            disabled={ask.isPending}
            placeholder="Ask to follow up"
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button
            disabled={ask.isPending}
            className="absolute right-4 bottom-4 h-7 space-x-1 text-xs"
            onClick={() => {
              ask.mutate({ text: search }, { onSuccess: () => setSearch("") });
            }}
          >
            <span>Send</span>
            {!ask.isPending && <SendHorizonalIcon className="size-3" />}
            {ask.isPending && <LoaderIcon className="size-3 animate-spin" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const ChatWidgetDesktop = () => {
  return (
    <div className="absolute top-0 left-0 z-10 flex max-h-svh w-full max-w-sm flex-col space-y-2 overflow-hidden p-2">
      <ChatHistory />
    </div>
  );
};

const ChatWidgetMobile = () => {
  return (
    <div className="fixed bottom-0 left-0 z-10 flex w-full flex-row items-center gap-x-2 p-2">
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline" className="w-full gap-x-2">
            <span>Ask AI</span>
            <BotIcon className="size-4" />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="flex max-h-svh w-svw flex-1 flex-col overflow-hidden">
            <ChatHistory />
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export const ChatWidget = () => {
  return (
    <div>
      <div className="hidden md:flex">
        <ChatWidgetDesktop />
      </div>
      <div className="md:hidden">
        <ChatWidgetMobile />
      </div>
    </div>
  );
};
