import { rootNodeFromAnchor } from "@codama/nodes-from-anchor";
import {
  assertIsNode,
  bottomUpTransformerVisitor,
  createFromRoot,
  instructionAccountNode,
} from "codama";
import { formatFile } from "../../scripts/format-file";

const productDir = import.meta.dir;
const anchorIdlPath = `${productDir}/idl/anchor.json`;
const codamaIdlPath = `${productDir}/idl/codama.json`;

const anchorIdlFile = Bun.file(anchorIdlPath);
if (!(await anchorIdlFile.exists())) {
  throw new Error(`Failed to load Anchor IDL: ${anchorIdlPath} does not exist`);
}

const anchorIdl = await anchorIdlFile.json();
const codama = createFromRoot(rootNodeFromAnchor(anchorIdl));

/**
 * Anchor names the Instructions sysvar account `instruction`. Codama's Rust
 * builder always emits `fn instruction(&self) -> Instruction` to finalize the
 * ix, so an account setter of the same name duplicates the method (E0592).
 * Rename to `instructionSysvar` before rendering clients.
 */
codama.update(
  bottomUpTransformerVisitor([
    {
      select: "[instructionAccountNode]instruction",
      transform: (node) => {
        assertIsNode(node, "instructionAccountNode");
        return instructionAccountNode({ ...node, name: "instructionSysvar" });
      },
    },
  ]),
);

await Bun.write(codamaIdlPath, codama.getJson());
await formatFile(codamaIdlPath);
console.log(`Wrote ${codamaIdlPath}`);
