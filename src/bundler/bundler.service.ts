import { Injectable } from '@nestjs/common';

type Input = {
  stringsInstructions: string[];
  signedDto: string;
  method: string;
  _id: string;
};

type BundleOutput = {
  signedInstructions: string[];
  dtos: { signedDto: string, method: string }[];
};

@Injectable()
export class BundlerService {

  private find(i: number, parent: number[]): number {
    if (parent[i] !== i) {
      parent[i] = this.find(parent[i], parent);
    }
    return parent[i];
  }

  private union(i: number, j: number, parent: number[], rank: number[]): void {
    const rootI = this.find(i, parent);
    const rootJ = this.find(j, parent);
    if (rootI !== rootJ) {
      if (rank[rootI] > rank[rootJ]) {
        parent[rootJ] = rootI;
      } else if (rank[rootI] < rank[rootJ]) {
        parent[rootI] = rootJ;
      } else {
        parent[rootJ] = rootI;
        rank[rootI]++;
      }
    }
  }

  generateBundle(inputs: Input[]): BundleOutput[] {
    const n = inputs.length;
    const parent = Array.from({ length: n }, (_, i) => i);
    const rank = Array(n).fill(0);

    const stringToIndices = new Map<string, number[]>();

    inputs.forEach((input, i) => {
      for (const str of input.stringsInstructions) {
        if (!stringToIndices.has(str)) {
          stringToIndices.set(str, []);
        }
        stringToIndices.get(str)!.push(i);
      }
    });

    for (const indices of stringToIndices.values()) {
      for (let i = 1; i < indices.length; i++) {
        this.union(indices[0], indices[i], parent, rank);
      }
    }

    const groups = new Map<number, Input[]>();
    for (let i = 0; i < n; i++) {
      const root = this.find(i, parent);
      if (!groups.has(root)) {
        groups.set(root, []);
      }
      groups.get(root)!.push(inputs[i]);
    }

    const bundles: BundleOutput[] = [];
    for (const group of groups.values()) {
      const allInstructions = new Set<string>();
      const dtoList: { signedDto: string; method: string, uniqueId: string }[] = [];

      for (const input of group) {
        input.stringsInstructions.forEach(str => allInstructions.add(str));
        dtoList.push({ signedDto: input.signedDto, method: input.method, uniqueId: input._id.toString() });
      }

      bundles.push({
        signedInstructions: Array.from(allInstructions),
        dtos: dtoList,
      });
    }

    return bundles;
  }

}
