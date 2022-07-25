import { PresenceMessageV2 } from "./presence_proto2";
import { PresenceMessageV3 } from "./presence_proto3";

describe("defaults", () => {

    it("should have has_ fields (v2)", () => {
        const presence = new PresenceMessageV2();

        expect(typeof presence["has_enum"]).toBe("boolean")
        expect(typeof presence["has_int32"]).toBe("boolean")
        expect(typeof presence["has_message"]).toBe("boolean")
        expect(typeof presence["has_oneof"]).toBe("boolean")
        expect(typeof presence["has_string"]).toBe("boolean")

        expect(typeof presence["has_opt_enum"]).toBe("boolean")
        expect(typeof presence["has_opt_int32"]).toBe("boolean")
        expect(typeof presence["has_opt_message"]).toBe("boolean")
        expect(typeof presence["has_opt_oneof"]).toBe("boolean")
        expect(typeof presence["has_opt_string"]).toBe("boolean")

        expect(typeof (presence as any)["has_repeated"]).toBe("undefined")
        expect(typeof (presence as any)["has_map"]).toBe("undefined")
    });

    it("should have has_ fields (v3)", () => {
        const presence = new PresenceMessageV3();

        expect(typeof (presence as any)["has_enum"]).toBe("undefined")
        expect(typeof (presence as any)["has_int32"]).toBe("undefined")
        expect(typeof presence["has_message"]).toBe("boolean")
        expect(typeof presence["has_oneof"]).toBe("boolean")
        expect(typeof (presence as any)["has_string"]).toBe("undefined")

        expect(typeof presence["has_opt_enum"]).toBe("boolean")
        expect(typeof presence["has_opt_int32"]).toBe("boolean")
        expect(typeof presence["has_opt_message"]).toBe("boolean")
        expect(typeof presence["has_opt_oneof"]).toBe("boolean")
        expect(typeof presence["has_opt_string"]).toBe("boolean")

        expect(typeof (presence as any)["has_repeated"]).toBe("undefined")
        expect(typeof (presence as any)["has_map"]).toBe("undefined")
    });

    it("should have presence", () => {
        const presence = new PresenceMessageV3();
        presence.opt_int32 = 10;

        expect(presence.opt_int32).toBe(10);
        expect(presence.has_opt_int32).toBeTrue();
        expect(presence.has_opt_message).toBeFalse();
    });

    it("should make presence field false on assignment of undefined", () => {
        const presence = new PresenceMessageV3();
        presence.opt_int32 = 10;
        presence.opt_int32 = undefined!;

        expect(presence.opt_int32).toBe(0);
        expect(presence.has_opt_int32).toBeFalse();
        expect(presence.has_opt_message).toBeFalse();
    });

    it("should serialize optional default without presence", () => {
        const presence = new PresenceMessageV3();
        const transferredPresence = PresenceMessageV3.deserialize(presence.serialize());

        expect(transferredPresence.opt_int32).toBe(0);
        expect(transferredPresence.has_opt_int32).toBeFalse();
    });

    it("should serialize optional default with presence", () => {
        const presence = new PresenceMessageV3();
        presence.opt_int32 = 0

        const transferredPresence = PresenceMessageV3.deserialize(presence.serialize());

        expect(transferredPresence.opt_int32).toBe(0);
        expect(transferredPresence.has_opt_int32).toBeTrue();
    });
})
