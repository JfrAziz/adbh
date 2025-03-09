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
  type: "EVChargingStation" | "WasteRecycleFacility" | "GreeneryLand" | "News";
  /**
   * if value exist, it is grid data
   */
  value?: number;
  location: {
    lat: number;
    lon: number;
  };
}

export interface DataNews {
  _key: string;
  _id: string;
  _rev: string;
  type: "News";
  content: string;
  date: string;
}

export interface Message {
  id: string;
  content: string;
  role: "user" | "ai";
  data?: {
    news?: DataNews[];
    map?: {
      grids?: DataPoint[];
      points?: DataPoint[];
      polygon?: GeoJSON;
    };
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
            type Data = Record<string, string>;

            const messageData: Message["data"] = {};

            const points = data.data.object.data_points.filter((d: Data) => {
              return !d.value && d.type !== "News";
            });

            if (points.length > 0)
              messageData.map = Object.assign(messageData.map || {}, {
                points: points as DataPoint[],
              });

            const grids = data.data.object.data_points.filter((d: Data) => {
              return d.value;
            });

            if (grids.length > 0)
              messageData.map = Object.assign(messageData.map || {}, {
                grids: grids as DataPoint[],
              });

            const news = data.data.object.data_points.filter((d: Data) => {
              return d.type === "News";
            });

            if (news.length > 0) messageData.news = news as [];

            if (
              data["data_polygon"] &&
              Object.keys(data["data_polygon"]).length > 0
            )
              messageData.map = Object.assign(messageData.map || {}, {
                polygon: data.data_polygon as GeoJSON,
              });

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
