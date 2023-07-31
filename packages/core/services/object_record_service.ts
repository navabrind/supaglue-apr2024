import type {
  ConnectionSafeAny,
  CreatedStandardObjectRecord,
  ObjectRecordData,
  ObjectRecordUpsertData,
  StandardObjectRecord,
} from '@supaglue/types';
import type { FieldMappingConfig } from '@supaglue/types/field_mapping_config';
import type { ConnectionService, RemoteService } from '.';
import { BadRequestError } from '../errors';
import type { DestinationService } from './destination_service';

export class ObjectRecordService {
  readonly #connectionService: ConnectionService;
  readonly #remoteService: RemoteService;
  readonly #destinationService: DestinationService;

  public constructor(
    connectionService: ConnectionService,
    remoteService: RemoteService,
    destinationService: DestinationService
  ) {
    this.#connectionService = connectionService;
    this.#remoteService = remoteService;
    this.#destinationService = destinationService;
  }

  public async createStandardObjectRecord(
    connection: ConnectionSafeAny,
    objectName: string,
    data: ObjectRecordUpsertData
  ): Promise<CreatedStandardObjectRecord> {
    const fieldMappingConfig = await this.#connectionService.getFieldMappingConfig(
      connection.id,
      'standard',
      objectName
    );
    const unmappedData = mapSchemaToObject(data, fieldMappingConfig);
    const remoteClient = await this.#remoteService.getRemoteClient(connection.id);
    const id = await remoteClient.createObjectRecord(
      {
        type: 'standard',
        name: objectName,
      },
      unmappedData
    );
    return {
      id,
      standardObjectName: objectName,
    };
  }

  public async getStandardObjectRecord(
    connection: ConnectionSafeAny,
    objectName: string,
    recordId: string
  ): Promise<StandardObjectRecord> {
    const fieldMappingConfig = await this.#connectionService.getFieldMappingConfig(
      connection.id,
      'standard',
      objectName
    );
    const remoteClient = await this.#remoteService.getRemoteClient(connection.id);
    const fields =
      fieldMappingConfig.type === 'inherit_all_fields'
        ? (await remoteClient.listProperties({ type: 'standard', name: objectName })).map((p) => p.id)
        : [
            ...new Set([
              ...fieldMappingConfig.coreFieldMappings.map((m) => m.mappedField),
              ...fieldMappingConfig.additionalFieldMappings.map((m) => m.mappedField),
            ]),
          ];
    const record = await remoteClient.getObjectRecord(
      {
        type: 'standard',
        name: objectName,
      },
      recordId,
      fields
    );
    return {
      id: recordId,
      standardObjectName: objectName,
      data: mapObjectToSchema(record.data, fieldMappingConfig),
    };
  }

  public async updateStandardObjectRecord(
    connection: ConnectionSafeAny,
    objectName: string,
    recordId: string,
    data: ObjectRecordUpsertData
  ): Promise<void> {
    const fieldMappingConfig = await this.#connectionService.getFieldMappingConfig(
      connection.id,
      'standard',
      objectName
    );
    const unmappedData = mapSchemaToObject(data, fieldMappingConfig);
    const remoteClient = await this.#remoteService.getRemoteClient(connection.id);
    await remoteClient.updateObjectRecord(
      {
        type: 'standard',
        name: objectName,
      },
      recordId,
      unmappedData
    );
  }
}

function mapSchemaToObject(
  data: ObjectRecordUpsertData,
  fieldMappingConfig: FieldMappingConfig
): ObjectRecordUpsertData {
  switch (fieldMappingConfig.type) {
    case 'inherit_all_fields':
      return data;
    case 'defined': {
      return Object.entries(data).reduce((acc, [key, value]) => {
        const coreFieldMapping = fieldMappingConfig.coreFieldMappings.find((m) => m.schemaField === key);
        const additionalFieldMapping = fieldMappingConfig.additionalFieldMappings.find((m) => m.schemaField === key);

        if (coreFieldMapping) {
          return { ...acc, [coreFieldMapping.mappedField]: value };
        } else if (additionalFieldMapping) {
          return { ...acc, [additionalFieldMapping.mappedField]: value };
        }

        throw new BadRequestError(`Field ${key} does not exist in schema or is not mapped`);
      }, {});
    }
  }
}

function mapObjectToSchema(data: ObjectRecordData, fieldMappingConfig: FieldMappingConfig): ObjectRecordData {
  switch (fieldMappingConfig.type) {
    case 'inherit_all_fields':
      return data;
    case 'defined': {
      const coreFields = fieldMappingConfig.coreFieldMappings.reduce((acc, { schemaField, mappedField }) => {
        const value = data[mappedField];
        if (value) {
          return { ...acc, [schemaField]: value };
        }
        return acc;
      }, {} as Record<string, unknown>);

      const additionalFields = fieldMappingConfig.additionalFieldMappings.reduce(
        (acc, { schemaField, mappedField }) => {
          const value = data[mappedField];
          if (value) {
            return { ...acc, [schemaField]: value };
          }
          return acc;
        },
        {} as Record<string, unknown>
      );

      return {
        ...coreFields,
        additionalFields,
      };
    }
  }
}