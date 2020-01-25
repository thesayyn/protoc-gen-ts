import {Srv, SrvClient, Request, Response} from '../protos/rpcs';
import * as grpc from 'grpc';

describe("RPCs", () => {
    let server: grpc.Server;

    let serviceImplSpy: jasmine.SpyObj<unknown>;

    let client: SrvClient;
    
    beforeEach(() => {
        server = new grpc.Server();
        serviceImplSpy = {
            List: jasmine.createSpy('List').and.callFake((call: grpc.ServerUnaryCall<Request>, callback: grpc.sendUnaryData<Response>) => {
                callback(undefined, new Response({
                    test: "1"
                }))
            })
        }
        server.addService(Srv, serviceImplSpy);
        server.bind("0.0.0.0:4884", grpc.ServerCredentials.createInsecure())
        server.start();

        client = new SrvClient("0.0.0.0:4884", grpc.credentials.createInsecure())
    })

    it("should connect",  done => {
        client['List'](new Request(), (e, response) => {
            expect(e).toBeFalsy()
            expect(response instanceof Response).toBe(true);
            expect(response.test).toBe("1");
            done();
        })
    })
});