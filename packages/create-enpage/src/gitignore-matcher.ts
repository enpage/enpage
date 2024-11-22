import fs from "node:fs";
import { minimatch } from "minimatch";
import { gitignoreToMinimatch } from "@humanwhocodes/gitignore-to-minimatch";

export class GitIgnoreMatcher {
  public readonly exists: boolean;
  protected patterns: string[] = [];

  constructor(
    private path: string,
    defaultPatterns: string[] = [],
  ) {
    this.exists = fs.existsSync(this.path);

    if (!this.exists) {
      return;
    }

    this.patterns = [
      ...defaultPatterns,
      ...fs
        .readFileSync(this.path, "utf-8")
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line !== "" && !line.startsWith("#"))
        .map(gitignoreToMinimatch),
    ];
  }

  public match(filename: string) {
    return this.patterns.some((pattern) => minimatch(filename, pattern));
  }
}
