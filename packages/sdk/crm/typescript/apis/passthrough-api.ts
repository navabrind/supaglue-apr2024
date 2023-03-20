/* tslint:disable */
/* eslint-disable */
/**
 * Supaglue CRM API
 * # Introduction  Welcome to the Supaglue unified CRM API documentation. You can use this API to read data that has been synced into Supaglue from third-party providers.  ### Base API URL  ``` http://localhost:8080/crm/v1 ``` 
 *
 * OpenAPI spec version: 0.4.1
 * Contact: docs@supaglue.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import globalAxios, { AxiosResponse, AxiosInstance, AxiosRequestConfig } from 'axios';
import { Configuration } from '../configuration';
// Some imports not used depending on template conditions
// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS, RequestArgs, BaseAPI, RequiredError } from '../base';
import { InlineResponse2005 } from '../models';
import { PassthroughBody } from '../models';
/**
 * PassthroughApi - axios parameter creator
 * @export
 */
export const PassthroughApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * Send request directly to a provider
         * @summary Send passthrough request
         * @param {PassthroughBody} body 
         * @param {string} xCustomerId The customer ID
         * @param {string} xProviderName The provider name
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        sendPassthroughRequest: async (body: PassthroughBody, xCustomerId: string, xProviderName: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'body' is not null or undefined
            if (body === null || body === undefined) {
                throw new RequiredError('body','Required parameter body was null or undefined when calling sendPassthroughRequest.');
            }
            // verify required parameter 'xCustomerId' is not null or undefined
            if (xCustomerId === null || xCustomerId === undefined) {
                throw new RequiredError('xCustomerId','Required parameter xCustomerId was null or undefined when calling sendPassthroughRequest.');
            }
            // verify required parameter 'xProviderName' is not null or undefined
            if (xProviderName === null || xProviderName === undefined) {
                throw new RequiredError('xProviderName','Required parameter xProviderName was null or undefined when calling sendPassthroughRequest.');
            }
            const localVarPath = `/passthrough`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions :AxiosRequestConfig = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            if (xCustomerId !== undefined && xCustomerId !== null) {
                localVarHeaderParameter['x-customer-id'] = String(xCustomerId);
            }

            if (xProviderName !== undefined && xProviderName !== null) {
                localVarHeaderParameter['x-provider-name'] = String(xProviderName);
            }

            localVarHeaderParameter['Content-Type'] = 'application/json';

            const query = new URLSearchParams(localVarUrlObj.search);
            for (const key in localVarQueryParameter) {
                query.set(key, localVarQueryParameter[key]);
            }
            for (const key in options.params) {
                query.set(key, options.params[key]);
            }
            localVarUrlObj.search = (new URLSearchParams(query)).toString();
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            const needsSerialization = (typeof body !== "string") || localVarRequestOptions.headers['Content-Type'] === 'application/json';
            localVarRequestOptions.data =  needsSerialization ? JSON.stringify(body !== undefined ? body : {}) : (body || "");

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * PassthroughApi - functional programming interface
 * @export
 */
export const PassthroughApiFp = function(configuration?: Configuration) {
    return {
        /**
         * Send request directly to a provider
         * @summary Send passthrough request
         * @param {PassthroughBody} body 
         * @param {string} xCustomerId The customer ID
         * @param {string} xProviderName The provider name
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async sendPassthroughRequest(body: PassthroughBody, xCustomerId: string, xProviderName: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<InlineResponse2005>>> {
            const localVarAxiosArgs = await PassthroughApiAxiosParamCreator(configuration).sendPassthroughRequest(body, xCustomerId, xProviderName, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
    }
};

/**
 * PassthroughApi - factory interface
 * @export
 */
export const PassthroughApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    return {
        /**
         * Send request directly to a provider
         * @summary Send passthrough request
         * @param {PassthroughBody} body 
         * @param {string} xCustomerId The customer ID
         * @param {string} xProviderName The provider name
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async sendPassthroughRequest(body: PassthroughBody, xCustomerId: string, xProviderName: string, options?: AxiosRequestConfig): Promise<AxiosResponse<InlineResponse2005>> {
            return PassthroughApiFp(configuration).sendPassthroughRequest(body, xCustomerId, xProviderName, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * PassthroughApi - object-oriented interface
 * @export
 * @class PassthroughApi
 * @extends {BaseAPI}
 */
export class PassthroughApi extends BaseAPI {
    /**
     * Send request directly to a provider
     * @summary Send passthrough request
     * @param {PassthroughBody} body 
     * @param {string} xCustomerId The customer ID
     * @param {string} xProviderName The provider name
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PassthroughApi
     */
    public async sendPassthroughRequest(body: PassthroughBody, xCustomerId: string, xProviderName: string, options?: AxiosRequestConfig) : Promise<AxiosResponse<InlineResponse2005>> {
        return PassthroughApiFp(this.configuration).sendPassthroughRequest(body, xCustomerId, xProviderName, options).then((request) => request(this.axios, this.basePath));
    }
}