# coding: utf-8

# flake8: noqa

"""
    Supaglue CRM API

    # Introduction  Welcome to the Supaglue unified CRM API documentation. You can use this API to read data that has been synced into Supaglue from third-party providers.  ### Base API URL  ``` http://localhost:8080/api/crm/v1 ```   # noqa: E501

    OpenAPI spec version: 0.3.3
    Contact: docs@supaglue.com
    Generated by: https://github.com/swagger-api/swagger-codegen.git
"""

from __future__ import absolute_import

# import apis into sdk package
from swagger_client.api.accounts_api import AccountsApi
from swagger_client.api.contacts_api import ContactsApi
from swagger_client.api.leads_api import LeadsApi
from swagger_client.api.opportunities_api import OpportunitiesApi
from swagger_client.api.sync_api import SyncApi
# import ApiClient
from swagger_client.api_client import ApiClient
from swagger_client.configuration import Configuration
# import models into sdk package
from swagger_client.models.account import Account
from swagger_client.models.accounts_account_id_body import AccountsAccountIdBody
from swagger_client.models.accounts_body import AccountsBody
from swagger_client.models.addresses import Addresses
from swagger_client.models.addresses_inner import AddressesInner
from swagger_client.models.contact import Contact
from swagger_client.models.contacts_body import ContactsBody
from swagger_client.models.contacts_contact_id_body import ContactsContactIdBody
from swagger_client.models.create_update_account import CreateUpdateAccount
from swagger_client.models.create_update_contact import CreateUpdateContact
from swagger_client.models.create_update_lead import CreateUpdateLead
from swagger_client.models.create_update_opportunity import CreateUpdateOpportunity
from swagger_client.models.email_addresses import EmailAddresses
from swagger_client.models.email_addresses_inner import EmailAddressesInner
from swagger_client.models.errors import Errors
from swagger_client.models.errors_inner import ErrorsInner
from swagger_client.models.inline_response200 import InlineResponse200
from swagger_client.models.inline_response2001 import InlineResponse2001
from swagger_client.models.inline_response2002 import InlineResponse2002
from swagger_client.models.inline_response2003 import InlineResponse2003
from swagger_client.models.inline_response2004 import InlineResponse2004
from swagger_client.models.inline_response2004_results import InlineResponse2004Results
from swagger_client.models.inline_response2005 import InlineResponse2005
from swagger_client.models.inline_response201 import InlineResponse201
from swagger_client.models.inline_response2011 import InlineResponse2011
from swagger_client.models.inline_response2012 import InlineResponse2012
from swagger_client.models.inline_response2013 import InlineResponse2013
from swagger_client.models.lead import Lead
from swagger_client.models.leads_body import LeadsBody
from swagger_client.models.leads_lead_id_body import LeadsLeadIdBody
from swagger_client.models.logs import Logs
from swagger_client.models.logs_inner import LogsInner
from swagger_client.models.opportunities_body import OpportunitiesBody
from swagger_client.models.opportunities_opportunity_id_body import OpportunitiesOpportunityIdBody
from swagger_client.models.opportunity import Opportunity
from swagger_client.models.pagination import Pagination
from swagger_client.models.phone_numbers import PhoneNumbers
from swagger_client.models.phone_numbers_inner import PhoneNumbersInner
from swagger_client.models.warnings import Warnings
from swagger_client.models.warnings_inner import WarningsInner