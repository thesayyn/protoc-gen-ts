import { PresenceMessageV2 } from "./presence_proto2";
import { PresenceMessageV3 } from "./presence_proto3";
import { PresenceCommonMessage } from "./presence_common";

describe("defaults", () => {

    function checkFieldsExist<T>(
      msg: T,
      shouldHave: (keyof T)[],
      shouldNotHave: (keyof T)[]
    ): void {
        for (const field of shouldHave) {
            const hasField = "has_" + field;
            const clearField = "clear_" + field;
            expect(typeof (msg as any)[hasField]).toBe("boolean");
            expect(typeof (msg as any)[clearField]).toBe("function");
        }
        for (const field of shouldNotHave) {
            const hasField = "has_" + field;
            const clearField = "clear_" + field;
            expect(typeof (msg as any)[hasField]).toBe("undefined");
            expect(typeof (msg as any)[clearField]).toBe("undefined");
        }
    }

    it("should have has_ and clear_ fields (v2)", () => {
        const presence = new PresenceMessageV2();

        const shouldHave: (keyof PresenceMessageV2)[] = [
          "int32",
          "enum",
          "string",
          "message",
          "oneof",

          "opt_int32",
          "opt_enum",
          "opt_string",
          "opt_message",
          "opt_oneof",
        ];
        const shouldNotHave: (keyof PresenceMessageV2)[] = [
          "repeated",
          "map",
        ];
        checkFieldsExist(presence, shouldHave, shouldNotHave);
    });

    it("should have has_ and clear_ fields (v3)", () => {
        const presence = new PresenceMessageV3();

        const shouldHave: (keyof PresenceMessageV3)[] = [
            "message",
            "oneof",

            "opt_int32",
            "opt_enum",
            "opt_string",
            "opt_message",
            "opt_oneof",
        ];
        const shouldNotHave: (keyof PresenceMessageV3)[] = [
            "int32",
            "enum",
            "string",
            "repeated",
            "map",
        ];
        checkFieldsExist(presence, shouldHave, shouldNotHave);
    });

    it("should have presence", () => {
        const presence = new PresenceMessageV3();

        expect(presence.opt_int32).toBe(0);
        expect(presence.opt_message).toBe(undefined);
        expect(presence.has_opt_int32).toBeFalse();
        expect(presence.has_opt_message).toBeFalse();

        presence.opt_int32 = 10;
        presence.opt_message = new PresenceCommonMessage()

        expect(presence.opt_int32).toBe(10);
        expect(presence.has_opt_int32).toBeTrue();
        expect(presence.has_opt_message).toBeTrue();
    });

    it("should make presence field false on assignment of undefined", () => {
        const presence = new PresenceMessageV3();
        presence.opt_int32 = 10;
        presence.opt_int32 = undefined!;

        expect(presence.opt_int32).toBe(0);
        expect(presence.has_opt_int32).toBeFalse();
        expect(presence.has_opt_message).toBeFalse();
    });

    it("should make presence field false after calling clear_", () => {
        const presence = new PresenceMessageV3();
        presence.opt_int32 = 10;
        presence.message = new PresenceCommonMessage();
        presence.clear_opt_int32();
        presence.clear_message();

        expect(presence.opt_int32).toBe(0);
        expect(presence.has_opt_int32).toBeFalse();
        expect(presence.has_opt_message).toBeFalse();
    })

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
