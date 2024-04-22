// eslint-disable-next-line @typescript-eslint/no-var-requires
const nock = require("nock");

import {
  IpStackFailedRequest,
  IpStackSuccessfulRequestForNigeria,
  IpStackSuccessfulRequestForUnitedStates,
} from "./ipstack-nock-data";

const baseUrl = "http://api.ipstack.com";

export const nockIpStackRequest = () => {
  nock(baseUrl)
    .defaultReplyHeaders({
      "access-control-allow-origin": "*",
      "access-control-allow-credentials": "true",
    })
    .get(`/check?access_key=${process.env.IPSTACK_KEY}`)
    .reply(IpStackSuccessfulRequestForUnitedStates.responseCode, {
      ...IpStackSuccessfulRequestForUnitedStates.data,
    });
};
