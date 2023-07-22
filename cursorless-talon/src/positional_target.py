from typing import Any

from talon import Module

from .modifiers.position import construct_positional_modifier

mod = Module()


@mod.capture(
    rule=(
        "({user.cursorless_position} | {user.cursorless_source_destination_connective}) "
        "<user.cursorless_target>"
    )
)
def cursorless_positional_target(m) -> dict[str, Any]:
    target: dict[str, Any] = m.cursorless_target
    try:
        modifier = construct_positional_modifier(m.cursorless_position)
        return update_first_primitive_target(target, modifier)
    except AttributeError:
        return target


def update_first_primitive_target(target: dict[str, Any], modifier: dict[str, Any]):
    if target["type"] == "primitive":
        modifiers = target["modifiers"] if "modifiers" in target else []
        modifiers.insert(0, modifier)
        result = {"type": "primitive", "modifiers": modifiers}
        if "mark" in target:
            result["mark"] = target["mark"]
        return result
    elif target["type"] == "range":
        return {
            **target,
            "anchor": update_first_primitive_target(target["anchor"], modifier),
        }
    else:
        elements = target["elements"]
        return {
            **target,
            "elements": [
                update_first_primitive_target(elements[0], modifier),
                *elements[1:],
            ],
        }
