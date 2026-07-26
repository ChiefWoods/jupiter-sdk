import { rootNodeFromAnchor } from "@codama/nodes-from-anchor";
import {
  assertIsNode,
  bottomUpTransformerVisitor,
  createFromRoot,
  updateProgramsVisitor,
} from "codama";
import { formatFile } from "../../scripts/format-file";

const productDir = import.meta.dir;
const anchorIdlPath = `${productDir}/idl/anchor.json`;
const codamaIdlPath = `${productDir}/idl/codama.json`;

/** Jupiter Governance (govern) program on mainnet. */
const GOVERN_PROGRAM_ADDRESS = "GovaE4iu227srtG2s3tZzB4RmWBzw8sTwrCLZz7kN7rY";

const anchorIdlFile = Bun.file(anchorIdlPath);
if (!(await anchorIdlFile.exists())) {
  throw new Error(`Failed to load Anchor IDL: ${anchorIdlPath} does not exist`);
}

const anchorIdl = await anchorIdlFile.json();
const codama = createFromRoot(rootNodeFromAnchor(anchorIdl));

// Older Anchor IDL omits `address`; Codama emits an empty program pubkey which
// breaks the Rust client (`address!("")`).
codama.update(
  updateProgramsVisitor({
    govern: { publicKey: GOVERN_PROGRAM_ADDRESS },
  }),
);

// Codama's Rust renderer scans `crate::path` tokens and treats `smart_wallet::SmartWallet`
// in docs as a missing Cargo dependency. Drop the faulty doc lines.
codama.update(
  bottomUpTransformerVisitor([
    {
      select: "[structFieldTypeNode]smartWallet",
      transform: (node) => {
        assertIsNode(node, "structFieldTypeNode");
        if (!node.docs?.some((doc) => doc.includes("smart_wallet::"))) {
          return node;
        }
        return {
          ...node,
          docs: node.docs.filter((doc) => !doc.includes("smart_wallet::")),
        };
      },
    },
  ]),
);

await Bun.write(codamaIdlPath, codama.getJson());
await formatFile(codamaIdlPath);
console.log(`Wrote ${codamaIdlPath}`);
