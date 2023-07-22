import {
  TestCaseFixtureLegacy,
  getRecordedTestPaths,
  getRecordedTestsDirPath,
} from "@cursorless/common";
import * as assert from "assert";
import * as yaml from "js-yaml";
import { promises as fsp } from "node:fs";
import * as path from "node:path";
import { canonicalizeSpokenFormTestCommand } from "../core/commandVersionUpgrades/canonicalizeSpokenFormTestCommand";
import { TalonRepl } from "../testUtil/TalonRepl";

suite("Talon spoken forms", async function () {
  this.timeout(0);

  const repl = new TalonRepl();

  suiteSetup(async () => {
    await repl.start();
    await toggleTestMode(repl, true);
  });

  suiteTeardown(async () => {
    await toggleTestMode(repl, false);
    await repl.stop();
  });

  const relativeDir = path.dirname(getRecordedTestsDirPath());

  getRecordedTestPaths()
    // .filter((p) => p.endsWith("bringWhaleToEndOfFine.yml"))
    .forEach((testPath) =>
      test(path.relative(relativeDir, testPath.split(".")[0]), () =>
        runTest(repl, testPath),
      ),
    );
});

async function runTest(repl: TalonRepl, file: string) {
  const buffer = await fsp.readFile(file);
  const fixture = yaml.load(buffer.toString()) as TestCaseFixtureLegacy;
  const commandExpected = canonicalizeSpokenFormTestCommand(fixture.command);

  if (commandExpected == null) {
    return;
  }

  const result = await repl.action(
    `user.private_cursorless_spoken_form_test("${commandExpected.spokenForm}")`,
  );

  const commandActual = (() => {
    try {
      return JSON.parse(result);
    } catch (e) {
      throw Error(result.toString());
    }
  })();

  assert.deepStrictEqual(commandActual, commandExpected);
}

async function toggleTestMode(repl: TalonRepl, enabled: boolean) {
  const arg = enabled ? "True" : "False";
  return repl.action(`user.private_cursorless_spoken_form_test_mode(${arg})`);
}
