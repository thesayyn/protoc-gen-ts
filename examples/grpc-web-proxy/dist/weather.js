import * as imp_0 from "google-protobuf";
import * as imp_1 from "grpc-web";
export class City {
    static type = "City";
    #unknown_fields = [];
    code = "";
    name = "";
    mergeFrom(bytes) {
        const br = new imp_0.BinaryReader(bytes);
        while (br.nextField() && !br.isEndGroup()) {
            switch (br.getFieldNumber()) {
                case 1:
                    this.code = br.readString();
                    break;
                case 2:
                    this.name = br.readString();
                    break;
                case 0:
                    throw new Error("illegal zero tag.");
                default:
                    const prev = br.getCursor();
                    br.skipField();
                    this.#unknown_fields.push({
                        no: br.getFieldNumber(),
                        wireType: br.getWireType(),
                        data: bytes.subarray(prev, br.getCursor())
                    });
            }
        }
        return this;
    }
    static fromBinary(bytes) {
        const message = new City;
        message.mergeFrom(bytes);
        return message;
    }
    toBinary() {
        const bw = new imp_0.BinaryWriter;
        if (this.code !== undefined && this.code !== "") {
            bw.writeString(1, this.code);
        }
        if (this.name !== undefined && this.name !== "") {
            bw.writeString(2, this.name);
        }
        for (const uf of this.#unknown_fields) {
            bw.writeFieldHeader_(uf.no, uf.wireType);
            bw.appendUint8Array_(uf.data);
        }
        return bw.getResultBuffer();
    }
    toJson() {
        const json = {};
        if (this.code !== undefined && this.code !== "")
            json.code = this.code;
        if (this.name !== undefined && this.name !== "")
            json.name = this.name;
        return json;
    }
    static fromJson(json) {
        const message = new City;
        const oneof = new Set;
        const code = json.hasOwnProperty("code") ? json.code : json.code;
        if (code !== null && code !== undefined && code !== "") {
            if (!(typeof code === "string"))
                throw new Error("illegal value for code");
            message.code = code;
        }
        const name = json.hasOwnProperty("name") ? json.name : json.name;
        if (name !== null && name !== undefined && name !== "") {
            if (!(typeof name === "string"))
                throw new Error("illegal value for name");
            message.name = name;
        }
        return message;
    }
}
export class Temperature {
    static type = "Temperature";
    #unknown_fields = [];
    code = "";
    current = 0;
    mergeFrom(bytes) {
        const br = new imp_0.BinaryReader(bytes);
        while (br.nextField() && !br.isEndGroup()) {
            switch (br.getFieldNumber()) {
                case 1:
                    this.code = br.readString();
                    break;
                case 2:
                    this.current = br.readInt32();
                    break;
                case 0:
                    throw new Error("illegal zero tag.");
                default:
                    const prev = br.getCursor();
                    br.skipField();
                    this.#unknown_fields.push({
                        no: br.getFieldNumber(),
                        wireType: br.getWireType(),
                        data: bytes.subarray(prev, br.getCursor())
                    });
            }
        }
        return this;
    }
    static fromBinary(bytes) {
        const message = new Temperature;
        message.mergeFrom(bytes);
        return message;
    }
    toBinary() {
        const bw = new imp_0.BinaryWriter;
        if (this.code !== undefined && this.code !== "") {
            bw.writeString(1, this.code);
        }
        if (this.current !== undefined && this.current !== 0) {
            bw.writeInt32(2, this.current);
        }
        for (const uf of this.#unknown_fields) {
            bw.writeFieldHeader_(uf.no, uf.wireType);
            bw.appendUint8Array_(uf.data);
        }
        return bw.getResultBuffer();
    }
    toJson() {
        const json = {};
        if (this.code !== undefined && this.code !== "")
            json.code = this.code;
        if (this.current !== undefined && this.current !== 0)
            json.current = Number.isFinite(this.current) ? this.current : this.current.toString();
        return json;
    }
    static fromJson(json) {
        const message = new Temperature;
        const oneof = new Set;
        const code = json.hasOwnProperty("code") ? json.code : json.code;
        if (code !== null && code !== undefined && code !== "") {
            if (!(typeof code === "string"))
                throw new Error("illegal value for code");
            message.code = code;
        }
        const current = json.hasOwnProperty("current") ? json.current : json.current;
        if (current !== null && current !== undefined && current !== 0) {
            if (!((typeof current === "number" || typeof current === "string" && current.indexOf(" ") === -1) && Number.isInteger(+current) && (current === "NaN" || current === "Infinity" || current === "-Infinity" || (current >= -2.147483648e9 && current <= +2.147483647e9))))
                throw new Error("illegal value for current");
            message.current = Number(current);
        }
        return message;
    }
}
export class CityQuery {
    static type = "CityQuery";
    #unknown_fields = [];
    mergeFrom(bytes) {
        const br = new imp_0.BinaryReader(bytes);
        while (br.nextField() && !br.isEndGroup()) {
            switch (br.getFieldNumber()) {
                case 0:
                    throw new Error("illegal zero tag.");
                default:
                    const prev = br.getCursor();
                    br.skipField();
                    this.#unknown_fields.push({
                        no: br.getFieldNumber(),
                        wireType: br.getWireType(),
                        data: bytes.subarray(prev, br.getCursor())
                    });
            }
        }
        return this;
    }
    static fromBinary(bytes) {
        const message = new CityQuery;
        message.mergeFrom(bytes);
        return message;
    }
    toBinary() {
        const bw = new imp_0.BinaryWriter;
        for (const uf of this.#unknown_fields) {
            bw.writeFieldHeader_(uf.no, uf.wireType);
            bw.appendUint8Array_(uf.data);
        }
        return bw.getResultBuffer();
    }
    toJson() {
        const json = {};
        return json;
    }
    static fromJson(json) {
        const message = new CityQuery;
        const oneof = new Set;
        return message;
    }
}
export class CityQuery_Result {
    static type = "CityQuery.Result";
    #unknown_fields = [];
    cities = [];
    mergeFrom(bytes) {
        const br = new imp_0.BinaryReader(bytes);
        while (br.nextField() && !br.isEndGroup()) {
            switch (br.getFieldNumber()) {
                case 2:
                    this.cities.push(City.fromBinary(br.readBytes()));
                    break;
                case 0:
                    throw new Error("illegal zero tag.");
                default:
                    const prev = br.getCursor();
                    br.skipField();
                    this.#unknown_fields.push({
                        no: br.getFieldNumber(),
                        wireType: br.getWireType(),
                        data: bytes.subarray(prev, br.getCursor())
                    });
            }
        }
        return this;
    }
    static fromBinary(bytes) {
        const message = new CityQuery_Result;
        message.mergeFrom(bytes);
        return message;
    }
    toBinary() {
        const bw = new imp_0.BinaryWriter;
        if (this.cities !== undefined && this.cities.length !== 0) {
            for (const cities of this.cities) {
                bw.writeBytes(2, cities.toBinary());
            }
        }
        for (const uf of this.#unknown_fields) {
            bw.writeFieldHeader_(uf.no, uf.wireType);
            bw.appendUint8Array_(uf.data);
        }
        return bw.getResultBuffer();
    }
    toJson() {
        const json = {};
        if (this.cities !== undefined && this.cities.length !== 0)
            json.cities = this.cities.map((r) => r.toJson());
        return json;
    }
    static fromJson(json) {
        const message = new CityQuery_Result;
        const oneof = new Set;
        const cities = json.hasOwnProperty("cities") ? json.cities : json.cities;
        if (cities !== null && cities !== undefined && cities.length !== 0) {
            message.cities = cities.map((r) => {
                if (!(typeof r === "object"))
                    throw new Error("illegal value for cities");
                return City.fromJson(r);
            });
        }
        return message;
    }
}
export class GetTemperature {
    static type = "GetTemperature";
    #unknown_fields = [];
    code = "";
    mergeFrom(bytes) {
        const br = new imp_0.BinaryReader(bytes);
        while (br.nextField() && !br.isEndGroup()) {
            switch (br.getFieldNumber()) {
                case 1:
                    this.code = br.readString();
                    break;
                case 0:
                    throw new Error("illegal zero tag.");
                default:
                    const prev = br.getCursor();
                    br.skipField();
                    this.#unknown_fields.push({
                        no: br.getFieldNumber(),
                        wireType: br.getWireType(),
                        data: bytes.subarray(prev, br.getCursor())
                    });
            }
        }
        return this;
    }
    static fromBinary(bytes) {
        const message = new GetTemperature;
        message.mergeFrom(bytes);
        return message;
    }
    toBinary() {
        const bw = new imp_0.BinaryWriter;
        if (this.code !== undefined && this.code !== "") {
            bw.writeString(1, this.code);
        }
        for (const uf of this.#unknown_fields) {
            bw.writeFieldHeader_(uf.no, uf.wireType);
            bw.appendUint8Array_(uf.data);
        }
        return bw.getResultBuffer();
    }
    toJson() {
        const json = {};
        if (this.code !== undefined && this.code !== "")
            json.code = this.code;
        return json;
    }
    static fromJson(json) {
        const message = new GetTemperature;
        const oneof = new Set;
        const code = json.hasOwnProperty("code") ? json.code : json.code;
        if (code !== null && code !== undefined && code !== "") {
            if (!(typeof code === "string"))
                throw new Error("illegal value for code");
            message.code = code;
        }
        return message;
    }
}
export class Ping {
    static type = "Ping";
    #unknown_fields = [];
    mergeFrom(bytes) {
        const br = new imp_0.BinaryReader(bytes);
        while (br.nextField() && !br.isEndGroup()) {
            switch (br.getFieldNumber()) {
                case 0:
                    throw new Error("illegal zero tag.");
                default:
                    const prev = br.getCursor();
                    br.skipField();
                    this.#unknown_fields.push({
                        no: br.getFieldNumber(),
                        wireType: br.getWireType(),
                        data: bytes.subarray(prev, br.getCursor())
                    });
            }
        }
        return this;
    }
    static fromBinary(bytes) {
        const message = new Ping;
        message.mergeFrom(bytes);
        return message;
    }
    toBinary() {
        const bw = new imp_0.BinaryWriter;
        for (const uf of this.#unknown_fields) {
            bw.writeFieldHeader_(uf.no, uf.wireType);
            bw.appendUint8Array_(uf.data);
        }
        return bw.getResultBuffer();
    }
    toJson() {
        const json = {};
        return json;
    }
    static fromJson(json) {
        const message = new Ping;
        const oneof = new Set;
        return message;
    }
}
export class Ping_Ack {
    static type = "Ping.Ack";
    #unknown_fields = [];
    mergeFrom(bytes) {
        const br = new imp_0.BinaryReader(bytes);
        while (br.nextField() && !br.isEndGroup()) {
            switch (br.getFieldNumber()) {
                case 0:
                    throw new Error("illegal zero tag.");
                default:
                    const prev = br.getCursor();
                    br.skipField();
                    this.#unknown_fields.push({
                        no: br.getFieldNumber(),
                        wireType: br.getWireType(),
                        data: bytes.subarray(prev, br.getCursor())
                    });
            }
        }
        return this;
    }
    static fromBinary(bytes) {
        const message = new Ping_Ack;
        message.mergeFrom(bytes);
        return message;
    }
    toBinary() {
        const bw = new imp_0.BinaryWriter;
        for (const uf of this.#unknown_fields) {
            bw.writeFieldHeader_(uf.no, uf.wireType);
            bw.appendUint8Array_(uf.data);
        }
        return bw.getResultBuffer();
    }
    toJson() {
        const json = {};
        return json;
    }
    static fromJson(json) {
        const message = new Ping_Ack;
        const oneof = new Set;
        return message;
    }
}
export class Forecast {
    static type = "Forecast";
    #unknown_fields = [];
    code = "";
    date = "";
    mergeFrom(bytes) {
        const br = new imp_0.BinaryReader(bytes);
        while (br.nextField() && !br.isEndGroup()) {
            switch (br.getFieldNumber()) {
                case 1:
                    this.code = br.readString();
                    break;
                case 2:
                    this.date = br.readString();
                    break;
                case 0:
                    throw new Error("illegal zero tag.");
                default:
                    const prev = br.getCursor();
                    br.skipField();
                    this.#unknown_fields.push({
                        no: br.getFieldNumber(),
                        wireType: br.getWireType(),
                        data: bytes.subarray(prev, br.getCursor())
                    });
            }
        }
        return this;
    }
    static fromBinary(bytes) {
        const message = new Forecast;
        message.mergeFrom(bytes);
        return message;
    }
    toBinary() {
        const bw = new imp_0.BinaryWriter;
        if (this.code !== undefined && this.code !== "") {
            bw.writeString(1, this.code);
        }
        if (this.date !== undefined && this.date !== "") {
            bw.writeString(2, this.date);
        }
        for (const uf of this.#unknown_fields) {
            bw.writeFieldHeader_(uf.no, uf.wireType);
            bw.appendUint8Array_(uf.data);
        }
        return bw.getResultBuffer();
    }
    toJson() {
        const json = {};
        if (this.code !== undefined && this.code !== "")
            json.code = this.code;
        if (this.date !== undefined && this.date !== "")
            json.date = this.date;
        return json;
    }
    static fromJson(json) {
        const message = new Forecast;
        const oneof = new Set;
        const code = json.hasOwnProperty("code") ? json.code : json.code;
        if (code !== null && code !== undefined && code !== "") {
            if (!(typeof code === "string"))
                throw new Error("illegal value for code");
            message.code = code;
        }
        const date = json.hasOwnProperty("date") ? json.date : json.date;
        if (date !== null && date !== undefined && date !== "") {
            if (!(typeof date === "string"))
                throw new Error("illegal value for date");
            message.date = date;
        }
        return message;
    }
}
export class Forecast_Result {
    static type = "Forecast.Result";
    #unknown_fields = [];
    temperature = undefined;
    mergeFrom(bytes) {
        const br = new imp_0.BinaryReader(bytes);
        while (br.nextField() && !br.isEndGroup()) {
            switch (br.getFieldNumber()) {
                case 1:
                    this.temperature ??= new Temperature;
                    this.temperature.mergeFrom(br.readBytes());
                    break;
                case 0:
                    throw new Error("illegal zero tag.");
                default:
                    const prev = br.getCursor();
                    br.skipField();
                    this.#unknown_fields.push({
                        no: br.getFieldNumber(),
                        wireType: br.getWireType(),
                        data: bytes.subarray(prev, br.getCursor())
                    });
            }
        }
        return this;
    }
    static fromBinary(bytes) {
        const message = new Forecast_Result;
        message.mergeFrom(bytes);
        return message;
    }
    toBinary() {
        const bw = new imp_0.BinaryWriter;
        if (this.temperature !== undefined) {
            bw.writeBytes(1, this.temperature.toBinary());
        }
        for (const uf of this.#unknown_fields) {
            bw.writeFieldHeader_(uf.no, uf.wireType);
            bw.appendUint8Array_(uf.data);
        }
        return bw.getResultBuffer();
    }
    toJson() {
        const json = {};
        if (this.temperature !== undefined)
            json.temperature = this.temperature.toJson();
        return json;
    }
    static fromJson(json) {
        const message = new Forecast_Result;
        const oneof = new Set;
        const temperature = json.hasOwnProperty("temperature") ? json.temperature : json.temperature;
        if (temperature !== null && temperature !== undefined) {
            if (!(typeof temperature === "object"))
                throw new Error("illegal value for temperature");
            message.temperature = Temperature.fromJson(temperature);
        }
        return message;
    }
}
export class Weather {
    #url;
    #client;
    constructor(url, options) {
        this.#url = url;
        this.#client = new imp_1.GrpcWebClientBase(options ?? {});
    }
    #cities = new imp_1.MethodDescriptor("/Weather/cities", imp_1.MethodType.UNARY, CityQuery, CityQuery_Result, (r) => r.toBinary(), CityQuery_Result.fromBinary);
    cities(req, metadata) {
        return this.#client.thenableCall(this.#url + "/Weather/cities", req, metadata ?? {}, this.#cities);
    }
    #get = new imp_1.MethodDescriptor("/Weather/get", imp_1.MethodType.SERVER_STREAMING, GetTemperature, Temperature, (r) => r.toBinary(), Temperature.fromBinary);
    get(req, metadata) {
        return this.#client.serverStreaming(this.#url + "/Weather/get", req, metadata ?? {}, this.#get);
    }
    #ping = new imp_1.MethodDescriptor("/Weather/ping", imp_1.MethodType.UNSUPPORTED, Ping, Ping_Ack, (r) => r.toBinary(), Ping_Ack.fromBinary);
    ping(req, metadata) {
        throw new Error("grpc-web does not support this call type. server_streaming: false, client_streaming: true");
    }
    #forecast = new imp_1.MethodDescriptor("/Weather/forecast", imp_1.MethodType.UNSUPPORTED, Forecast, Forecast_Result, (r) => r.toBinary(), Forecast_Result.fromBinary);
    forecast(req, metadata) {
        throw new Error("grpc-web does not support this call type. server_streaming: true, client_streaming: true");
    }
}
