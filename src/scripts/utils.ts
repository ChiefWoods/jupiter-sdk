import { resolve } from "node:path";

/** Resolve `src/products/<product-name>` from a product name CLI arg. */
export function resolveProductDir(productName: string): string {
  return resolve(import.meta.dir, "../products", productName);
}

/** Require at least one of `idl/anchor.json` or `idl/codama.json`. */
export async function assertProductIdl(productDir: string): Promise<void> {
  const anchorIdlPath = `${productDir}/idl/anchor.json`;
  const codamaIdlPath = `${productDir}/idl/codama.json`;
  const hasAnchorIdl = await Bun.file(anchorIdlPath).exists();
  const hasCodamaIdl = await Bun.file(codamaIdlPath).exists();

  if (!hasAnchorIdl && !hasCodamaIdl) {
    throw new Error(`Failed to find product IDL: need ${anchorIdlPath} or ${codamaIdlPath}`);
  }
}
