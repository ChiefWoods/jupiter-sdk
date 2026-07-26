import { format } from "oxfmt";

/** Format a file in place with the oxfmt API. */
export async function formatFile(path: string): Promise<void> {
  const sourceText = await Bun.file(path).text();
  const { code, errors } = await format(path, sourceText);

  if (errors.length > 0) {
    const messages = errors.map((error) => error.message).join("\n");
    throw new Error(`Failed to format ${path}:\n${messages}`);
  }

  if (code !== sourceText) {
    await Bun.write(path, code);
  }
}
