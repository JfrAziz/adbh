import ev from "@/data/1-ev-charging-berlin.json?url";
import greenery from "@/data/2-greenery-land-hamburg.json?url";
import wasterRecycle from "@/data/3-waste-recycle-facility-bremen.json?url";
import coLevel from "@/data/4-co-level-bayern.json?url";
import news from "@/data/5-news-berlin.json?url";
import popDensity from "@/data/6-pop-density-hessen.json?url";
import multiDataPoints from "@/data/7-multi-data-points.json?url";

export const CACHED_QUERY = [
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
  {
    id: "co-level-bayern",
    text: "Show me the location with the highest CO level in Bayern",
    source: coLevel,
  },
  {
    id: "news-berlin",
    text: "Retrieve news related to Berlin",
    source: news,
  },
  {
    id: "pop-density-hessen",
    text: "Find me highest population location in Hessen",
    source: popDensity,
  },
  {
    id: "multi-data-points",
    text: "Show me various facilities location in Munich",
    source: multiDataPoints,
  },
];
