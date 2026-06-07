/* eslint-disable */
  /**
   * Generated data model types.
   *
   * THIS CODE IS AUTOMATICALLY GENERATED.
   *
   * To regenerate, run `npx convex dev`.
   * @module
   */
  
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
   * Documents are uniquely identified by their `Id`, accessible on the `_id`
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
  