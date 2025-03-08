import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface Message {
  id: string;
  data?: {
    [key: string]: unknown;
  };
  content: string;
  role: "user" | "ai";
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
