/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */


export interface paths {
  "/salesforce/contact": {
    /** List contacts */
    get: operations["listContacts"];
    parameters: {
      header: {
        "x-customer-id": components["parameters"]["x-customer-id"];
      };
    };
  };
  "/salesforce/account": {
    /** List accounts */
    get: operations["listAccounts"];
    parameters: {
      header: {
        "x-customer-id": components["parameters"]["x-customer-id"];
      };
    };
  };
}

export type webhooks = Record<string, never>;

export interface components {
  schemas: {
    salesforce_contact: {
      /** @description The unique identifier for this contact. */
      Id?: string;
      /** @description A description of the contact. */
      Description?: string;
      /** @description The contact's email address. */
      Email?: string;
      /** @description ID of the account that's the parent of this contact. This is a relationship field. */
      AccountId?: string;
      /** @description The contact's first name up to 40 characters. */
      FirstName?: string;
      /** @description The contact's home phone number. */
      HomePHone?: string;
      /** @description Indicates whether the object has been moved to the Recycle Bin (true) or not (false). */
      IsDeleted?: boolean;
      /** @description The date of the last activity on a contact. The LastActivityDate is set to whichever is more recent -- the LastActivityDate of a related task or event or the LastModifiedDate of a contact's record. */
      LastActivityDate?: string;
      /** @description The contact's last name. Maximum size is 80 characters. */
      LastName?: string;
      /** @description The source of the lead. */
      LeadSource?: string;
      /** @description The city of the mailing address of this contact. */
      MailingCity?: string;
      /** @description The country of the mailing address of this contact. */
      MailingCountry?: string;
      /** @description The postal code of the mailing address of this contact. */
      MailingPostalCode?: string;
      /** @description The state of the mailijng address of this contact. */
      MailingState?: string;
      /** @description The street of the mailing address of this contact. */
      MailingStreet?: string;
      /** @description The contact's mobile phone number. */
      MobilePhone?: string;
      /** @description ID of the user who owns this contact. This is a relationship field. */
      OwnerId?: string;
      /** @description The contact's phone number. */
      Phone?: string;
      /** @description The contact's fax number. */
      Fax?: string;
      /** @description The contact's title. */
      Title?: string;
      /** @description The date and time when this contact was created. */
      CreatedDate?: string;
      /** @description The date and time when this contact was last modified. */
      SystemModstamp?: string;
      /** @description The raw data returned by the provider. */
      raw_data?: {
        [key: string]: unknown;
      };
    };
    salesforce_account: {
      /** @description The unique identifier for this account. */
      Id?: string;
      /** @description A description of the contact. */
      Description?: string;
      /** @description The city of the billing address of this contact. */
      BillingCity?: string;
      /** @description The country of the billing address of this contact. */
      BillingCountry?: string;
      /** @description The postal code of the billing address of this contact. */
      BillingPostalCode?: string;
      /** @description The state of the billing address of this contact. */
      BillingState?: string;
      /** @description The street of the billing address of this contact. */
      BillingStreet?: string;
      /** @description The city of the shipping address of this contact. */
      ShippingCity?: string;
      /** @description The country of the shipping address of this contact. */
      ShippingCountry?: string;
      /** @description The postal code of the shipping address of this contact. */
      ShippingPostalCode?: string;
      /** @description The state of the shipping address of this contact. */
      ShippingState?: string;
      /** @description The street of the shipping address of this contact. */
      ShippingStreet?: string;
      /** @description The account's phone number. */
      Phone?: string;
      /** @description The account's fax number. */
      Fax?: string;
      /** @description The type of industry in which the account operates. */
      Industry?: string;
      /** @description The date of the last activity on an account. The LastActivityDate is set to whichever is more recent -- the LastActivityDate of a related task or event or the LastModifiedDate of an account's record. */
      LastActivityDate?: string;
      /** @description The name of the account. Maximum size is 255 characters. */
      Name?: string;
      /** @description The number of employees that work at the account. */
      NumberOfEmployees?: number;
      /** @description ID of the user who owns this account. This is a relationship field. */
      OwnerId?: string;
      /** @description The account's website URL. */
      Website?: string;
      /** @description Indicates whether the object has been moved to the Recycle Bin (true) or not (false). */
      IsDeleted?: boolean;
      /** @description The date and time when this contact was created. */
      CreatedDate?: string;
      /** @description The date and time when this contact was last modified. */
      SystemModstamp?: string;
      /** @description The raw data returned by the provider. */
      raw_data?: {
        [key: string]: unknown;
      };
    };
    pagination: {
      /** @example eyJpZCI6IjQyNTc5ZjczLTg1MjQtNDU3MC05YjY3LWVjYmQ3MDJjNmIxNCIsInJldmVyc2UiOmZhbHNlfQ== */
      next: string | null;
      /** @example eyJpZCI6IjBjZDhmYmZkLWU5NmQtNDEwZC05ZjQxLWIwMjU1YjdmNGI4NyIsInJldmVyc2UiOnRydWV9 */
      previous: string | null;
      /** @example 100 */
      total_count: number;
    };
    errors: ({
        /** @example name is a required field on model. */
        detail?: string;
        /** @example MISSING_REQUIRED_FIELD */
        problem_type?: string;
        source?: {
          /** @example irure consectetur */
          pointer?: string;
        };
        /** @example Missing Required Field */
        title?: string;
      })[];
    /**
     * @example [
     *   {
     *     "detail": "An unrecognized field, age, was passed in with request data.",
     *     "problem_type": "UNRECOGNIZED_FIELD",
     *     "source": {
     *       "pointer": "Lorem ipsum"
     *     },
     *     "title": "Unrecognized Field"
     *   },
     *   {
     *     "detail": "An unrecognized field, age, was passed in with request data.",
     *     "problem_type": "UNRECOGNIZED_FIELD",
     *     "source": {
     *       "pointer": "in"
     *     },
     *     "title": "Unrecognized Field"
     *   }
     * ]
     */
    warnings: ({
        /** @example An unrecognized field, age, was passed in with request data. */
        detail?: string;
        /** @example UNRECOGNIZED_FIELD */
        problem_type?: string;
        source?: {
          /** @example Lorem ipsum */
          pointer?: string;
        };
        /** @example Unrecognized Field */
        title?: string;
      })[];
  };
  responses: never;
  parameters: {
    /** @description The customer ID that uniquely identifies the customer in your application */
    "x-customer-id": string;
    /** @description The provider name */
    "x-provider-name": string;
  };
  requestBodies: never;
  headers: never;
  pathItems: never;
}

