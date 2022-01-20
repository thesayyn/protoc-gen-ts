import { Metadata, CallOptions } from '@fyn-software/grpc';
import { AsyncClient, AsyncRequest, AsyncResponse } from './async.js';

const client = new AsyncClient('https://example.com/api/');
const metaData: Metadata = {};
const options: CallOptions = {
    deadline: 10 * 1000,
};

// Unary
{
    const request = new AsyncRequest({});
    const response: AsyncResponse = await client.Unary(request, metaData, options);
}

// ClientStream
{
    const createRequests = async function *()
    {
        yield new AsyncRequest({});
    }

    const response: AsyncResponse = await client.ClientStream(createRequests(), metaData, options);
}

// ServerStream
{
    const request = new AsyncRequest({});
    for await(const response of client.ServerStream(request, metaData, options))
    {

    }
}

// BidiStream
{
    const createRequests = async function *()
    {
        yield new AsyncRequest({});
    }

    for await(const response of client.BidiStream(createRequests(), metaData, options))
    {

    }
}