import { HatColor, HatShape, VscodeHatStyleName } from "@cursorless/common";

export function getStyleName(
  color: HatColor,
  shape: HatShape,
): VscodeHatStyleName {
  if (shape === "default") {
    return color;
  }

  return `${color}-${shape}`;
}