export type external = Record<string, never>;

export interface operations {

  /** List contacts */
  listContacts: {
    parameters: {
      query?: {
        /** @description If provided, will only return objects modified after this datetime */
        modified_after?: Date;
        /** @description If provided, will only return objects modified before this datetime */
        modified_before?: Date;
        /** @description If provided, will only return objects created after this datetime */
        created_after?: Date;
        /** @description If provided, will only return objects created before this datetime */
        created_before?: Date;
        /** @description Whether to include data that was deleted in providers. */
        include_deleted_data?: boolean;
        /** @description Number of results to return per page */
        page_size?: string;
        /** @description The pagination cursor value */
        cursor?: string;
      };
      header: {
        "x-customer-id": components["parameters"]["x-customer-id"];
      };
    };
    responses: {
      /** @description Contacts */
      200: {
        content: {
          "application/json": {
            pagination: components["schemas"]["pagination"];
            records: (components["schemas"]["salesforce_contact"])[];
          };
        };
      };
    };
  };
  /** List accounts */
  listAccounts: {
    parameters: {
      header: {
        "x-customer-id": components["parameters"]["x-customer-id"];
      };
    };
    responses: {
      /** @description Accounts */
      200: {
        content: {
          "application/json": {
            pagination: components["schemas"]["pagination"];
            records: (components["schemas"]["salesforce_account"])[];
          };
        };
      };
    };
  };
}
