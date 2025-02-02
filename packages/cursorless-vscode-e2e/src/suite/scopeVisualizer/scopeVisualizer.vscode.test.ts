import { commands } from "vscode";
import asyncSafety from "../../asyncSafety";
import { endToEndTestSetup } from "../../endToEndTestSetup";
import { runBasicMultilineContentTest } from "./runBasicMultilineContentTest";
import { runBasicRemovalTest } from "./runBasicRemovalTest";
import { runNestedMultilineContentTest } from "./runNestedMultilineContentTest";
import { runUpdateTest } from "./runUpdateTest";

suite("scope visualizer", async function () {
  endToEndTestSetup(this);

  teardown(() => commands.executeCommand("cursorless.hideScopeVisualizer"));

  test(
    "basic multiline content",
    asyncSafety(() => runBasicMultilineContentTest()),
  );
  test(
    "nested multiline content",
    asyncSafety(() => runNestedMultilineContentTest()),
  );
  test(
    "update",
    asyncSafety(() => runUpdateTest()),
  );
  test(
    "basic removal",
    asyncSafety(() => runBasicRemovalTest()),
  );
});
