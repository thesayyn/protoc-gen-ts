import * as grpc from "@grpc/grpc-js";
import * as fs from "node:fs";
import * as http2 from "node:http2";
import * as streams from "node:stream";
import * as events from "node:events";
import * as base64stream from "base64-stream";

const grpcContentType = "application/grpc";
const grpcWebContentType = "application/grpc-web";
const grpcWebTextContentType = "application/grpc-web-text";

function isCorsRequest(headers: http2.IncomingHttpHeaders) {
  return headers[":method"] == "OPTIONS";
}

function isGrpcWebRequest(headers: http2.IncomingHttpHeaders) {
  return headers["x-grpc-web"] == "1";
}

function isGrpcWebText(headers: http2.IncomingHttpHeaders) {
  return headers["content-type"] == grpcWebTextContentType;
}

class GrpcWebTextRequest extends streams.Transform {
  #stream: http2.ServerHttp2Stream;
  #text: boolean;
  constructor(stream: http2.ServerHttp2Stream, text: boolean) {
    super({
      write: (chunk, encoding, callback) => {
        console.log(chunk), encoding;
        this.#stream.write(Buffer.from("test"))
      },
    });
    this.#stream = stream;
    this.#text = text;
    this.setup();
  }
  setup() {

    const base64 = new base64stream.Base64Decode();
    base64.on("data", (chunk) => this.emit("data", chunk));
    base64.on("end", e => this.emit("end", e))
    this.#stream.pipe(base64);

    this.#stream.on("waitForTrailers", () => {
      console.log("waiting for trailers")
    })
  
    this.#stream.on("error", e => this.emit("error", e))
    this.#stream.on("drain", e => this.emit("drain", e))
    this.#stream.on("end", () => this.emit("end"))
  }
  get headersSent() {
    return this.#stream.headersSent;
  }
  respond(
    headers?: http2.OutgoingHttpHeaders,
    options?: http2.ServerStreamResponseOptions
  ) {
    const nh = { ...headers };
    nh["access-control-allow-origin"] = "*";
    if (this.#text) {
      nh["content-type"] = grpcWebTextContentType;
    }
    nh["access-control-expose-headers"] = Object.keys(headers || {}).join(", ");
    console.log("respond", nh, options);
    this.#stream.respond(nh, options);
  }
}

class GrpcWebProxyServer extends events.EventEmitter {
  #http: http2.Http2Server;
  constructor(http: http2.Http2Server) {
    super();
    this.#http = http;
    this.setup();
  }
  address() {
    return this.#http.address();
  }
  setup() {
    this.#http.on("session", (s) => {
      console.error(`new session ${s.socket.address().address}`);
      // this.emit("session", s);
    });
    this.#http.on("stream", (stream, headers) => {
      if (isCorsRequest(headers)) {
        return respondCors(stream, headers);
      } else if (isGrpcWebRequest(headers)) {
        if (isGrpcWebText(headers)) {
          //console.log(stream, headers);
          const req = new GrpcWebTextRequest(stream, true);
          this.emit("stream", req, headers);
        }
      }
    });
  }
}

function respondCors(
  stream: http2.ServerHttp2Stream,
  headers: http2.IncomingHttpHeaders
) {
  stream.respond({
    ":status": 200,
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "*",
    "access-control-max-age": "2592000",
    "access-control-allow-headers": headers["access-control-request-headers"],
  });
  stream.end();
}

export function GrpcWebProxy(srv: grpc.Server) {
  const setupHandlers = srv["_setupHandlers"];
  srv["_setupHandlers"] = (http: import("http2").Http2Server) => {
    const proxy = new GrpcWebProxyServer(http);
    return setupHandlers.bind(srv)(proxy);
  };
  return srv;
}

export class GrpcWebServerCredentials extends grpc.ServerCredentials {
  _isSecure(): boolean {
    return true;
  }

  _getSettings(): import("http2").SecureServerOptions {
    return {
      allowHTTP1: true,
      key: fs.readFileSync("./localhost-key.pem"),
      cert: fs.readFileSync("./localhost.pem"),
    };
  }
}
