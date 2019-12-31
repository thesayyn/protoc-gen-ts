import * as pb_1 from "google-protobuf";
export namespace cg {
    export class C2G_Login extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [], null);
        }
        get token(): string {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as string;
        }
        set token(value: string) {
            pb_1.Message.setField(this, 1, value);
        }
        get server_id(): string {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as string;
        }
        set server_id(value: string) {
            pb_1.Message.setField(this, 2, value);
        }
        get version(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 3, undefined) as number | undefined;
        }
        set version(value: number) {
            pb_1.Message.setField(this, 3, value);
        }
        get login(): boolean | undefined {
            return pb_1.Message.getFieldWithDefault(this, 5, undefined) as boolean | undefined;
        }
        set login(value: boolean) {
            pb_1.Message.setField(this, 5, value);
        }
        get extend(): Uint8Array | undefined {
            return pb_1.Message.getFieldWithDefault(this, 20, undefined) as Uint8Array | undefined;
        }
        set extend(value: Uint8Array) {
            pb_1.Message.setField(this, 20, value);
        }
        toObject() {
            return {
                token: this.token,
                server_id: this.server_id,
                version: this.version,
                login: this.login,
                extend: this.extend
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.token)
                writer.writeString(1, this.token);
            if (this.server_id)
                writer.writeUint64String(2, this.server_id);
            if (this.version)
                writer.writeUint32(3, this.version);
            if (this.login)
                writer.writeBool(5, this.login);
            if (this.extend)
                writer.writeBytes(20, this.extend);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): C2G_Login {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new C2G_Login();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.token = reader.readString();
                        break;
                    case 2:
                        message.server_id = reader.readUint64String();
                        break;
                    case 3:
                        message.version = reader.readUint32();
                        break;
                    case 5:
                        message.login = reader.readBool();
                        break;
                    case 20:
                        message.extend = reader.readBytes();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class G2C_Login extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [], null);
        }
        get ret(): number {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as number;
        }
        set ret(value: number) {
            pb_1.Message.setField(this, 1, value);
        }
        get uid(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as string | undefined;
        }
        set uid(value: string) {
            pb_1.Message.setField(this, 2, value);
        }
        get new(): boolean | undefined {
            return pb_1.Message.getFieldWithDefault(this, 3, undefined) as boolean | undefined;
        }
        set new(value: boolean) {
            pb_1.Message.setField(this, 3, value);
        }
        get data(): Uint8Array | undefined {
            return pb_1.Message.getFieldWithDefault(this, 4, undefined) as Uint8Array | undefined;
        }
        set data(value: Uint8Array) {
            pb_1.Message.setField(this, 4, value);
        }
        get loginRank(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 10, undefined) as number | undefined;
        }
        set loginRank(value: number) {
            pb_1.Message.setField(this, 10, value);
        }
        toObject() {
            return {
                ret: this.ret,
                uid: this.uid,
                new: this.new,
                data: this.data,
                loginRank: this.loginRank
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.ret)
                writer.writeUint32(1, this.ret);
            if (this.uid)
                writer.writeUint64String(2, this.uid);
            if (this.new)
                writer.writeBool(3, this.new);
            if (this.data)
                writer.writeBytes(4, this.data);
            if (this.loginRank)
                writer.writeInt32(10, this.loginRank);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): G2C_Login {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new G2C_Login();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.ret = reader.readUint32();
                        break;
                    case 2:
                        message.uid = reader.readUint64String();
                        break;
                    case 3:
                        message.new = reader.readBool();
                        break;
                    case 4:
                        message.data = reader.readBytes();
                        break;
                    case 10:
                        message.loginRank = reader.readInt32();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class C2G_Create extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [], null);
        }
        get name(): string {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as string;
        }
        set name(value: string) {
            pb_1.Message.setField(this, 1, value);
        }
        get type(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as number | undefined;
        }
        set type(value: number) {
            pb_1.Message.setField(this, 2, value);
        }
        get server_id(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 3, undefined) as string | undefined;
        }
        set server_id(value: string) {
            pb_1.Message.setField(this, 3, value);
        }
        toObject() {
            return {
                name: this.name,
                type: this.type,
                server_id: this.server_id
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.name)
                writer.writeString(1, this.name);
            if (this.type)
                writer.writeUint32(2, this.type);
            if (this.server_id)
                writer.writeUint64String(3, this.server_id);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): C2G_Create {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new C2G_Create();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.name = reader.readString();
                        break;
                    case 2:
                        message.type = reader.readUint32();
                        break;
                    case 3:
                        message.server_id = reader.readUint64String();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class G2C_Create extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [], null);
        }
        get ret(): number {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as number;
        }
        set ret(value: number) {
            pb_1.Message.setField(this, 1, value);
        }
        get uid(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as string | undefined;
        }
        set uid(value: string) {
            pb_1.Message.setField(this, 2, value);
        }
        get sid(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 3, undefined) as string | undefined;
        }
        set sid(value: string) {
            pb_1.Message.setField(this, 3, value);
        }
        toObject() {
            return {
                ret: this.ret,
                uid: this.uid,
                sid: this.sid
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.ret)
                writer.writeUint32(1, this.ret);
            if (this.uid)
                writer.writeUint64String(2, this.uid);
            if (this.sid)
                writer.writeUint64String(3, this.sid);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): G2C_Create {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new G2C_Create();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.ret = reader.readUint32();
                        break;
                    case 2:
                        message.uid = reader.readUint64String();
                        break;
                    case 3:
                        message.sid = reader.readUint64String();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class C2G_Offline extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [], null);
        }
        toObject() {
            return {};
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): C2G_Offline {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new C2G_Offline();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class C2G_SayHi extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [], null);
        }
        toObject() {
            return {};
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): C2G_SayHi {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new C2G_SayHi();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class G2C_SayHi extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [2, 3], null);
        }
        get id(): string {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as string;
        }
        set id(value: string) {
            pb_1.Message.setField(this, 1, value);
        }
        get current(): string[] {
            return pb_1.Message.getField(this, 2) as string[];
        }
        set current(value: string[]) {
            pb_1.Message.setField(this, 2, value);
        }
        get del(): string[] {
            return pb_1.Message.getField(this, 3) as string[];
        }
        set del(value: string[]) {
            pb_1.Message.setField(this, 3, value);
        }
        toObject() {
            return {
                id: this.id,
                current: this.current,
                del: this.del
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.id)
                writer.writeUint64String(1, this.id);
            if (this.current)
                writer.writeRepeatedUint64String(2, this.current);
            if (this.del)
                writer.writeRepeatedUint64String(3, this.del);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): G2C_SayHi {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new G2C_SayHi();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.id = reader.readUint64String();
                        break;
                    case 2:
                        message.current.push(reader.readUint64String());
                        break;
                    case 3:
                        message.del.push(reader.readUint64String());
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class C2G_KeepAlive extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [], null);
        }
        toObject() {
            return {};
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): C2G_KeepAlive {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new C2G_KeepAlive();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class G2C_KeepAlive extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [], null);
        }
        toObject() {
            return {};
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): G2C_KeepAlive {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new G2C_KeepAlive();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class G2C_Broadcast extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [1], null);
        }
        get ids(): string[] {
            return pb_1.Message.getField(this, 1) as string[];
        }
        set ids(value: string[]) {
            pb_1.Message.setField(this, 1, value);
        }
        get cmd(): number {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as number;
        }
        set cmd(value: number) {
            pb_1.Message.setField(this, 2, value);
        }
        get info(): Uint8Array | undefined {
            return pb_1.Message.getFieldWithDefault(this, 3, undefined) as Uint8Array | undefined;
        }
        set info(value: Uint8Array) {
            pb_1.Message.setField(this, 3, value);
        }
        toObject() {
            return {
                ids: this.ids,
                cmd: this.cmd,
                info: this.info
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.ids)
                writer.writeRepeatedUint64String(1, this.ids);
            if (this.cmd)
                writer.writeUint32(2, this.cmd);
            if (this.info)
                writer.writeBytes(3, this.info);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): G2C_Broadcast {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new G2C_Broadcast();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.ids.push(reader.readUint64String());
                        break;
                    case 2:
                        message.cmd = reader.readUint32();
                        break;
                    case 3:
                        message.info = reader.readBytes();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class G2C_Offline extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [], null);
        }
        toObject() {
            return {};
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): G2C_Offline {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new G2C_Offline();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export enum RET {
        RET_ERROR = 0,
        RET_OK = 1,
        RET_SERVER_MAINTAIN = 2,
        RET_USER_NOT_EXIST = 3,
        RET_USER_NAME_REPEAT = 4,
        RET_LOGIN_REPEAT = 5,
        RET_LOGIC_NOT_OPEN = 6,
        RET_ACCOUNT_EXIST = 7,
        RET_ACCOUNT_BAN = 8,
        RET_VERSION_ERROR = 9,
        RET_TIME_ERROR = 10,
        RET_TOKEN_ERROR = 11,
        RET_IP_BAN = 12,
        RET_SERVER_BUSY = 13,
        RET_USER_DEVICE_LIMIT = 14,
        RET_USER_DATA_ERROR = 15,
        RET_EXEC_DB_CMD_ERROR = 16,
        RET_STOP_REGIST = 17,
        RET_ENTER_QUEUE = 18,
        RET_DEVICE_INFO_ERROR = 19,
        RET_DATA_ERROR = 20
    }
    export enum ID {
        MSG_NONE = 0,
        MSG_LOGIC_MIN = 10000,
        MSG_LOGIC_MAX = 30000,
        MSG_BEGIN = 10001,
        MSG_END = 10999,
        MSG_C2G_Login = 10002,
        MSG_G2C_Login = 10003,
        MSG_C2G_Create = 10004,
        MSG_G2C_Create = 10005,
        MSG_C2G_Offline = 10006,
        MSG_C2G_KeepAlive = 10007,
        MSG_G2C_KeepAlive = 10008,
        MSG_C2G_SayHi = 10009,
        MSG_G2C_SayHi = 10010,
        MSG_G2C_Broadcast = 10011,
        MSG_G2C_Offline = 10012
    }
}
