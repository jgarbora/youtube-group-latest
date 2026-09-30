import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { ChannelsConfig } from "./types";

dotenv.config();

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === "") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value.trim();
}

function loadChannelsConfig(): ChannelsConfig {
  const configPath = path.resolve(process.cwd(), "channels.json");

  if (!fs.existsSync(configPath)) {
    throw new Error("channels.json not found");
  }

  let raw: string;
  try {
    raw = fs.readFileSync(configPath, "utf-8");
  } catch (err) {
    throw new Error(`Failed to read channels.json: ${err}`);
  }

  let data: ChannelsConfig;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error("channels.json contains invalid JSON");
  }

  if (!Array.isArray(data.categories) || data.categories.length === 0) {
    throw new Error("channels.json must contain at least one category");
  }

  const slugs = new Set<string>();

  for (const category of data.categories) {
    if (!category.name || category.name.trim() === "") {
      throw new Error("Each category must have a non-empty name");
    }
    if (!category.slug || category.slug.trim() === "") {
      throw new Error(`Category "${category.name}" must have a non-empty slug`);
    }
    if (!Array.isArray(category.channels) || category.channels.length === 0) {
      throw new Error(
        `Category "${category.name}" must have at least one channel`
      );
    }
    if (slugs.has(category.slug)) {
      throw new Error(`Duplicate category slug: ${category.slug}`);
    }
    slugs.add(category.slug);
  }

  return data;
}

const channelsConfig = loadChannelsConfig();

export function getAllChannelIds(): string[] {
  return channelsConfig.categories.flatMap((c) => c.channels);
}

export function getChannelIdsByCategory(
  slug: string
): string[] | undefined {
  const category = channelsConfig.categories.find((c) => c.slug === slug);
  return category?.channels;
}

export const config = {
  youtubeApiKey: requireEnv("YOUTUBE_API_KEY"),
  // Shorts are excluded by default. Set INCLUDE_SHORTS=true to get them back.
  includeShorts: process.env.INCLUDE_SHORTS?.trim().toLowerCase() === "true",
  categories: channelsConfig.categories,
  port: parseInt(process.env.PORT || "3000", 10),
};
