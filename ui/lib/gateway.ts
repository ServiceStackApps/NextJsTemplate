import { JsonServiceClient } from '@servicestack/client'

export const client = new JsonServiceClient();
client.replyBaseUrl = "/api/";