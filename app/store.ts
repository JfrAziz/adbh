import { ulid } from "ulid";
import { create } from "zustand";
import { GeoJSON } from "geojson";
import { PREDEFINED_QUERY } from "./data";
import { immer } from "zustand/middleware/immer";
import { useMutation } from "@tanstack/react-query";

export interface DataPoint {
  _key: string;
  _id: string;
  _rev: string;
  type: "EVChargingStation" | "WasteRecycleFacility" | "GreeneryLand";
  location: {
    lat: number;
    lon: number;
  };
}

export interface Message {
  id: string;
  content: string;
  role: "user" | "ai";
  data?: {
    data_points?: DataPoint[];
    data_polygon?: GeoJSON;
  } & {
    [key: string]: unknown;
  };
}

export const store = create<{
  /**
   * active message id, this used to show the map data
   * from the message
   */
  active: string | null;
  /**
   * all messages
   */
  messages: Message[];
}>()(
  immer(() => ({
    active: null as string | null,
    messages: [] as Message[],
  }))
);

export const askAI = () =>
  useMutation({
    mutationFn: async (message: { text: string; predefinedId?: string }) => {
      const pre = PREDEFINED_QUERY.find((p) => {
        return p.id === message.predefinedId || p.text === message.text;
      });

      if (pre) {
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const data = await fetch(pre.source)
          .then((res) => res.json())
          .then((data) => {
            const messageData = { ...data.data.object };

            if ("data_polygon" in data)
              messageData.data_polygon = data.data_polygon as GeoJSON;

            return {
              text: data.data.text_generated as string,
              data: messageData,
            };
          });

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
