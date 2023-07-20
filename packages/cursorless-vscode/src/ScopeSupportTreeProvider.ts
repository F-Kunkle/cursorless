import { ScopeType } from "@cursorless/common";
import {
  ScopeProvider,
  ScopeSupport,
  ScopeSupportLevels,
} from "@cursorless/cursorless-engine";
import * as vscode from "vscode";

export class ScopeSupportTreeProvider
  implements vscode.TreeDataProvider<TreeItem>
{
  private onDidChangeScopeSupportDisposable: vscode.Disposable | undefined;
  private treeView: vscode.TreeView<TreeItem>;
  private supportLevels: ScopeSupportLevels = [];

  private _onDidChangeTreeData: vscode.EventEmitter<
    TreeItem | undefined | null | void
  > = new vscode.EventEmitter<TreeItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<
    TreeItem | undefined | null | void
  > = this._onDidChangeTreeData.event;

  constructor(
    private context: vscode.ExtensionContext,
    private scopeProvider: ScopeProvider,
  ) {
    this.treeView = vscode.window.createTreeView("cursorlessScopeSupport", {
      treeDataProvider: this,
    });

    this.context.subscriptions.push(
      this.treeView,
      this.treeView.onDidChangeVisibility(this.onDidChangeVisible, this),
      this,
    );
  }

  static create(
    context: vscode.ExtensionContext,
    scopeProvider: ScopeProvider,
  ): ScopeSupportTreeProvider {
    const treeProvider = new ScopeSupportTreeProvider(context, scopeProvider);
    treeProvider.init();
    return treeProvider;
  }

  init() {
    if (this.treeView.visible) {
      this.registerScopeSupportListener();
    }
  }

  onDidChangeVisible(e: vscode.TreeViewVisibilityChangeEvent) {
    if (e.visible) {
      if (this.onDidChangeScopeSupportDisposable != null) {
        return;
      }

      this.registerScopeSupportListener();
    } else {
      if (this.onDidChangeScopeSupportDisposable == null) {
        return;
      }

      this.onDidChangeScopeSupportDisposable.dispose();
      this.onDidChangeScopeSupportDisposable = undefined;
    }
  }

  private registerScopeSupportListener() {
    this.onDidChangeScopeSupportDisposable =
      this.scopeProvider.onDidChangeScopeSupport((supportLevels) => {
        this.supportLevels = supportLevels;
        this._onDidChangeTreeData.fire();
      });
  }

  getTreeItem(element: TreeItem): TreeItem {
    return element;
  }

  getChildren(element?: TreeItem): TreeItem[] {
    if (element == null) {
      return getSupportCategories();
    }

    if (element instanceof SupportCategoryTreeItem) {
      return this.getScopeTypesWithSupport(element.scopeSupport);
    }

    throw new Error("Unexpected element");
  }

  getScopeTypesWithSupport(scopeSupport: ScopeSupport): ScopeSupportTreeItem[] {
    return this.supportLevels
      .filter((supportLevel) => supportLevel.support === scopeSupport)
      .map((supportLevel) => new ScopeSupportTreeItem(supportLevel.scopeType));
  }

  dispose() {
    this.onDidChangeScopeSupportDisposable?.dispose();
  }
}

function getSupportCategories(): SupportCategoryTreeItem[] {
  return [
    new SupportCategoryTreeItem(
      "Supported and present in editor",
      ScopeSupport.supportedAndPresentInEditor,
      vscode.TreeItemCollapsibleState.Expanded,
    ),
    new SupportCategoryTreeItem(
      "Supported but not present in editor",
      ScopeSupport.supportedButNotPresentInEditor,
      vscode.TreeItemCollapsibleState.Expanded,
    ),
    new SupportCategoryTreeItem(
      "Supported using legacy pathways",
      ScopeSupport.supportedLegacy,
      vscode.TreeItemCollapsibleState.Expanded,
    ),
    new SupportCategoryTreeItem(
      "Unsupported",
      ScopeSupport.unsupported,
      vscode.TreeItemCollapsibleState.Collapsed,
    ),
  ];
}

class ScopeSupportTreeItem extends vscode.TreeItem {
  constructor(scopeType: ScopeType) {
    super(scopeType.type, vscode.TreeItemCollapsibleState.None);
  }
}

class SupportCategoryTreeItem extends vscode.TreeItem {
  constructor(
    label: string,
    public readonly scopeSupport: ScopeSupport,
    collapsibleState: vscode.TreeItemCollapsibleState,
  ) {
    super(label, collapsibleState);
  }
}

type TreeItem = ScopeSupportTreeItem | SupportCategoryTreeItem;
