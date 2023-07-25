import { HatColor, HatShape } from "../types/command/hatStyles.types";

const hatColors: Record<HatColor, string | null> = {
  blue: "blue",
  green: "green",
  red: "red",
  pink: "pink",
  yellow: "yellow",
  userColor1: "navy",
  userColor2: "apricot",

  default: null,
};

const hatShapes: Record<HatShape, string | null> = {
  ex: "ex",
  fox: "fox",
  wing: "wing",
  hole: "hole",
  frame: "frame",
  curve: "curve",
  eye: "eye",
  play: "play",
  crosshairs: "cross",
  bolt: "bolt",

  default: null,
};

const marks: Record<string, string | null> = {
  cursor: "this",
  that: "that",
  source: "source",
  nothing: "nothing",

  explicit: null,
};

export const lineDirections = {
  modulo100: "row",
  relativeUp: "up",
  relativeDown: "down",
};

export function hatColorToSpokenForm(color: string): string {
  const result = hatColors[color as HatColor];
  if (result == null) {
    throw Error(`Unknown hat color '${color}'`);
  }
  return result;
}

export function hatShapeToSpokenForm(shape: string): string {
  const result = hatShapes[shape as HatShape];
  if (result == null) {
    throw Error(`Unknown hat shape '${shape}'`);
  }
  return result;
}

export function markTypeToSpokenForm(mark: string): string {
  const result = marks[mark];
  if (result == null) {
    throw Error(`Unknown mark '${mark}'`);
  }
  return result;
}
