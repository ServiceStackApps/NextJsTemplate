import * as React from 'react';
import { createContext, useReducer } from 'react';
import { JsonServiceClient, GetNavItemsResponse, UserAttributes, IAuthSession } from '@servicestack/client';
import {
  Authenticate, AuthenticateResponse
} from './dtos';

declare let global: any; // populated from package.json/jest

if (typeof global === 'undefined') {
  (window as any).global = window;
}

export let client = new JsonServiceClient('/');

const isNode = typeof process === 'object' &&
  typeof process.versions === 'object' &&
  typeof process.versions.node !== 'undefined';
if (isNode) {
  const packageConfig = require("../../package.json");
  let baseUrl = packageConfig["proxy"] ?? '/'
  client = new JsonServiceClient(baseUrl);
  if (baseUrl.startsWith("https://localhost") || baseUrl.startsWith("https://127.0.0.1")) {
    // allow self-signed certs
    client.requestFilter = (req) => {
      const https = require('https');
      (req as any).agent = new https.Agent({ rejectUnauthorized: false });
    };
  }
}

export {
  errorResponse, errorResponseExcept,
  splitOnFirst, toPascalCase,
  queryString,
  classNames,
} from '@servicestack/client';
