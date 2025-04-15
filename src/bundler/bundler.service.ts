import { Injectable } from '@nestjs/common';

@Injectable()
export class BundlerService {
  private find(s: string, parent: Map<string, string>): string {
    if (parent.get(s) !== s) {
      parent.set(s, this.find(parent.get(s)!, parent)); // Path compression
    }
    return parent.get(s)!;
  }

  private union(a: string, b: string, parent: Map<string, string>, rank: Map<string, number>): void {
    const rootA = this.find(a, parent);
    const rootB = this.find(b, parent);

    if (rootA !== rootB) {
      const rankA = rank.get(rootA) || 0;
      const rankB = rank.get(rootB) || 0;

      if (rankA > rankB) {
        parent.set(rootB, rootA);
      } else if (rankA < rankB) {
        parent.set(rootA, rootB);
      } else {
        parent.set(rootB, rootA);
        rank.set(rootA, rankA + 1);
      }
    }
  }

  generateBundle(input: string[]): string[][] {
    const parent = new Map<string, string>();
    const rank = new Map<string, number>();
    const charToString = new Map<string, string>();

    for (const str of input) {
      parent.set(str, str);
      rank.set(str, 1);
    }

    for (const str of input) {
      for (const char of str) {
        if (charToString.has(char)) {
          this.union(str, charToString.get(char)!, parent, rank);
        } else {
          charToString.set(char, str);
        }
      }
    }
    const groups = new Map<string, string[]>();
    for (const str of input) {
      const root = this.find(str, parent);
      if (!groups.has(root)) {
        groups.set(root, []);
      }
      groups.get(root)!.push(str);
    }

    return Array.from(groups.values());
  }
}
