import { rootNodeFromAnchor } from "@codama/nodes-from-anchor";
import {
  assertIsNode,
  bottomUpTransformerVisitor,
  createFromRoot,
  definedTypeLinkNode,
  definedTypeNode,
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
 * The IDL contains both the route-plan defined type `swap` and the `swapEvent`
 * event. The Web3.js renderer exposes both as `Swap`; rename the defined type
 * and every link to it so the generated clients expose `SwapType` and `Swap`.
 */
codama.update(
  bottomUpTransformerVisitor([
    {
      select: "[definedTypeNode]swap",
      transform: (node) => {
        assertIsNode(node, "definedTypeNode");
        return definedTypeNode({ ...node, name: "swapType" });
      },
    },
    {
      select: "[definedTypeLinkNode]swap",
      transform: (node) => {
        assertIsNode(node, "definedTypeLinkNode");
        return definedTypeLinkNode("swapType");
      },
    },
  ]),
);

await Bun.write(codamaIdlPath, codama.getJson());
await formatFile(codamaIdlPath);
console.log(`Wrote ${codamaIdlPath}`);
