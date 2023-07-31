import type { operations, paths } from '../gen/v2/actions';

export type SendPassthroughRequestPathParams = any;
// TODO - this should be generated from the openapi spec, but it's not getting generated due to a bug in openapi-typescript
// export type SendPassthroughRequestQueryParams = Required<operations['getUser']>['parameters']['query'];
export type SendPassthroughRequestQueryParams = any;
export type SendPassthroughRequestRequest =
  operations['sendPassthroughRequest']['requestBody']['content']['application/json'];
export type SendPassthroughRequestResponse =
  operations['sendPassthroughRequest']['responses'][keyof operations['sendPassthroughRequest']['responses']]['content']['application/json'];

export type CreateEntityRecordPathParams = paths['/entities/{entity_name}']['parameters']['path'];
export type CreateEntityRecordRequestQueryParams = never;
export type CreateEntityRecordRequest = operations['createEntityRecord']['requestBody']['content']['application/json'];
export type CreateEntityRecordResponse =
  operations['createEntityRecord']['responses'][keyof operations['createEntityRecord']['responses']]['content']['application/json'];

export type GetEntityRecordPathParams = paths['/entities/{entity_name}/{record_id}']['parameters']['path'];
export type GetEntityRecordRequestQueryParams = never;
export type GetEntityRecordRequest = never;
export type GetEntityRecordResponse =
  operations['getEntityRecord']['responses'][keyof operations['getEntityRecord']['responses']]['content']['application/json'];

export type UpdateEntityRecordPathParams = paths['/entities/{entity_name}/{record_id}']['parameters']['path'];
export type UpdateEntityRecordRequestQueryParams = never;
export type UpdateEntityRecordRequest = operations['updateEntityRecord']['requestBody']['content']['application/json'];
export type UpdateEntityRecordResponse =
  operations['updateEntityRecord']['responses'][keyof operations['updateEntityRecord']['responses']]['content']['application/json'];