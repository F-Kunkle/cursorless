import * as os from "node:os";
import * as childProcess from "node:child_process";

export class TalonRepl {
  private child?: childProcess.ChildProcessWithoutNullStreams;

  async action(action: string) {
    return this.command(`actions.${action}`);
  }

  start() {
    return new Promise<void>((resolve, reject) => {
      const path = getReplPath();
      this.child = childProcess.spawn(path);

      if (!this.child.stdin) {
        reject("stdin is null");
        return;
      }

      this.child.stdout.once("data", () => {
        // The first data from the repl is always: Talon REPL | Python 3.9.13 ...
        resolve();
      });
    });
  }

  stop() {
    return new Promise<void>((resolve) => {
      if (this.child != null) {
        this.child.on("close", () => {
          this.child = undefined;
          resolve();
        });

        this.child.stdin.end();
      } else {
        resolve();
      }
    });
  }

  private async command(command: string) {
    return new Promise<string>((resolve, reject) => {
      if (this.child != null) {
        this.child.stdout.once("data", (data) => {
          resolve(data);
        });

        this.child.stdin.write(command);
        this.child.stdin.write("\n");
      } else {
        reject();
      }
    });
  }
}

function getReplPath() {
  return os.platform() === "win32"
    ? `${os.homedir()}\\AppData\\Roaming\\talon\\.venv\\Scripts\\repl.bat`
    : `${os.homedir()}/.talon/.venv/bin/repl`;
}
