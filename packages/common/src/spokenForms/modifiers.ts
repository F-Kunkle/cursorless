import {
  CompositeKeyMap,
  ModifierType,
  NoSpokenFormError,
  SimpleScopeTypeType,
  SurroundingPairName,
} from "..";

export const modifiers: Record<ModifierType, string | null> = {
  excludeInterior: "bounds",
  toRawSelection: "just",
  leading: "leading",
  trailing: "trailing",
  keepContentFilter: "content",
  keepEmptyFilter: "empty",
  inferPreviousMark: "its",
  startOf: "start of",
  endOf: "end of",
  interiorOnly: "inside",
  extendThroughStartOf: "head",
  extendThroughEndOf: "tail",
  everyScope: "every",

  containingScope: null,
  ordinalScope: null,
  relativeScope: null,
  modifyIfUntyped: null,
  cascading: null,
  range: null,
};

export const modifiersExtra = {
  first: "first",
  last: "last",
  previous: "previous",
  next: "next",
  forward: "forward",
  backward: "backward",
};

const scopes: Record<SimpleScopeTypeType, string | null> = {
  argumentOrParameter: "arg",
  attribute: "attribute",
  functionCall: "call",
  functionCallee: "callee",
  className: "class name",
  class: "class",
  comment: "comment",
  functionName: "funk name",
  namedFunction: "funk",
  ifStatement: "if state",
  instance: "instance",
  collectionItem: "item",
  collectionKey: "key",
  anonymousFunction: "lambda",
  list: "list",
  map: "map",
  name: "name",
  regularExpression: "regex",
  section: "section",
  sectionLevelOne: "one section",
  sectionLevelTwo: "two section",
  sectionLevelThree: "three section",
  sectionLevelFour: "four section",
  sectionLevelFive: "five section",
  sectionLevelSix: "six section",
  selector: "selector",
  statement: "state",
  string: "string",
  branch: "branch",
  type: "type",
  value: "value",
  condition: "condition",
  unit: "unit",
  //  XML, JSX
  xmlElement: "element",
  xmlBothTags: "tags",
  xmlStartTag: "start tag",
  xmlEndTag: "end tag",
  // LaTeX
  part: "part",
  chapter: "chapter",
  subSection: "subsection",
  subSubSection: "subsubsection",
  namedParagraph: "paragraph",
  subParagraph: "subparagraph",
  environment: "environment",
  // Text-based scope types
  character: "char",
  word: "word",
  token: "token",
  identifier: "identifier",
  line: "line",
  sentence: "sentence",
  paragraph: "block",
  document: "file",
  nonWhitespaceSequence: "paint",
  boundedNonWhitespaceSequence: "short paint",
  url: "link",
  notebookCell: "cell",

  switchStatementSubject: null,
};

const surroundingPairsSpoken: Record<SurroundingPairName, string | null> = {
  curlyBrackets: "curly",
  angleBrackets: "diamond",
  escapedDoubleQuotes: "escaped quad",
  escapedSingleQuotes: "escaped twin",
  escapedParentheses: "escaped round",
  escapedSquareBrackets: "escaped box",
  doubleQuotes: "quad",
  parentheses: "round",
  backtickQuotes: "skis",
  squareBrackets: "box",
  singleQuotes: "twin",
  any: "pair",
  string: "string",

  collectionBoundary: null,

  // whitespace: "void",
};

const surroundingPairsDelimiters: Record<
  SurroundingPairName,
  [string, string] | null
> = {
  curlyBrackets: ["{", "}"],
  angleBrackets: ["<", ">"],
  escapedDoubleQuotes: ['\\"', '\\"'],
  escapedSingleQuotes: ["\\'", "\\'"],
  escapedParentheses: ["\\(", "\\)"],
  escapedSquareBrackets: ["\\[", "\\]"],
  doubleQuotes: ['"', '"'],
  parentheses: ["(", ")"],
  backtickQuotes: ["`", "`"],
  squareBrackets: ["[", "]"],
  singleQuotes: ["'", "'"],

  any: null,
  string: null,
  collectionBoundary: null,
};
const surroundingPairDelimiterToName = new CompositeKeyMap<
  [string, string],
  SurroundingPairName
>((pair) => pair);

for (const [name, pair] of Object.entries(surroundingPairsDelimiters)) {
  if (pair != null) {
    surroundingPairDelimiterToName.set(pair, name as SurroundingPairName);
  }
}

export const surroundingPairForceDirections = {
  left: "left",
  right: "right",
};

export function modifierTypeToSpokenForm(modifier: ModifierType): string {
  const result = modifiers[modifier];
  if (result == null) {
    throw Error(`Unknown modifier '${modifier}'`);
  }
  return result;
}

export function scopeTypeTypeToSpokenForm(scope: SimpleScopeTypeType): string {
  if (scope === "switchStatementSubject") {
    throw new NoSpokenFormError(`No spoken form for scope '${scope}'`);
  }

  const result = scopes[scope];
  if (result == null) {
    throw Error(`Unknown scope '${scope}'`);
  }
  return result;
}

export function surroundingPairToSpokenForm(
  surroundingPair: SurroundingPairName,
): string {
  const result = surroundingPairsSpoken[surroundingPair];
  if (result == null) {
    throw Error(`Unknown surrounding pair '${surroundingPair}'`);
  }
  return result;
}

export function surroundingPairDelimitersToSpokenForm(
  left: string,
  right: string,
): string {
  const pairName = surroundingPairDelimiterToName.get([left, right]);
  if (pairName == null) {
    throw Error(`Unknown surrounding pair delimiters '${left} ${right}'`);
  }
  return surroundingPairToSpokenForm(pairName);
}
