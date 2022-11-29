﻿/*
This file is part of web3.js.

web3.js is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

web3.js is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License
along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
*/

import { isNullish } from 'web3-validator';
import {
	JsonRpcPayload,
	JsonRpcResponse,
	JsonRpcResponseWithResult,
	JsonRpcResponseWithError,
	JsonRpcOptionalRequest,
	JsonRpcBatchRequest,
	JsonRpcNotification,
	JsonRpcRequest,
	JsonRpcBatchResponse,
	JsonRpcSubscriptionResult,
} from 'web3-types';

import { uuidV4 } from './uuid';

export const isResponseWithResult = <Result = unknown, Error = unknown>(
	response: JsonRpcResponse<Result, Error>,
): response is JsonRpcResponseWithResult<Result> =>
	!Array.isArray(response) &&
	!!response &&
	response.jsonrpc === '2.0' &&
	// JSON RPC consider "null" as valid response
	'result' in response &&
	isNullish(response.error) &&
	(typeof response.id === 'number' || typeof response.id === 'string');

// To avoid circular package dependency, copied to code here. If you update this please update same function in `response_errors.ts`
export const isResponseWithError = <Error = unknown, Result = unknown>(
	response: JsonRpcResponse<Result, Error>,
): response is JsonRpcResponseWithError<Error> =>
	!Array.isArray(response) &&
	response.jsonrpc === '2.0' &&
	!!response &&
	isNullish(response.result) &&
	// JSON RPC consider "null" as valid response
	'error' in response &&
	(typeof response.id === 'number' || typeof response.id === 'string');

export const isResponseWithNotification = <Result>(
	response: JsonRpcNotification<Result> | JsonRpcSubscriptionResult,
): response is JsonRpcNotification<Result> =>
	!Array.isArray(response) &&
	!!response &&
	response.jsonrpc === '2.0' &&
	!isNullish(response.params) &&
	!isNullish(response.method);

export const isSubscriptionResult = <Result>(
	response: JsonRpcNotification<Result> | JsonRpcSubscriptionResult,
): response is JsonRpcSubscriptionResult =>
	!Array.isArray(response) &&
	!!response &&
	response.jsonrpc === '2.0' &&
	'id' in response &&
	// JSON RPC consider "null" as valid response
	'result' in response;

export const validateResponse = <Result = unknown, Error = unknown>(
	response: JsonRpcResponse<Result, Error>,
): boolean => isResponseWithResult<Result>(response) || isResponseWithError<Error>(response);

export const isValidResponse = <Result = unknown, Error = unknown>(
	response: JsonRpcResponse<Result, Error>,
): boolean =>
	Array.isArray(response) ? response.every(validateResponse) : validateResponse(response);

export const isBatchResponse = <Result = unknown, Error = unknown>(
	response: JsonRpcResponse<Result, Error>,
): response is JsonRpcBatchResponse<Result, Error> =>
	Array.isArray(response) && response.length > 1 && isValidResponse(response);

export const toPayload = <ParamType = unknown[]>(
	request: JsonRpcOptionalRequest<ParamType>,
): JsonRpcPayload<ParamType> => ({
	jsonrpc: request.jsonrpc ?? '2.0',
	id: request.id ?? uuidV4(),
	method: request.method,
	params: request.params ?? undefined,
});

export const toBatchPayload = (requests: JsonRpcOptionalRequest<unknown>[]): JsonRpcBatchRequest =>
	requests.map(request => toPayload<unknown>(request)) as JsonRpcBatchRequest;

export const isBatchRequest = (
	request: JsonRpcBatchRequest | JsonRpcRequest<unknown> | JsonRpcOptionalRequest<unknown>,
): request is JsonRpcBatchRequest => Array.isArray(request) && request.length > 1;