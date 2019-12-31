import * as pb_1 from "google-protobuf";
export namespace common {
    export class PlayerHeadPortrait extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [], null);
        }
        get name(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as string | undefined;
        }
        set name(value: string) {
            pb_1.Message.setField(this, 1, value);
        }
        get level(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as number | undefined;
        }
        set level(value: number) {
            pb_1.Message.setField(this, 2, value);
        }
        get avatar(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 3, undefined) as number | undefined;
        }
        set avatar(value: number) {
            pb_1.Message.setField(this, 3, value);
        }
        get avatarFrame(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 4, undefined) as number | undefined;
        }
        set avatarFrame(value: number) {
            pb_1.Message.setField(this, 4, value);
        }
        get vipLv(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 5, undefined) as number | undefined;
        }
        set vipLv(value: number) {
            pb_1.Message.setField(this, 5, value);
        }
        get uid(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 6, undefined) as number | undefined;
        }
        set uid(value: number) {
            pb_1.Message.setField(this, 6, value);
        }
        toObject() {
            return {
                name: this.name,
                level: this.level,
                avatar: this.avatar,
                avatarFrame: this.avatarFrame,
                vipLv: this.vipLv,
                uid: this.uid
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.name)
                writer.writeString(1, this.name);
            if (this.level)
                writer.writeUint32(2, this.level);
            if (this.avatar)
                writer.writeInt32(3, this.avatar);
            if (this.avatarFrame)
                writer.writeInt32(4, this.avatarFrame);
            if (this.vipLv)
                writer.writeUint32(5, this.vipLv);
            if (this.uid)
                writer.writeUint64(6, this.uid);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): PlayerHeadPortrait {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new PlayerHeadPortrait();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.name = reader.readString();
                        break;
                    case 2:
                        message.level = reader.readUint32();
                        break;
                    case 3:
                        message.avatar = reader.readInt32();
                        break;
                    case 4:
                        message.avatarFrame = reader.readInt32();
                        break;
                    case 5:
                        message.vipLv = reader.readUint32();
                        break;
                    case 6:
                        message.uid = reader.readUint64();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class PlayerSimpleData extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [19], null);
        }
        get id(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as string | undefined;
        }
        set id(value: string) {
            pb_1.Message.setField(this, 1, value);
        }
        get name(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as string | undefined;
        }
        set name(value: string) {
            pb_1.Message.setField(this, 2, value);
        }
        get serverId(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 3, undefined) as string | undefined;
        }
        set serverId(value: string) {
            pb_1.Message.setField(this, 3, value);
        }
        get level(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 4, undefined) as number | undefined;
        }
        set level(value: number) {
            pb_1.Message.setField(this, 4, value);
        }
        get career(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 5, undefined) as number | undefined;
        }
        set career(value: number) {
            pb_1.Message.setField(this, 5, value);
        }
        get avatar(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 6, undefined) as number | undefined;
        }
        set avatar(value: number) {
            pb_1.Message.setField(this, 6, value);
        }
        get avatarFrame(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 7, undefined) as number | undefined;
        }
        set avatarFrame(value: number) {
            pb_1.Message.setField(this, 7, value);
        }
        get msg(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 8, undefined) as string | undefined;
        }
        set msg(value: string) {
            pb_1.Message.setField(this, 8, value);
        }
        get vip(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 9, undefined) as number | undefined;
        }
        set vip(value: number) {
            pb_1.Message.setField(this, 9, value);
        }
        get power(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 10, undefined) as number | undefined;
        }
        set power(value: number) {
            pb_1.Message.setField(this, 10, value);
        }
        get lastLogout(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 11, undefined) as string | undefined;
        }
        set lastLogout(value: string) {
            pb_1.Message.setField(this, 11, value);
        }
        get guildId(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 12, undefined) as string | undefined;
        }
        set guildId(value: string) {
            pb_1.Message.setField(this, 12, value);
        }
        get guildName(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 13, undefined) as string | undefined;
        }
        set guildName(value: string) {
            pb_1.Message.setField(this, 13, value);
        }
        get counsellorId(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 14, undefined) as number | undefined;
        }
        set counsellorId(value: number) {
            pb_1.Message.setField(this, 14, value);
        }
        get lastLogin(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 15, undefined) as string | undefined;
        }
        set lastLogin(value: string) {
            pb_1.Message.setField(this, 15, value);
        }
        get arenaRank(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 16, undefined) as number | undefined;
        }
        set arenaRank(value: number) {
            pb_1.Message.setField(this, 16, value);
        }
        get arenaDefencePower(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 17, undefined) as number | undefined;
        }
        set arenaDefencePower(value: number) {
            pb_1.Message.setField(this, 17, value);
        }
        get pveCounsellorId(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 18, undefined) as number | undefined;
        }
        set pveCounsellorId(value: number) {
            pb_1.Message.setField(this, 18, value);
        }
        get hideVipSystems(): number[] {
            return pb_1.Message.getField(this, 19) as number[];
        }
        set hideVipSystems(value: number[]) {
            pb_1.Message.setField(this, 19, value);
        }
        get friends(): Friends | undefined {
            return pb_1.Message.getWrapperField(this, Friends, 20) as Friends | undefined;
        }
        set friends(value: Friends) {
            pb_1.Message.setWrapperField(this, 20, value);
        }
        get praise(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 21, undefined) as number | undefined;
        }
        set praise(value: number) {
            pb_1.Message.setField(this, 21, value);
        }
        get hasPraise(): boolean | undefined {
            return pb_1.Message.getFieldWithDefault(this, 22, undefined) as boolean | undefined;
        }
        set hasPraise(value: boolean) {
            pb_1.Message.setField(this, 22, value);
        }
        get peakRank(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 23, undefined) as number | undefined;
        }
        set peakRank(value: number) {
            pb_1.Message.setField(this, 23, value);
        }
        get maxPower(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 24, undefined) as number | undefined;
        }
        set maxPower(value: number) {
            pb_1.Message.setField(this, 24, value);
        }
        get showCommanderId(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 25, undefined) as number | undefined;
        }
        set showCommanderId(value: number) {
            pb_1.Message.setField(this, 25, value);
        }
        get online(): boolean | undefined {
            return pb_1.Message.getFieldWithDefault(this, 30, undefined) as boolean | undefined;
        }
        set online(value: boolean) {
            pb_1.Message.setField(this, 30, value);
        }
        toObject() {
            return {
                id: this.id,
                name: this.name,
                serverId: this.serverId,
                level: this.level,
                career: this.career,
                avatar: this.avatar,
                avatarFrame: this.avatarFrame,
                msg: this.msg,
                vip: this.vip,
                power: this.power,
                lastLogout: this.lastLogout,
                guildId: this.guildId,
                guildName: this.guildName,
                counsellorId: this.counsellorId,
                lastLogin: this.lastLogin,
                arenaRank: this.arenaRank,
                arenaDefencePower: this.arenaDefencePower,
                pveCounsellorId: this.pveCounsellorId,
                hideVipSystems: this.hideVipSystems,
                friends: this.friends,
                praise: this.praise,
                hasPraise: this.hasPraise,
                peakRank: this.peakRank,
                maxPower: this.maxPower,
                showCommanderId: this.showCommanderId,
                online: this.online
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.id)
                writer.writeUint64String(1, this.id);
            if (this.name)
                writer.writeString(2, this.name);
            if (this.serverId)
                writer.writeUint64String(3, this.serverId);
            if (this.level)
                writer.writeUint32(4, this.level);
            if (this.career)
                writer.writeUint32(5, this.career);
            if (this.avatar)
                writer.writeInt32(6, this.avatar);
            if (this.avatarFrame)
                writer.writeInt32(7, this.avatarFrame);
            if (this.msg)
                writer.writeString(8, this.msg);
            if (this.vip)
                writer.writeUint32(9, this.vip);
            if (this.power)
                writer.writeUint32(10, this.power);
            if (this.lastLogout)
                writer.writeInt64String(11, this.lastLogout);
            if (this.guildId)
                writer.writeUint64String(12, this.guildId);
            if (this.guildName)
                writer.writeString(13, this.guildName);
            if (this.counsellorId)
                writer.writeInt32(14, this.counsellorId);
            if (this.lastLogin)
                writer.writeInt64String(15, this.lastLogin);
            if (this.arenaRank)
                writer.writeUint32(16, this.arenaRank);
            if (this.arenaDefencePower)
                writer.writeUint32(17, this.arenaDefencePower);
            if (this.pveCounsellorId)
                writer.writeInt32(18, this.pveCounsellorId);
            if (this.hideVipSystems)
                writer.writeRepeatedInt32(19, this.hideVipSystems);
            if (this.friends)
                writer.writeMessage(20, this.friends, (item: Friends) => item.serialize(writer));
            if (this.praise)
                writer.writeUint32(21, this.praise);
            if (this.hasPraise)
                writer.writeBool(22, this.hasPraise);
            if (this.peakRank)
                writer.writeUint32(23, this.peakRank);
            if (this.maxPower)
                writer.writeUint32(24, this.maxPower);
            if (this.showCommanderId)
                writer.writeInt32(25, this.showCommanderId);
            if (this.online)
                writer.writeBool(30, this.online);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): PlayerSimpleData {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new PlayerSimpleData();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.id = reader.readUint64String();
                        break;
                    case 2:
                        message.name = reader.readString();
                        break;
                    case 3:
                        message.serverId = reader.readUint64String();
                        break;
                    case 4:
                        message.level = reader.readUint32();
                        break;
                    case 5:
                        message.career = reader.readUint32();
                        break;
                    case 6:
                        message.avatar = reader.readInt32();
                        break;
                    case 7:
                        message.avatarFrame = reader.readInt32();
                        break;
                    case 8:
                        message.msg = reader.readString();
                        break;
                    case 9:
                        message.vip = reader.readUint32();
                        break;
                    case 10:
                        message.power = reader.readUint32();
                        break;
                    case 11:
                        message.lastLogout = reader.readInt64String();
                        break;
                    case 12:
                        message.guildId = reader.readUint64String();
                        break;
                    case 13:
                        message.guildName = reader.readString();
                        break;
                    case 14:
                        message.counsellorId = reader.readInt32();
                        break;
                    case 15:
                        message.lastLogin = reader.readInt64String();
                        break;
                    case 16:
                        message.arenaRank = reader.readUint32();
                        break;
                    case 17:
                        message.arenaDefencePower = reader.readUint32();
                        break;
                    case 18:
                        message.pveCounsellorId = reader.readInt32();
                        break;
                    case 19:
                        message.hideVipSystems.push(reader.readInt32());
                        break;
                    case 20:
                        reader.readMessage(message.friends, () => message.friends = Friends.deserialize(reader));
                        break;
                    case 21:
                        message.praise = reader.readUint32();
                        break;
                    case 22:
                        message.hasPraise = reader.readBool();
                        break;
                    case 23:
                        message.peakRank = reader.readUint32();
                        break;
                    case 24:
                        message.maxPower = reader.readUint32();
                        break;
                    case 25:
                        message.showCommanderId = reader.readInt32();
                        break;
                    case 30:
                        message.online = reader.readBool();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class PlayerSimpleDataEx extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [20, 22, 23, 24, 27, 29], null);
        }
        get id(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as string | undefined;
        }
        set id(value: string) {
            pb_1.Message.setField(this, 1, value);
        }
        get name(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as string | undefined;
        }
        set name(value: string) {
            pb_1.Message.setField(this, 2, value);
        }
        get serverId(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 3, undefined) as string | undefined;
        }
        set serverId(value: string) {
            pb_1.Message.setField(this, 3, value);
        }
        get level(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 4, undefined) as number | undefined;
        }
        set level(value: number) {
            pb_1.Message.setField(this, 4, value);
        }
        get career(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 5, undefined) as number | undefined;
        }
        set career(value: number) {
            pb_1.Message.setField(this, 5, value);
        }
        get avatar(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 6, undefined) as number | undefined;
        }
        set avatar(value: number) {
            pb_1.Message.setField(this, 6, value);
        }
        get avatarFrame(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 7, undefined) as number | undefined;
        }
        set avatarFrame(value: number) {
            pb_1.Message.setField(this, 7, value);
        }
        get msg(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 8, undefined) as string | undefined;
        }
        set msg(value: string) {
            pb_1.Message.setField(this, 8, value);
        }
        get vip(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 9, undefined) as number | undefined;
        }
        set vip(value: number) {
            pb_1.Message.setField(this, 9, value);
        }
        get power(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 10, undefined) as number | undefined;
        }
        set power(value: number) {
            pb_1.Message.setField(this, 10, value);
        }
        get lastLogout(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 11, undefined) as string | undefined;
        }
        set lastLogout(value: string) {
            pb_1.Message.setField(this, 11, value);
        }
        get guildId(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 12, undefined) as string | undefined;
        }
        set guildId(value: string) {
            pb_1.Message.setField(this, 12, value);
        }
        get guildName(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 13, undefined) as string | undefined;
        }
        set guildName(value: string) {
            pb_1.Message.setField(this, 13, value);
        }
        get counsellorId(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 14, undefined) as number | undefined;
        }
        set counsellorId(value: number) {
            pb_1.Message.setField(this, 14, value);
        }
        get lastLogin(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 15, undefined) as string | undefined;
        }
        set lastLogin(value: string) {
            pb_1.Message.setField(this, 15, value);
        }
        get arenaRank(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 16, undefined) as number | undefined;
        }
        set arenaRank(value: number) {
            pb_1.Message.setField(this, 16, value);
        }
        get arenaDefencePower(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 17, undefined) as number | undefined;
        }
        set arenaDefencePower(value: number) {
            pb_1.Message.setField(this, 17, value);
        }
        get praise(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 18, undefined) as number | undefined;
        }
        set praise(value: number) {
            pb_1.Message.setField(this, 18, value);
        }
        get hasPraise(): boolean | undefined {
            return pb_1.Message.getFieldWithDefault(this, 19, undefined) as boolean | undefined;
        }
        set hasPraise(value: boolean) {
            pb_1.Message.setField(this, 19, value);
        }
        get commanders(): Commander[] {
            return pb_1.Message.getRepeatedWrapperField(this, Commander, 20) as Commander[];
        }
        set commanders(value: Commander[]) {
            pb_1.Message.setRepeatedWrapperField(this, 20, value);
        }
        get formation(): Formation | undefined {
            return pb_1.Message.getWrapperField(this, Formation, 21) as Formation | undefined;
        }
        set formation(value: Formation) {
            pb_1.Message.setWrapperField(this, 21, value);
        }
        get counsellors(): Counsellor[] {
            return pb_1.Message.getRepeatedWrapperField(this, Counsellor, 22) as Counsellor[];
        }
        set counsellors(value: Counsellor[]) {
            pb_1.Message.setRepeatedWrapperField(this, 22, value);
        }
        get strTalents(): StrTalent[] {
            return pb_1.Message.getRepeatedWrapperField(this, StrTalent, 23) as StrTalent[];
        }
        set strTalents(value: StrTalent[]) {
            pb_1.Message.setRepeatedWrapperField(this, 23, value);
        }
        get treasures(): Treasure[] {
            return pb_1.Message.getRepeatedWrapperField(this, Treasure, 24) as Treasure[];
        }
        set treasures(value: Treasure[]) {
            pb_1.Message.setRepeatedWrapperField(this, 24, value);
        }
        get treasureFates(): TreasureFatesInfo | undefined {
            return pb_1.Message.getWrapperField(this, TreasureFatesInfo, 25) as TreasureFatesInfo | undefined;
        }
        set treasureFates(value: TreasureFatesInfo) {
            pb_1.Message.setWrapperField(this, 25, value);
        }
        get pokedexInfo(): PokedexBattleInfo | undefined {
            return pb_1.Message.getWrapperField(this, PokedexBattleInfo, 26) as PokedexBattleInfo | undefined;
        }
        set pokedexInfo(value: PokedexBattleInfo) {
            pb_1.Message.setWrapperField(this, 26, value);
        }
        get soldierTech(): SoldierTech[] {
            return pb_1.Message.getRepeatedWrapperField(this, SoldierTech, 27) as SoldierTech[];
        }
        set soldierTech(value: SoldierTech[]) {
            pb_1.Message.setRepeatedWrapperField(this, 27, value);
        }
        get peakRank(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 28, undefined) as number | undefined;
        }
        set peakRank(value: number) {
            pb_1.Message.setField(this, 28, value);
        }
        get hideVipSystems(): number[] {
            return pb_1.Message.getField(this, 29) as number[];
        }
        set hideVipSystems(value: number[]) {
            pb_1.Message.setField(this, 29, value);
        }
        get collect(): Collect | undefined {
            return pb_1.Message.getWrapperField(this, Collect, 30) as Collect | undefined;
        }
        set collect(value: Collect) {
            pb_1.Message.setWrapperField(this, 30, value);
        }
        toObject() {
            return {
                id: this.id,
                name: this.name,
                serverId: this.serverId,
                level: this.level,
                career: this.career,
                avatar: this.avatar,
                avatarFrame: this.avatarFrame,
                msg: this.msg,
                vip: this.vip,
                power: this.power,
                lastLogout: this.lastLogout,
                guildId: this.guildId,
                guildName: this.guildName,
                counsellorId: this.counsellorId,
                lastLogin: this.lastLogin,
                arenaRank: this.arenaRank,
                arenaDefencePower: this.arenaDefencePower,
                praise: this.praise,
                hasPraise: this.hasPraise,
                commanders: this.commanders,
                formation: this.formation,
                counsellors: this.counsellors,
                strTalents: this.strTalents,
                treasures: this.treasures,
                treasureFates: this.treasureFates,
                pokedexInfo: this.pokedexInfo,
                soldierTech: this.soldierTech,
                peakRank: this.peakRank,
                hideVipSystems: this.hideVipSystems,
                collect: this.collect
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.id)
                writer.writeUint64String(1, this.id);
            if (this.name)
                writer.writeString(2, this.name);
            if (this.serverId)
                writer.writeUint64String(3, this.serverId);
            if (this.level)
                writer.writeUint32(4, this.level);
            if (this.career)
                writer.writeUint32(5, this.career);
            if (this.avatar)
                writer.writeInt32(6, this.avatar);
            if (this.avatarFrame)
                writer.writeInt32(7, this.avatarFrame);
            if (this.msg)
                writer.writeString(8, this.msg);
            if (this.vip)
                writer.writeUint32(9, this.vip);
            if (this.power)
                writer.writeUint32(10, this.power);
            if (this.lastLogout)
                writer.writeInt64String(11, this.lastLogout);
            if (this.guildId)
                writer.writeUint64String(12, this.guildId);
            if (this.guildName)
                writer.writeString(13, this.guildName);
            if (this.counsellorId)
                writer.writeInt32(14, this.counsellorId);
            if (this.lastLogin)
                writer.writeInt64String(15, this.lastLogin);
            if (this.arenaRank)
                writer.writeUint32(16, this.arenaRank);
            if (this.arenaDefencePower)
                writer.writeUint32(17, this.arenaDefencePower);
            if (this.praise)
                writer.writeUint32(18, this.praise);
            if (this.hasPraise)
                writer.writeBool(19, this.hasPraise);
            if (this.commanders)
                writer.writeRepeatedMessage(20, this.commanders, (item: Commander) => item.serialize(writer));
            if (this.formation)
                writer.writeMessage(21, this.formation, (item: Formation) => item.serialize(writer));
            if (this.counsellors)
                writer.writeRepeatedMessage(22, this.counsellors, (item: Counsellor) => item.serialize(writer));
            if (this.strTalents)
                writer.writeRepeatedMessage(23, this.strTalents, (item: StrTalent) => item.serialize(writer));
            if (this.treasures)
                writer.writeRepeatedMessage(24, this.treasures, (item: Treasure) => item.serialize(writer));
            if (this.treasureFates)
                writer.writeMessage(25, this.treasureFates, (item: TreasureFatesInfo) => item.serialize(writer));
            if (this.pokedexInfo)
                writer.writeMessage(26, this.pokedexInfo, (item: PokedexBattleInfo) => item.serialize(writer));
            if (this.soldierTech)
                writer.writeRepeatedMessage(27, this.soldierTech, (item: SoldierTech) => item.serialize(writer));
            if (this.peakRank)
                writer.writeUint32(28, this.peakRank);
            if (this.hideVipSystems)
                writer.writeRepeatedInt32(29, this.hideVipSystems);
            if (this.collect)
                writer.writeMessage(30, this.collect, (item: Collect) => item.serialize(writer));
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): PlayerSimpleDataEx {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new PlayerSimpleDataEx();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.id = reader.readUint64String();
                        break;
                    case 2:
                        message.name = reader.readString();
                        break;
                    case 3:
                        message.serverId = reader.readUint64String();
                        break;
                    case 4:
                        message.level = reader.readUint32();
                        break;
                    case 5:
                        message.career = reader.readUint32();
                        break;
                    case 6:
                        message.avatar = reader.readInt32();
                        break;
                    case 7:
                        message.avatarFrame = reader.readInt32();
                        break;
                    case 8:
                        message.msg = reader.readString();
                        break;
                    case 9:
                        message.vip = reader.readUint32();
                        break;
                    case 10:
                        message.power = reader.readUint32();
                        break;
                    case 11:
                        message.lastLogout = reader.readInt64String();
                        break;
                    case 12:
                        message.guildId = reader.readUint64String();
                        break;
                    case 13:
                        message.guildName = reader.readString();
                        break;
                    case 14:
                        message.counsellorId = reader.readInt32();
                        break;
                    case 15:
                        message.lastLogin = reader.readInt64String();
                        break;
                    case 16:
                        message.arenaRank = reader.readUint32();
                        break;
                    case 17:
                        message.arenaDefencePower = reader.readUint32();
                        break;
                    case 18:
                        message.praise = reader.readUint32();
                        break;
                    case 19:
                        message.hasPraise = reader.readBool();
                        break;
                    case 20:
                        reader.readMessage(message.commanders, () => pb_1.Message.addToRepeatedWrapperField(message, 20, Commander.deserialize(reader), Commander));
                        break;
                    case 21:
                        reader.readMessage(message.formation, () => message.formation = Formation.deserialize(reader));
                        break;
                    case 22:
                        reader.readMessage(message.counsellors, () => pb_1.Message.addToRepeatedWrapperField(message, 22, Counsellor.deserialize(reader), Counsellor));
                        break;
                    case 23:
                        reader.readMessage(message.strTalents, () => pb_1.Message.addToRepeatedWrapperField(message, 23, StrTalent.deserialize(reader), StrTalent));
                        break;
                    case 24:
                        reader.readMessage(message.treasures, () => pb_1.Message.addToRepeatedWrapperField(message, 24, Treasure.deserialize(reader), Treasure));
                        break;
                    case 25:
                        reader.readMessage(message.treasureFates, () => message.treasureFates = TreasureFatesInfo.deserialize(reader));
                        break;
                    case 26:
                        reader.readMessage(message.pokedexInfo, () => message.pokedexInfo = PokedexBattleInfo.deserialize(reader));
                        break;
                    case 27:
                        reader.readMessage(message.soldierTech, () => pb_1.Message.addToRepeatedWrapperField(message, 27, SoldierTech.deserialize(reader), SoldierTech));
                        break;
                    case 28:
                        message.peakRank = reader.readUint32();
                        break;
                    case 29:
                        message.hideVipSystems.push(reader.readInt32());
                        break;
                    case 30:
                        reader.readMessage(message.collect, () => message.collect = Collect.deserialize(reader));
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class DeviceInfo extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [], null);
        }
        get deviceType(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 20, undefined) as string | undefined;
        }
        set deviceType(value: string) {
            pb_1.Message.setField(this, 20, value);
        }
        get deviceOS(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 21, undefined) as string | undefined;
        }
        set deviceOS(value: string) {
            pb_1.Message.setField(this, 21, value);
        }
        get deviceID(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 22, undefined) as string | undefined;
        }
        set deviceID(value: string) {
            pb_1.Message.setField(this, 22, value);
        }
        get bundleID(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 23, undefined) as string | undefined;
        }
        set bundleID(value: string) {
            pb_1.Message.setField(this, 23, value);
        }
        get region(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 24, undefined) as string | undefined;
        }
        set region(value: string) {
            pb_1.Message.setField(this, 24, value);
        }
        get language(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 25, undefined) as string | undefined;
        }
        set language(value: string) {
            pb_1.Message.setField(this, 25, value);
        }
        get gameVer(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 26, undefined) as string | undefined;
        }
        set gameVer(value: string) {
            pb_1.Message.setField(this, 26, value);
        }
        get opId(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 27, undefined) as string | undefined;
        }
        set opId(value: string) {
            pb_1.Message.setField(this, 27, value);
        }
        get vipLevel(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 28, undefined) as number | undefined;
        }
        set vipLevel(value: number) {
            pb_1.Message.setField(this, 28, value);
        }
        toObject() {
            return {
                deviceType: this.deviceType,
                deviceOS: this.deviceOS,
                deviceID: this.deviceID,
                bundleID: this.bundleID,
                region: this.region,
                language: this.language,
                gameVer: this.gameVer,
                opId: this.opId,
                vipLevel: this.vipLevel
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.deviceType)
                writer.writeString(20, this.deviceType);
            if (this.deviceOS)
                writer.writeString(21, this.deviceOS);
            if (this.deviceID)
                writer.writeString(22, this.deviceID);
            if (this.bundleID)
                writer.writeString(23, this.bundleID);
            if (this.region)
                writer.writeString(24, this.region);
            if (this.language)
                writer.writeString(25, this.language);
            if (this.gameVer)
                writer.writeString(26, this.gameVer);
            if (this.opId)
                writer.writeString(27, this.opId);
            if (this.vipLevel)
                writer.writeInt32(28, this.vipLevel);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): DeviceInfo {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new DeviceInfo();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 20:
                        message.deviceType = reader.readString();
                        break;
                    case 21:
                        message.deviceOS = reader.readString();
                        break;
                    case 22:
                        message.deviceID = reader.readString();
                        break;
                    case 23:
                        message.bundleID = reader.readString();
                        break;
                    case 24:
                        message.region = reader.readString();
                        break;
                    case 25:
                        message.language = reader.readString();
                        break;
                    case 26:
                        message.gameVer = reader.readString();
                        break;
                    case 27:
                        message.opId = reader.readString();
                        break;
                    case 28:
                        message.vipLevel = reader.readInt32();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class RoleSummary extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [], null);
        }
        get account(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as string | undefined;
        }
        set account(value: string) {
            pb_1.Message.setField(this, 1, value);
        }
        get roleId(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as string | undefined;
        }
        set roleId(value: string) {
            pb_1.Message.setField(this, 2, value);
        }
        get serverId(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 3, undefined) as string | undefined;
        }
        set serverId(value: string) {
            pb_1.Message.setField(this, 3, value);
        }
        get roleName(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 4, undefined) as string | undefined;
        }
        set roleName(value: string) {
            pb_1.Message.setField(this, 4, value);
        }
        get lv(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 5, undefined) as number | undefined;
        }
        set lv(value: number) {
            pb_1.Message.setField(this, 5, value);
        }
        get vipLv(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 6, undefined) as number | undefined;
        }
        set vipLv(value: number) {
            pb_1.Message.setField(this, 6, value);
        }
        get upTime(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 7, undefined) as string | undefined;
        }
        set upTime(value: string) {
            pb_1.Message.setField(this, 7, value);
        }
        toObject() {
            return {
                account: this.account,
                roleId: this.roleId,
                serverId: this.serverId,
                roleName: this.roleName,
                lv: this.lv,
                vipLv: this.vipLv,
                upTime: this.upTime
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.account)
                writer.writeString(1, this.account);
            if (this.roleId)
                writer.writeUint64String(2, this.roleId);
            if (this.serverId)
                writer.writeUint64String(3, this.serverId);
            if (this.roleName)
                writer.writeString(4, this.roleName);
            if (this.lv)
                writer.writeUint32(5, this.lv);
            if (this.vipLv)
                writer.writeUint32(6, this.vipLv);
            if (this.upTime)
                writer.writeInt64String(7, this.upTime);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): RoleSummary {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new RoleSummary();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.account = reader.readString();
                        break;
                    case 2:
                        message.roleId = reader.readUint64String();
                        break;
                    case 3:
                        message.serverId = reader.readUint64String();
                        break;
                    case 4:
                        message.roleName = reader.readString();
                        break;
                    case 5:
                        message.lv = reader.readUint32();
                        break;
                    case 6:
                        message.vipLv = reader.readUint32();
                        break;
                    case 7:
                        message.upTime = reader.readInt64String();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class Item extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [], null);
        }
        get id(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as number | undefined;
        }
        set id(value: number) {
            pb_1.Message.setField(this, 1, value);
        }
        get count(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as number | undefined;
        }
        set count(value: number) {
            pb_1.Message.setField(this, 2, value);
        }
        get validTime(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 3, undefined) as string | undefined;
        }
        set validTime(value: string) {
            pb_1.Message.setField(this, 3, value);
        }
        toObject() {
            return {
                id: this.id,
                count: this.count,
                validTime: this.validTime
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.id)
                writer.writeInt32(1, this.id);
            if (this.count)
                writer.writeUint32(2, this.count);
            if (this.validTime)
                writer.writeInt64String(3, this.validTime);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): Item {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new Item();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.id = reader.readInt32();
                        break;
                    case 2:
                        message.count = reader.readUint32();
                        break;
                    case 3:
                        message.validTime = reader.readInt64String();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class CommanderSkill extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [], null);
        }
        get skillSlotId(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as number | undefined;
        }
        set skillSlotId(value: number) {
            pb_1.Message.setField(this, 1, value);
        }
        get level(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as number | undefined;
        }
        set level(value: number) {
            pb_1.Message.setField(this, 2, value);
        }
        get exp(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 3, undefined) as number | undefined;
        }
        set exp(value: number) {
            pb_1.Message.setField(this, 3, value);
        }
        toObject() {
            return {
                skillSlotId: this.skillSlotId,
                level: this.level,
                exp: this.exp
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.skillSlotId)
                writer.writeUint32(1, this.skillSlotId);
            if (this.level)
                writer.writeUint32(2, this.level);
            if (this.exp)
                writer.writeUint32(3, this.exp);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): CommanderSkill {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new CommanderSkill();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.skillSlotId = reader.readUint32();
                        break;
                    case 2:
                        message.level = reader.readUint32();
                        break;
                    case 3:
                        message.exp = reader.readUint32();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class CommanderEquip extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [], null);
        }
        get equipSlotId(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as number | undefined;
        }
        set equipSlotId(value: number) {
            pb_1.Message.setField(this, 1, value);
        }
        get synthetical(): boolean | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as boolean | undefined;
        }
        set synthetical(value: boolean) {
            pb_1.Message.setField(this, 2, value);
        }
        toObject() {
            return {
                equipSlotId: this.equipSlotId,
                synthetical: this.synthetical
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.equipSlotId)
                writer.writeUint32(1, this.equipSlotId);
            if (this.synthetical)
                writer.writeBool(2, this.synthetical);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): CommanderEquip {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new CommanderEquip();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.equipSlotId = reader.readUint32();
                        break;
                    case 2:
                        message.synthetical = reader.readBool();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class Commander extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [13, 14], null);
        }
        get id(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as number | undefined;
        }
        set id(value: number) {
            pb_1.Message.setField(this, 1, value);
        }
        get level(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as number | undefined;
        }
        set level(value: number) {
            pb_1.Message.setField(this, 2, value);
        }
        get exp(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 3, undefined) as number | undefined;
        }
        set exp(value: number) {
            pb_1.Message.setField(this, 3, value);
        }
        get peerage(): Peerage | undefined {
            return pb_1.Message.getFieldWithDefault(this, 4, undefined) as Peerage | undefined;
        }
        set peerage(value: Peerage) {
            pb_1.Message.setField(this, 4, value);
        }
        get awakenLevel(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 5, undefined) as number | undefined;
        }
        set awakenLevel(value: number) {
            pb_1.Message.setField(this, 5, value);
        }
        get quality(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 6, undefined) as number | undefined;
        }
        set quality(value: number) {
            pb_1.Message.setField(this, 6, value);
        }
        get starLevel(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 7, undefined) as number | undefined;
        }
        set starLevel(value: number) {
            pb_1.Message.setField(this, 7, value);
        }
        get littleStarLevel(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 8, undefined) as number | undefined;
        }
        set littleStarLevel(value: number) {
            pb_1.Message.setField(this, 8, value);
        }
        get official(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 9, undefined) as number | undefined;
        }
        set official(value: number) {
            pb_1.Message.setField(this, 9, value);
        }
        get basePower(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 10, undefined) as number | undefined;
        }
        set basePower(value: number) {
            pb_1.Message.setField(this, 10, value);
        }
        get leadershipLevel(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 11, undefined) as number | undefined;
        }
        set leadershipLevel(value: number) {
            pb_1.Message.setField(this, 11, value);
        }
        get soldierId(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 12, undefined) as number | undefined;
        }
        set soldierId(value: number) {
            pb_1.Message.setField(this, 12, value);
        }
        get skills(): CommanderSkill[] {
            return pb_1.Message.getRepeatedWrapperField(this, CommanderSkill, 13) as CommanderSkill[];
        }
        set skills(value: CommanderSkill[]) {
            pb_1.Message.setRepeatedWrapperField(this, 13, value);
        }
        get equips(): CommanderEquip[] {
            return pb_1.Message.getRepeatedWrapperField(this, CommanderEquip, 14) as CommanderEquip[];
        }
        set equips(value: CommanderEquip[]) {
            pb_1.Message.setRepeatedWrapperField(this, 14, value);
        }
        get power(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 15, undefined) as number | undefined;
        }
        set power(value: number) {
            pb_1.Message.setField(this, 15, value);
        }
        toObject() {
            return {
                id: this.id,
                level: this.level,
                exp: this.exp,
                peerage: this.peerage,
                awakenLevel: this.awakenLevel,
                quality: this.quality,
                starLevel: this.starLevel,
                littleStarLevel: this.littleStarLevel,
                official: this.official,
                basePower: this.basePower,
                leadershipLevel: this.leadershipLevel,
                soldierId: this.soldierId,
                skills: this.skills,
                equips: this.equips,
                power: this.power
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.id)
                writer.writeInt32(1, this.id);
            if (this.level)
                writer.writeUint32(2, this.level);
            if (this.exp)
                writer.writeUint32(3, this.exp);
            if (this.peerage)
                writer.writeEnum(4, this.peerage);
            if (this.awakenLevel)
                writer.writeUint32(5, this.awakenLevel);
            if (this.quality)
                writer.writeUint32(6, this.quality);
            if (this.starLevel)
                writer.writeUint32(7, this.starLevel);
            if (this.littleStarLevel)
                writer.writeUint32(8, this.littleStarLevel);
            if (this.official)
                writer.writeUint32(9, this.official);
            if (this.basePower)
                writer.writeUint32(10, this.basePower);
            if (this.leadershipLevel)
                writer.writeUint32(11, this.leadershipLevel);
            if (this.soldierId)
                writer.writeInt32(12, this.soldierId);
            if (this.skills)
                writer.writeRepeatedMessage(13, this.skills, (item: CommanderSkill) => item.serialize(writer));
            if (this.equips)
                writer.writeRepeatedMessage(14, this.equips, (item: CommanderEquip) => item.serialize(writer));
            if (this.power)
                writer.writeUint32(15, this.power);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): Commander {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new Commander();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.id = reader.readInt32();
                        break;
                    case 2:
                        message.level = reader.readUint32();
                        break;
                    case 3:
                        message.exp = reader.readUint32();
                        break;
                    case 4:
                        message.peerage = reader.readEnum();
                        break;
                    case 5:
                        message.awakenLevel = reader.readUint32();
                        break;
                    case 6:
                        message.quality = reader.readUint32();
                        break;
                    case 7:
                        message.starLevel = reader.readUint32();
                        break;
                    case 8:
                        message.littleStarLevel = reader.readUint32();
                        break;
                    case 9:
                        message.official = reader.readUint32();
                        break;
                    case 10:
                        message.basePower = reader.readUint32();
                        break;
                    case 11:
                        message.leadershipLevel = reader.readUint32();
                        break;
                    case 12:
                        message.soldierId = reader.readInt32();
                        break;
                    case 13:
                        reader.readMessage(message.skills, () => pb_1.Message.addToRepeatedWrapperField(message, 13, CommanderSkill.deserialize(reader), CommanderSkill));
                        break;
                    case 14:
                        reader.readMessage(message.equips, () => pb_1.Message.addToRepeatedWrapperField(message, 14, CommanderEquip.deserialize(reader), CommanderEquip));
                        break;
                    case 15:
                        message.power = reader.readUint32();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class Grid extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [], null);
        }
        get id(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as number | undefined;
        }
        set id(value: number) {
            pb_1.Message.setField(this, 1, value);
        }
        get commanderId(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as number | undefined;
        }
        set commanderId(value: number) {
            pb_1.Message.setField(this, 2, value);
        }
        get soldierId(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 3, undefined) as number | undefined;
        }
        set soldierId(value: number) {
            pb_1.Message.setField(this, 3, value);
        }
        get soldierNum(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 4, undefined) as number | undefined;
        }
        set soldierNum(value: number) {
            pb_1.Message.setField(this, 4, value);
        }
        toObject() {
            return {
                id: this.id,
                commanderId: this.commanderId,
                soldierId: this.soldierId,
                soldierNum: this.soldierNum
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.id)
                writer.writeInt32(1, this.id);
            if (this.commanderId)
                writer.writeInt32(2, this.commanderId);
            if (this.soldierId)
                writer.writeInt32(3, this.soldierId);
            if (this.soldierNum)
                writer.writeInt32(4, this.soldierNum);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): Grid {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new Grid();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.id = reader.readInt32();
                        break;
                    case 2:
                        message.commanderId = reader.readInt32();
                        break;
                    case 3:
                        message.soldierId = reader.readInt32();
                        break;
                    case 4:
                        message.soldierNum = reader.readInt32();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class Formation extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [3], null);
        }
        get type(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as number | undefined;
        }
        set type(value: number) {
            pb_1.Message.setField(this, 1, value);
        }
        get counsellorId(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as number | undefined;
        }
        set counsellorId(value: number) {
            pb_1.Message.setField(this, 2, value);
        }
        get grid(): Grid[] {
            return pb_1.Message.getRepeatedWrapperField(this, Grid, 3) as Grid[];
        }
        set grid(value: Grid[]) {
            pb_1.Message.setRepeatedWrapperField(this, 3, value);
        }
        get treasureGroup(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 4, undefined) as number | undefined;
        }
        set treasureGroup(value: number) {
            pb_1.Message.setField(this, 4, value);
        }
        get illustratedGroup(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 5, undefined) as number | undefined;
        }
        set illustratedGroup(value: number) {
            pb_1.Message.setField(this, 5, value);
        }
        toObject() {
            return {
                type: this.type,
                counsellorId: this.counsellorId,
                grid: this.grid,
                treasureGroup: this.treasureGroup,
                illustratedGroup: this.illustratedGroup
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.type)
                writer.writeInt32(1, this.type);
            if (this.counsellorId)
                writer.writeInt32(2, this.counsellorId);
            if (this.grid)
                writer.writeRepeatedMessage(3, this.grid, (item: Grid) => item.serialize(writer));
            if (this.treasureGroup)
                writer.writeUint32(4, this.treasureGroup);
            if (this.illustratedGroup)
                writer.writeUint32(5, this.illustratedGroup);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): Formation {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new Formation();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.type = reader.readInt32();
                        break;
                    case 2:
                        message.counsellorId = reader.readInt32();
                        break;
                    case 3:
                        reader.readMessage(message.grid, () => pb_1.Message.addToRepeatedWrapperField(message, 3, Grid.deserialize(reader), Grid));
                        break;
                    case 4:
                        message.treasureGroup = reader.readUint32();
                        break;
                    case 5:
                        message.illustratedGroup = reader.readUint32();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class Soldier extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [], null);
        }
        get id(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as number | undefined;
        }
        set id(value: number) {
            pb_1.Message.setField(this, 1, value);
        }
        toObject() {
            return {
                id: this.id
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.id)
                writer.writeInt32(1, this.id);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): Soldier {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new Soldier();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.id = reader.readInt32();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class SoldierTech extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [], null);
        }
        get id(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as number | undefined;
        }
        set id(value: number) {
            pb_1.Message.setField(this, 1, value);
        }
        get level(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as number | undefined;
        }
        set level(value: number) {
            pb_1.Message.setField(this, 2, value);
        }
        toObject() {
            return {
                id: this.id,
                level: this.level
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.id)
                writer.writeInt32(1, this.id);
            if (this.level)
                writer.writeInt32(2, this.level);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): SoldierTech {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new SoldierTech();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.id = reader.readInt32();
                        break;
                    case 2:
                        message.level = reader.readInt32();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class Counsellor extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [4, 6], null);
        }
        get id(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as number | undefined;
        }
        set id(value: number) {
            pb_1.Message.setField(this, 1, value);
        }
        get star(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as number | undefined;
        }
        set star(value: number) {
            pb_1.Message.setField(this, 2, value);
        }
        get magics(): CounsellorMagic[] {
            return pb_1.Message.getRepeatedWrapperField(this, CounsellorMagic, 4) as CounsellorMagic[];
        }
        set magics(value: CounsellorMagic[]) {
            pb_1.Message.setRepeatedWrapperField(this, 4, value);
        }
        get power(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 5, undefined) as number | undefined;
        }
        set power(value: number) {
            pb_1.Message.setField(this, 5, value);
        }
        get qiMen(): CounsellorQiMen[] {
            return pb_1.Message.getRepeatedWrapperField(this, CounsellorQiMen, 6) as CounsellorQiMen[];
        }
        set qiMen(value: CounsellorQiMen[]) {
            pb_1.Message.setRepeatedWrapperField(this, 6, value);
        }
        get qiJi(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 7, undefined) as number | undefined;
        }
        set qiJi(value: number) {
            pb_1.Message.setField(this, 7, value);
        }
        toObject() {
            return {
                id: this.id,
                star: this.star,
                magics: this.magics,
                power: this.power,
                qiMen: this.qiMen,
                qiJi: this.qiJi
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.id)
                writer.writeInt32(1, this.id);
            if (this.star)
                writer.writeUint32(2, this.star);
            if (this.magics)
                writer.writeRepeatedMessage(4, this.magics, (item: CounsellorMagic) => item.serialize(writer));
            if (this.power)
                writer.writeUint32(5, this.power);
            if (this.qiMen)
                writer.writeRepeatedMessage(6, this.qiMen, (item: CounsellorQiMen) => item.serialize(writer));
            if (this.qiJi)
                writer.writeUint32(7, this.qiJi);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): Counsellor {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new Counsellor();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.id = reader.readInt32();
                        break;
                    case 2:
                        message.star = reader.readUint32();
                        break;
                    case 4:
                        reader.readMessage(message.magics, () => pb_1.Message.addToRepeatedWrapperField(message, 4, CounsellorMagic.deserialize(reader), CounsellorMagic));
                        break;
                    case 5:
                        message.power = reader.readUint32();
                        break;
                    case 6:
                        reader.readMessage(message.qiMen, () => pb_1.Message.addToRepeatedWrapperField(message, 6, CounsellorQiMen.deserialize(reader), CounsellorQiMen));
                        break;
                    case 7:
                        message.qiJi = reader.readUint32();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class CounsellorMagic extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [], null);
        }
        get id(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as number | undefined;
        }
        set id(value: number) {
            pb_1.Message.setField(this, 1, value);
        }
        get level(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as number | undefined;
        }
        set level(value: number) {
            pb_1.Message.setField(this, 2, value);
        }
        get progress(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 3, undefined) as number | undefined;
        }
        set progress(value: number) {
            pb_1.Message.setField(this, 3, value);
        }
        toObject() {
            return {
                id: this.id,
                level: this.level,
                progress: this.progress
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.id)
                writer.writeInt32(1, this.id);
            if (this.level)
                writer.writeUint32(2, this.level);
            if (this.progress)
                writer.writeUint32(3, this.progress);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): CounsellorMagic {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new CounsellorMagic();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.id = reader.readInt32();
                        break;
                    case 2:
                        message.level = reader.readUint32();
                        break;
                    case 3:
                        message.progress = reader.readUint32();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class CounsellorQiMen extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [], null);
        }
        get id(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as number | undefined;
        }
        set id(value: number) {
            pb_1.Message.setField(this, 1, value);
        }
        get level(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as number | undefined;
        }
        set level(value: number) {
            pb_1.Message.setField(this, 2, value);
        }
        toObject() {
            return {
                id: this.id,
                level: this.level
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.id)
                writer.writeInt32(1, this.id);
            if (this.level)
                writer.writeInt32(2, this.level);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): CounsellorQiMen {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new CounsellorQiMen();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.id = reader.readInt32();
                        break;
                    case 2:
                        message.level = reader.readInt32();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class MissionUnit extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [3], null);
        }
        get id(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as number | undefined;
        }
        set id(value: number) {
            pb_1.Message.setField(this, 1, value);
        }
        get Status(): MissionStatus | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as MissionStatus | undefined;
        }
        set Status(value: MissionStatus) {
            pb_1.Message.setField(this, 2, value);
        }
        get interactFortress(): number[] {
            return pb_1.Message.getField(this, 3) as number[];
        }
        set interactFortress(value: number[]) {
            pb_1.Message.setField(this, 3, value);
        }
        get selectedFightID(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 5, undefined) as number | undefined;
        }
        set selectedFightID(value: number) {
            pb_1.Message.setField(this, 5, value);
        }
        get isDoFightEventTrigger(): boolean | undefined {
            return pb_1.Message.getFieldWithDefault(this, 6, undefined) as boolean | undefined;
        }
        set isDoFightEventTrigger(value: boolean) {
            pb_1.Message.setField(this, 6, value);
        }
        toObject() {
            return {
                id: this.id,
                Status: this.Status,
                interactFortress: this.interactFortress,
                selectedFightID: this.selectedFightID,
                isDoFightEventTrigger: this.isDoFightEventTrigger
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.id)
                writer.writeInt32(1, this.id);
            if (this.Status)
                writer.writeEnum(2, this.Status);
            if (this.interactFortress)
                writer.writeRepeatedInt32(3, this.interactFortress);
            if (this.selectedFightID)
                writer.writeInt32(5, this.selectedFightID);
            if (this.isDoFightEventTrigger)
                writer.writeBool(6, this.isDoFightEventTrigger);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): MissionUnit {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new MissionUnit();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.id = reader.readInt32();
                        break;
                    case 2:
                        message.Status = reader.readEnum();
                        break;
                    case 3:
                        message.interactFortress.push(reader.readInt32());
                        break;
                    case 5:
                        message.selectedFightID = reader.readInt32();
                        break;
                    case 6:
                        message.isDoFightEventTrigger = reader.readBool();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class MissionTargetChapter extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [], null);
        }
        get targetId(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as number | undefined;
        }
        set targetId(value: number) {
            pb_1.Message.setField(this, 1, value);
        }
        get reward(): boolean | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as boolean | undefined;
        }
        set reward(value: boolean) {
            pb_1.Message.setField(this, 2, value);
        }
        toObject() {
            return {
                targetId: this.targetId,
                reward: this.reward
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.targetId)
                writer.writeInt32(1, this.targetId);
            if (this.reward)
                writer.writeBool(2, this.reward);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): MissionTargetChapter {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new MissionTargetChapter();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.targetId = reader.readInt32();
                        break;
                    case 2:
                        message.reward = reader.readBool();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class MissionChapter extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [3], null);
        }
        get chapterId(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as number | undefined;
        }
        set chapterId(value: number) {
            pb_1.Message.setField(this, 1, value);
        }
        get rewardIndex(): number[] {
            return pb_1.Message.getField(this, 3) as number[];
        }
        set rewardIndex(value: number[]) {
            pb_1.Message.setField(this, 3, value);
        }
        toObject() {
            return {
                chapterId: this.chapterId,
                rewardIndex: this.rewardIndex
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.chapterId)
                writer.writeInt32(1, this.chapterId);
            if (this.rewardIndex)
                writer.writeRepeatedInt32(3, this.rewardIndex);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): MissionChapter {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new MissionChapter();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.chapterId = reader.readInt32();
                        break;
                    case 3:
                        message.rewardIndex.push(reader.readInt32());
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class Position extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [], null);
        }
        get x(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as number | undefined;
        }
        set x(value: number) {
            pb_1.Message.setField(this, 1, value);
        }
        get y(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as number | undefined;
        }
        set y(value: number) {
            pb_1.Message.setField(this, 2, value);
        }
        toObject() {
            return {
                x: this.x,
                y: this.y
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.x)
                writer.writeFloat(1, this.x);
            if (this.y)
                writer.writeFloat(2, this.y);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): Position {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new Position();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.x = reader.readFloat();
                        break;
                    case 2:
                        message.y = reader.readFloat();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class WorldMap extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [], null);
        }
        get index(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as number | undefined;
        }
        set index(value: number) {
            pb_1.Message.setField(this, 1, value);
        }
        get resId(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as number | undefined;
        }
        set resId(value: number) {
            pb_1.Message.setField(this, 2, value);
        }
        toObject() {
            return {
                index: this.index,
                resId: this.resId
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.index)
                writer.writeInt32(1, this.index);
            if (this.resId)
                writer.writeInt32(2, this.resId);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): WorldMap {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new WorldMap();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.index = reader.readInt32();
                        break;
                    case 2:
                        message.resId = reader.readInt32();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class Fortress extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [], null);
        }
        get id(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as number | undefined;
        }
        set id(value: number) {
            pb_1.Message.setField(this, 1, value);
        }
        get pos(): Position | undefined {
            return pb_1.Message.getWrapperField(this, Position, 2) as Position | undefined;
        }
        set pos(value: Position) {
            pb_1.Message.setWrapperField(this, 2, value);
        }
        get nationID(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 3, undefined) as number | undefined;
        }
        set nationID(value: number) {
            pb_1.Message.setField(this, 3, value);
        }
        get show(): boolean | undefined {
            return pb_1.Message.getFieldWithDefault(this, 4, undefined) as boolean | undefined;
        }
        set show(value: boolean) {
            pb_1.Message.setField(this, 4, value);
        }
        get status(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 5, undefined) as number | undefined;
        }
        set status(value: number) {
            pb_1.Message.setField(this, 5, value);
        }
        get descID(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 6, undefined) as number | undefined;
        }
        set descID(value: number) {
            pb_1.Message.setField(this, 6, value);
        }
        get dir(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 7, undefined) as number | undefined;
        }
        set dir(value: number) {
            pb_1.Message.setField(this, 7, value);
        }
        get action(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 8, undefined) as number | undefined;
        }
        set action(value: number) {
            pb_1.Message.setField(this, 8, value);
        }
        get resId(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 9, undefined) as number | undefined;
        }
        set resId(value: number) {
            pb_1.Message.setField(this, 9, value);
        }
        toObject() {
            return {
                id: this.id,
                pos: this.pos,
                nationID: this.nationID,
                show: this.show,
                status: this.status,
                descID: this.descID,
                dir: this.dir,
                action: this.action,
                resId: this.resId
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.id)
                writer.writeInt32(1, this.id);
            if (this.pos)
                writer.writeMessage(2, this.pos, (item: Position) => item.serialize(writer));
            if (this.nationID)
                writer.writeInt32(3, this.nationID);
            if (this.show)
                writer.writeBool(4, this.show);
            if (this.status)
                writer.writeInt32(5, this.status);
            if (this.descID)
                writer.writeInt32(6, this.descID);
            if (this.dir)
                writer.writeInt32(7, this.dir);
            if (this.action)
                writer.writeInt32(8, this.action);
            if (this.resId)
                writer.writeInt32(9, this.resId);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): Fortress {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new Fortress();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.id = reader.readInt32();
                        break;
                    case 2:
                        reader.readMessage(message.pos, () => message.pos = Position.deserialize(reader));
                        break;
                    case 3:
                        message.nationID = reader.readInt32();
                        break;
                    case 4:
                        message.show = reader.readBool();
                        break;
                    case 5:
                        message.status = reader.readInt32();
                        break;
                    case 6:
                        message.descID = reader.readInt32();
                        break;
                    case 7:
                        message.dir = reader.readInt32();
                        break;
                    case 8:
                        message.action = reader.readInt32();
                        break;
                    case 9:
                        message.resId = reader.readInt32();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class District extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [], null);
        }
        get id(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as number | undefined;
        }
        set id(value: number) {
            pb_1.Message.setField(this, 1, value);
        }
        get nationID(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as number | undefined;
        }
        set nationID(value: number) {
            pb_1.Message.setField(this, 2, value);
        }
        get unlock(): boolean | undefined {
            return pb_1.Message.getFieldWithDefault(this, 3, undefined) as boolean | undefined;
        }
        set unlock(value: boolean) {
            pb_1.Message.setField(this, 3, value);
        }
        toObject() {
            return {
                id: this.id,
                nationID: this.nationID,
                unlock: this.unlock
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.id)
                writer.writeInt32(1, this.id);
            if (this.nationID)
                writer.writeInt32(2, this.nationID);
            if (this.unlock)
                writer.writeBool(3, this.unlock);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): District {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new District();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.id = reader.readInt32();
                        break;
                    case 2:
                        message.nationID = reader.readInt32();
                        break;
                    case 3:
                        message.unlock = reader.readBool();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class DungeonLevel extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [], null);
        }
        get id(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as number | undefined;
        }
        set id(value: number) {
            pb_1.Message.setField(this, 1, value);
        }
        get star(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as number | undefined;
        }
        set star(value: number) {
            pb_1.Message.setField(this, 2, value);
        }
        get fightCount(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 3, undefined) as number | undefined;
        }
        set fightCount(value: number) {
            pb_1.Message.setField(this, 3, value);
        }
        get eliteDungeonBuyTimes(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 4, undefined) as number | undefined;
        }
        set eliteDungeonBuyTimes(value: number) {
            pb_1.Message.setField(this, 4, value);
        }
        toObject() {
            return {
                id: this.id,
                star: this.star,
                fightCount: this.fightCount,
                eliteDungeonBuyTimes: this.eliteDungeonBuyTimes
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.id)
                writer.writeInt32(1, this.id);
            if (this.star)
                writer.writeUint32(2, this.star);
            if (this.fightCount)
                writer.writeInt32(3, this.fightCount);
            if (this.eliteDungeonBuyTimes)
                writer.writeUint32(4, this.eliteDungeonBuyTimes);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): DungeonLevel {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new DungeonLevel();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.id = reader.readInt32();
                        break;
                    case 2:
                        message.star = reader.readUint32();
                        break;
                    case 3:
                        message.fightCount = reader.readInt32();
                        break;
                    case 4:
                        message.eliteDungeonBuyTimes = reader.readUint32();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class DungeonChapter extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [2, 3], null);
        }
        get id(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as number | undefined;
        }
        set id(value: number) {
            pb_1.Message.setField(this, 1, value);
        }
        get connectStageId(): number[] {
            return pb_1.Message.getField(this, 2) as number[];
        }
        set connectStageId(value: number[]) {
            pb_1.Message.setField(this, 2, value);
        }
        get starRewards(): boolean[] {
            return pb_1.Message.getField(this, 3) as boolean[];
        }
        set starRewards(value: boolean[]) {
            pb_1.Message.setField(this, 3, value);
        }
        toObject() {
            return {
                id: this.id,
                connectStageId: this.connectStageId,
                starRewards: this.starRewards
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.id)
                writer.writeInt32(1, this.id);
            if (this.connectStageId)
                writer.writeRepeatedInt32(2, this.connectStageId);
            if (this.starRewards)
                writer.writeRepeatedBool(3, this.starRewards);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): DungeonChapter {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new DungeonChapter();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.id = reader.readInt32();
                        break;
                    case 2:
                        message.connectStageId.push(reader.readInt32());
                        break;
                    case 3:
                        message.starRewards.push(reader.readBool());
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class MailCondition extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [], null);
        }
        get condition_type(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as number | undefined;
        }
        set condition_type(value: number) {
            pb_1.Message.setField(this, 1, value);
        }
        get min(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as number | undefined;
        }
        set min(value: number) {
            pb_1.Message.setField(this, 2, value);
        }
        get max(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 3, undefined) as number | undefined;
        }
        set max(value: number) {
            pb_1.Message.setField(this, 3, value);
        }
        toObject() {
            return {
                condition_type: this.condition_type,
                min: this.min,
                max: this.max
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.condition_type)
                writer.writeUint32(1, this.condition_type);
            if (this.min)
                writer.writeUint32(2, this.min);
            if (this.max)
                writer.writeUint32(3, this.max);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): MailCondition {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new MailCondition();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.condition_type = reader.readUint32();
                        break;
                    case 2:
                        message.min = reader.readUint32();
                        break;
                    case 3:
                        message.max = reader.readUint32();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class Mail extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [8, 9], null);
        }
        get id(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as string | undefined;
        }
        set id(value: string) {
            pb_1.Message.setField(this, 1, value);
        }
        get TID(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as number | undefined;
        }
        set TID(value: number) {
            pb_1.Message.setField(this, 2, value);
        }
        get hasRead(): boolean | undefined {
            return pb_1.Message.getFieldWithDefault(this, 3, undefined) as boolean | undefined;
        }
        set hasRead(value: boolean) {
            pb_1.Message.setField(this, 3, value);
        }
        get receiveTime(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 4, undefined) as string | undefined;
        }
        set receiveTime(value: string) {
            pb_1.Message.setField(this, 4, value);
        }
        get hasGet(): boolean | undefined {
            return pb_1.Message.getFieldWithDefault(this, 5, undefined) as boolean | undefined;
        }
        set hasGet(value: boolean) {
            pb_1.Message.setField(this, 5, value);
        }
        get title(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 6, undefined) as string | undefined;
        }
        set title(value: string) {
            pb_1.Message.setField(this, 6, value);
        }
        get content(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 7, undefined) as string | undefined;
        }
        set content(value: string) {
            pb_1.Message.setField(this, 7, value);
        }
        get atachments(): Item[] {
            return pb_1.Message.getRepeatedWrapperField(this, Item, 8) as Item[];
        }
        set atachments(value: Item[]) {
            pb_1.Message.setRepeatedWrapperField(this, 8, value);
        }
        get stringParams(): string[] {
            return pb_1.Message.getField(this, 9) as string[];
        }
        set stringParams(value: string[]) {
            pb_1.Message.setField(this, 9, value);
        }
        toObject() {
            return {
                id: this.id,
                TID: this.TID,
                hasRead: this.hasRead,
                receiveTime: this.receiveTime,
                hasGet: this.hasGet,
                title: this.title,
                content: this.content,
                atachments: this.atachments,
                stringParams: this.stringParams
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.id)
                writer.writeUint64String(1, this.id);
            if (this.TID)
                writer.writeInt32(2, this.TID);
            if (this.hasRead)
                writer.writeBool(3, this.hasRead);
            if (this.receiveTime)
                writer.writeInt64String(4, this.receiveTime);
            if (this.hasGet)
                writer.writeBool(5, this.hasGet);
            if (this.title)
                writer.writeString(6, this.title);
            if (this.content)
                writer.writeString(7, this.content);
            if (this.atachments)
                writer.writeRepeatedMessage(8, this.atachments, (item: Item) => item.serialize(writer));
            if (this.stringParams)
                writer.writeRepeatedString(9, this.stringParams);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): Mail {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new Mail();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.id = reader.readUint64String();
                        break;
                    case 2:
                        message.TID = reader.readInt32();
                        break;
                    case 3:
                        message.hasRead = reader.readBool();
                        break;
                    case 4:
                        message.receiveTime = reader.readInt64String();
                        break;
                    case 5:
                        message.hasGet = reader.readBool();
                        break;
                    case 6:
                        message.title = reader.readString();
                        break;
                    case 7:
                        message.content = reader.readString();
                        break;
                    case 8:
                        reader.readMessage(message.atachments, () => pb_1.Message.addToRepeatedWrapperField(message, 8, Item.deserialize(reader), Item));
                        break;
                    case 9:
                        pb_1.Message.addToRepeatedField(message, 9, reader.readString());
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class Friends extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [1, 2, 3], null);
        }
        get friendList(): string[] {
            return pb_1.Message.getField(this, 1) as string[];
        }
        set friendList(value: string[]) {
            pb_1.Message.setField(this, 1, value);
        }
        get blackList(): string[] {
            return pb_1.Message.getField(this, 2) as string[];
        }
        set blackList(value: string[]) {
            pb_1.Message.setField(this, 2, value);
        }
        get requestList(): string[] {
            return pb_1.Message.getField(this, 3) as string[];
        }
        set requestList(value: string[]) {
            pb_1.Message.setField(this, 3, value);
        }
        toObject() {
            return {
                friendList: this.friendList,
                blackList: this.blackList,
                requestList: this.requestList
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.friendList)
                writer.writeRepeatedUint64String(1, this.friendList);
            if (this.blackList)
                writer.writeRepeatedUint64String(2, this.blackList);
            if (this.requestList)
                writer.writeRepeatedUint64String(3, this.requestList);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): Friends {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new Friends();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.friendList.push(reader.readUint64String());
                        break;
                    case 2:
                        message.blackList.push(reader.readUint64String());
                        break;
                    case 3:
                        message.requestList.push(reader.readUint64String());
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class FriendCommonData extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [], null);
        }
        get id(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as string | undefined;
        }
        set id(value: string) {
            pb_1.Message.setField(this, 1, value);
        }
        get name(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as string | undefined;
        }
        set name(value: string) {
            pb_1.Message.setField(this, 2, value);
        }
        get level(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 3, undefined) as number | undefined;
        }
        set level(value: number) {
            pb_1.Message.setField(this, 3, value);
        }
        get fightPower(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 4, undefined) as number | undefined;
        }
        set fightPower(value: number) {
            pb_1.Message.setField(this, 4, value);
        }
        get vip(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 5, undefined) as number | undefined;
        }
        set vip(value: number) {
            pb_1.Message.setField(this, 5, value);
        }
        get avatar(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 6, undefined) as number | undefined;
        }
        set avatar(value: number) {
            pb_1.Message.setField(this, 6, value);
        }
        get avatarFrame(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 7, undefined) as number | undefined;
        }
        set avatarFrame(value: number) {
            pb_1.Message.setField(this, 7, value);
        }
        get declaration(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 8, undefined) as string | undefined;
        }
        set declaration(value: string) {
            pb_1.Message.setField(this, 8, value);
        }
        get logoutTime(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 9, undefined) as string | undefined;
        }
        set logoutTime(value: string) {
            pb_1.Message.setField(this, 9, value);
        }
        get requestFlag(): boolean | undefined {
            return pb_1.Message.getFieldWithDefault(this, 10, undefined) as boolean | undefined;
        }
        set requestFlag(value: boolean) {
            pb_1.Message.setField(this, 10, value);
        }
        get physicalCollectState(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 11, undefined) as number | undefined;
        }
        set physicalCollectState(value: number) {
            pb_1.Message.setField(this, 11, value);
        }
        get physicalGiveFlag(): boolean | undefined {
            return pb_1.Message.getFieldWithDefault(this, 12, undefined) as boolean | undefined;
        }
        set physicalGiveFlag(value: boolean) {
            pb_1.Message.setField(this, 12, value);
        }
        get friendType(): FriendType | undefined {
            return pb_1.Message.getFieldWithDefault(this, 13, undefined) as FriendType | undefined;
        }
        set friendType(value: FriendType) {
            pb_1.Message.setField(this, 13, value);
        }
        get isHideVip(): boolean | undefined {
            return pb_1.Message.getFieldWithDefault(this, 14, undefined) as boolean | undefined;
        }
        set isHideVip(value: boolean) {
            pb_1.Message.setField(this, 14, value);
        }
        toObject() {
            return {
                id: this.id,
                name: this.name,
                level: this.level,
                fightPower: this.fightPower,
                vip: this.vip,
                avatar: this.avatar,
                avatarFrame: this.avatarFrame,
                declaration: this.declaration,
                logoutTime: this.logoutTime,
                requestFlag: this.requestFlag,
                physicalCollectState: this.physicalCollectState,
                physicalGiveFlag: this.physicalGiveFlag,
                friendType: this.friendType,
                isHideVip: this.isHideVip
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.id)
                writer.writeUint64String(1, this.id);
            if (this.name)
                writer.writeString(2, this.name);
            if (this.level)
                writer.writeUint32(3, this.level);
            if (this.fightPower)
                writer.writeUint32(4, this.fightPower);
            if (this.vip)
                writer.writeUint32(5, this.vip);
            if (this.avatar)
                writer.writeInt32(6, this.avatar);
            if (this.avatarFrame)
                writer.writeInt32(7, this.avatarFrame);
            if (this.declaration)
                writer.writeString(8, this.declaration);
            if (this.logoutTime)
                writer.writeInt64String(9, this.logoutTime);
            if (this.requestFlag)
                writer.writeBool(10, this.requestFlag);
            if (this.physicalCollectState)
                writer.writeInt32(11, this.physicalCollectState);
            if (this.physicalGiveFlag)
                writer.writeBool(12, this.physicalGiveFlag);
            if (this.friendType)
                writer.writeEnum(13, this.friendType);
            if (this.isHideVip)
                writer.writeBool(14, this.isHideVip);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): FriendCommonData {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new FriendCommonData();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.id = reader.readUint64String();
                        break;
                    case 2:
                        message.name = reader.readString();
                        break;
                    case 3:
                        message.level = reader.readUint32();
                        break;
                    case 4:
                        message.fightPower = reader.readUint32();
                        break;
                    case 5:
                        message.vip = reader.readUint32();
                        break;
                    case 6:
                        message.avatar = reader.readInt32();
                        break;
                    case 7:
                        message.avatarFrame = reader.readInt32();
                        break;
                    case 8:
                        message.declaration = reader.readString();
                        break;
                    case 9:
                        message.logoutTime = reader.readInt64String();
                        break;
                    case 10:
                        message.requestFlag = reader.readBool();
                        break;
                    case 11:
                        message.physicalCollectState = reader.readInt32();
                        break;
                    case 12:
                        message.physicalGiveFlag = reader.readBool();
                        break;
                    case 13:
                        message.friendType = reader.readEnum();
                        break;
                    case 14:
                        message.isHideVip = reader.readBool();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class VoiceData extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [], null);
        }
        get data(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as string | undefined;
        }
        set data(value: string) {
            pb_1.Message.setField(this, 1, value);
        }
        get duration(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as number | undefined;
        }
        set duration(value: number) {
            pb_1.Message.setField(this, 2, value);
        }
        toObject() {
            return {
                data: this.data,
                duration: this.duration
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.data)
                writer.writeString(1, this.data);
            if (this.duration)
                writer.writeInt32(2, this.duration);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): VoiceData {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new VoiceData();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.data = reader.readString();
                        break;
                    case 2:
                        message.duration = reader.readInt32();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class ChatCell extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [5], null);
        }
        get senderID(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as string | undefined;
        }
        set senderID(value: string) {
            pb_1.Message.setField(this, 1, value);
        }
        get sendTime(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as string | undefined;
        }
        set sendTime(value: string) {
            pb_1.Message.setField(this, 2, value);
        }
        get type(): ChatCellType | undefined {
            return pb_1.Message.getFieldWithDefault(this, 3, undefined) as ChatCellType | undefined;
        }
        set type(value: ChatCellType) {
            pb_1.Message.setField(this, 3, value);
        }
        get msg(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 4, undefined) as string | undefined;
        }
        set msg(value: string) {
            pb_1.Message.setField(this, 4, value);
        }
        get params(): string[] {
            return pb_1.Message.getField(this, 5) as string[];
        }
        set params(value: string[]) {
            pb_1.Message.setField(this, 5, value);
        }
        get unionID(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 6, undefined) as string | undefined;
        }
        set unionID(value: string) {
            pb_1.Message.setField(this, 6, value);
        }
        get battleId(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 7, undefined) as string | undefined;
        }
        set battleId(value: string) {
            pb_1.Message.setField(this, 7, value);
        }
        get levelLimit(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 8, undefined) as number | undefined;
        }
        set levelLimit(value: number) {
            pb_1.Message.setField(this, 8, value);
        }
        get confirm(): boolean | undefined {
            return pb_1.Message.getFieldWithDefault(this, 9, undefined) as boolean | undefined;
        }
        set confirm(value: boolean) {
            pb_1.Message.setField(this, 9, value);
        }
        toObject() {
            return {
                senderID: this.senderID,
                sendTime: this.sendTime,
                type: this.type,
                msg: this.msg,
                params: this.params,
                unionID: this.unionID,
                battleId: this.battleId,
                levelLimit: this.levelLimit,
                confirm: this.confirm
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.senderID)
                writer.writeUint64String(1, this.senderID);
            if (this.sendTime)
                writer.writeInt64String(2, this.sendTime);
            if (this.type)
                writer.writeEnum(3, this.type);
            if (this.msg)
                writer.writeString(4, this.msg);
            if (this.params)
                writer.writeRepeatedString(5, this.params);
            if (this.unionID)
                writer.writeUint64String(6, this.unionID);
            if (this.battleId)
                writer.writeUint64String(7, this.battleId);
            if (this.levelLimit)
                writer.writeUint32(8, this.levelLimit);
            if (this.confirm)
                writer.writeBool(9, this.confirm);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): ChatCell {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new ChatCell();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.senderID = reader.readUint64String();
                        break;
                    case 2:
                        message.sendTime = reader.readInt64String();
                        break;
                    case 3:
                        message.type = reader.readEnum();
                        break;
                    case 4:
                        message.msg = reader.readString();
                        break;
                    case 5:
                        pb_1.Message.addToRepeatedField(message, 5, reader.readString());
                        break;
                    case 6:
                        message.unionID = reader.readUint64String();
                        break;
                    case 7:
                        message.battleId = reader.readUint64String();
                        break;
                    case 8:
                        message.levelLimit = reader.readUint32();
                        break;
                    case 9:
                        message.confirm = reader.readBool();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class Announce extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [1], null);
        }
        get msgs(): AnnounceMessage[] {
            return pb_1.Message.getRepeatedWrapperField(this, AnnounceMessage, 1) as AnnounceMessage[];
        }
        set msgs(value: AnnounceMessage[]) {
            pb_1.Message.setRepeatedWrapperField(this, 1, value);
        }
        toObject() {
            return {
                msgs: this.msgs
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.msgs)
                writer.writeRepeatedMessage(1, this.msgs, (item: AnnounceMessage) => item.serialize(writer));
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): Announce {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new Announce();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        reader.readMessage(message.msgs, () => pb_1.Message.addToRepeatedWrapperField(message, 1, AnnounceMessage.deserialize(reader), AnnounceMessage));
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class LoopTime extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [], null);
        }
        get beginTime(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as string | undefined;
        }
        set beginTime(value: string) {
            pb_1.Message.setField(this, 2, value);
        }
        get endTime(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 3, undefined) as string | undefined;
        }
        set endTime(value: string) {
            pb_1.Message.setField(this, 3, value);
        }
        get frequent(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 4, undefined) as number | undefined;
        }
        set frequent(value: number) {
            pb_1.Message.setField(this, 4, value);
        }
        toObject() {
            return {
                beginTime: this.beginTime,
                endTime: this.endTime,
                frequent: this.frequent
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.beginTime)
                writer.writeInt64String(2, this.beginTime);
            if (this.endTime)
                writer.writeInt64String(3, this.endTime);
            if (this.frequent)
                writer.writeUint32(4, this.frequent);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): LoopTime {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new LoopTime();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 2:
                        message.beginTime = reader.readInt64String();
                        break;
                    case 3:
                        message.endTime = reader.readInt64String();
                        break;
                    case 4:
                        message.frequent = reader.readUint32();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class AnnounceMessage extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [], null);
        }
        get id(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as string | undefined;
        }
        set id(value: string) {
            pb_1.Message.setField(this, 1, value);
        }
        get loopTime(): LoopTime | undefined {
            return pb_1.Message.getWrapperField(this, LoopTime, 2) as LoopTime | undefined;
        }
        set loopTime(value: LoopTime) {
            pb_1.Message.setWrapperField(this, 2, value);
        }
        get priority(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 3, undefined) as number | undefined;
        }
        set priority(value: number) {
            pb_1.Message.setField(this, 3, value);
        }
        get endTime(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 4, undefined) as string | undefined;
        }
        set endTime(value: string) {
            pb_1.Message.setField(this, 4, value);
        }
        get msg(): ChatCell | undefined {
            return pb_1.Message.getWrapperField(this, ChatCell, 5) as ChatCell | undefined;
        }
        set msg(value: ChatCell) {
            pb_1.Message.setWrapperField(this, 5, value);
        }
        toObject() {
            return {
                id: this.id,
                loopTime: this.loopTime,
                priority: this.priority,
                endTime: this.endTime,
                msg: this.msg
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.id)
                writer.writeUint64String(1, this.id);
            if (this.loopTime)
                writer.writeMessage(2, this.loopTime, (item: LoopTime) => item.serialize(writer));
            if (this.priority)
                writer.writeUint32(3, this.priority);
            if (this.endTime)
                writer.writeInt64String(4, this.endTime);
            if (this.msg)
                writer.writeMessage(5, this.msg, (item: ChatCell) => item.serialize(writer));
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): AnnounceMessage {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new AnnounceMessage();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.id = reader.readUint64String();
                        break;
                    case 2:
                        reader.readMessage(message.loopTime, () => message.loopTime = LoopTime.deserialize(reader));
                        break;
                    case 3:
                        message.priority = reader.readUint32();
                        break;
                    case 4:
                        message.endTime = reader.readInt64String();
                        break;
                    case 5:
                        reader.readMessage(message.msg, () => message.msg = ChatCell.deserialize(reader));
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class MarketGrid extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [], null);
        }
        get marketItemID(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as number | undefined;
        }
        set marketItemID(value: number) {
            pb_1.Message.setField(this, 1, value);
        }
        get itemId(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as number | undefined;
        }
        set itemId(value: number) {
            pb_1.Message.setField(this, 2, value);
        }
        get buyTimes(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 3, undefined) as number | undefined;
        }
        set buyTimes(value: number) {
            pb_1.Message.setField(this, 3, value);
        }
        get lock(): boolean | undefined {
            return pb_1.Message.getFieldWithDefault(this, 4, undefined) as boolean | undefined;
        }
        set lock(value: boolean) {
            pb_1.Message.setField(this, 4, value);
        }
        toObject() {
            return {
                marketItemID: this.marketItemID,
                itemId: this.itemId,
                buyTimes: this.buyTimes,
                lock: this.lock
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.marketItemID)
                writer.writeInt32(1, this.marketItemID);
            if (this.itemId)
                writer.writeInt32(2, this.itemId);
            if (this.buyTimes)
                writer.writeInt32(3, this.buyTimes);
            if (this.lock)
                writer.writeBool(4, this.lock);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): MarketGrid {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new MarketGrid();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.marketItemID = reader.readInt32();
                        break;
                    case 2:
                        message.itemId = reader.readInt32();
                        break;
                    case 3:
                        message.buyTimes = reader.readInt32();
                        break;
                    case 4:
                        message.lock = reader.readBool();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class ItemMarket extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [2], null);
        }
        get marketId(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as number | undefined;
        }
        set marketId(value: number) {
            pb_1.Message.setField(this, 1, value);
        }
        get grids(): MarketGrid[] {
            return pb_1.Message.getRepeatedWrapperField(this, MarketGrid, 2) as MarketGrid[];
        }
        set grids(value: MarketGrid[]) {
            pb_1.Message.setRepeatedWrapperField(this, 2, value);
        }
        get autoRefreshTime(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 3, undefined) as string | undefined;
        }
        set autoRefreshTime(value: string) {
            pb_1.Message.setField(this, 3, value);
        }
        get manualRefreshCount(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 4, undefined) as number | undefined;
        }
        set manualRefreshCount(value: number) {
            pb_1.Message.setField(this, 4, value);
        }
        get freeRefreshCount(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 6, undefined) as number | undefined;
        }
        set freeRefreshCount(value: number) {
            pb_1.Message.setField(this, 6, value);
        }
        toObject() {
            return {
                marketId: this.marketId,
                grids: this.grids,
                autoRefreshTime: this.autoRefreshTime,
                manualRefreshCount: this.manualRefreshCount,
                freeRefreshCount: this.freeRefreshCount
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.marketId)
                writer.writeInt32(1, this.marketId);
            if (this.grids)
                writer.writeRepeatedMessage(2, this.grids, (item: MarketGrid) => item.serialize(writer));
            if (this.autoRefreshTime)
                writer.writeInt64String(3, this.autoRefreshTime);
            if (this.manualRefreshCount)
                writer.writeInt32(4, this.manualRefreshCount);
            if (this.freeRefreshCount)
                writer.writeInt32(6, this.freeRefreshCount);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): ItemMarket {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new ItemMarket();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.marketId = reader.readInt32();
                        break;
                    case 2:
                        reader.readMessage(message.grids, () => pb_1.Message.addToRepeatedWrapperField(message, 2, MarketGrid.deserialize(reader), MarketGrid));
                        break;
                    case 3:
                        message.autoRefreshTime = reader.readInt64String();
                        break;
                    case 4:
                        message.manualRefreshCount = reader.readInt32();
                        break;
                    case 6:
                        message.freeRefreshCount = reader.readInt32();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class ShopDailyRecord extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [], null);
        }
        get physicalBuyTimes(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as number | undefined;
        }
        set physicalBuyTimes(value: number) {
            pb_1.Message.setField(this, 1, value);
        }
        get physicalFreeBuyTimes(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as number | undefined;
        }
        set physicalFreeBuyTimes(value: number) {
            pb_1.Message.setField(this, 2, value);
        }
        get goldBuyTimes(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 3, undefined) as number | undefined;
        }
        set goldBuyTimes(value: number) {
            pb_1.Message.setField(this, 3, value);
        }
        get goldFreeBuyTimes(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 4, undefined) as number | undefined;
        }
        set goldFreeBuyTimes(value: number) {
            pb_1.Message.setField(this, 4, value);
        }
        get commanderExpBuyTimes(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 5, undefined) as number | undefined;
        }
        set commanderExpBuyTimes(value: number) {
            pb_1.Message.setField(this, 5, value);
        }
        get commanderExpFreeBuyTimes(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 6, undefined) as number | undefined;
        }
        set commanderExpFreeBuyTimes(value: number) {
            pb_1.Message.setField(this, 6, value);
        }
        get advanceStoneBuyTimes(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 7, undefined) as number | undefined;
        }
        set advanceStoneBuyTimes(value: number) {
            pb_1.Message.setField(this, 7, value);
        }
        get advanceStoneFreeBuyTimes(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 8, undefined) as number | undefined;
        }
        set advanceStoneFreeBuyTimes(value: number) {
            pb_1.Message.setField(this, 8, value);
        }
        get magicBookBuyTimes(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 9, undefined) as number | undefined;
        }
        set magicBookBuyTimes(value: number) {
            pb_1.Message.setField(this, 9, value);
        }
        get magicBookFreeBuyTimes(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 10, undefined) as number | undefined;
        }
        set magicBookFreeBuyTimes(value: number) {
            pb_1.Message.setField(this, 10, value);
        }
        toObject() {
            return {
                physicalBuyTimes: this.physicalBuyTimes,
                physicalFreeBuyTimes: this.physicalFreeBuyTimes,
                goldBuyTimes: this.goldBuyTimes,
                goldFreeBuyTimes: this.goldFreeBuyTimes,
                commanderExpBuyTimes: this.commanderExpBuyTimes,
                commanderExpFreeBuyTimes: this.commanderExpFreeBuyTimes,
                advanceStoneBuyTimes: this.advanceStoneBuyTimes,
                advanceStoneFreeBuyTimes: this.advanceStoneFreeBuyTimes,
                magicBookBuyTimes: this.magicBookBuyTimes,
                magicBookFreeBuyTimes: this.magicBookFreeBuyTimes
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.physicalBuyTimes)
                writer.writeUint32(1, this.physicalBuyTimes);
            if (this.physicalFreeBuyTimes)
                writer.writeUint32(2, this.physicalFreeBuyTimes);
            if (this.goldBuyTimes)
                writer.writeUint32(3, this.goldBuyTimes);
            if (this.goldFreeBuyTimes)
                writer.writeUint32(4, this.goldFreeBuyTimes);
            if (this.commanderExpBuyTimes)
                writer.writeUint32(5, this.commanderExpBuyTimes);
            if (this.commanderExpFreeBuyTimes)
                writer.writeUint32(6, this.commanderExpFreeBuyTimes);
            if (this.advanceStoneBuyTimes)
                writer.writeUint32(7, this.advanceStoneBuyTimes);
            if (this.advanceStoneFreeBuyTimes)
                writer.writeUint32(8, this.advanceStoneFreeBuyTimes);
            if (this.magicBookBuyTimes)
                writer.writeUint32(9, this.magicBookBuyTimes);
            if (this.magicBookFreeBuyTimes)
                writer.writeUint32(10, this.magicBookFreeBuyTimes);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): ShopDailyRecord {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new ShopDailyRecord();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.physicalBuyTimes = reader.readUint32();
                        break;
                    case 2:
                        message.physicalFreeBuyTimes = reader.readUint32();
                        break;
                    case 3:
                        message.goldBuyTimes = reader.readUint32();
                        break;
                    case 4:
                        message.goldFreeBuyTimes = reader.readUint32();
                        break;
                    case 5:
                        message.commanderExpBuyTimes = reader.readUint32();
                        break;
                    case 6:
                        message.commanderExpFreeBuyTimes = reader.readUint32();
                        break;
                    case 7:
                        message.advanceStoneBuyTimes = reader.readUint32();
                        break;
                    case 8:
                        message.advanceStoneFreeBuyTimes = reader.readUint32();
                        break;
                    case 9:
                        message.magicBookBuyTimes = reader.readUint32();
                        break;
                    case 10:
                        message.magicBookFreeBuyTimes = reader.readUint32();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class TrainItem extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [], null);
        }
        get id(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as number | undefined;
        }
        set id(value: number) {
            pb_1.Message.setField(this, 1, value);
        }
        get star(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as number | undefined;
        }
        set star(value: number) {
            pb_1.Message.setField(this, 2, value);
        }
        get reward(): boolean | undefined {
            return pb_1.Message.getFieldWithDefault(this, 5, undefined) as boolean | undefined;
        }
        set reward(value: boolean) {
            pb_1.Message.setField(this, 5, value);
        }
        toObject() {
            return {
                id: this.id,
                star: this.star,
                reward: this.reward
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.id)
                writer.writeInt32(1, this.id);
            if (this.star)
                writer.writeInt32(2, this.star);
            if (this.reward)
                writer.writeBool(5, this.reward);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): TrainItem {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new TrainItem();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.id = reader.readInt32();
                        break;
                    case 2:
                        message.star = reader.readInt32();
                        break;
                    case 5:
                        message.reward = reader.readBool();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class ReplaySimple extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [], null);
        }
        get id(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as string | undefined;
        }
        set id(value: string) {
            pb_1.Message.setField(this, 1, value);
        }
        get battleTime(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as string | undefined;
        }
        set battleTime(value: string) {
            pb_1.Message.setField(this, 2, value);
        }
        get formation(): Formation | undefined {
            return pb_1.Message.getWrapperField(this, Formation, 3) as Formation | undefined;
        }
        set formation(value: Formation) {
            pb_1.Message.setWrapperField(this, 3, value);
        }
        get targetFormation(): Formation | undefined {
            return pb_1.Message.getWrapperField(this, Formation, 4) as Formation | undefined;
        }
        set targetFormation(value: Formation) {
            pb_1.Message.setWrapperField(this, 4, value);
        }
        toObject() {
            return {
                id: this.id,
                battleTime: this.battleTime,
                formation: this.formation,
                targetFormation: this.targetFormation
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.id)
                writer.writeUint64String(1, this.id);
            if (this.battleTime)
                writer.writeInt64String(2, this.battleTime);
            if (this.formation)
                writer.writeMessage(3, this.formation, (item: Formation) => item.serialize(writer));
            if (this.targetFormation)
                writer.writeMessage(4, this.targetFormation, (item: Formation) => item.serialize(writer));
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): ReplaySimple {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new ReplaySimple();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.id = reader.readUint64String();
                        break;
                    case 2:
                        message.battleTime = reader.readInt64String();
                        break;
                    case 3:
                        reader.readMessage(message.formation, () => message.formation = Formation.deserialize(reader));
                        break;
                    case 4:
                        reader.readMessage(message.targetFormation, () => message.targetFormation = Formation.deserialize(reader));
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class GuildHonorPlayer extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [], null);
        }
        get uid(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as number | undefined;
        }
        set uid(value: number) {
            pb_1.Message.setField(this, 1, value);
        }
        get icon(): PlayerHeadPortrait | undefined {
            return pb_1.Message.getWrapperField(this, PlayerHeadPortrait, 2) as PlayerHeadPortrait | undefined;
        }
        set icon(value: PlayerHeadPortrait) {
            pb_1.Message.setWrapperField(this, 2, value);
        }
        get power(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 3, undefined) as number | undefined;
        }
        set power(value: number) {
            pb_1.Message.setField(this, 3, value);
        }
        get guildHonorType(): GuildHonorType | undefined {
            return pb_1.Message.getFieldWithDefault(this, 4, undefined) as GuildHonorType | undefined;
        }
        set guildHonorType(value: GuildHonorType) {
            pb_1.Message.setField(this, 4, value);
        }
        get value(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 5, undefined) as number | undefined;
        }
        set value(value: number) {
            pb_1.Message.setField(this, 5, value);
        }
        get counsellorId(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 6, undefined) as number | undefined;
        }
        set counsellorId(value: number) {
            pb_1.Message.setField(this, 6, value);
        }
        toObject() {
            return {
                uid: this.uid,
                icon: this.icon,
                power: this.power,
                guildHonorType: this.guildHonorType,
                value: this.value,
                counsellorId: this.counsellorId
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.uid)
                writer.writeUint64(1, this.uid);
            if (this.icon)
                writer.writeMessage(2, this.icon, (item: PlayerHeadPortrait) => item.serialize(writer));
            if (this.power)
                writer.writeUint32(3, this.power);
            if (this.guildHonorType)
                writer.writeEnum(4, this.guildHonorType);
            if (this.value)
                writer.writeInt32(5, this.value);
            if (this.counsellorId)
                writer.writeInt32(6, this.counsellorId);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): GuildHonorPlayer {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new GuildHonorPlayer();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.uid = reader.readUint64();
                        break;
                    case 2:
                        reader.readMessage(message.icon, () => message.icon = PlayerHeadPortrait.deserialize(reader));
                        break;
                    case 3:
                        message.power = reader.readUint32();
                        break;
                    case 4:
                        message.guildHonorType = reader.readEnum();
                        break;
                    case 5:
                        message.value = reader.readInt32();
                        break;
                    case 6:
                        message.counsellorId = reader.readInt32();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class GuildLog extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [5], null);
        }
        get eventId(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as number | undefined;
        }
        set eventId(value: number) {
            pb_1.Message.setField(this, 1, value);
        }
        get time(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as string | undefined;
        }
        set time(value: string) {
            pb_1.Message.setField(this, 2, value);
        }
        get playerID(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 3, undefined) as string | undefined;
        }
        set playerID(value: string) {
            pb_1.Message.setField(this, 3, value);
        }
        get playerName(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 4, undefined) as string | undefined;
        }
        set playerName(value: string) {
            pb_1.Message.setField(this, 4, value);
        }
        get params(): string[] {
            return pb_1.Message.getField(this, 5) as string[];
        }
        set params(value: string[]) {
            pb_1.Message.setField(this, 5, value);
        }
        toObject() {
            return {
                eventId: this.eventId,
                time: this.time,
                playerID: this.playerID,
                playerName: this.playerName,
                params: this.params
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.eventId)
                writer.writeInt32(1, this.eventId);
            if (this.time)
                writer.writeInt64String(2, this.time);
            if (this.playerID)
                writer.writeUint64String(3, this.playerID);
            if (this.playerName)
                writer.writeString(4, this.playerName);
            if (this.params)
                writer.writeRepeatedString(5, this.params);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): GuildLog {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new GuildLog();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.eventId = reader.readInt32();
                        break;
                    case 2:
                        message.time = reader.readInt64String();
                        break;
                    case 3:
                        message.playerID = reader.readUint64String();
                        break;
                    case 4:
                        message.playerName = reader.readString();
                        break;
                    case 5:
                        pb_1.Message.addToRepeatedField(message, 5, reader.readString());
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class GuildAnnouncement extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [], null);
        }
        get time(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as string | undefined;
        }
        set time(value: string) {
            pb_1.Message.setField(this, 1, value);
        }
        get title(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as string | undefined;
        }
        set title(value: string) {
            pb_1.Message.setField(this, 2, value);
        }
        get content(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 3, undefined) as string | undefined;
        }
        set content(value: string) {
            pb_1.Message.setField(this, 3, value);
        }
        toObject() {
            return {
                time: this.time,
                title: this.title,
                content: this.content
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.time)
                writer.writeInt64String(1, this.time);
            if (this.title)
                writer.writeString(2, this.title);
            if (this.content)
                writer.writeString(3, this.content);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): GuildAnnouncement {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new GuildAnnouncement();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.time = reader.readInt64String();
                        break;
                    case 2:
                        message.title = reader.readString();
                        break;
                    case 3:
                        message.content = reader.readString();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class GuildNotice extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [], null);
        }
        get id(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as string | undefined;
        }
        set id(value: string) {
            pb_1.Message.setField(this, 1, value);
        }
        get time(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as string | undefined;
        }
        set time(value: string) {
            pb_1.Message.setField(this, 2, value);
        }
        get title(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 3, undefined) as string | undefined;
        }
        set title(value: string) {
            pb_1.Message.setField(this, 3, value);
        }
        get content(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 4, undefined) as string | undefined;
        }
        set content(value: string) {
            pb_1.Message.setField(this, 4, value);
        }
        get publisherName(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 5, undefined) as string | undefined;
        }
        set publisherName(value: string) {
            pb_1.Message.setField(this, 5, value);
        }
        get publisherId(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 6, undefined) as number | undefined;
        }
        set publisherId(value: number) {
            pb_1.Message.setField(this, 6, value);
        }
        toObject() {
            return {
                id: this.id,
                time: this.time,
                title: this.title,
                content: this.content,
                publisherName: this.publisherName,
                publisherId: this.publisherId
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.id)
                writer.writeInt64String(1, this.id);
            if (this.time)
                writer.writeInt64String(2, this.time);
            if (this.title)
                writer.writeString(3, this.title);
            if (this.content)
                writer.writeString(4, this.content);
            if (this.publisherName)
                writer.writeString(5, this.publisherName);
            if (this.publisherId)
                writer.writeUint64(6, this.publisherId);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): GuildNotice {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new GuildNotice();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.id = reader.readInt64String();
                        break;
                    case 2:
                        message.time = reader.readInt64String();
                        break;
                    case 3:
                        message.title = reader.readString();
                        break;
                    case 4:
                        message.content = reader.readString();
                        break;
                    case 5:
                        message.publisherName = reader.readString();
                        break;
                    case 6:
                        message.publisherId = reader.readUint64();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class GuildNoticeTemplate extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [], null);
        }
        get content(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as string | undefined;
        }
        set content(value: string) {
            pb_1.Message.setField(this, 1, value);
        }
        toObject() {
            return {
                content: this.content
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.content)
                writer.writeString(1, this.content);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): GuildNoticeTemplate {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new GuildNoticeTemplate();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.content = reader.readString();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class Treasure extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [], null);
        }
        get id(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as number | undefined;
        }
        set id(value: number) {
            pb_1.Message.setField(this, 1, value);
        }
        get advanceLevel(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as number | undefined;
        }
        set advanceLevel(value: number) {
            pb_1.Message.setField(this, 2, value);
        }
        get isAwake(): boolean | undefined {
            return pb_1.Message.getFieldWithDefault(this, 3, undefined) as boolean | undefined;
        }
        set isAwake(value: boolean) {
            pb_1.Message.setField(this, 3, value);
        }
        toObject() {
            return {
                id: this.id,
                advanceLevel: this.advanceLevel,
                isAwake: this.isAwake
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.id)
                writer.writeInt32(1, this.id);
            if (this.advanceLevel)
                writer.writeUint32(2, this.advanceLevel);
            if (this.isAwake)
                writer.writeBool(3, this.isAwake);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): Treasure {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new Treasure();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.id = reader.readInt32();
                        break;
                    case 2:
                        message.advanceLevel = reader.readUint32();
                        break;
                    case 3:
                        message.isAwake = reader.readBool();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class TreasureFate extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [], null);
        }
        get id(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as number | undefined;
        }
        set id(value: number) {
            pb_1.Message.setField(this, 1, value);
        }
        get level(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as number | undefined;
        }
        set level(value: number) {
            pb_1.Message.setField(this, 2, value);
        }
        toObject() {
            return {
                id: this.id,
                level: this.level
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.id)
                writer.writeInt32(1, this.id);
            if (this.level)
                writer.writeUint32(2, this.level);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): TreasureFate {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new TreasureFate();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.id = reader.readInt32();
                        break;
                    case 2:
                        message.level = reader.readUint32();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class TreasureFatesInfo extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [1, 2, 3], null);
        }
        get positiveFateSkills(): TreasureFate[] {
            return pb_1.Message.getRepeatedWrapperField(this, TreasureFate, 1) as TreasureFate[];
        }
        set positiveFateSkills(value: TreasureFate[]) {
            pb_1.Message.setRepeatedWrapperField(this, 1, value);
        }
        get startFateSkills(): TreasureFate[] {
            return pb_1.Message.getRepeatedWrapperField(this, TreasureFate, 2) as TreasureFate[];
        }
        set startFateSkills(value: TreasureFate[]) {
            pb_1.Message.setRepeatedWrapperField(this, 2, value);
        }
        get passiveFateSkills(): TreasureFate[] {
            return pb_1.Message.getRepeatedWrapperField(this, TreasureFate, 3) as TreasureFate[];
        }
        set passiveFateSkills(value: TreasureFate[]) {
            pb_1.Message.setRepeatedWrapperField(this, 3, value);
        }
        toObject() {
            return {
                positiveFateSkills: this.positiveFateSkills,
                startFateSkills: this.startFateSkills,
                passiveFateSkills: this.passiveFateSkills
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.positiveFateSkills)
                writer.writeRepeatedMessage(1, this.positiveFateSkills, (item: TreasureFate) => item.serialize(writer));
            if (this.startFateSkills)
                writer.writeRepeatedMessage(2, this.startFateSkills, (item: TreasureFate) => item.serialize(writer));
            if (this.passiveFateSkills)
                writer.writeRepeatedMessage(3, this.passiveFateSkills, (item: TreasureFate) => item.serialize(writer));
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): TreasureFatesInfo {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new TreasureFatesInfo();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        reader.readMessage(message.positiveFateSkills, () => pb_1.Message.addToRepeatedWrapperField(message, 1, TreasureFate.deserialize(reader), TreasureFate));
                        break;
                    case 2:
                        reader.readMessage(message.startFateSkills, () => pb_1.Message.addToRepeatedWrapperField(message, 2, TreasureFate.deserialize(reader), TreasureFate));
                        break;
                    case 3:
                        reader.readMessage(message.passiveFateSkills, () => pb_1.Message.addToRepeatedWrapperField(message, 3, TreasureFate.deserialize(reader), TreasureFate));
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class FateSkillGroup extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [3], null);
        }
        get id(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as number | undefined;
        }
        set id(value: number) {
            pb_1.Message.setField(this, 1, value);
        }
        get name(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as string | undefined;
        }
        set name(value: string) {
            pb_1.Message.setField(this, 2, value);
        }
        get startSkills(): number[] {
            return pb_1.Message.getField(this, 3) as number[];
        }
        set startSkills(value: number[]) {
            pb_1.Message.setField(this, 3, value);
        }
        get positiveSkill(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 4, undefined) as number | undefined;
        }
        set positiveSkill(value: number) {
            pb_1.Message.setField(this, 4, value);
        }
        toObject() {
            return {
                id: this.id,
                name: this.name,
                startSkills: this.startSkills,
                positiveSkill: this.positiveSkill
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.id)
                writer.writeInt32(1, this.id);
            if (this.name)
                writer.writeString(2, this.name);
            if (this.startSkills)
                writer.writeRepeatedInt32(3, this.startSkills);
            if (this.positiveSkill)
                writer.writeInt32(4, this.positiveSkill);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): FateSkillGroup {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new FateSkillGroup();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.id = reader.readInt32();
                        break;
                    case 2:
                        message.name = reader.readString();
                        break;
                    case 3:
                        message.startSkills.push(reader.readInt32());
                        break;
                    case 4:
                        message.positiveSkill = reader.readInt32();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class ArenaBattleLogPlayerInfo extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [], null);
        }
        get uid(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as string | undefined;
        }
        set uid(value: string) {
            pb_1.Message.setField(this, 1, value);
        }
        get name(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as string | undefined;
        }
        set name(value: string) {
            pb_1.Message.setField(this, 2, value);
        }
        get power(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 3, undefined) as number | undefined;
        }
        set power(value: number) {
            pb_1.Message.setField(this, 3, value);
        }
        get level(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 4, undefined) as number | undefined;
        }
        set level(value: number) {
            pb_1.Message.setField(this, 4, value);
        }
        get vipLevel(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 5, undefined) as number | undefined;
        }
        set vipLevel(value: number) {
            pb_1.Message.setField(this, 5, value);
        }
        get avatar(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 6, undefined) as number | undefined;
        }
        set avatar(value: number) {
            pb_1.Message.setField(this, 6, value);
        }
        get avatarFrame(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 7, undefined) as number | undefined;
        }
        set avatarFrame(value: number) {
            pb_1.Message.setField(this, 7, value);
        }
        get counsellorId(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 8, undefined) as number | undefined;
        }
        set counsellorId(value: number) {
            pb_1.Message.setField(this, 8, value);
        }
        get msg(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 9, undefined) as string | undefined;
        }
        set msg(value: string) {
            pb_1.Message.setField(this, 9, value);
        }
        get guildName(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 10, undefined) as string | undefined;
        }
        set guildName(value: string) {
            pb_1.Message.setField(this, 10, value);
        }
        get beforeRank(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 11, undefined) as number | undefined;
        }
        set beforeRank(value: number) {
            pb_1.Message.setField(this, 11, value);
        }
        get afterRank(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 12, undefined) as number | undefined;
        }
        set afterRank(value: number) {
            pb_1.Message.setField(this, 12, value);
        }
        toObject() {
            return {
                uid: this.uid,
                name: this.name,
                power: this.power,
                level: this.level,
                vipLevel: this.vipLevel,
                avatar: this.avatar,
                avatarFrame: this.avatarFrame,
                counsellorId: this.counsellorId,
                msg: this.msg,
                guildName: this.guildName,
                beforeRank: this.beforeRank,
                afterRank: this.afterRank
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.uid)
                writer.writeUint64String(1, this.uid);
            if (this.name)
                writer.writeString(2, this.name);
            if (this.power)
                writer.writeUint32(3, this.power);
            if (this.level)
                writer.writeUint32(4, this.level);
            if (this.vipLevel)
                writer.writeUint32(5, this.vipLevel);
            if (this.avatar)
                writer.writeInt32(6, this.avatar);
            if (this.avatarFrame)
                writer.writeInt32(7, this.avatarFrame);
            if (this.counsellorId)
                writer.writeInt32(8, this.counsellorId);
            if (this.msg)
                writer.writeString(9, this.msg);
            if (this.guildName)
                writer.writeString(10, this.guildName);
            if (this.beforeRank)
                writer.writeUint32(11, this.beforeRank);
            if (this.afterRank)
                writer.writeUint32(12, this.afterRank);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): ArenaBattleLogPlayerInfo {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new ArenaBattleLogPlayerInfo();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.uid = reader.readUint64String();
                        break;
                    case 2:
                        message.name = reader.readString();
                        break;
                    case 3:
                        message.power = reader.readUint32();
                        break;
                    case 4:
                        message.level = reader.readUint32();
                        break;
                    case 5:
                        message.vipLevel = reader.readUint32();
                        break;
                    case 6:
                        message.avatar = reader.readInt32();
                        break;
                    case 7:
                        message.avatarFrame = reader.readInt32();
                        break;
                    case 8:
                        message.counsellorId = reader.readInt32();
                        break;
                    case 9:
                        message.msg = reader.readString();
                        break;
                    case 10:
                        message.guildName = reader.readString();
                        break;
                    case 11:
                        message.beforeRank = reader.readUint32();
                        break;
                    case 12:
                        message.afterRank = reader.readUint32();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class ArenaBattleLog extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [3], null);
        }
        get battleId(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as string | undefined;
        }
        set battleId(value: string) {
            pb_1.Message.setField(this, 1, value);
        }
        get battleTime(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as string | undefined;
        }
        set battleTime(value: string) {
            pb_1.Message.setField(this, 2, value);
        }
        get players(): ArenaBattleLogPlayerInfo[] {
            return pb_1.Message.getRepeatedWrapperField(this, ArenaBattleLogPlayerInfo, 3) as ArenaBattleLogPlayerInfo[];
        }
        set players(value: ArenaBattleLogPlayerInfo[]) {
            pb_1.Message.setRepeatedWrapperField(this, 3, value);
        }
        get winUid(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 4, undefined) as string | undefined;
        }
        set winUid(value: string) {
            pb_1.Message.setField(this, 4, value);
        }
        get complete(): boolean | undefined {
            return pb_1.Message.getFieldWithDefault(this, 5, undefined) as boolean | undefined;
        }
        set complete(value: boolean) {
            pb_1.Message.setField(this, 5, value);
        }
        get close(): boolean | undefined {
            return pb_1.Message.getFieldWithDefault(this, 6, undefined) as boolean | undefined;
        }
        set close(value: boolean) {
            pb_1.Message.setField(this, 6, value);
        }
        toObject() {
            return {
                battleId: this.battleId,
                battleTime: this.battleTime,
                players: this.players,
                winUid: this.winUid,
                complete: this.complete,
                close: this.close
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.battleId)
                writer.writeUint64String(1, this.battleId);
            if (this.battleTime)
                writer.writeInt64String(2, this.battleTime);
            if (this.players)
                writer.writeRepeatedMessage(3, this.players, (item: ArenaBattleLogPlayerInfo) => item.serialize(writer));
            if (this.winUid)
                writer.writeUint64String(4, this.winUid);
            if (this.complete)
                writer.writeBool(5, this.complete);
            if (this.close)
                writer.writeBool(6, this.close);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): ArenaBattleLog {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new ArenaBattleLog();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.battleId = reader.readUint64String();
                        break;
                    case 2:
                        message.battleTime = reader.readInt64String();
                        break;
                    case 3:
                        reader.readMessage(message.players, () => pb_1.Message.addToRepeatedWrapperField(message, 3, ArenaBattleLogPlayerInfo.deserialize(reader), ArenaBattleLogPlayerInfo));
                        break;
                    case 4:
                        message.winUid = reader.readUint64String();
                        break;
                    case 5:
                        message.complete = reader.readBool();
                        break;
                    case 6:
                        message.close = reader.readBool();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class PeakMatchPlayer extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [6], null);
        }
        get uid(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as string | undefined;
        }
        set uid(value: string) {
            pb_1.Message.setField(this, 1, value);
        }
        get icon(): PlayerHeadPortrait | undefined {
            return pb_1.Message.getWrapperField(this, PlayerHeadPortrait, 2) as PlayerHeadPortrait | undefined;
        }
        set icon(value: PlayerHeadPortrait) {
            pb_1.Message.setWrapperField(this, 2, value);
        }
        get score(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 3, undefined) as number | undefined;
        }
        set score(value: number) {
            pb_1.Message.setField(this, 3, value);
        }
        get power(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 4, undefined) as number | undefined;
        }
        set power(value: number) {
            pb_1.Message.setField(this, 4, value);
        }
        get counsellorId(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 5, undefined) as number | undefined;
        }
        set counsellorId(value: number) {
            pb_1.Message.setField(this, 5, value);
        }
        get commanders(): Commander[] {
            return pb_1.Message.getRepeatedWrapperField(this, Commander, 6) as Commander[];
        }
        set commanders(value: Commander[]) {
            pb_1.Message.setRepeatedWrapperField(this, 6, value);
        }
        get isRobot(): boolean | undefined {
            return pb_1.Message.getFieldWithDefault(this, 7, undefined) as boolean | undefined;
        }
        set isRobot(value: boolean) {
            pb_1.Message.setField(this, 7, value);
        }
        get isReady(): boolean | undefined {
            return pb_1.Message.getFieldWithDefault(this, 8, undefined) as boolean | undefined;
        }
        set isReady(value: boolean) {
            pb_1.Message.setField(this, 8, value);
        }
        toObject() {
            return {
                uid: this.uid,
                icon: this.icon,
                score: this.score,
                power: this.power,
                counsellorId: this.counsellorId,
                commanders: this.commanders,
                isRobot: this.isRobot,
                isReady: this.isReady
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.uid)
                writer.writeUint64String(1, this.uid);
            if (this.icon)
                writer.writeMessage(2, this.icon, (item: PlayerHeadPortrait) => item.serialize(writer));
            if (this.score)
                writer.writeUint32(3, this.score);
            if (this.power)
                writer.writeUint32(4, this.power);
            if (this.counsellorId)
                writer.writeInt32(5, this.counsellorId);
            if (this.commanders)
                writer.writeRepeatedMessage(6, this.commanders, (item: Commander) => item.serialize(writer));
            if (this.isRobot)
                writer.writeBool(7, this.isRobot);
            if (this.isReady)
                writer.writeBool(8, this.isReady);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): PeakMatchPlayer {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new PeakMatchPlayer();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.uid = reader.readUint64String();
                        break;
                    case 2:
                        reader.readMessage(message.icon, () => message.icon = PlayerHeadPortrait.deserialize(reader));
                        break;
                    case 3:
                        message.score = reader.readUint32();
                        break;
                    case 4:
                        message.power = reader.readUint32();
                        break;
                    case 5:
                        message.counsellorId = reader.readInt32();
                        break;
                    case 6:
                        reader.readMessage(message.commanders, () => pb_1.Message.addToRepeatedWrapperField(message, 6, Commander.deserialize(reader), Commander));
                        break;
                    case 7:
                        message.isRobot = reader.readBool();
                        break;
                    case 8:
                        message.isReady = reader.readBool();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class PeakFormationData extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [2], null);
        }
        get mathTime(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as string | undefined;
        }
        set mathTime(value: string) {
            pb_1.Message.setField(this, 1, value);
        }
        get counsellors(): Counsellor[] {
            return pb_1.Message.getRepeatedWrapperField(this, Counsellor, 2) as Counsellor[];
        }
        set counsellors(value: Counsellor[]) {
            pb_1.Message.setRepeatedWrapperField(this, 2, value);
        }
        toObject() {
            return {
                mathTime: this.mathTime,
                counsellors: this.counsellors
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.mathTime)
                writer.writeInt64String(1, this.mathTime);
            if (this.counsellors)
                writer.writeRepeatedMessage(2, this.counsellors, (item: Counsellor) => item.serialize(writer));
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): PeakFormationData {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new PeakFormationData();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.mathTime = reader.readInt64String();
                        break;
                    case 2:
                        reader.readMessage(message.counsellors, () => pb_1.Message.addToRepeatedWrapperField(message, 2, Counsellor.deserialize(reader), Counsellor));
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class PeakBattleData extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [], null);
        }
        get address(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as string | undefined;
        }
        set address(value: string) {
            pb_1.Message.setField(this, 1, value);
        }
        get secret(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as string | undefined;
        }
        set secret(value: string) {
            pb_1.Message.setField(this, 2, value);
        }
        get info(): BattleStartInfo | undefined {
            return pb_1.Message.getWrapperField(this, BattleStartInfo, 3) as BattleStartInfo | undefined;
        }
        set info(value: BattleStartInfo) {
            pb_1.Message.setWrapperField(this, 3, value);
        }
        toObject() {
            return {
                address: this.address,
                secret: this.secret,
                info: this.info
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.address)
                writer.writeString(1, this.address);
            if (this.secret)
                writer.writeString(2, this.secret);
            if (this.info)
                writer.writeMessage(3, this.info, (item: BattleStartInfo) => item.serialize(writer));
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): PeakBattleData {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new PeakBattleData();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.address = reader.readString();
                        break;
                    case 2:
                        message.secret = reader.readString();
                        break;
                    case 3:
                        reader.readMessage(message.info, () => message.info = BattleStartInfo.deserialize(reader));
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class PeakStateData extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [2], null);
        }
        get peakStateStep(): PeakStateStep | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as PeakStateStep | undefined;
        }
        set peakStateStep(value: PeakStateStep) {
            pb_1.Message.setField(this, 1, value);
        }
        get peakMatchPlayer(): PeakMatchPlayer[] {
            return pb_1.Message.getRepeatedWrapperField(this, PeakMatchPlayer, 2) as PeakMatchPlayer[];
        }
        set peakMatchPlayer(value: PeakMatchPlayer[]) {
            pb_1.Message.setRepeatedWrapperField(this, 2, value);
        }
        get peakFormationData(): PeakFormationData | undefined {
            return pb_1.Message.getWrapperField(this, PeakFormationData, 3) as PeakFormationData | undefined;
        }
        set peakFormationData(value: PeakFormationData) {
            pb_1.Message.setWrapperField(this, 3, value);
        }
        get peakBattleData(): PeakBattleData | undefined {
            return pb_1.Message.getWrapperField(this, PeakBattleData, 4) as PeakBattleData | undefined;
        }
        set peakBattleData(value: PeakBattleData) {
            pb_1.Message.setWrapperField(this, 4, value);
        }
        toObject() {
            return {
                peakStateStep: this.peakStateStep,
                peakMatchPlayer: this.peakMatchPlayer,
                peakFormationData: this.peakFormationData,
                peakBattleData: this.peakBattleData
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.peakStateStep)
                writer.writeEnum(1, this.peakStateStep);
            if (this.peakMatchPlayer)
                writer.writeRepeatedMessage(2, this.peakMatchPlayer, (item: PeakMatchPlayer) => item.serialize(writer));
            if (this.peakFormationData)
                writer.writeMessage(3, this.peakFormationData, (item: PeakFormationData) => item.serialize(writer));
            if (this.peakBattleData)
                writer.writeMessage(4, this.peakBattleData, (item: PeakBattleData) => item.serialize(writer));
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): PeakStateData {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new PeakStateData();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.peakStateStep = reader.readEnum();
                        break;
                    case 2:
                        reader.readMessage(message.peakMatchPlayer, () => pb_1.Message.addToRepeatedWrapperField(message, 2, PeakMatchPlayer.deserialize(reader), PeakMatchPlayer));
                        break;
                    case 3:
                        reader.readMessage(message.peakFormationData, () => message.peakFormationData = PeakFormationData.deserialize(reader));
                        break;
                    case 4:
                        reader.readMessage(message.peakBattleData, () => message.peakBattleData = PeakBattleData.deserialize(reader));
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class PeakBattleResult extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [10], null);
        }
        get battleID(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as string | undefined;
        }
        set battleID(value: string) {
            pb_1.Message.setField(this, 1, value);
        }
        get winUid(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as string | undefined;
        }
        set winUid(value: string) {
            pb_1.Message.setField(this, 2, value);
        }
        get maxScore(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 3, undefined) as number | undefined;
        }
        set maxScore(value: number) {
            pb_1.Message.setField(this, 3, value);
        }
        get beforeScore(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 4, undefined) as number | undefined;
        }
        set beforeScore(value: number) {
            pb_1.Message.setField(this, 4, value);
        }
        get afterScore(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 5, undefined) as number | undefined;
        }
        set afterScore(value: number) {
            pb_1.Message.setField(this, 5, value);
        }
        get totalBattleTimes(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 6, undefined) as number | undefined;
        }
        set totalBattleTimes(value: number) {
            pb_1.Message.setField(this, 6, value);
        }
        get totalBattleWinTimes(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 7, undefined) as number | undefined;
        }
        set totalBattleWinTimes(value: number) {
            pb_1.Message.setField(this, 7, value);
        }
        get lastAccumulatePeakCoin(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 8, undefined) as number | undefined;
        }
        set lastAccumulatePeakCoin(value: number) {
            pb_1.Message.setField(this, 8, value);
        }
        get nowAccumulatePeakCoinBeginTime(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 9, undefined) as string | undefined;
        }
        set nowAccumulatePeakCoinBeginTime(value: string) {
            pb_1.Message.setField(this, 9, value);
        }
        get hotCommander(): number[] {
            return pb_1.Message.getField(this, 10) as number[];
        }
        set hotCommander(value: number[]) {
            pb_1.Message.setField(this, 10, value);
        }
        get hotCounsellor(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 11, undefined) as number | undefined;
        }
        set hotCounsellor(value: number) {
            pb_1.Message.setField(this, 11, value);
        }
        get leftChallengeTimes(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 12, undefined) as number | undefined;
        }
        set leftChallengeTimes(value: number) {
            pb_1.Message.setField(this, 12, value);
        }
        toObject() {
            return {
                battleID: this.battleID,
                winUid: this.winUid,
                maxScore: this.maxScore,
                beforeScore: this.beforeScore,
                afterScore: this.afterScore,
                totalBattleTimes: this.totalBattleTimes,
                totalBattleWinTimes: this.totalBattleWinTimes,
                lastAccumulatePeakCoin: this.lastAccumulatePeakCoin,
                nowAccumulatePeakCoinBeginTime: this.nowAccumulatePeakCoinBeginTime,
                hotCommander: this.hotCommander,
                hotCounsellor: this.hotCounsellor,
                leftChallengeTimes: this.leftChallengeTimes
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.battleID)
                writer.writeUint64String(1, this.battleID);
            if (this.winUid)
                writer.writeUint64String(2, this.winUid);
            if (this.maxScore)
                writer.writeUint32(3, this.maxScore);
            if (this.beforeScore)
                writer.writeUint32(4, this.beforeScore);
            if (this.afterScore)
                writer.writeUint32(5, this.afterScore);
            if (this.totalBattleTimes)
                writer.writeInt32(6, this.totalBattleTimes);
            if (this.totalBattleWinTimes)
                writer.writeInt32(7, this.totalBattleWinTimes);
            if (this.lastAccumulatePeakCoin)
                writer.writeUint32(8, this.lastAccumulatePeakCoin);
            if (this.nowAccumulatePeakCoinBeginTime)
                writer.writeInt64String(9, this.nowAccumulatePeakCoinBeginTime);
            if (this.hotCommander)
                writer.writeRepeatedInt32(10, this.hotCommander);
            if (this.hotCounsellor)
                writer.writeInt32(11, this.hotCounsellor);
            if (this.leftChallengeTimes)
                writer.writeUint32(12, this.leftChallengeTimes);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): PeakBattleResult {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new PeakBattleResult();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.battleID = reader.readUint64String();
                        break;
                    case 2:
                        message.winUid = reader.readUint64String();
                        break;
                    case 3:
                        message.maxScore = reader.readUint32();
                        break;
                    case 4:
                        message.beforeScore = reader.readUint32();
                        break;
                    case 5:
                        message.afterScore = reader.readUint32();
                        break;
                    case 6:
                        message.totalBattleTimes = reader.readInt32();
                        break;
                    case 7:
                        message.totalBattleWinTimes = reader.readInt32();
                        break;
                    case 8:
                        message.lastAccumulatePeakCoin = reader.readUint32();
                        break;
                    case 9:
                        message.nowAccumulatePeakCoinBeginTime = reader.readInt64String();
                        break;
                    case 10:
                        message.hotCommander.push(reader.readInt32());
                        break;
                    case 11:
                        message.hotCounsellor = reader.readInt32();
                        break;
                    case 12:
                        message.leftChallengeTimes = reader.readUint32();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class PeakBattleLogPlayerInfo extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [], null);
        }
        get uid(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as string | undefined;
        }
        set uid(value: string) {
            pb_1.Message.setField(this, 1, value);
        }
        get icon(): PlayerHeadPortrait | undefined {
            return pb_1.Message.getWrapperField(this, PlayerHeadPortrait, 2) as PlayerHeadPortrait | undefined;
        }
        set icon(value: PlayerHeadPortrait) {
            pb_1.Message.setWrapperField(this, 2, value);
        }
        get power(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 3, undefined) as number | undefined;
        }
        set power(value: number) {
            pb_1.Message.setField(this, 3, value);
        }
        get beforeScore(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 4, undefined) as number | undefined;
        }
        set beforeScore(value: number) {
            pb_1.Message.setField(this, 4, value);
        }
        get afterScore(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 5, undefined) as number | undefined;
        }
        set afterScore(value: number) {
            pb_1.Message.setField(this, 5, value);
        }
        toObject() {
            return {
                uid: this.uid,
                icon: this.icon,
                power: this.power,
                beforeScore: this.beforeScore,
                afterScore: this.afterScore
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.uid)
                writer.writeUint64String(1, this.uid);
            if (this.icon)
                writer.writeMessage(2, this.icon, (item: PlayerHeadPortrait) => item.serialize(writer));
            if (this.power)
                writer.writeUint32(3, this.power);
            if (this.beforeScore)
                writer.writeUint32(4, this.beforeScore);
            if (this.afterScore)
                writer.writeUint32(5, this.afterScore);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): PeakBattleLogPlayerInfo {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new PeakBattleLogPlayerInfo();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.uid = reader.readUint64String();
                        break;
                    case 2:
                        reader.readMessage(message.icon, () => message.icon = PlayerHeadPortrait.deserialize(reader));
                        break;
                    case 3:
                        message.power = reader.readUint32();
                        break;
                    case 4:
                        message.beforeScore = reader.readUint32();
                        break;
                    case 5:
                        message.afterScore = reader.readUint32();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class PeakBattleLog extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [3], null);
        }
        get battleId(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as string | undefined;
        }
        set battleId(value: string) {
            pb_1.Message.setField(this, 1, value);
        }
        get battleTime(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as string | undefined;
        }
        set battleTime(value: string) {
            pb_1.Message.setField(this, 2, value);
        }
        get players(): PeakBattleLogPlayerInfo[] {
            return pb_1.Message.getRepeatedWrapperField(this, PeakBattleLogPlayerInfo, 3) as PeakBattleLogPlayerInfo[];
        }
        set players(value: PeakBattleLogPlayerInfo[]) {
            pb_1.Message.setRepeatedWrapperField(this, 3, value);
        }
        get winUid(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 4, undefined) as string | undefined;
        }
        set winUid(value: string) {
            pb_1.Message.setField(this, 4, value);
        }
        toObject() {
            return {
                battleId: this.battleId,
                battleTime: this.battleTime,
                players: this.players,
                winUid: this.winUid
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.battleId)
                writer.writeUint64String(1, this.battleId);
            if (this.battleTime)
                writer.writeInt64String(2, this.battleTime);
            if (this.players)
                writer.writeRepeatedMessage(3, this.players, (item: PeakBattleLogPlayerInfo) => item.serialize(writer));
            if (this.winUid)
                writer.writeUint64String(4, this.winUid);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): PeakBattleLog {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new PeakBattleLog();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.battleId = reader.readUint64String();
                        break;
                    case 2:
                        message.battleTime = reader.readInt64String();
                        break;
                    case 3:
                        reader.readMessage(message.players, () => pb_1.Message.addToRepeatedWrapperField(message, 3, PeakBattleLogPlayerInfo.deserialize(reader), PeakBattleLogPlayerInfo));
                        break;
                    case 4:
                        message.winUid = reader.readUint64String();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class BattleAttr extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [], null);
        }
        get attrType(): AttrType | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as AttrType | undefined;
        }
        set attrType(value: AttrType) {
            pb_1.Message.setField(this, 1, value);
        }
        get attrValue(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as number | undefined;
        }
        set attrValue(value: number) {
            pb_1.Message.setField(this, 2, value);
        }
        toObject() {
            return {
                attrType: this.attrType,
                attrValue: this.attrValue
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.attrType)
                writer.writeEnum(1, this.attrType);
            if (this.attrValue)
                writer.writeInt32(2, this.attrValue);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): BattleAttr {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new BattleAttr();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.attrType = reader.readEnum();
                        break;
                    case 2:
                        message.attrValue = reader.readInt32();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class SoldierTechSkill extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [], null);
        }
        get id(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as number | undefined;
        }
        set id(value: number) {
            pb_1.Message.setField(this, 1, value);
        }
        get level(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as number | undefined;
        }
        set level(value: number) {
            pb_1.Message.setField(this, 2, value);
        }
        get skillType(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 3, undefined) as number | undefined;
        }
        set skillType(value: number) {
            pb_1.Message.setField(this, 3, value);
        }
        toObject() {
            return {
                id: this.id,
                level: this.level,
                skillType: this.skillType
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.id)
                writer.writeInt32(1, this.id);
            if (this.level)
                writer.writeInt32(2, this.level);
            if (this.skillType)
                writer.writeInt32(3, this.skillType);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): SoldierTechSkill {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new SoldierTechSkill();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.id = reader.readInt32();
                        break;
                    case 2:
                        message.level = reader.readInt32();
                        break;
                    case 3:
                        message.skillType = reader.readInt32();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class PlayerGuildSkill extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [], null);
        }
        get slotId(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as number | undefined;
        }
        set slotId(value: number) {
            pb_1.Message.setField(this, 1, value);
        }
        get level(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as number | undefined;
        }
        set level(value: number) {
            pb_1.Message.setField(this, 2, value);
        }
        toObject() {
            return {
                slotId: this.slotId,
                level: this.level
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.slotId)
                writer.writeInt32(1, this.slotId);
            if (this.level)
                writer.writeUint32(2, this.level);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): PlayerGuildSkill {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new PlayerGuildSkill();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.slotId = reader.readInt32();
                        break;
                    case 2:
                        message.level = reader.readUint32();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class BattleCommander extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [5], null);
        }
        get commander(): Commander | undefined {
            return pb_1.Message.getWrapperField(this, Commander, 1) as Commander | undefined;
        }
        set commander(value: Commander) {
            pb_1.Message.setWrapperField(this, 1, value);
        }
        get gridId(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as number | undefined;
        }
        set gridId(value: number) {
            pb_1.Message.setField(this, 2, value);
        }
        get Hp(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 3, undefined) as number | undefined;
        }
        set Hp(value: number) {
            pb_1.Message.setField(this, 3, value);
        }
        get Armor(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 4, undefined) as number | undefined;
        }
        set Armor(value: number) {
            pb_1.Message.setField(this, 4, value);
        }
        get attrs(): BattleAttr[] {
            return pb_1.Message.getRepeatedWrapperField(this, BattleAttr, 5) as BattleAttr[];
        }
        set attrs(value: BattleAttr[]) {
            pb_1.Message.setRepeatedWrapperField(this, 5, value);
        }
        toObject() {
            return {
                commander: this.commander,
                gridId: this.gridId,
                Hp: this.Hp,
                Armor: this.Armor,
                attrs: this.attrs
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.commander)
                writer.writeMessage(1, this.commander, (item: Commander) => item.serialize(writer));
            if (this.gridId)
                writer.writeInt32(2, this.gridId);
            if (this.Hp)
                writer.writeInt32(3, this.Hp);
            if (this.Armor)
                writer.writeInt32(4, this.Armor);
            if (this.attrs)
                writer.writeRepeatedMessage(5, this.attrs, (item: BattleAttr) => item.serialize(writer));
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): BattleCommander {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new BattleCommander();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        reader.readMessage(message.commander, () => message.commander = Commander.deserialize(reader));
                        break;
                    case 2:
                        message.gridId = reader.readInt32();
                        break;
                    case 3:
                        message.Hp = reader.readInt32();
                        break;
                    case 4:
                        message.Armor = reader.readInt32();
                        break;
                    case 5:
                        reader.readMessage(message.attrs, () => pb_1.Message.addToRepeatedWrapperField(message, 5, BattleAttr.deserialize(reader), BattleAttr));
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class BattleNpcCommander extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [], null);
        }
        get id(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as number | undefined;
        }
        set id(value: number) {
            pb_1.Message.setField(this, 1, value);
        }
        get gridId(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as number | undefined;
        }
        set gridId(value: number) {
            pb_1.Message.setField(this, 2, value);
        }
        get soldierId(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 3, undefined) as number | undefined;
        }
        set soldierId(value: number) {
            pb_1.Message.setField(this, 3, value);
        }
        get soldierNum(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 4, undefined) as number | undefined;
        }
        set soldierNum(value: number) {
            pb_1.Message.setField(this, 4, value);
        }
        toObject() {
            return {
                id: this.id,
                gridId: this.gridId,
                soldierId: this.soldierId,
                soldierNum: this.soldierNum
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.id)
                writer.writeInt32(1, this.id);
            if (this.gridId)
                writer.writeInt32(2, this.gridId);
            if (this.soldierId)
                writer.writeInt32(3, this.soldierId);
            if (this.soldierNum)
                writer.writeInt32(4, this.soldierNum);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): BattleNpcCommander {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new BattleNpcCommander();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.id = reader.readInt32();
                        break;
                    case 2:
                        message.gridId = reader.readInt32();
                        break;
                    case 3:
                        message.soldierId = reader.readInt32();
                        break;
                    case 4:
                        message.soldierNum = reader.readInt32();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class BattleCounsellor extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [], null);
        }
        get counsellor(): Counsellor | undefined {
            return pb_1.Message.getWrapperField(this, Counsellor, 1) as Counsellor | undefined;
        }
        set counsellor(value: Counsellor) {
            pb_1.Message.setWrapperField(this, 1, value);
        }
        get assist(): boolean | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as boolean | undefined;
        }
        set assist(value: boolean) {
            pb_1.Message.setField(this, 2, value);
        }
        toObject() {
            return {
                counsellor: this.counsellor,
                assist: this.assist
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.counsellor)
                writer.writeMessage(1, this.counsellor, (item: Counsellor) => item.serialize(writer));
            if (this.assist)
                writer.writeBool(2, this.assist);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): BattleCounsellor {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new BattleCounsellor();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        reader.readMessage(message.counsellor, () => message.counsellor = Counsellor.deserialize(reader));
                        break;
                    case 2:
                        message.assist = reader.readBool();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class BattleDailyBoss extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [], null);
        }
        get hp(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as number | undefined;
        }
        set hp(value: number) {
            pb_1.Message.setField(this, 1, value);
        }
        get damage(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as number | undefined;
        }
        set damage(value: number) {
            pb_1.Message.setField(this, 2, value);
        }
        toObject() {
            return {
                hp: this.hp,
                damage: this.damage
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.hp)
                writer.writeUint32(1, this.hp);
            if (this.damage)
                writer.writeUint32(2, this.damage);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): BattleDailyBoss {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new BattleDailyBoss();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.hp = reader.readUint32();
                        break;
                    case 2:
                        message.damage = reader.readUint32();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class BattleDailyExp extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [], null);
        }
        get normalKillNum(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as number | undefined;
        }
        set normalKillNum(value: number) {
            pb_1.Message.setField(this, 1, value);
        }
        get eliteKillNum(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as number | undefined;
        }
        set eliteKillNum(value: number) {
            pb_1.Message.setField(this, 2, value);
        }
        get roundNum(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 3, undefined) as number | undefined;
        }
        set roundNum(value: number) {
            pb_1.Message.setField(this, 3, value);
        }
        toObject() {
            return {
                normalKillNum: this.normalKillNum,
                eliteKillNum: this.eliteKillNum,
                roundNum: this.roundNum
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.normalKillNum)
                writer.writeUint32(1, this.normalKillNum);
            if (this.eliteKillNum)
                writer.writeUint32(2, this.eliteKillNum);
            if (this.roundNum)
                writer.writeUint32(3, this.roundNum);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): BattleDailyExp {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new BattleDailyExp();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.normalKillNum = reader.readUint32();
                        break;
                    case 2:
                        message.eliteKillNum = reader.readUint32();
                        break;
                    case 3:
                        message.roundNum = reader.readUint32();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class BattleDailyCoin extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [], null);
        }
        get normalKillNum(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as number | undefined;
        }
        set normalKillNum(value: number) {
            pb_1.Message.setField(this, 1, value);
        }
        get eliteKillNum(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as number | undefined;
        }
        set eliteKillNum(value: number) {
            pb_1.Message.setField(this, 2, value);
        }
        get roundNum(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 3, undefined) as number | undefined;
        }
        set roundNum(value: number) {
            pb_1.Message.setField(this, 3, value);
        }
        get damage(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 4, undefined) as number | undefined;
        }
        set damage(value: number) {
            pb_1.Message.setField(this, 4, value);
        }
        toObject() {
            return {
                normalKillNum: this.normalKillNum,
                eliteKillNum: this.eliteKillNum,
                roundNum: this.roundNum,
                damage: this.damage
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.normalKillNum)
                writer.writeUint32(1, this.normalKillNum);
            if (this.eliteKillNum)
                writer.writeUint32(2, this.eliteKillNum);
            if (this.roundNum)
                writer.writeUint32(3, this.roundNum);
            if (this.damage)
                writer.writeUint32(4, this.damage);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): BattleDailyCoin {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new BattleDailyCoin();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.normalKillNum = reader.readUint32();
                        break;
                    case 2:
                        message.eliteKillNum = reader.readUint32();
                        break;
                    case 3:
                        message.roundNum = reader.readUint32();
                        break;
                    case 4:
                        message.damage = reader.readUint32();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class Skill extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [], null);
        }
        get tableType(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as number | undefined;
        }
        set tableType(value: number) {
            pb_1.Message.setField(this, 1, value);
        }
        get id(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as number | undefined;
        }
        set id(value: number) {
            pb_1.Message.setField(this, 2, value);
        }
        toObject() {
            return {
                tableType: this.tableType,
                id: this.id
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.tableType)
                writer.writeInt32(1, this.tableType);
            if (this.id)
                writer.writeInt32(2, this.id);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): Skill {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new Skill();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.tableType = reader.readInt32();
                        break;
                    case 2:
                        message.id = reader.readInt32();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class BattlePlayerInfo extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [17, 18, 19, 24, 26, 27, 28, 29], null);
        }
        get id(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as string | undefined;
        }
        set id(value: string) {
            pb_1.Message.setField(this, 1, value);
        }
        get name(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as string | undefined;
        }
        set name(value: string) {
            pb_1.Message.setField(this, 2, value);
        }
        get level(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 3, undefined) as number | undefined;
        }
        set level(value: number) {
            pb_1.Message.setField(this, 3, value);
        }
        get avatar(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 4, undefined) as number | undefined;
        }
        set avatar(value: number) {
            pb_1.Message.setField(this, 4, value);
        }
        get avatarFrame(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 5, undefined) as number | undefined;
        }
        set avatarFrame(value: number) {
            pb_1.Message.setField(this, 5, value);
        }
        get msg(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 6, undefined) as string | undefined;
        }
        set msg(value: string) {
            pb_1.Message.setField(this, 6, value);
        }
        get vipLevel(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 7, undefined) as number | undefined;
        }
        set vipLevel(value: number) {
            pb_1.Message.setField(this, 7, value);
        }
        get power(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 8, undefined) as number | undefined;
        }
        set power(value: number) {
            pb_1.Message.setField(this, 8, value);
        }
        get guildName(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 9, undefined) as string | undefined;
        }
        set guildName(value: string) {
            pb_1.Message.setField(this, 9, value);
        }
        get serverId(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 10, undefined) as string | undefined;
        }
        set serverId(value: string) {
            pb_1.Message.setField(this, 10, value);
        }
        get formationType(): FormationType | undefined {
            return pb_1.Message.getFieldWithDefault(this, 14, undefined) as FormationType | undefined;
        }
        set formationType(value: FormationType) {
            pb_1.Message.setField(this, 14, value);
        }
        get isRobot(): boolean | undefined {
            return pb_1.Message.getFieldWithDefault(this, 15, undefined) as boolean | undefined;
        }
        set isRobot(value: boolean) {
            pb_1.Message.setField(this, 15, value);
        }
        get counsellorId(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 16, undefined) as number | undefined;
        }
        set counsellorId(value: number) {
            pb_1.Message.setField(this, 16, value);
        }
        get battleCounsellors(): BattleCounsellor[] {
            return pb_1.Message.getRepeatedWrapperField(this, BattleCounsellor, 17) as BattleCounsellor[];
        }
        set battleCounsellors(value: BattleCounsellor[]) {
            pb_1.Message.setRepeatedWrapperField(this, 17, value);
        }
        get battleCommanders(): BattleCommander[] {
            return pb_1.Message.getRepeatedWrapperField(this, BattleCommander, 18) as BattleCommander[];
        }
        set battleCommanders(value: BattleCommander[]) {
            pb_1.Message.setRepeatedWrapperField(this, 18, value);
        }
        get battleNpcCommanders(): BattleNpcCommander[] {
            return pb_1.Message.getRepeatedWrapperField(this, BattleNpcCommander, 19) as BattleNpcCommander[];
        }
        set battleNpcCommanders(value: BattleNpcCommander[]) {
            pb_1.Message.setRepeatedWrapperField(this, 19, value);
        }
        get treasureGroup(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 22, undefined) as number | undefined;
        }
        set treasureGroup(value: number) {
            pb_1.Message.setField(this, 22, value);
        }
        get treasureFatesInfo(): TreasureFatesInfo | undefined {
            return pb_1.Message.getWrapperField(this, TreasureFatesInfo, 23) as TreasureFatesInfo | undefined;
        }
        set treasureFatesInfo(value: TreasureFatesInfo) {
            pb_1.Message.setWrapperField(this, 23, value);
        }
        get treasures(): Treasure[] {
            return pb_1.Message.getRepeatedWrapperField(this, Treasure, 24) as Treasure[];
        }
        set treasures(value: Treasure[]) {
            pb_1.Message.setRepeatedWrapperField(this, 24, value);
        }
        get pokedexInfo(): PokedexBattleInfo | undefined {
            return pb_1.Message.getWrapperField(this, PokedexBattleInfo, 25) as PokedexBattleInfo | undefined;
        }
        set pokedexInfo(value: PokedexBattleInfo) {
            pb_1.Message.setWrapperField(this, 25, value);
        }
        get strTalents(): StrTalent[] {
            return pb_1.Message.getRepeatedWrapperField(this, StrTalent, 26) as StrTalent[];
        }
        set strTalents(value: StrTalent[]) {
            pb_1.Message.setRepeatedWrapperField(this, 26, value);
        }
        get guild(): PlayerGuildSkill[] {
            return pb_1.Message.getRepeatedWrapperField(this, PlayerGuildSkill, 27) as PlayerGuildSkill[];
        }
        set guild(value: PlayerGuildSkill[]) {
            pb_1.Message.setRepeatedWrapperField(this, 27, value);
        }
        get soldierTechs(): SoldierTechSkill[] {
            return pb_1.Message.getRepeatedWrapperField(this, SoldierTechSkill, 28) as SoldierTechSkill[];
        }
        set soldierTechs(value: SoldierTechSkill[]) {
            pb_1.Message.setRepeatedWrapperField(this, 28, value);
        }
        get extralSkills(): Skill[] {
            return pb_1.Message.getRepeatedWrapperField(this, Skill, 29) as Skill[];
        }
        set extralSkills(value: Skill[]) {
            pb_1.Message.setRepeatedWrapperField(this, 29, value);
        }
        get collect(): Collect | undefined {
            return pb_1.Message.getWrapperField(this, Collect, 30) as Collect | undefined;
        }
        set collect(value: Collect) {
            pb_1.Message.setWrapperField(this, 30, value);
        }
        toObject() {
            return {
                id: this.id,
                name: this.name,
                level: this.level,
                avatar: this.avatar,
                avatarFrame: this.avatarFrame,
                msg: this.msg,
                vipLevel: this.vipLevel,
                power: this.power,
                guildName: this.guildName,
                serverId: this.serverId,
                formationType: this.formationType,
                isRobot: this.isRobot,
                counsellorId: this.counsellorId,
                battleCounsellors: this.battleCounsellors,
                battleCommanders: this.battleCommanders,
                battleNpcCommanders: this.battleNpcCommanders,
                treasureGroup: this.treasureGroup,
                treasureFatesInfo: this.treasureFatesInfo,
                treasures: this.treasures,
                pokedexInfo: this.pokedexInfo,
                strTalents: this.strTalents,
                guild: this.guild,
                soldierTechs: this.soldierTechs,
                extralSkills: this.extralSkills,
                collect: this.collect
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.id)
                writer.writeUint64String(1, this.id);
            if (this.name)
                writer.writeString(2, this.name);
            if (this.level)
                writer.writeUint32(3, this.level);
            if (this.avatar)
                writer.writeInt32(4, this.avatar);
            if (this.avatarFrame)
                writer.writeInt32(5, this.avatarFrame);
            if (this.msg)
                writer.writeString(6, this.msg);
            if (this.vipLevel)
                writer.writeUint32(7, this.vipLevel);
            if (this.power)
                writer.writeUint32(8, this.power);
            if (this.guildName)
                writer.writeString(9, this.guildName);
            if (this.serverId)
                writer.writeUint64String(10, this.serverId);
            if (this.formationType)
                writer.writeEnum(14, this.formationType);
            if (this.isRobot)
                writer.writeBool(15, this.isRobot);
            if (this.counsellorId)
                writer.writeInt32(16, this.counsellorId);
            if (this.battleCounsellors)
                writer.writeRepeatedMessage(17, this.battleCounsellors, (item: BattleCounsellor) => item.serialize(writer));
            if (this.battleCommanders)
                writer.writeRepeatedMessage(18, this.battleCommanders, (item: BattleCommander) => item.serialize(writer));
            if (this.battleNpcCommanders)
                writer.writeRepeatedMessage(19, this.battleNpcCommanders, (item: BattleNpcCommander) => item.serialize(writer));
            if (this.treasureGroup)
                writer.writeUint32(22, this.treasureGroup);
            if (this.treasureFatesInfo)
                writer.writeMessage(23, this.treasureFatesInfo, (item: TreasureFatesInfo) => item.serialize(writer));
            if (this.treasures)
                writer.writeRepeatedMessage(24, this.treasures, (item: Treasure) => item.serialize(writer));
            if (this.pokedexInfo)
                writer.writeMessage(25, this.pokedexInfo, (item: PokedexBattleInfo) => item.serialize(writer));
            if (this.strTalents)
                writer.writeRepeatedMessage(26, this.strTalents, (item: StrTalent) => item.serialize(writer));
            if (this.guild)
                writer.writeRepeatedMessage(27, this.guild, (item: PlayerGuildSkill) => item.serialize(writer));
            if (this.soldierTechs)
                writer.writeRepeatedMessage(28, this.soldierTechs, (item: SoldierTechSkill) => item.serialize(writer));
            if (this.extralSkills)
                writer.writeRepeatedMessage(29, this.extralSkills, (item: Skill) => item.serialize(writer));
            if (this.collect)
                writer.writeMessage(30, this.collect, (item: Collect) => item.serialize(writer));
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): BattlePlayerInfo {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new BattlePlayerInfo();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.id = reader.readUint64String();
                        break;
                    case 2:
                        message.name = reader.readString();
                        break;
                    case 3:
                        message.level = reader.readUint32();
                        break;
                    case 4:
                        message.avatar = reader.readInt32();
                        break;
                    case 5:
                        message.avatarFrame = reader.readInt32();
                        break;
                    case 6:
                        message.msg = reader.readString();
                        break;
                    case 7:
                        message.vipLevel = reader.readUint32();
                        break;
                    case 8:
                        message.power = reader.readUint32();
                        break;
                    case 9:
                        message.guildName = reader.readString();
                        break;
                    case 10:
                        message.serverId = reader.readUint64String();
                        break;
                    case 14:
                        message.formationType = reader.readEnum();
                        break;
                    case 15:
                        message.isRobot = reader.readBool();
                        break;
                    case 16:
                        message.counsellorId = reader.readInt32();
                        break;
                    case 17:
                        reader.readMessage(message.battleCounsellors, () => pb_1.Message.addToRepeatedWrapperField(message, 17, BattleCounsellor.deserialize(reader), BattleCounsellor));
                        break;
                    case 18:
                        reader.readMessage(message.battleCommanders, () => pb_1.Message.addToRepeatedWrapperField(message, 18, BattleCommander.deserialize(reader), BattleCommander));
                        break;
                    case 19:
                        reader.readMessage(message.battleNpcCommanders, () => pb_1.Message.addToRepeatedWrapperField(message, 19, BattleNpcCommander.deserialize(reader), BattleNpcCommander));
                        break;
                    case 22:
                        message.treasureGroup = reader.readUint32();
                        break;
                    case 23:
                        reader.readMessage(message.treasureFatesInfo, () => message.treasureFatesInfo = TreasureFatesInfo.deserialize(reader));
                        break;
                    case 24:
                        reader.readMessage(message.treasures, () => pb_1.Message.addToRepeatedWrapperField(message, 24, Treasure.deserialize(reader), Treasure));
                        break;
                    case 25:
                        reader.readMessage(message.pokedexInfo, () => message.pokedexInfo = PokedexBattleInfo.deserialize(reader));
                        break;
                    case 26:
                        reader.readMessage(message.strTalents, () => pb_1.Message.addToRepeatedWrapperField(message, 26, StrTalent.deserialize(reader), StrTalent));
                        break;
                    case 27:
                        reader.readMessage(message.guild, () => pb_1.Message.addToRepeatedWrapperField(message, 27, PlayerGuildSkill.deserialize(reader), PlayerGuildSkill));
                        break;
                    case 28:
                        reader.readMessage(message.soldierTechs, () => pb_1.Message.addToRepeatedWrapperField(message, 28, SoldierTechSkill.deserialize(reader), SoldierTechSkill));
                        break;
                    case 29:
                        reader.readMessage(message.extralSkills, () => pb_1.Message.addToRepeatedWrapperField(message, 29, Skill.deserialize(reader), Skill));
                        break;
                    case 30:
                        reader.readMessage(message.collect, () => message.collect = Collect.deserialize(reader));
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class BattleStartInfo extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [10], null);
        }
        get id(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as string | undefined;
        }
        set id(value: string) {
            pb_1.Message.setField(this, 1, value);
        }
        get typeId(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as number | undefined;
        }
        set typeId(value: number) {
            pb_1.Message.setField(this, 2, value);
        }
        get stageId(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 3, undefined) as number | undefined;
        }
        set stageId(value: number) {
            pb_1.Message.setField(this, 3, value);
        }
        get beginTime(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 4, undefined) as string | undefined;
        }
        set beginTime(value: string) {
            pb_1.Message.setField(this, 4, value);
        }
        get randomSeed(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 5, undefined) as number | undefined;
        }
        set randomSeed(value: number) {
            pb_1.Message.setField(this, 5, value);
        }
        get speed(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 6, undefined) as number | undefined;
        }
        set speed(value: number) {
            pb_1.Message.setField(this, 6, value);
        }
        get fighter(): BattlePlayerInfo[] {
            return pb_1.Message.getRepeatedWrapperField(this, BattlePlayerInfo, 10) as BattlePlayerInfo[];
        }
        set fighter(value: BattlePlayerInfo[]) {
            pb_1.Message.setRepeatedWrapperField(this, 10, value);
        }
        get ver(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 200, undefined) as string | undefined;
        }
        set ver(value: string) {
            pb_1.Message.setField(this, 200, value);
        }
        toObject() {
            return {
                id: this.id,
                typeId: this.typeId,
                stageId: this.stageId,
                beginTime: this.beginTime,
                randomSeed: this.randomSeed,
                speed: this.speed,
                fighter: this.fighter,
                ver: this.ver
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.id)
                writer.writeUint64String(1, this.id);
            if (this.typeId)
                writer.writeInt32(2, this.typeId);
            if (this.stageId)
                writer.writeInt32(3, this.stageId);
            if (this.beginTime)
                writer.writeInt64String(4, this.beginTime);
            if (this.randomSeed)
                writer.writeInt32(5, this.randomSeed);
            if (this.speed)
                writer.writeInt32(6, this.speed);
            if (this.fighter)
                writer.writeRepeatedMessage(10, this.fighter, (item: BattlePlayerInfo) => item.serialize(writer));
            if (this.ver)
                writer.writeString(200, this.ver);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): BattleStartInfo {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new BattleStartInfo();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.id = reader.readUint64String();
                        break;
                    case 2:
                        message.typeId = reader.readInt32();
                        break;
                    case 3:
                        message.stageId = reader.readInt32();
                        break;
                    case 4:
                        message.beginTime = reader.readInt64String();
                        break;
                    case 5:
                        message.randomSeed = reader.readInt32();
                        break;
                    case 6:
                        message.speed = reader.readInt32();
                        break;
                    case 10:
                        reader.readMessage(message.fighter, () => pb_1.Message.addToRepeatedWrapperField(message, 10, BattlePlayerInfo.deserialize(reader), BattlePlayerInfo));
                        break;
                    case 200:
                        message.ver = reader.readString();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class BattlePlayerInput extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [], null);
        }
        get id(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as string | undefined;
        }
        set id(value: string) {
            pb_1.Message.setField(this, 1, value);
        }
        get sid(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as number | undefined;
        }
        set sid(value: number) {
            pb_1.Message.setField(this, 2, value);
        }
        get x(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 3, undefined) as number | undefined;
        }
        set x(value: number) {
            pb_1.Message.setField(this, 3, value);
        }
        get y(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 4, undefined) as number | undefined;
        }
        set y(value: number) {
            pb_1.Message.setField(this, 4, value);
        }
        toObject() {
            return {
                id: this.id,
                sid: this.sid,
                x: this.x,
                y: this.y
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.id)
                writer.writeUint64String(1, this.id);
            if (this.sid)
                writer.writeInt32(2, this.sid);
            if (this.x)
                writer.writeInt32(3, this.x);
            if (this.y)
                writer.writeInt32(4, this.y);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): BattlePlayerInput {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new BattlePlayerInput();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.id = reader.readUint64String();
                        break;
                    case 2:
                        message.sid = reader.readInt32();
                        break;
                    case 3:
                        message.x = reader.readInt32();
                        break;
                    case 4:
                        message.y = reader.readInt32();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class BattleFrameData extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [2], null);
        }
        get frameId(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as number | undefined;
        }
        set frameId(value: number) {
            pb_1.Message.setField(this, 1, value);
        }
        get input(): BattlePlayerInput[] {
            return pb_1.Message.getRepeatedWrapperField(this, BattlePlayerInput, 2) as BattlePlayerInput[];
        }
        set input(value: BattlePlayerInput[]) {
            pb_1.Message.setRepeatedWrapperField(this, 2, value);
        }
        toObject() {
            return {
                frameId: this.frameId,
                input: this.input
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.frameId)
                writer.writeUint32(1, this.frameId);
            if (this.input)
                writer.writeRepeatedMessage(2, this.input, (item: BattlePlayerInput) => item.serialize(writer));
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): BattleFrameData {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new BattleFrameData();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.frameId = reader.readUint32();
                        break;
                    case 2:
                        reader.readMessage(message.input, () => pb_1.Message.addToRepeatedWrapperField(message, 2, BattlePlayerInput.deserialize(reader), BattlePlayerInput));
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class BattleResultCommander extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [1, 2], null);
        }
        get player(): BattleCommander[] {
            return pb_1.Message.getRepeatedWrapperField(this, BattleCommander, 1) as BattleCommander[];
        }
        set player(value: BattleCommander[]) {
            pb_1.Message.setRepeatedWrapperField(this, 1, value);
        }
        get target(): BattleCommander[] {
            return pb_1.Message.getRepeatedWrapperField(this, BattleCommander, 2) as BattleCommander[];
        }
        set target(value: BattleCommander[]) {
            pb_1.Message.setRepeatedWrapperField(this, 2, value);
        }
        toObject() {
            return {
                player: this.player,
                target: this.target
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.player)
                writer.writeRepeatedMessage(1, this.player, (item: BattleCommander) => item.serialize(writer));
            if (this.target)
                writer.writeRepeatedMessage(2, this.target, (item: BattleCommander) => item.serialize(writer));
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): BattleResultCommander {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new BattleResultCommander();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        reader.readMessage(message.player, () => pb_1.Message.addToRepeatedWrapperField(message, 1, BattleCommander.deserialize(reader), BattleCommander));
                        break;
                    case 2:
                        reader.readMessage(message.target, () => pb_1.Message.addToRepeatedWrapperField(message, 2, BattleCommander.deserialize(reader), BattleCommander));
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class BattleResultInfo extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [10], null);
        }
        get id(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as string | undefined;
        }
        set id(value: string) {
            pb_1.Message.setField(this, 1, value);
        }
        get win(): boolean | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as boolean | undefined;
        }
        set win(value: boolean) {
            pb_1.Message.setField(this, 2, value);
        }
        get star(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 3, undefined) as number | undefined;
        }
        set star(value: number) {
            pb_1.Message.setField(this, 3, value);
        }
        get totalTime(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 4, undefined) as number | undefined;
        }
        set totalTime(value: number) {
            pb_1.Message.setField(this, 4, value);
        }
        get commanderDieNum(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 5, undefined) as number | undefined;
        }
        set commanderDieNum(value: number) {
            pb_1.Message.setField(this, 5, value);
        }
        get targetCommanderDieNum(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 6, undefined) as number | undefined;
        }
        set targetCommanderDieNum(value: number) {
            pb_1.Message.setField(this, 6, value);
        }
        get frames(): BattleFrameData[] {
            return pb_1.Message.getRepeatedWrapperField(this, BattleFrameData, 10) as BattleFrameData[];
        }
        set frames(value: BattleFrameData[]) {
            pb_1.Message.setRepeatedWrapperField(this, 10, value);
        }
        get commander(): BattleResultCommander | undefined {
            return pb_1.Message.getWrapperField(this, BattleResultCommander, 11) as BattleResultCommander | undefined;
        }
        set commander(value: BattleResultCommander) {
            pb_1.Message.setWrapperField(this, 11, value);
        }
        get dailyBoss(): BattleDailyBoss | undefined {
            return pb_1.Message.getWrapperField(this, BattleDailyBoss, 12) as BattleDailyBoss | undefined;
        }
        set dailyBoss(value: BattleDailyBoss) {
            pb_1.Message.setWrapperField(this, 12, value);
        }
        get dailyExp(): BattleDailyExp | undefined {
            return pb_1.Message.getWrapperField(this, BattleDailyExp, 13) as BattleDailyExp | undefined;
        }
        set dailyExp(value: BattleDailyExp) {
            pb_1.Message.setWrapperField(this, 13, value);
        }
        get dailyCoin(): BattleDailyCoin | undefined {
            return pb_1.Message.getWrapperField(this, BattleDailyCoin, 14) as BattleDailyCoin | undefined;
        }
        set dailyCoin(value: BattleDailyCoin) {
            pb_1.Message.setWrapperField(this, 14, value);
        }
        toObject() {
            return {
                id: this.id,
                win: this.win,
                star: this.star,
                totalTime: this.totalTime,
                commanderDieNum: this.commanderDieNum,
                targetCommanderDieNum: this.targetCommanderDieNum,
                frames: this.frames,
                commander: this.commander,
                dailyBoss: this.dailyBoss,
                dailyExp: this.dailyExp,
                dailyCoin: this.dailyCoin
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.id)
                writer.writeUint64String(1, this.id);
            if (this.win)
                writer.writeBool(2, this.win);
            if (this.star)
                writer.writeInt32(3, this.star);
            if (this.totalTime)
                writer.writeUint32(4, this.totalTime);
            if (this.commanderDieNum)
                writer.writeUint32(5, this.commanderDieNum);
            if (this.targetCommanderDieNum)
                writer.writeUint32(6, this.targetCommanderDieNum);
            if (this.frames)
                writer.writeRepeatedMessage(10, this.frames, (item: BattleFrameData) => item.serialize(writer));
            if (this.commander)
                writer.writeMessage(11, this.commander, (item: BattleResultCommander) => item.serialize(writer));
            if (this.dailyBoss)
                writer.writeMessage(12, this.dailyBoss, (item: BattleDailyBoss) => item.serialize(writer));
            if (this.dailyExp)
                writer.writeMessage(13, this.dailyExp, (item: BattleDailyExp) => item.serialize(writer));
            if (this.dailyCoin)
                writer.writeMessage(14, this.dailyCoin, (item: BattleDailyCoin) => item.serialize(writer));
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): BattleResultInfo {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new BattleResultInfo();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.id = reader.readUint64String();
                        break;
                    case 2:
                        message.win = reader.readBool();
                        break;
                    case 3:
                        message.star = reader.readInt32();
                        break;
                    case 4:
                        message.totalTime = reader.readUint32();
                        break;
                    case 5:
                        message.commanderDieNum = reader.readUint32();
                        break;
                    case 6:
                        message.targetCommanderDieNum = reader.readUint32();
                        break;
                    case 10:
                        reader.readMessage(message.frames, () => pb_1.Message.addToRepeatedWrapperField(message, 10, BattleFrameData.deserialize(reader), BattleFrameData));
                        break;
                    case 11:
                        reader.readMessage(message.commander, () => message.commander = BattleResultCommander.deserialize(reader));
                        break;
                    case 12:
                        reader.readMessage(message.dailyBoss, () => message.dailyBoss = BattleDailyBoss.deserialize(reader));
                        break;
                    case 13:
                        reader.readMessage(message.dailyExp, () => message.dailyExp = BattleDailyExp.deserialize(reader));
                        break;
                    case 14:
                        reader.readMessage(message.dailyCoin, () => message.dailyCoin = BattleDailyCoin.deserialize(reader));
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class BattleReplay extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [11], null);
        }
        get info(): BattleStartInfo | undefined {
            return pb_1.Message.getWrapperField(this, BattleStartInfo, 10) as BattleStartInfo | undefined;
        }
        set info(value: BattleStartInfo) {
            pb_1.Message.setWrapperField(this, 10, value);
        }
        get frames(): BattleFrameData[] {
            return pb_1.Message.getRepeatedWrapperField(this, BattleFrameData, 11) as BattleFrameData[];
        }
        set frames(value: BattleFrameData[]) {
            pb_1.Message.setRepeatedWrapperField(this, 11, value);
        }
        get error(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 12, undefined) as string | undefined;
        }
        set error(value: string) {
            pb_1.Message.setField(this, 12, value);
        }
        toObject() {
            return {
                info: this.info,
                frames: this.frames,
                error: this.error
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.info)
                writer.writeMessage(10, this.info, (item: BattleStartInfo) => item.serialize(writer));
            if (this.frames)
                writer.writeRepeatedMessage(11, this.frames, (item: BattleFrameData) => item.serialize(writer));
            if (this.error)
                writer.writeString(12, this.error);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): BattleReplay {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new BattleReplay();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 10:
                        reader.readMessage(message.info, () => message.info = BattleStartInfo.deserialize(reader));
                        break;
                    case 11:
                        reader.readMessage(message.frames, () => pb_1.Message.addToRepeatedWrapperField(message, 11, BattleFrameData.deserialize(reader), BattleFrameData));
                        break;
                    case 12:
                        message.error = reader.readString();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class SlayCommander extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [], null);
        }
        get level(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as number | undefined;
        }
        set level(value: number) {
            pb_1.Message.setField(this, 2, value);
        }
        get hp(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 3, undefined) as number | undefined;
        }
        set hp(value: number) {
            pb_1.Message.setField(this, 3, value);
        }
        get commander(): Commander | undefined {
            return pb_1.Message.getWrapperField(this, Commander, 4) as Commander | undefined;
        }
        set commander(value: Commander) {
            pb_1.Message.setWrapperField(this, 4, value);
        }
        toObject() {
            return {
                level: this.level,
                hp: this.hp,
                commander: this.commander
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.level)
                writer.writeInt32(2, this.level);
            if (this.hp)
                writer.writeInt32(3, this.hp);
            if (this.commander)
                writer.writeMessage(4, this.commander, (item: Commander) => item.serialize(writer));
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): SlayCommander {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new SlayCommander();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 2:
                        message.level = reader.readInt32();
                        break;
                    case 3:
                        message.hp = reader.readInt32();
                        break;
                    case 4:
                        reader.readMessage(message.commander, () => message.commander = Commander.deserialize(reader));
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class SlayCity extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [], null);
        }
        get id(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as number | undefined;
        }
        set id(value: number) {
            pb_1.Message.setField(this, 1, value);
        }
        get powerId(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as number | undefined;
        }
        set powerId(value: number) {
            pb_1.Message.setField(this, 2, value);
        }
        get taxPer(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 5, undefined) as number | undefined;
        }
        set taxPer(value: number) {
            pb_1.Message.setField(this, 5, value);
        }
        get fightPower(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 6, undefined) as number | undefined;
        }
        set fightPower(value: number) {
            pb_1.Message.setField(this, 6, value);
        }
        toObject() {
            return {
                id: this.id,
                powerId: this.powerId,
                taxPer: this.taxPer,
                fightPower: this.fightPower
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.id)
                writer.writeInt32(1, this.id);
            if (this.powerId)
                writer.writeInt32(2, this.powerId);
            if (this.taxPer)
                writer.writeInt32(5, this.taxPer);
            if (this.fightPower)
                writer.writeUint32(6, this.fightPower);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): SlayCity {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new SlayCity();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.id = reader.readInt32();
                        break;
                    case 2:
                        message.powerId = reader.readInt32();
                        break;
                    case 5:
                        message.taxPer = reader.readInt32();
                        break;
                    case 6:
                        message.fightPower = reader.readUint32();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class SlayPlayerCommander extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [], null);
        }
        get id(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as number | undefined;
        }
        set id(value: number) {
            pb_1.Message.setField(this, 1, value);
        }
        get strength(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as number | undefined;
        }
        set strength(value: number) {
            pb_1.Message.setField(this, 2, value);
        }
        get hp(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 3, undefined) as number | undefined;
        }
        set hp(value: number) {
            pb_1.Message.setField(this, 3, value);
        }
        toObject() {
            return {
                id: this.id,
                strength: this.strength,
                hp: this.hp
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.id)
                writer.writeInt32(1, this.id);
            if (this.strength)
                writer.writeInt32(2, this.strength);
            if (this.hp)
                writer.writeInt32(3, this.hp);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): SlayPlayerCommander {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new SlayPlayerCommander();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.id = reader.readInt32();
                        break;
                    case 2:
                        message.strength = reader.readInt32();
                        break;
                    case 3:
                        message.hp = reader.readInt32();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class SlayPower extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [], null);
        }
        get id(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as number | undefined;
        }
        set id(value: number) {
            pb_1.Message.setField(this, 1, value);
        }
        get gold(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as number | undefined;
        }
        set gold(value: number) {
            pb_1.Message.setField(this, 2, value);
        }
        toObject() {
            return {
                id: this.id,
                gold: this.gold
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.id)
                writer.writeInt32(1, this.id);
            if (this.gold)
                writer.writeInt32(2, this.gold);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): SlayPower {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new SlayPower();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.id = reader.readInt32();
                        break;
                    case 2:
                        message.gold = reader.readInt32();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class SlayAttack extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [], null);
        }
        get attackCityId(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as number | undefined;
        }
        set attackCityId(value: number) {
            pb_1.Message.setField(this, 1, value);
        }
        get defendCityId(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as number | undefined;
        }
        set defendCityId(value: number) {
            pb_1.Message.setField(this, 2, value);
        }
        toObject() {
            return {
                attackCityId: this.attackCityId,
                defendCityId: this.defendCityId
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.attackCityId)
                writer.writeInt32(1, this.attackCityId);
            if (this.defendCityId)
                writer.writeInt32(2, this.defendCityId);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): SlayAttack {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new SlayAttack();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.attackCityId = reader.readInt32();
                        break;
                    case 2:
                        message.defendCityId = reader.readInt32();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class SlaySilkBuy extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [], null);
        }
        get silkId(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as number | undefined;
        }
        set silkId(value: number) {
            pb_1.Message.setField(this, 1, value);
        }
        get bought(): boolean | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as boolean | undefined;
        }
        set bought(value: boolean) {
            pb_1.Message.setField(this, 2, value);
        }
        toObject() {
            return {
                silkId: this.silkId,
                bought: this.bought
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.silkId)
                writer.writeInt32(1, this.silkId);
            if (this.bought)
                writer.writeBool(2, this.bought);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): SlaySilkBuy {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new SlaySilkBuy();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.silkId = reader.readInt32();
                        break;
                    case 2:
                        message.bought = reader.readBool();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class SilkBag extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [1], null);
        }
        get items(): number[] {
            return pb_1.Message.getField(this, 1) as number[];
        }
        set items(value: number[]) {
            pb_1.Message.setField(this, 1, value);
        }
        toObject() {
            return {
                items: this.items
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.items)
                writer.writeRepeatedInt32(1, this.items);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): SilkBag {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new SilkBag();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.items.push(reader.readInt32());
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class SlayEvent extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [], null);
        }
        get eventId(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as number | undefined;
        }
        set eventId(value: number) {
            pb_1.Message.setField(this, 1, value);
        }
        get cityId(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as number | undefined;
        }
        set cityId(value: number) {
            pb_1.Message.setField(this, 2, value);
        }
        get powerId(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 3, undefined) as number | undefined;
        }
        set powerId(value: number) {
            pb_1.Message.setField(this, 3, value);
        }
        toObject() {
            return {
                eventId: this.eventId,
                cityId: this.cityId,
                powerId: this.powerId
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.eventId)
                writer.writeInt32(1, this.eventId);
            if (this.cityId)
                writer.writeInt32(2, this.cityId);
            if (this.powerId)
                writer.writeInt32(3, this.powerId);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): SlayEvent {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new SlayEvent();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.eventId = reader.readInt32();
                        break;
                    case 2:
                        message.cityId = reader.readInt32();
                        break;
                    case 3:
                        message.powerId = reader.readInt32();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class SlayFightReport extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [], null);
        }
        get typ(): SlayFightReportType | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as SlayFightReportType | undefined;
        }
        set typ(value: SlayFightReportType) {
            pb_1.Message.setField(this, 1, value);
        }
        get actionPower(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as number | undefined;
        }
        set actionPower(value: number) {
            pb_1.Message.setField(this, 2, value);
        }
        get defendPower(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 3, undefined) as number | undefined;
        }
        set defendPower(value: number) {
            pb_1.Message.setField(this, 3, value);
        }
        get city(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 4, undefined) as number | undefined;
        }
        set city(value: number) {
            pb_1.Message.setField(this, 4, value);
        }
        get teamNum(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 5, undefined) as number | undefined;
        }
        set teamNum(value: number) {
            pb_1.Message.setField(this, 5, value);
        }
        get level(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 6, undefined) as number | undefined;
        }
        set level(value: number) {
            pb_1.Message.setField(this, 6, value);
        }
        toObject() {
            return {
                typ: this.typ,
                actionPower: this.actionPower,
                defendPower: this.defendPower,
                city: this.city,
                teamNum: this.teamNum,
                level: this.level
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.typ)
                writer.writeEnum(1, this.typ);
            if (this.actionPower)
                writer.writeInt32(2, this.actionPower);
            if (this.defendPower)
                writer.writeInt32(3, this.defendPower);
            if (this.city)
                writer.writeInt32(4, this.city);
            if (this.teamNum)
                writer.writeInt32(5, this.teamNum);
            if (this.level)
                writer.writeInt32(6, this.level);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): SlayFightReport {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new SlayFightReport();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.typ = reader.readEnum();
                        break;
                    case 2:
                        message.actionPower = reader.readInt32();
                        break;
                    case 3:
                        message.defendPower = reader.readInt32();
                        break;
                    case 4:
                        message.city = reader.readInt32();
                        break;
                    case 5:
                        message.teamNum = reader.readInt32();
                        break;
                    case 6:
                        message.level = reader.readInt32();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class SlayRoundReport extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [2], null);
        }
        get round(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as number | undefined;
        }
        set round(value: number) {
            pb_1.Message.setField(this, 1, value);
        }
        get reports(): SlayFightReport[] {
            return pb_1.Message.getRepeatedWrapperField(this, SlayFightReport, 2) as SlayFightReport[];
        }
        set reports(value: SlayFightReport[]) {
            pb_1.Message.setRepeatedWrapperField(this, 2, value);
        }
        toObject() {
            return {
                round: this.round,
                reports: this.reports
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.round)
                writer.writeInt32(1, this.round);
            if (this.reports)
                writer.writeRepeatedMessage(2, this.reports, (item: SlayFightReport) => item.serialize(writer));
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): SlayRoundReport {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new SlayRoundReport();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.round = reader.readInt32();
                        break;
                    case 2:
                        reader.readMessage(message.reports, () => pb_1.Message.addToRepeatedWrapperField(message, 2, SlayFightReport.deserialize(reader), SlayFightReport));
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class TaskCell extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [], null);
        }
        get id(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as number | undefined;
        }
        set id(value: number) {
            pb_1.Message.setField(this, 1, value);
        }
        get progress(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as number | undefined;
        }
        set progress(value: number) {
            pb_1.Message.setField(this, 2, value);
        }
        toObject() {
            return {
                id: this.id,
                progress: this.progress
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.id)
                writer.writeInt32(1, this.id);
            if (this.progress)
                writer.writeUint32(2, this.progress);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): TaskCell {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new TaskCell();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.id = reader.readInt32();
                        break;
                    case 2:
                        message.progress = reader.readUint32();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class DailyBoss extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [1], null);
        }
        get bossDatas(): DailyBossData[] {
            return pb_1.Message.getRepeatedWrapperField(this, DailyBossData, 1) as DailyBossData[];
        }
        set bossDatas(value: DailyBossData[]) {
            pb_1.Message.setRepeatedWrapperField(this, 1, value);
        }
        toObject() {
            return {
                bossDatas: this.bossDatas
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.bossDatas)
                writer.writeRepeatedMessage(1, this.bossDatas, (item: DailyBossData) => item.serialize(writer));
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): DailyBoss {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new DailyBoss();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        reader.readMessage(message.bossDatas, () => pb_1.Message.addToRepeatedWrapperField(message, 1, DailyBossData.deserialize(reader), DailyBossData));
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class DailyBossData extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [2], null);
        }
        get bossId(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as number | undefined;
        }
        set bossId(value: number) {
            pb_1.Message.setField(this, 1, value);
        }
        get firstKillAwards(): boolean[] {
            return pb_1.Message.getField(this, 2) as boolean[];
        }
        set firstKillAwards(value: boolean[]) {
            pb_1.Message.setField(this, 2, value);
        }
        get challengedTime(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 3, undefined) as number | undefined;
        }
        set challengedTime(value: number) {
            pb_1.Message.setField(this, 3, value);
        }
        get bestLevel(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 4, undefined) as number | undefined;
        }
        set bestLevel(value: number) {
            pb_1.Message.setField(this, 4, value);
        }
        get bestTime(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 5, undefined) as number | undefined;
        }
        set bestTime(value: number) {
            pb_1.Message.setField(this, 5, value);
        }
        get unlockLevel(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 6, undefined) as number | undefined;
        }
        set unlockLevel(value: number) {
            pb_1.Message.setField(this, 6, value);
        }
        get bestDamage(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 7, undefined) as number | undefined;
        }
        set bestDamage(value: number) {
            pb_1.Message.setField(this, 7, value);
        }
        toObject() {
            return {
                bossId: this.bossId,
                firstKillAwards: this.firstKillAwards,
                challengedTime: this.challengedTime,
                bestLevel: this.bestLevel,
                bestTime: this.bestTime,
                unlockLevel: this.unlockLevel,
                bestDamage: this.bestDamage
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.bossId)
                writer.writeInt32(1, this.bossId);
            if (this.firstKillAwards)
                writer.writeRepeatedBool(2, this.firstKillAwards);
            if (this.challengedTime)
                writer.writeUint32(3, this.challengedTime);
            if (this.bestLevel)
                writer.writeInt32(4, this.bestLevel);
            if (this.bestTime)
                writer.writeUint32(5, this.bestTime);
            if (this.unlockLevel)
                writer.writeInt32(6, this.unlockLevel);
            if (this.bestDamage)
                writer.writeUint32(7, this.bestDamage);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): DailyBossData {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new DailyBossData();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.bossId = reader.readInt32();
                        break;
                    case 2:
                        message.firstKillAwards.push(reader.readBool());
                        break;
                    case 3:
                        message.challengedTime = reader.readUint32();
                        break;
                    case 4:
                        message.bestLevel = reader.readInt32();
                        break;
                    case 5:
                        message.bestTime = reader.readUint32();
                        break;
                    case 6:
                        message.unlockLevel = reader.readInt32();
                        break;
                    case 7:
                        message.bestDamage = reader.readUint32();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class DailyExp extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [7], null);
        }
        get challengedTime(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as number | undefined;
        }
        set challengedTime(value: number) {
            pb_1.Message.setField(this, 1, value);
        }
        get dayKillNum(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as number | undefined;
        }
        set dayKillNum(value: number) {
            pb_1.Message.setField(this, 2, value);
        }
        get weekKillNum(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 3, undefined) as number | undefined;
        }
        set weekKillNum(value: number) {
            pb_1.Message.setField(this, 3, value);
        }
        get bestKillNum(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 4, undefined) as number | undefined;
        }
        set bestKillNum(value: number) {
            pb_1.Message.setField(this, 4, value);
        }
        get lastChallengePower(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 5, undefined) as number | undefined;
        }
        set lastChallengePower(value: number) {
            pb_1.Message.setField(this, 5, value);
        }
        get bestOutputPower(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 6, undefined) as number | undefined;
        }
        set bestOutputPower(value: number) {
            pb_1.Message.setField(this, 6, value);
        }
        get dayAwardTakenRecords(): number[] {
            return pb_1.Message.getField(this, 7) as number[];
        }
        set dayAwardTakenRecords(value: number[]) {
            pb_1.Message.setField(this, 7, value);
        }
        toObject() {
            return {
                challengedTime: this.challengedTime,
                dayKillNum: this.dayKillNum,
                weekKillNum: this.weekKillNum,
                bestKillNum: this.bestKillNum,
                lastChallengePower: this.lastChallengePower,
                bestOutputPower: this.bestOutputPower,
                dayAwardTakenRecords: this.dayAwardTakenRecords
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.challengedTime)
                writer.writeUint32(1, this.challengedTime);
            if (this.dayKillNum)
                writer.writeUint32(2, this.dayKillNum);
            if (this.weekKillNum)
                writer.writeUint32(3, this.weekKillNum);
            if (this.bestKillNum)
                writer.writeUint32(4, this.bestKillNum);
            if (this.lastChallengePower)
                writer.writeUint32(5, this.lastChallengePower);
            if (this.bestOutputPower)
                writer.writeUint32(6, this.bestOutputPower);
            if (this.dayAwardTakenRecords)
                writer.writeRepeatedInt32(7, this.dayAwardTakenRecords);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): DailyExp {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new DailyExp();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.challengedTime = reader.readUint32();
                        break;
                    case 2:
                        message.dayKillNum = reader.readUint32();
                        break;
                    case 3:
                        message.weekKillNum = reader.readUint32();
                        break;
                    case 4:
                        message.bestKillNum = reader.readUint32();
                        break;
                    case 5:
                        message.lastChallengePower = reader.readUint32();
                        break;
                    case 6:
                        message.bestOutputPower = reader.readUint32();
                        break;
                    case 7:
                        message.dayAwardTakenRecords.push(reader.readInt32());
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class DailyCoin extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [7], null);
        }
        get challengedTime(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as number | undefined;
        }
        set challengedTime(value: number) {
            pb_1.Message.setField(this, 1, value);
        }
        get dayDamage(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as number | undefined;
        }
        set dayDamage(value: number) {
            pb_1.Message.setField(this, 2, value);
        }
        get weekDamage(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 3, undefined) as number | undefined;
        }
        set weekDamage(value: number) {
            pb_1.Message.setField(this, 3, value);
        }
        get bestDamage(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 4, undefined) as number | undefined;
        }
        set bestDamage(value: number) {
            pb_1.Message.setField(this, 4, value);
        }
        get lastChallengePower(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 5, undefined) as number | undefined;
        }
        set lastChallengePower(value: number) {
            pb_1.Message.setField(this, 5, value);
        }
        get bestOutputPower(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 6, undefined) as number | undefined;
        }
        set bestOutputPower(value: number) {
            pb_1.Message.setField(this, 6, value);
        }
        get dayAwardTakenRecords(): number[] {
            return pb_1.Message.getField(this, 7) as number[];
        }
        set dayAwardTakenRecords(value: number[]) {
            pb_1.Message.setField(this, 7, value);
        }
        toObject() {
            return {
                challengedTime: this.challengedTime,
                dayDamage: this.dayDamage,
                weekDamage: this.weekDamage,
                bestDamage: this.bestDamage,
                lastChallengePower: this.lastChallengePower,
                bestOutputPower: this.bestOutputPower,
                dayAwardTakenRecords: this.dayAwardTakenRecords
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.challengedTime)
                writer.writeUint32(1, this.challengedTime);
            if (this.dayDamage)
                writer.writeUint32(2, this.dayDamage);
            if (this.weekDamage)
                writer.writeUint32(3, this.weekDamage);
            if (this.bestDamage)
                writer.writeUint32(4, this.bestDamage);
            if (this.lastChallengePower)
                writer.writeUint32(5, this.lastChallengePower);
            if (this.bestOutputPower)
                writer.writeUint32(6, this.bestOutputPower);
            if (this.dayAwardTakenRecords)
                writer.writeRepeatedInt32(7, this.dayAwardTakenRecords);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): DailyCoin {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new DailyCoin();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.challengedTime = reader.readUint32();
                        break;
                    case 2:
                        message.dayDamage = reader.readUint32();
                        break;
                    case 3:
                        message.weekDamage = reader.readUint32();
                        break;
                    case 4:
                        message.bestDamage = reader.readUint32();
                        break;
                    case 5:
                        message.lastChallengePower = reader.readUint32();
                        break;
                    case 6:
                        message.bestOutputPower = reader.readUint32();
                        break;
                    case 7:
                        message.dayAwardTakenRecords.push(reader.readInt32());
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class StrMansion extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [1], null);
        }
        get talents(): StrTalent[] {
            return pb_1.Message.getRepeatedWrapperField(this, StrTalent, 1) as StrTalent[];
        }
        set talents(value: StrTalent[]) {
            pb_1.Message.setRepeatedWrapperField(this, 1, value);
        }
        get power(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as number | undefined;
        }
        set power(value: number) {
            pb_1.Message.setField(this, 2, value);
        }
        toObject() {
            return {
                talents: this.talents,
                power: this.power
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.talents)
                writer.writeRepeatedMessage(1, this.talents, (item: StrTalent) => item.serialize(writer));
            if (this.power)
                writer.writeUint32(2, this.power);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): StrMansion {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new StrMansion();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        reader.readMessage(message.talents, () => pb_1.Message.addToRepeatedWrapperField(message, 1, StrTalent.deserialize(reader), StrTalent));
                        break;
                    case 2:
                        message.power = reader.readUint32();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class StrTalent extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [], null);
        }
        get id(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as number | undefined;
        }
        set id(value: number) {
            pb_1.Message.setField(this, 1, value);
        }
        get level(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as number | undefined;
        }
        set level(value: number) {
            pb_1.Message.setField(this, 2, value);
        }
        toObject() {
            return {
                id: this.id,
                level: this.level
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.id)
                writer.writeInt32(1, this.id);
            if (this.level)
                writer.writeUint32(2, this.level);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): StrTalent {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new StrTalent();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.id = reader.readInt32();
                        break;
                    case 2:
                        message.level = reader.readUint32();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class Pokedex extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [1, 2, 4], null);
        }
        get pokedexDatas(): PokedexData[] {
            return pb_1.Message.getRepeatedWrapperField(this, PokedexData, 1) as PokedexData[];
        }
        set pokedexDatas(value: PokedexData[]) {
            pb_1.Message.setRepeatedWrapperField(this, 1, value);
        }
        get formationDatas(): PokedexFormationData[] {
            return pb_1.Message.getRepeatedWrapperField(this, PokedexFormationData, 2) as PokedexFormationData[];
        }
        set formationDatas(value: PokedexFormationData[]) {
            pb_1.Message.setRepeatedWrapperField(this, 2, value);
        }
        get curFormationId(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 3, undefined) as number | undefined;
        }
        set curFormationId(value: number) {
            pb_1.Message.setField(this, 3, value);
        }
        get fmtPowers(): PokedexFmtPower[] {
            return pb_1.Message.getRepeatedWrapperField(this, PokedexFmtPower, 4) as PokedexFmtPower[];
        }
        set fmtPowers(value: PokedexFmtPower[]) {
            pb_1.Message.setRepeatedWrapperField(this, 4, value);
        }
        toObject() {
            return {
                pokedexDatas: this.pokedexDatas,
                formationDatas: this.formationDatas,
                curFormationId: this.curFormationId,
                fmtPowers: this.fmtPowers
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.pokedexDatas)
                writer.writeRepeatedMessage(1, this.pokedexDatas, (item: PokedexData) => item.serialize(writer));
            if (this.formationDatas)
                writer.writeRepeatedMessage(2, this.formationDatas, (item: PokedexFormationData) => item.serialize(writer));
            if (this.curFormationId)
                writer.writeInt32(3, this.curFormationId);
            if (this.fmtPowers)
                writer.writeRepeatedMessage(4, this.fmtPowers, (item: PokedexFmtPower) => item.serialize(writer));
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): Pokedex {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new Pokedex();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        reader.readMessage(message.pokedexDatas, () => pb_1.Message.addToRepeatedWrapperField(message, 1, PokedexData.deserialize(reader), PokedexData));
                        break;
                    case 2:
                        reader.readMessage(message.formationDatas, () => pb_1.Message.addToRepeatedWrapperField(message, 2, PokedexFormationData.deserialize(reader), PokedexFormationData));
                        break;
                    case 3:
                        message.curFormationId = reader.readInt32();
                        break;
                    case 4:
                        reader.readMessage(message.fmtPowers, () => pb_1.Message.addToRepeatedWrapperField(message, 4, PokedexFmtPower.deserialize(reader), PokedexFmtPower));
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class PokedexFormationData extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [], null);
        }
        get id(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as number | undefined;
        }
        set id(value: number) {
            pb_1.Message.setField(this, 1, value);
        }
        get name(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as string | undefined;
        }
        set name(value: string) {
            pb_1.Message.setField(this, 2, value);
        }
        toObject() {
            return {
                id: this.id,
                name: this.name
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.id)
                writer.writeInt32(1, this.id);
            if (this.name)
                writer.writeString(2, this.name);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): PokedexFormationData {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new PokedexFormationData();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.id = reader.readInt32();
                        break;
                    case 2:
                        message.name = reader.readString();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class PokedexData extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [4], null);
        }
        get id(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as number | undefined;
        }
        set id(value: number) {
            pb_1.Message.setField(this, 1, value);
        }
        get level(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as number | undefined;
        }
        set level(value: number) {
            pb_1.Message.setField(this, 2, value);
        }
        get score(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 3, undefined) as number | undefined;
        }
        set score(value: number) {
            pb_1.Message.setField(this, 3, value);
        }
        get posList(): PokedexPos[] {
            return pb_1.Message.getRepeatedWrapperField(this, PokedexPos, 4) as PokedexPos[];
        }
        set posList(value: PokedexPos[]) {
            pb_1.Message.setRepeatedWrapperField(this, 4, value);
        }
        toObject() {
            return {
                id: this.id,
                level: this.level,
                score: this.score,
                posList: this.posList
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.id)
                writer.writeInt32(1, this.id);
            if (this.level)
                writer.writeUint32(2, this.level);
            if (this.score)
                writer.writeUint32(3, this.score);
            if (this.posList)
                writer.writeRepeatedMessage(4, this.posList, (item: PokedexPos) => item.serialize(writer));
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): PokedexData {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new PokedexData();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.id = reader.readInt32();
                        break;
                    case 2:
                        message.level = reader.readUint32();
                        break;
                    case 3:
                        message.score = reader.readUint32();
                        break;
                    case 4:
                        reader.readMessage(message.posList, () => pb_1.Message.addToRepeatedWrapperField(message, 4, PokedexPos.deserialize(reader), PokedexPos));
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class PokedexPos extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [], null);
        }
        get posId(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as number | undefined;
        }
        set posId(value: number) {
            pb_1.Message.setField(this, 1, value);
        }
        get posValue(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as number | undefined;
        }
        set posValue(value: number) {
            pb_1.Message.setField(this, 2, value);
        }
        toObject() {
            return {
                posId: this.posId,
                posValue: this.posValue
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.posId)
                writer.writeInt32(1, this.posId);
            if (this.posValue)
                writer.writeInt32(2, this.posValue);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): PokedexPos {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new PokedexPos();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.posId = reader.readInt32();
                        break;
                    case 2:
                        message.posValue = reader.readInt32();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class PokedexPosList extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [1], null);
        }
        get poses(): PokedexPos[] {
            return pb_1.Message.getRepeatedWrapperField(this, PokedexPos, 1) as PokedexPos[];
        }
        set poses(value: PokedexPos[]) {
            pb_1.Message.setRepeatedWrapperField(this, 1, value);
        }
        toObject() {
            return {
                poses: this.poses
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.poses)
                writer.writeRepeatedMessage(1, this.poses, (item: PokedexPos) => item.serialize(writer));
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): PokedexPosList {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new PokedexPosList();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        reader.readMessage(message.poses, () => pb_1.Message.addToRepeatedWrapperField(message, 1, PokedexPos.deserialize(reader), PokedexPos));
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class PokedexScore extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [], null);
        }
        get id(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as number | undefined;
        }
        set id(value: number) {
            pb_1.Message.setField(this, 1, value);
        }
        get score(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as number | undefined;
        }
        set score(value: number) {
            pb_1.Message.setField(this, 2, value);
        }
        toObject() {
            return {
                id: this.id,
                score: this.score
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.id)
                writer.writeInt32(1, this.id);
            if (this.score)
                writer.writeUint32(2, this.score);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): PokedexScore {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new PokedexScore();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.id = reader.readInt32();
                        break;
                    case 2:
                        message.score = reader.readUint32();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class PokedexPower extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [], null);
        }
        get pokedexId(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as number | undefined;
        }
        set pokedexId(value: number) {
            pb_1.Message.setField(this, 1, value);
        }
        get power(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as number | undefined;
        }
        set power(value: number) {
            pb_1.Message.setField(this, 2, value);
        }
        get score(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 3, undefined) as number | undefined;
        }
        set score(value: number) {
            pb_1.Message.setField(this, 3, value);
        }
        toObject() {
            return {
                pokedexId: this.pokedexId,
                power: this.power,
                score: this.score
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.pokedexId)
                writer.writeInt32(1, this.pokedexId);
            if (this.power)
                writer.writeUint32(2, this.power);
            if (this.score)
                writer.writeUint32(3, this.score);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): PokedexPower {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new PokedexPower();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.pokedexId = reader.readInt32();
                        break;
                    case 2:
                        message.power = reader.readUint32();
                        break;
                    case 3:
                        message.score = reader.readUint32();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class PokedexFmtPower extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [2], null);
        }
        get fmtId(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as number | undefined;
        }
        set fmtId(value: number) {
            pb_1.Message.setField(this, 1, value);
        }
        get powers(): PokedexPower[] {
            return pb_1.Message.getRepeatedWrapperField(this, PokedexPower, 2) as PokedexPower[];
        }
        set powers(value: PokedexPower[]) {
            pb_1.Message.setRepeatedWrapperField(this, 2, value);
        }
        toObject() {
            return {
                fmtId: this.fmtId,
                powers: this.powers
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.fmtId)
                writer.writeInt32(1, this.fmtId);
            if (this.powers)
                writer.writeRepeatedMessage(2, this.powers, (item: PokedexPower) => item.serialize(writer));
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): PokedexFmtPower {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new PokedexFmtPower();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.fmtId = reader.readInt32();
                        break;
                    case 2:
                        reader.readMessage(message.powers, () => pb_1.Message.addToRepeatedWrapperField(message, 2, PokedexPower.deserialize(reader), PokedexPower));
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class PokedexBattleInfo extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [1], null);
        }
        get scores(): PokedexScore[] {
            return pb_1.Message.getRepeatedWrapperField(this, PokedexScore, 1) as PokedexScore[];
        }
        set scores(value: PokedexScore[]) {
            pb_1.Message.setRepeatedWrapperField(this, 1, value);
        }
        toObject() {
            return {
                scores: this.scores
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.scores)
                writer.writeRepeatedMessage(1, this.scores, (item: PokedexScore) => item.serialize(writer));
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): PokedexBattleInfo {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new PokedexBattleInfo();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        reader.readMessage(message.scores, () => pb_1.Message.addToRepeatedWrapperField(message, 1, PokedexScore.deserialize(reader), PokedexScore));
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class PrivilegeData extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [2, 3, 4], null);
        }
        get peerage(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as number | undefined;
        }
        set peerage(value: number) {
            pb_1.Message.setField(this, 1, value);
        }
        get abilityList(): PrivilegeAbility[] {
            return pb_1.Message.getRepeatedWrapperField(this, PrivilegeAbility, 2) as PrivilegeAbility[];
        }
        set abilityList(value: PrivilegeAbility[]) {
            pb_1.Message.setRepeatedWrapperField(this, 2, value);
        }
        get effectList(): PrivilegeEffect[] {
            return pb_1.Message.getRepeatedWrapperField(this, PrivilegeEffect, 3) as PrivilegeEffect[];
        }
        set effectList(value: PrivilegeEffect[]) {
            pb_1.Message.setRepeatedWrapperField(this, 3, value);
        }
        get shop(): PrivilegeShopItem[] {
            return pb_1.Message.getRepeatedWrapperField(this, PrivilegeShopItem, 4) as PrivilegeShopItem[];
        }
        set shop(value: PrivilegeShopItem[]) {
            pb_1.Message.setRepeatedWrapperField(this, 4, value);
        }
        get isPrivilegeWagesGet(): boolean | undefined {
            return pb_1.Message.getFieldWithDefault(this, 5, undefined) as boolean | undefined;
        }
        set isPrivilegeWagesGet(value: boolean) {
            pb_1.Message.setField(this, 5, value);
        }
        toObject() {
            return {
                peerage: this.peerage,
                abilityList: this.abilityList,
                effectList: this.effectList,
                shop: this.shop,
                isPrivilegeWagesGet: this.isPrivilegeWagesGet
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.peerage)
                writer.writeInt32(1, this.peerage);
            if (this.abilityList)
                writer.writeRepeatedMessage(2, this.abilityList, (item: PrivilegeAbility) => item.serialize(writer));
            if (this.effectList)
                writer.writeRepeatedMessage(3, this.effectList, (item: PrivilegeEffect) => item.serialize(writer));
            if (this.shop)
                writer.writeRepeatedMessage(4, this.shop, (item: PrivilegeShopItem) => item.serialize(writer));
            if (this.isPrivilegeWagesGet)
                writer.writeBool(5, this.isPrivilegeWagesGet);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): PrivilegeData {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new PrivilegeData();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.peerage = reader.readInt32();
                        break;
                    case 2:
                        reader.readMessage(message.abilityList, () => pb_1.Message.addToRepeatedWrapperField(message, 2, PrivilegeAbility.deserialize(reader), PrivilegeAbility));
                        break;
                    case 3:
                        reader.readMessage(message.effectList, () => pb_1.Message.addToRepeatedWrapperField(message, 3, PrivilegeEffect.deserialize(reader), PrivilegeEffect));
                        break;
                    case 4:
                        reader.readMessage(message.shop, () => pb_1.Message.addToRepeatedWrapperField(message, 4, PrivilegeShopItem.deserialize(reader), PrivilegeShopItem));
                        break;
                    case 5:
                        message.isPrivilegeWagesGet = reader.readBool();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class PrivilegeAbility extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [], null);
        }
        get id(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as number | undefined;
        }
        set id(value: number) {
            pb_1.Message.setField(this, 1, value);
        }
        get level(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as number | undefined;
        }
        set level(value: number) {
            pb_1.Message.setField(this, 2, value);
        }
        toObject() {
            return {
                id: this.id,
                level: this.level
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.id)
                writer.writeInt32(1, this.id);
            if (this.level)
                writer.writeUint32(2, this.level);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): PrivilegeAbility {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new PrivilegeAbility();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.id = reader.readInt32();
                        break;
                    case 2:
                        message.level = reader.readUint32();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class PrivilegeEffect extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [], null);
        }
        get id(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as number | undefined;
        }
        set id(value: number) {
            pb_1.Message.setField(this, 1, value);
        }
        get level(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as number | undefined;
        }
        set level(value: number) {
            pb_1.Message.setField(this, 2, value);
        }
        toObject() {
            return {
                id: this.id,
                level: this.level
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.id)
                writer.writeInt32(1, this.id);
            if (this.level)
                writer.writeUint32(2, this.level);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): PrivilegeEffect {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new PrivilegeEffect();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.id = reader.readInt32();
                        break;
                    case 2:
                        message.level = reader.readUint32();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class PrivilegeShopItem extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [], null);
        }
        get id(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as number | undefined;
        }
        set id(value: number) {
            pb_1.Message.setField(this, 1, value);
        }
        get isBuy(): boolean | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as boolean | undefined;
        }
        set isBuy(value: boolean) {
            pb_1.Message.setField(this, 2, value);
        }
        toObject() {
            return {
                id: this.id,
                isBuy: this.isBuy
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.id)
                writer.writeInt32(1, this.id);
            if (this.isBuy)
                writer.writeBool(2, this.isBuy);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): PrivilegeShopItem {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new PrivilegeShopItem();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.id = reader.readInt32();
                        break;
                    case 2:
                        message.isBuy = reader.readBool();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class VipData extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [3, 4], null);
        }
        get vipLevel(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as number | undefined;
        }
        set vipLevel(value: number) {
            pb_1.Message.setField(this, 1, value);
        }
        get vipExp(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as number | undefined;
        }
        set vipExp(value: number) {
            pb_1.Message.setField(this, 2, value);
        }
        get giftBuyRecord(): number[] {
            return pb_1.Message.getField(this, 3) as number[];
        }
        set giftBuyRecord(value: number[]) {
            pb_1.Message.setField(this, 3, value);
        }
        get hideVipSystems(): number[] {
            return pb_1.Message.getField(this, 4) as number[];
        }
        set hideVipSystems(value: number[]) {
            pb_1.Message.setField(this, 4, value);
        }
        toObject() {
            return {
                vipLevel: this.vipLevel,
                vipExp: this.vipExp,
                giftBuyRecord: this.giftBuyRecord,
                hideVipSystems: this.hideVipSystems
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.vipLevel)
                writer.writeUint32(1, this.vipLevel);
            if (this.vipExp)
                writer.writeUint32(2, this.vipExp);
            if (this.giftBuyRecord)
                writer.writeRepeatedInt32(3, this.giftBuyRecord);
            if (this.hideVipSystems)
                writer.writeRepeatedInt32(4, this.hideVipSystems);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): VipData {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new VipData();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.vipLevel = reader.readUint32();
                        break;
                    case 2:
                        message.vipExp = reader.readUint32();
                        break;
                    case 3:
                        message.giftBuyRecord.push(reader.readInt32());
                        break;
                    case 4:
                        message.hideVipSystems.push(reader.readInt32());
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class HandBook extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [1, 2], null);
        }
        get finishedPageIds(): number[] {
            return pb_1.Message.getField(this, 1) as number[];
        }
        set finishedPageIds(value: number[]) {
            pb_1.Message.setField(this, 1, value);
        }
        get quests(): HandBookQuest[] {
            return pb_1.Message.getRepeatedWrapperField(this, HandBookQuest, 2) as HandBookQuest[];
        }
        set quests(value: HandBookQuest[]) {
            pb_1.Message.setRepeatedWrapperField(this, 2, value);
        }
        toObject() {
            return {
                finishedPageIds: this.finishedPageIds,
                quests: this.quests
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.finishedPageIds)
                writer.writeRepeatedInt32(1, this.finishedPageIds);
            if (this.quests)
                writer.writeRepeatedMessage(2, this.quests, (item: HandBookQuest) => item.serialize(writer));
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): HandBook {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new HandBook();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.finishedPageIds.push(reader.readInt32());
                        break;
                    case 2:
                        reader.readMessage(message.quests, () => pb_1.Message.addToRepeatedWrapperField(message, 2, HandBookQuest.deserialize(reader), HandBookQuest));
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class HandBookQuest extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [], null);
        }
        get id(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as number | undefined;
        }
        set id(value: number) {
            pb_1.Message.setField(this, 1, value);
        }
        get progress(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as number | undefined;
        }
        set progress(value: number) {
            pb_1.Message.setField(this, 2, value);
        }
        get finish(): boolean | undefined {
            return pb_1.Message.getFieldWithDefault(this, 3, undefined) as boolean | undefined;
        }
        set finish(value: boolean) {
            pb_1.Message.setField(this, 3, value);
        }
        toObject() {
            return {
                id: this.id,
                progress: this.progress,
                finish: this.finish
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.id)
                writer.writeInt32(1, this.id);
            if (this.progress)
                writer.writeUint32(2, this.progress);
            if (this.finish)
                writer.writeBool(3, this.finish);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): HandBookQuest {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new HandBookQuest();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.id = reader.readInt32();
                        break;
                    case 2:
                        message.progress = reader.readUint32();
                        break;
                    case 3:
                        message.finish = reader.readBool();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class QuestionnaireInfo extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [12], null);
        }
        get id(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as string | undefined;
        }
        set id(value: string) {
            pb_1.Message.setField(this, 1, value);
        }
        get type(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as number | undefined;
        }
        set type(value: number) {
            pb_1.Message.setField(this, 2, value);
        }
        get content(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 3, undefined) as string | undefined;
        }
        set content(value: string) {
            pb_1.Message.setField(this, 3, value);
        }
        get remark(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 4, undefined) as string | undefined;
        }
        set remark(value: string) {
            pb_1.Message.setField(this, 4, value);
        }
        get start_time(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 5, undefined) as number | undefined;
        }
        set start_time(value: number) {
            pb_1.Message.setField(this, 5, value);
        }
        get finish_time(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 6, undefined) as number | undefined;
        }
        set finish_time(value: number) {
            pb_1.Message.setField(this, 6, value);
        }
        get min_level(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 7, undefined) as number | undefined;
        }
        set min_level(value: number) {
            pb_1.Message.setField(this, 7, value);
        }
        get max_level(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 8, undefined) as number | undefined;
        }
        set max_level(value: number) {
            pb_1.Message.setField(this, 8, value);
        }
        get min_vip(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 9, undefined) as number | undefined;
        }
        set min_vip(value: number) {
            pb_1.Message.setField(this, 9, value);
        }
        get max_vip(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 10, undefined) as number | undefined;
        }
        set max_vip(value: number) {
            pb_1.Message.setField(this, 10, value);
        }
        get createTm(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 11, undefined) as number | undefined;
        }
        set createTm(value: number) {
            pb_1.Message.setField(this, 11, value);
        }
        get items(): Item[] {
            return pb_1.Message.getRepeatedWrapperField(this, Item, 12) as Item[];
        }
        set items(value: Item[]) {
            pb_1.Message.setRepeatedWrapperField(this, 12, value);
        }
        toObject() {
            return {
                id: this.id,
                type: this.type,
                content: this.content,
                remark: this.remark,
                start_time: this.start_time,
                finish_time: this.finish_time,
                min_level: this.min_level,
                max_level: this.max_level,
                min_vip: this.min_vip,
                max_vip: this.max_vip,
                createTm: this.createTm,
                items: this.items
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.id)
                writer.writeUint64String(1, this.id);
            if (this.type)
                writer.writeUint32(2, this.type);
            if (this.content)
                writer.writeString(3, this.content);
            if (this.remark)
                writer.writeString(4, this.remark);
            if (this.start_time)
                writer.writeUint32(5, this.start_time);
            if (this.finish_time)
                writer.writeUint32(6, this.finish_time);
            if (this.min_level)
                writer.writeUint32(7, this.min_level);
            if (this.max_level)
                writer.writeUint32(8, this.max_level);
            if (this.min_vip)
                writer.writeUint32(9, this.min_vip);
            if (this.max_vip)
                writer.writeUint32(10, this.max_vip);
            if (this.createTm)
                writer.writeUint32(11, this.createTm);
            if (this.items)
                writer.writeRepeatedMessage(12, this.items, (item: Item) => item.serialize(writer));
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): QuestionnaireInfo {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new QuestionnaireInfo();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.id = reader.readUint64String();
                        break;
                    case 2:
                        message.type = reader.readUint32();
                        break;
                    case 3:
                        message.content = reader.readString();
                        break;
                    case 4:
                        message.remark = reader.readString();
                        break;
                    case 5:
                        message.start_time = reader.readUint32();
                        break;
                    case 6:
                        message.finish_time = reader.readUint32();
                        break;
                    case 7:
                        message.min_level = reader.readUint32();
                        break;
                    case 8:
                        message.max_level = reader.readUint32();
                        break;
                    case 9:
                        message.min_vip = reader.readUint32();
                        break;
                    case 10:
                        message.max_vip = reader.readUint32();
                        break;
                    case 11:
                        message.createTm = reader.readUint32();
                        break;
                    case 12:
                        reader.readMessage(message.items, () => pb_1.Message.addToRepeatedWrapperField(message, 12, Item.deserialize(reader), Item));
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class DramaStage extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [4], null);
        }
        get stageId(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as number | undefined;
        }
        set stageId(value: number) {
            pb_1.Message.setField(this, 1, value);
        }
        get buildId(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as number | undefined;
        }
        set buildId(value: number) {
            pb_1.Message.setField(this, 2, value);
        }
        get passed(): boolean | undefined {
            return pb_1.Message.getFieldWithDefault(this, 3, undefined) as boolean | undefined;
        }
        set passed(value: boolean) {
            pb_1.Message.setField(this, 3, value);
        }
        get skills(): DramaSkill[] {
            return pb_1.Message.getRepeatedWrapperField(this, DramaSkill, 4) as DramaSkill[];
        }
        set skills(value: DramaSkill[]) {
            pb_1.Message.setRepeatedWrapperField(this, 4, value);
        }
        get shop(): DramaShop | undefined {
            return pb_1.Message.getWrapperField(this, DramaShop, 5) as DramaShop | undefined;
        }
        set shop(value: DramaShop) {
            pb_1.Message.setWrapperField(this, 5, value);
        }
        get box(): DramaBox | undefined {
            return pb_1.Message.getWrapperField(this, DramaBox, 6) as DramaBox | undefined;
        }
        set box(value: DramaBox) {
            pb_1.Message.setWrapperField(this, 6, value);
        }
        toObject() {
            return {
                stageId: this.stageId,
                buildId: this.buildId,
                passed: this.passed,
                skills: this.skills,
                shop: this.shop,
                box: this.box
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.stageId)
                writer.writeInt32(1, this.stageId);
            if (this.buildId)
                writer.writeInt32(2, this.buildId);
            if (this.passed)
                writer.writeBool(3, this.passed);
            if (this.skills)
                writer.writeRepeatedMessage(4, this.skills, (item: DramaSkill) => item.serialize(writer));
            if (this.shop)
                writer.writeMessage(5, this.shop, (item: DramaShop) => item.serialize(writer));
            if (this.box)
                writer.writeMessage(6, this.box, (item: DramaBox) => item.serialize(writer));
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): DramaStage {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new DramaStage();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.stageId = reader.readInt32();
                        break;
                    case 2:
                        message.buildId = reader.readInt32();
                        break;
                    case 3:
                        message.passed = reader.readBool();
                        break;
                    case 4:
                        reader.readMessage(message.skills, () => pb_1.Message.addToRepeatedWrapperField(message, 4, DramaSkill.deserialize(reader), DramaSkill));
                        break;
                    case 5:
                        reader.readMessage(message.shop, () => message.shop = DramaShop.deserialize(reader));
                        break;
                    case 6:
                        reader.readMessage(message.box, () => message.box = DramaBox.deserialize(reader));
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class DramaSkill extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [], null);
        }
        get skill(): Skill | undefined {
            return pb_1.Message.getWrapperField(this, Skill, 1) as Skill | undefined;
        }
        set skill(value: Skill) {
            pb_1.Message.setWrapperField(this, 1, value);
        }
        get isRelive(): boolean | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as boolean | undefined;
        }
        set isRelive(value: boolean) {
            pb_1.Message.setField(this, 2, value);
        }
        get quality(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 3, undefined) as number | undefined;
        }
        set quality(value: number) {
            pb_1.Message.setField(this, 3, value);
        }
        toObject() {
            return {
                skill: this.skill,
                isRelive: this.isRelive,
                quality: this.quality
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.skill)
                writer.writeMessage(1, this.skill, (item: Skill) => item.serialize(writer));
            if (this.isRelive)
                writer.writeBool(2, this.isRelive);
            if (this.quality)
                writer.writeInt32(3, this.quality);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): DramaSkill {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new DramaSkill();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        reader.readMessage(message.skill, () => message.skill = Skill.deserialize(reader));
                        break;
                    case 2:
                        message.isRelive = reader.readBool();
                        break;
                    case 3:
                        message.quality = reader.readInt32();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class DramaShop extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [], null);
        }
        get buyCount(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as number | undefined;
        }
        set buyCount(value: number) {
            pb_1.Message.setField(this, 1, value);
        }
        get privilegeBuy(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as number | undefined;
        }
        set privilegeBuy(value: number) {
            pb_1.Message.setField(this, 2, value);
        }
        get freeBuyCount(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 3, undefined) as number | undefined;
        }
        set freeBuyCount(value: number) {
            pb_1.Message.setField(this, 3, value);
        }
        toObject() {
            return {
                buyCount: this.buyCount,
                privilegeBuy: this.privilegeBuy,
                freeBuyCount: this.freeBuyCount
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.buyCount)
                writer.writeInt32(1, this.buyCount);
            if (this.privilegeBuy)
                writer.writeInt32(2, this.privilegeBuy);
            if (this.freeBuyCount)
                writer.writeInt32(3, this.freeBuyCount);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): DramaShop {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new DramaShop();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.buyCount = reader.readInt32();
                        break;
                    case 2:
                        message.privilegeBuy = reader.readInt32();
                        break;
                    case 3:
                        message.freeBuyCount = reader.readInt32();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class DramaBox extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [1], null);
        }
        get items(): Item[] {
            return pb_1.Message.getRepeatedWrapperField(this, Item, 1) as Item[];
        }
        set items(value: Item[]) {
            pb_1.Message.setRepeatedWrapperField(this, 1, value);
        }
        toObject() {
            return {
                items: this.items
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.items)
                writer.writeRepeatedMessage(1, this.items, (item: Item) => item.serialize(writer));
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): DramaBox {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new DramaBox();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        reader.readMessage(message.items, () => pb_1.Message.addToRepeatedWrapperField(message, 1, Item.deserialize(reader), Item));
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class EtcdValue extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [1], null);
        }
        get target(): string[] {
            return pb_1.Message.getField(this, 1) as string[];
        }
        set target(value: string[]) {
            pb_1.Message.setField(this, 1, value);
        }
        get data(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as string | undefined;
        }
        set data(value: string) {
            pb_1.Message.setField(this, 2, value);
        }
        get enable(): boolean | undefined {
            return pb_1.Message.getFieldWithDefault(this, 3, undefined) as boolean | undefined;
        }
        set enable(value: boolean) {
            pb_1.Message.setField(this, 3, value);
        }
        toObject() {
            return {
                target: this.target,
                data: this.data,
                enable: this.enable
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.target)
                writer.writeRepeatedUint64String(1, this.target);
            if (this.data)
                writer.writeString(2, this.data);
            if (this.enable)
                writer.writeBool(3, this.enable);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): EtcdValue {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new EtcdValue();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.target.push(reader.readUint64String());
                        break;
                    case 2:
                        message.data = reader.readString();
                        break;
                    case 3:
                        message.enable = reader.readBool();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class CollectPos extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [], null);
        }
        get posId(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as number | undefined;
        }
        set posId(value: number) {
            pb_1.Message.setField(this, 1, value);
        }
        get posValue(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as number | undefined;
        }
        set posValue(value: number) {
            pb_1.Message.setField(this, 2, value);
        }
        get commanderScore(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 3, undefined) as number | undefined;
        }
        set commanderScore(value: number) {
            pb_1.Message.setField(this, 3, value);
        }
        get posAddScore(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 4, undefined) as number | undefined;
        }
        set posAddScore(value: number) {
            pb_1.Message.setField(this, 4, value);
        }
        toObject() {
            return {
                posId: this.posId,
                posValue: this.posValue,
                commanderScore: this.commanderScore,
                posAddScore: this.posAddScore
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.posId)
                writer.writeInt32(1, this.posId);
            if (this.posValue)
                writer.writeInt32(2, this.posValue);
            if (this.commanderScore)
                writer.writeUint32(3, this.commanderScore);
            if (this.posAddScore)
                writer.writeUint32(4, this.posAddScore);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): CollectPos {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new CollectPos();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.posId = reader.readInt32();
                        break;
                    case 2:
                        message.posValue = reader.readInt32();
                        break;
                    case 3:
                        message.commanderScore = reader.readUint32();
                        break;
                    case 4:
                        message.posAddScore = reader.readUint32();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class Collect extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [1], null);
        }
        get collectDatas(): CollectData[] {
            return pb_1.Message.getRepeatedWrapperField(this, CollectData, 1) as CollectData[];
        }
        set collectDatas(value: CollectData[]) {
            pb_1.Message.setRepeatedWrapperField(this, 1, value);
        }
        toObject() {
            return {
                collectDatas: this.collectDatas
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.collectDatas)
                writer.writeRepeatedMessage(1, this.collectDatas, (item: CollectData) => item.serialize(writer));
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): Collect {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new Collect();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        reader.readMessage(message.collectDatas, () => pb_1.Message.addToRepeatedWrapperField(message, 1, CollectData.deserialize(reader), CollectData));
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class CollectData extends pb_1.Message {
        constructor(data?: any[]) {
            super();
            pb_1.Message.initialize(this, data, 0, -1, [4], null);
        }
        get collectId(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as number | undefined;
        }
        set collectId(value: number) {
            pb_1.Message.setField(this, 1, value);
        }
        get collectLv(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as number | undefined;
        }
        set collectLv(value: number) {
            pb_1.Message.setField(this, 2, value);
        }
        get posList(): CollectPos[] {
            return pb_1.Message.getRepeatedWrapperField(this, CollectPos, 4) as CollectPos[];
        }
        set posList(value: CollectPos[]) {
            pb_1.Message.setRepeatedWrapperField(this, 4, value);
        }
        get score(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 5, undefined) as number | undefined;
        }
        set score(value: number) {
            pb_1.Message.setField(this, 5, value);
        }
        get power(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 6, undefined) as number | undefined;
        }
        set power(value: number) {
            pb_1.Message.setField(this, 6, value);
        }
        toObject() {
            return {
                collectId: this.collectId,
                collectLv: this.collectLv,
                posList: this.posList,
                score: this.score,
                power: this.power
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.collectId)
                writer.writeInt32(1, this.collectId);
            if (this.collectLv)
                writer.writeUint32(2, this.collectLv);
            if (this.posList)
                writer.writeRepeatedMessage(4, this.posList, (item: CollectPos) => item.serialize(writer));
            if (this.score)
                writer.writeUint32(5, this.score);
            if (this.power)
                writer.writeUint32(6, this.power);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): CollectData {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new CollectData();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.collectId = reader.readInt32();
                        break;
                    case 2:
                        message.collectLv = reader.readUint32();
                        break;
                    case 4:
                        reader.readMessage(message.posList, () => pb_1.Message.addToRepeatedWrapperField(message, 4, CollectPos.deserialize(reader), CollectPos));
                        break;
                    case 5:
                        message.score = reader.readUint32();
                        break;
                    case 6:
                        message.power = reader.readUint32();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export enum PlayerPropertyType {
        exp = 1,
        diamond = 2,
        gold = 3,
        physcal = 4,
        activity = 5,
        commanderExpPool = 6,
        vipExp = 7,
        skillExp = 8,
        dramaCoin = 9,
        arenaCoin = 15,
        gameCoin = 16,
        treasureScore = 20,
        treasureBaseCoin = 21,
        treasureCoin = 22,
        peakCoin = 23,
        slayCoin = 25,
        guildContributionCoin = 27,
        guildContributionExp = 28,
        privilegeCoin = 29,
        goldenDragon = 30,
        guildExchangeCoin = 31,
        rechargeDiamond = 999,
        res_property_dividing_line = 9000,
        power = 9497,
        level = 9498,
        vipLevel = 9499
    }
    export enum UsedFunction {
        SoldierHasChange = 1,
        ArenaEverEnter = 2,
        ArenaEverChallenge = 3,
        PeakEverEnter = 4,
        PeakEverChallenge = 5,
        CollectEverEnter = 6,
        PrivilegeEverEnter = 7
    }
    export enum FormationType {
        pve = 1,
        arenaAttack = 2,
        arenaDefence = 3,
        peak = 4,
        dailyBoss1 = 5,
        dailyBoss2 = 6,
        dailyBoss3 = 7,
        slayAttack = 8,
        drama = 9,
        trainAttack = 10,
        trainDefend = 11,
        dailyExp = 13,
        dailyCoin = 14,
        slayAttack2 = 15,
        slayAttack3 = 16,
        chibi1 = 17,
        chibi2 = 18,
        MaxLimit = 19
    }
    export enum SwitchID {
        MUSIC = 1,
        SOUNDEFFECT = 2,
        PUSH = 3
    }
    export enum Division {
        Novice = 1,
        Apprentice = 2,
        Elites = 3,
        Expert = 4,
        Teacher = 5,
        Master = 6,
        Championer = 7,
        King = 8,
        Legend = 9
    }
    export enum Peerage {
        Civilian = 1,
        Baron = 2,
        Viscount = 3,
        Earl = 4,
        Marquis = 5,
        Duke = 6
    }
    export enum MissionStatus {
        Accepted = 0,
        Finished = 1
    }
    export enum FriendType {
        Friend = 1,
        Request = 2,
        Black = 3,
        Recommend = 4,
        Search = 5
    }
    export enum ChatChannel {
        System = 0,
        World = 1,
        Union = 2,
        Private = 3,
        Count = 4,
        All = 1024
    }
    export enum ChatCellType {
        normal = 0,
        callCommander = 1,
        drawCommander = 2,
        arenaFirstChange = 3,
        arenaSecondChange = 4,
        arenaThirdChange = 5,
        dragon = 100,
        arenaFightReport = 200,
        unionRecruit = 201,
        GMReserve = 999
    }
    export enum RankType {
        FightPower = 0,
        dailyBoss1Time = 1,
        dailyBoss2Time = 2,
        dailyBoss3Time = 3,
        CounsellorPower = 4,
        InstanceStar = 5,
        CommanderPower = 6,
        TreasurePower = 7,
        DailyExpKillNum = 8,
        DailyCoinKillNum = 9,
        FriendRecommend = 10,
        ArenaDefencePower = 11,
        Guild = 100,
        Peak = 101
    }
    export enum ShopType {
        Physical = 1,
        Gold = 2,
        CommanderExp = 3,
        GameCoin = 4,
        AdvanceStone = 5,
        MagicBook = 6
    }
    export enum GuildPowerType {
        President = 1,
        VicePresident = 2,
        Normal = 3
    }
    export enum GuildHonorType {
        OnlineTime = 0,
        PowerUpgrade = 1,
        RecvCommanderFragment = 2,
        DiamondCost = 3,
        physicalCost = 4
    }
    export enum TreasureQuality {
        Green = 1,
        Blue = 2,
        Purple = 3,
        Orange = 4,
        Red = 5
    }
    export enum TreasureFateType {
        Positive = 1,
        Start = 2,
        Passive = 3
    }
    export enum PeakStateStep {
        NONE = 1,
        FORMATION = 2,
        BATTLE = 3
    }
    export enum AttrType {
        AtkAddPro = 52,
        HPAddPro = 53,
        DefProEx = 55
    }
    export enum SlayFightReportType {
        AttackPowerSuccess = 1,
        AttackPowerFail = 2,
        AttackNeutralSuccess = 3,
        AttackNeutralFail = 4,
        CallArmy = 5,
        LevelUpArmy = 6
    }
    export enum StrMansionTabType {
        Wind = 1,
        Fire = 2,
        Dirt = 3,
        Water = 4,
        Max = 10
    }
    export enum HideVipUI {
        FriendUI = 1,
        UnionUI = 2,
        ChatUI = 3,
        PlayerInfoUI = 4
    }
    export enum ChibiRankType {
        Date = 1,
        Time = 2,
        Power = 3
    }
}
