import { PresenceCommonMessage, PresenceCommonEnum, PresenceCommonMessageOneOf } from "./presence_common";
import { PresenceMessageV2 } from "./presence_proto2";
import { PresenceMessageV3 } from "./presence_proto3";

describe("defaults", () => {

    it("should have has and clear methods (v2)", () => {
        const presence = new PresenceMessageV2();

        expect(typeof presence["has_enum"]).toBe("function")
        expect(typeof presence["has_int32"]).toBe("function")
        expect(typeof presence["has_message"]).toBe("function")
        expect(typeof presence["has_oneof"]).toBe("function")
        expect(typeof presence["has_string"]).toBe("function")

        expect(typeof presence["has_opt_enum"]).toBe("function")
        expect(typeof presence["has_opt_int32"]).toBe("function")
        expect(typeof presence["has_opt_message"]).toBe("function")
        expect(typeof presence["has_opt_oneof"]).toBe("function")
        expect(typeof presence["has_opt_string"]).toBe("function")

        expect(typeof presence["has_repeated"]).toBe("undefined")
        expect(typeof presence["has_map"]).toBe("undefined")
    });

    it("should have has and clear methods (v3)", () => {
        const presence = new PresenceMessageV3();

        expect(typeof presence["has_enum"]).toBe("undefined")
        expect(typeof presence["has_int32"]).toBe("undefined")
        expect(typeof presence["has_message"]).toBe("function")
        expect(typeof presence["has_oneof"]).toBe("function")
        expect(typeof presence["has_string"]).toBe("undefined")

        expect(typeof presence["has_opt_enum"]).toBe("function")
        expect(typeof presence["has_opt_int32"]).toBe("function")
        expect(typeof presence["has_opt_message"]).toBe("function")
        expect(typeof presence["has_opt_oneof"]).toBe("function")
        expect(typeof presence["has_opt_string"]).toBe("function")

        expect(typeof presence["has_repeated"]).toBe("undefined")
        expect(typeof presence["has_map"]).toBe("undefined")
    });

    it("should have presence", () => {
        const presence = new PresenceMessageV3();
        presence.opt_int32 = 10;

        expect(presence.opt_int32).toBe(10);
        expect(presence.has_opt_int32()).toBeTrue();
        expect(presence.has_opt_message()).toBeFalse();
    });

    it("should clear presence", () => {
        const presence = new PresenceMessageV3();
        presence.opt_int32 = 10;
        presence.clear_opt_int32();

        expect(presence.opt_int32).toBe(0);
        expect(presence.has_opt_int32()).toBeFalse();
        expect(presence.has_opt_message()).toBeFalse();
    });

    it("should serialize optional default without presence", () => {
        const presence = new PresenceMessageV3();
        const transferredPresence = PresenceMessageV3.deserialize(presence.serialize());

        expect(transferredPresence.opt_int32).toBe(0);
        expect(transferredPresence.has_opt_int32()).toBeFalse();
    });

    it("should serialize optional default with presence", () => {
        const presence = new PresenceMessageV3();
        presence.opt_int32 = 0

        const transferredPresence = PresenceMessageV3.deserialize(presence.serialize());

        expect(transferredPresence.opt_int32).toBe(0);
        expect(transferredPresence.has_opt_int32()).toBeTrue();
    });
})
