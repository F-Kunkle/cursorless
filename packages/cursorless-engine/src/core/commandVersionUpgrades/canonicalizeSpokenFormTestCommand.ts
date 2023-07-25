import {
  Command,
  CommandV5,
  PartialPrimitiveTargetDescriptorV5,
  PartialRangeTargetDescriptorV5,
  PartialTargetDescriptorV5,
} from "@cursorless/common";
import { canonicalizeAndValidateCommand } from "./canonicalizeAndValidateCommand";
import { upgradeV0ToV1 } from "./upgradeV0ToV1";
import { upgradeV1ToV2 } from "./upgradeV1ToV2";
import { upgradeV2ToV3 } from "./upgradeV2ToV3";
import { upgradeV3ToV4 } from "./upgradeV3ToV4";
import { upgradeV4ToV5 } from "./upgradeV4ToV5";

/**
 * Temporarily here to support spoken form tests for current(v5) Talon side grammar
 * TODO: remove
 */
export function canonicalizeSpokenFormTestCommand(
  command: Command,
): Required<CommandV5> | null {
  while (command.version < 5) {
    switch (command.version) {
      case 0:
        command = upgradeV0ToV1(command);
        break;
      case 1:
        command = upgradeV1ToV2(command);
        break;
      case 2:
        command = upgradeV2ToV3(command);
        break;
      case 3:
        command = upgradeV3ToV4(command);
        break;
      case 4:
        command = upgradeV4ToV5(command);
        break;
    }
  }

  if (command.version !== 5) {
    return null;
  }

  const canonicalCommand: Required<CommandV5> = {
    version: 5,
    spokenForm: "",
    action: {
      name: command.action.name,
      args: command.action.args ?? [],
    },
    targets: command.targets.map(canonicalizeTargetsV5),
    usePrePhraseSnapshot: true,
  };

  const commandLatest = canonicalizeAndValidateCommand(canonicalCommand);
  const spokenForm = generateSpokenForm(commandLatest);

  if (spokenForm == null) {
    return null;
  }

  canonicalCommand.spokenForm = spokenForm;

  return canonicalCommand;
}

function canonicalizeTargetsV5(
  target: PartialTargetDescriptorV5,
): PartialTargetDescriptorV5 {
  switch (target.type) {
    case "list":
      return {
        type: target.type,
        elements: target.elements.map(
          canonicalizeTargetsV5,
        ) as PartialPrimitiveTargetDescriptorV5[],
      };
    case "range": {
      const result: PartialRangeTargetDescriptorV5 = {
        type: target.type,
        anchor: canonicalizeTargetsV5(
          target.anchor,
        ) as PartialPrimitiveTargetDescriptorV5,
        active: canonicalizeTargetsV5(
          target.active,
        ) as PartialPrimitiveTargetDescriptorV5,
        excludeAnchor: target.excludeAnchor,
        excludeActive: target.excludeActive,
      };
      if (target.rangeType != null) {
        result.rangeType = target.rangeType;
      }
      return result;
    }

    case "primitive": {
      const result: PartialTargetDescriptorV5 = {
        type: "primitive",
      };
      if (target.modifiers != null) {
        result.modifiers = target.modifiers;
      }
      if (target.mark != null) {
        result.mark = target.mark;
      }
      return result;
    }
    case "implicit":
      return target;
  }
}
