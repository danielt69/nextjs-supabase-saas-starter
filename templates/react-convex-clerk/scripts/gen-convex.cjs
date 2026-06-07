// One-off generator for convex/_generated/* that reuses Convex's own codegen
// templates (no deployment required). The DataModel types are derived
// statically from convex/schema.ts via DataModelFromSchemaDefinition, exactly
// as `npx convex dev` would produce. Run: node scripts/gen-convex.cjs
const fs = require("node:fs");
const path = require("node:path");

const tpl = path.join(
  __dirname,
  "..",
  "node_modules",
  "convex",
  "dist",
  "cjs",
  "cli",
  "codegen_templates"
);
const { apiCodegen } = require(path.join(tpl, "api.js"));
const { serverCodegen } = require(path.join(tpl, "server.js"));
// dataModel.js transitively requires the Convex CLI (chalk etc.), but its
// dynamic output is a static string derived from convex/schema.ts at compile
// time. Reproduce it directly using the shared header() helper.
const { header } = require(path.join(tpl, "common.js"));

const outDir = path.join(__dirname, "..", "convex", "_generated");
fs.mkdirSync(outDir, { recursive: true });

const modulePaths = ["projects.ts", "providerKeys.ts", "llm.ts"];
const api = apiCodegen(modulePaths, { useTypeScript: false });
const server = serverCodegen({ useTypeScript: false, envVars: undefined });

const dataModelDTS = `${header("Generated data model types.")}
  import type { DataModelFromSchemaDefinition, DocumentByName, TableNamesInDataModel, SystemTableNames } from "convex/server";
  import type { GenericId } from "convex/values";
  import schema from "../schema.js";

  /**
   * The names of all of your Convex tables.
   */
  export type TableNames = TableNamesInDataModel<DataModel>;

  /**
   * The type of a document stored in Convex.
   *
   * @typeParam TableName - A string literal type of the table name (like "users").
   */
  export type Doc<TableName extends TableNames> = DocumentByName<DataModel, TableName>;

  /**
   * An identifier for a document in Convex.
   *
   * Documents are uniquely identified by their \`Id\`, accessible on the \`_id\`
   * field. IDs are strings at runtime, but this type distinguishes them from
   * other strings when type checking.
   *
   * @typeParam TableName - A string literal type of the table name (like "users").
   */
  export type Id<TableName extends TableNames | SystemTableNames> = GenericId<TableName>;

  /**
   * A type describing your Convex data model.
   */
  export type DataModel = DataModelFromSchemaDefinition<typeof schema>;
  `;

const files = {
  "api.js": api.JS,
  "api.d.ts": api.DTS,
  "server.js": server.JS,
  "server.d.ts": server.DTS,
  "dataModel.d.ts": dataModelDTS,
};

for (const [name, contents] of Object.entries(files)) {
  fs.writeFileSync(path.join(outDir, name), contents, "utf8");
  console.log("wrote", path.join("convex/_generated", name));
}
