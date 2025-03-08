import { ulid } from "ulid";
import { Message, store } from "./store";
import { useMutation } from "@tanstack/react-query";

import ev from "@/data/ev-charging-berlin.json?url";
import greenery from "@/data/greenery-land-hamburg.json?url";
import wasterRecycle from "@/data/waste-recycle-facility-bremen.json?url";

export const PREDEFINED_QUERY = [
  {
    id: "ev-charging-berlin",
    text: "Find EV charging stations in Berlin",
    source: ev,
  },
  {
    id: "greenery-land-hamburg",
    text: "How many greenery land in Hamburg?",
    source: greenery,
  },
  {
    id: "waste-recycle-facility-bremen",
    text: "Find waste recycle facility in Bremen",
    source: wasterRecycle,
  },
];

export const askAI = () =>
  useMutation({
    mutationFn: async (message: { text: string; predefinedId?: string }) => {
      const pre = PREDEFINED_QUERY.find((p) => p.id === message.predefinedId);

      if (pre) {
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const data = await fetch(pre.source)
          .then((res) => res.json())
          .then((data) => ({
            text: data.data.text_generated as string,
            data: {
              ...data.data?.object,
              data_polygon: data.data_polygon,
            },
          }));

        return data;
      }

      return undefined;
    },
    onSuccess: (data, variables) => {
      const message: Message = data
        ? {
            id: ulid(),
            role: "ai",
            data: data.data,
            content: data.text,
          }
        : {
            id: ulid(),
            role: "ai",
            content: "Sorry, I don't understand.",
          };

      store.setState((state) => {
        state.active = message.id;

        state.messages.push({
          id: ulid(),
          role: "user",
          content: variables.text,
        });

        state.messages.push(message);
      });

      return data;
    },
  });
