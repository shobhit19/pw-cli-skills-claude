import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import Ajv, { ValidateFunction } from 'ajv';

// Validates API responses against the component schemas defined in
// specs/api/petstore.yaml, so response shapes are checked against the
// spec itself rather than a hand-duplicated schema.

interface OpenApiDocument {
  components?: {
    schemas?: Record<string, unknown>;
  };
}

const SPEC_PATH = path.resolve(__dirname, '../../../specs/api/petstore.yaml');

function rewriteRefs(node: unknown): unknown {
  if (Array.isArray(node)) {
    return node.map(rewriteRefs);
  }
  if (node && typeof node === 'object') {
    return Object.fromEntries(
      Object.entries(node as Record<string, unknown>).map(([key, value]) => {
        if (key === '$ref' && typeof value === 'string') {
          return [key, value.replace('#/components/schemas/', '')];
        }
        return [key, rewriteRefs(value)];
      }),
    );
  }
  return node;
}

function loadComponentSchemas(): Record<string, unknown> {
  const doc = yaml.load(fs.readFileSync(SPEC_PATH, 'utf8')) as OpenApiDocument;
  const schemas = doc.components?.schemas ?? {};
  return rewriteRefs(schemas) as Record<string, unknown>;
}

const ajv = new Ajv({ strict: false, allErrors: true });
const componentSchemas = loadComponentSchemas();

for (const [name, schema] of Object.entries(componentSchemas)) {
  ajv.addSchema(schema as Record<string, unknown>, name);
}

const compiledValidators = new Map<string, ValidateFunction>();

export interface SchemaValidationResult {
  valid: boolean;
  errors: string[];
}

// schemaName must match a key under components.schemas in specs/api/petstore.yaml
// (e.g. "Pet", "Order", "User", "ApiResponse").
export function validateSchema(schemaName: string, data: unknown): SchemaValidationResult {
  let validate = compiledValidators.get(schemaName);
  if (!validate) {
    const compiled = ajv.getSchema(schemaName);
    if (!compiled) {
      throw new Error(
        `Unknown schema "${schemaName}" — check components.schemas in specs/api/petstore.yaml`,
      );
    }
    validate = compiled;
    compiledValidators.set(schemaName, validate);
  }
  const valid = validate(data) as boolean;
  const errors = (validate.errors ?? []).map((err) => `${err.instancePath || '/'} ${err.message ?? ''}`.trim());
  return { valid, errors };
}
