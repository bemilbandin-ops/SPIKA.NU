import "server-only";

import { randomInt } from "node:crypto";

const ADJECTIVES = [
  "amber",
  "bouncy",
  "breezy",
  "bright",
  "brisk",
  "bubbly",
  "calm",
  "cheeky",
  "chipper",
  "chummy",
  "clever",
  "cloudy",
  "cozy",
  "crafty",
  "crispy",
  "dandy",
  "daring",
  "dapper",
  "dreamy",
  "dusty",
  "eager",
  "electric",
  "fancy",
  "feathery",
  "fizzy",
  "fluffy",
  "forest",
  "frosty",
  "gentle",
  "giddy",
  "giggly",
  "glimmer",
  "golden",
  "happy",
  "hazy",
  "honey",
  "jaunty",
  "jazzy",
  "jolly",
  "lively",
  "lucky",
  "luminous",
  "mellow",
  "merry",
  "misty",
  "moonlit",
  "mossy",
  "nimble",
  "peppy",
  "playful",
  "plucky",
  "polished",
  "pouncy",
  "quirky",
  "radiant",
  "rapid",
  "rosy",
  "rustic",
  "sassy",
  "shiny",
  "silky",
  "sleepy",
  "sneaky",
  "snappy",
  "sparkly",
  "sprightly",
  "starry",
  "steady",
  "sunny",
  "swirly",
  "swift",
  "tidy",
  "twinkly",
  "upbeat",
  "velvety",
  "vivid",
  "warm",
  "wavy",
  "whimsical",
  "wild",
  "witty",
  "zany",
  "zesty"
] as const;

const NOUNS = [
  "alpaca",
  "anchor",
  "badger",
  "bagel",
  "balloon",
  "banana",
  "beetle",
  "biscuit",
  "blossom",
  "cactus",
  "candle",
  "carrot",
  "cookie",
  "cricket",
  "croissant",
  "daisy",
  "dolphin",
  "dumpling",
  "feather",
  "fern",
  "firefly",
  "flannel",
  "frog",
  "glacier",
  "hammock",
  "hamster",
  "hedgehog",
  "jellybean",
  "lantern",
  "lemon",
  "llama",
  "marshmallow",
  "meadow",
  "melon",
  "mitten",
  "moonbeam",
  "moose",
  "muffin",
  "mushroom",
  "noodle",
  "otter",
  "pancake",
  "pebble",
  "penguin",
  "pepper",
  "pickle",
  "pigeon",
  "pinecone",
  "planet",
  "plum",
  "pocket",
  "potato",
  "pretzel",
  "rabbit",
  "rainbow",
  "river",
  "sailboat",
  "seashell",
  "sparrow",
  "sprinkle",
  "squirrel",
  "starfish",
  "sunrise",
  "taco",
  "teacup",
  "thistle",
  "tomato",
  "tulip",
  "turnip",
  "waffle",
  "walnut",
  "willow",
  "zebra"
] as const;

const BLOCKED_WORDS = new Set<string>([]);
const BLOCKED_ALIASES = new Set<string>([]);

function pickRandom<T>(items: readonly T[]): T {
  return items[randomInt(items.length)]!;
}

function isAllowedAlias(alias: string): boolean {
  if (BLOCKED_ALIASES.has(alias)) {
    return false;
  }

  return alias
    .split("-")
    .every((part) => !BLOCKED_WORDS.has(part));
}

export function generateMemorableEventSearchCode(): string {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    const candidate = `${pickRandom(ADJECTIVES)}-${pickRandom(NOUNS)}`;

    if (isAllowedAlias(candidate)) {
      return candidate;
    }
  }

  throw new Error("Det gick inte att skapa ett nytt sÃ¶k-ID.");
}
