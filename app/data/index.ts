import ev from "@/data/1-ev-charging-berlin.json?url";
import greenery from "@/data/2-greenery-land-hamburg.json?url";
import wasterRecycle from "@/data/3-waste-recycle-facility-bremen.json?url";

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
