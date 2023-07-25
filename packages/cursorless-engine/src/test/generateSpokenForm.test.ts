import {
  Command,
  TestCaseFixtureLegacy,
  getRecordedTestPaths,
  getRecordedTestsDirPath,
  serialize,
  shouldUpdateFixtures,
} from "@cursorless/common";
import * as yaml from "js-yaml";
import * as assert from "node:assert";
import * as fs from "node:fs";
import { promises as fsp } from "node:fs";
import * as path from "node:path";
import { canonicalizeAndValidateCommand } from "../core/commandVersionUpgrades/canonicalizeAndValidateCommand";
import { generateSpokenForm } from "../core/commandVersionUpgrades/generateSpokenForm";

suite("Generate spoken forms", () => {
  const relativeDir = path.dirname(getRecordedTestsDirPath());

  getRecordedTestPaths().forEach((testPath) =>
    test(path.relative(relativeDir, testPath.split(".")[0]), () =>
      runTest(testPath),
    ),
  );
});

async function runTest(file: string) {
  const buffer = await fsp.readFile(file);
  const fixture = yaml.load(buffer.toString()) as TestCaseFixtureLegacy;
  const spokenForm = await generateSpokenFormWithHatTokenMapSuffix(
    file,
    fixture.command,
  );

  if (spokenForm == null) {
    return null;
  }

  if (shouldUpdateFixtures()) {
    if (fixture.command.spokenForm !== spokenForm) {
      fixture.command.spokenForm = spokenForm;
      await fsp.writeFile(file, serialize(fixture));
    }
  } else {
    assert.equal(fixture.command.spokenForm, spokenForm);
  }
}

async function generateSpokenFormWithHatTokenMapSuffix(
  file: string,
  command: Command,
): Promise<string | null> {
  const commandLatest = canonicalizeAndValidateCommand(command);
  const generatedSpokenForm = generateSpokenForm(commandLatest);

  if (generatedSpokenForm == null) {
    return null;
  }

  const suffix = await getHatTokenMapSuffix(file, command);
  return generatedSpokenForm + suffix;
}

async function getHatTokenMapSuffix(
  file: string,
  command: Command,
): Promise<string> {
  if (command.spokenForm == null || !(await isHatTokenMapTest(file))) {
    return "";
  }

  const originalComponents = command.spokenForm.split(" ");
  if (
    originalComponents.length > 2 &&
    originalComponents[originalComponents.length - 2] === "take"
  ) {
    return (
      " " + originalComponents.slice(originalComponents.length - 2).join(" ")
    );
  }

  return "";
}

async function isHatTokenMapTest(file: string): Promise<boolean> {
  const dir = path.dirname(file);
  const configFile = path.join(dir, "config.json");
  if (fs.existsSync(configFile)) {
    const buffer = await fsp.readFile(configFile);
    const config = JSON.parse(buffer.toString());
    return Boolean(config["isHatTokenMapTest"]);
  }
  return false;
}
