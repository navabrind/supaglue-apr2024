import type { ObjectType } from './object_sync';

export type FieldMappingInfo = {
  name: string;
  isAddedByCustomer: boolean;
  customerMappedName?: string;
  schemaMappedName?: string;
};

export type ObjectFieldMappingInfo = {
  objectName: string;
  objectType: ObjectType;
  schemaId: string;
  allowAdditionalFieldMappings: boolean;
  fields: FieldMappingInfo[];
};

export type ObjectFieldMappingUpdateParams = {
  name: string;
  type: ObjectType;
  fieldMappings: SchemaMappingsConfigObjectFieldMapping[];
};

export type SchemaMappingsConfig = {
  // TODO: Support custom objects.
  commonObjects?: SchemaMappingsConfigForObject[];
  standardObjects?: SchemaMappingsConfigForObject[];
};

export type SchemaMappingsConfigForObject = {
  object: string;
  fieldMappings: SchemaMappingsConfigObjectFieldMapping[];
};

export type SchemaMappingsConfigObjectFieldMapping = {
  schemaField: string; // my_first_column
  mappedField?: string; // blah_1
};