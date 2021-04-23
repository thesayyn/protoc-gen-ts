"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Change = exports.Kind = void 0;
const pb_1 = __importStar(require("google-protobuf"));
var Kind;
(function (Kind) {
    Kind[Kind["UPDATED"] = 0] = "UPDATED";
    Kind[Kind["DELETED"] = 1] = "DELETED";
})(Kind = exports.Kind || (exports.Kind = {}));
class Change extends pb_1.Message {
    constructor(data) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [3], []);
        if (!Array.isArray(data) && typeof data == "object") {
            if ("kind" in data) {
                this.kind = data.kind;
            }
            if ("patch" in data) {
                this.patch = data.patch;
            }
            this.tags = data.tags;
        }
    }
    get kind() {
        return pb_1.Message.getField(this, 1);
    }
    set kind(value) {
        pb_1.Message.setField(this, 1, value);
    }
    get patch() {
        return pb_1.Message.getField(this, 2);
    }
    set patch(value) {
        pb_1.Message.setField(this, 2, value);
    }
    get tags() {
        return pb_1.Message.getField(this, 3);
    }
    set tags(value) {
        pb_1.Message.setField(this, 3, value);
    }
    toObject() {
        var data = {
            tags: this.tags
        };
        if (this.kind != null) {
            data.kind = this.kind;
        }
        if (this.patch != null) {
            data.patch = this.patch;
        }
        return data;
    }
    serialize(w) {
        const writer = w || new pb_1.BinaryWriter();
        if (this.kind !== undefined)
            writer.writeEnum(1, this.kind);
        if (typeof this.patch === "string" && this.patch.length)
            writer.writeString(2, this.patch);
        if (this.tags !== undefined)
            writer.writeRepeatedString(3, this.tags);
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes) {
        const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new Change();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                case 1:
                    message.kind = reader.readEnum();
                    break;
                case 2:
                    message.patch = reader.readString();
                    break;
                case 3:
                    pb_1.Message.addToRepeatedField(message, 3, reader.readString());
                    break;
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary() {
        return this.serialize();
    }
    static deserializeBinary(bytes) {
        return Change.deserialize(bytes);
    }
}
exports.Change = Change;
