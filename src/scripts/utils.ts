import { resolve } from "node:path";

/** Resolve `src/products/<product-name>` from a product name CLI arg. */
export function resolveProductDir(productName: string): string {
  return resolve(import.meta.dir, "../products", productName);
}
