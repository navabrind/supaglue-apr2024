import { HUBSPOT_STANDARD_OBJECT_TYPES, SALESFORCE_OBJECTS } from '@supaglue/utils';

export const getStandardObjectOptions = (providerName?: string): string[] => {
  switch (providerName) {
    case 'hubspot': {
      return HUBSPOT_STANDARD_OBJECT_TYPES as unknown as string[];
    }
    case 'salesforce': {
      return SALESFORCE_OBJECTS as unknown as string[];
    }
    default:
      return [];
  }
};