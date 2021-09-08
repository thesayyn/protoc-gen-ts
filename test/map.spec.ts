
import { Tags, Topic } from "./map";
import { importdirective } from "./imported";

describe("maps", () => {
    it("should serialize as map", () => {
        const tags = new Tags({});

        tags.keys.set("see", "working");

        const bytes = tags.serialize();
        const gotTags = Tags.deserialize(bytes);

        expect(tags.keys).toBeInstanceOf(Map);
        expect(gotTags.toObject()).toEqual({ keys: { see: 'working' } })
    });

    it("should take the last seen", () => {
        const tags = new Tags({});
        tags.keys.set("see", "not_working");
        tags.keys.set("see", "working");

        expect(Tags.deserialize(tags.serialize()).toObject()).toEqual({ keys: { see: 'working' } })
    });


    it("should take the last seen from constructor", () => {
        const tags = new Tags({
            keys: new Map([
                ["see", "not_working"],
                ["see", "working"],
            ])
        });
        expect(Tags.deserialize(tags.serialize()).toObject()).toEqual({ keys: { see: 'working' } })
    });


    it("should work with message values", () => {
        const tags = new Tags({
            topics: new Map([
                ["first", new Topic({ link: "example1" })],
                ["second", new Topic({ link: "example2" })],
            ])
        });
        const transferredTags = Tags.deserialize(tags.serialize());
        expect(transferredTags.toObject()).toEqual({
            topics: {
                first: { link: "example1" },
                second: { link: "example2" }
            }
        })
    });

    it("should work with imported message values", () => {
        const tags = new Tags({
            imported: new Map([
                [1, new importdirective.Imported.SubMessage({ key: importdirective.Imported.SubMessage.MyEnum.VALUE })],
                [2, new importdirective.Imported.SubMessage({ key: importdirective.Imported.SubMessage.MyEnum.VALUE2 })]
            ]),
            imported2: new Map([
                [1, importdirective.Imported.SubMessage.MyEnum.VALUE],
                [3, importdirective.Imported.SubMessage.MyEnum.VALUE2]
            ])
        });
        const transferredTags = Tags.deserialize(tags.serialize());
        expect(transferredTags.toObject()).toEqual({
            imported: {
                1: { key: importdirective.Imported.SubMessage.MyEnum.VALUE },
                2: { key: importdirective.Imported.SubMessage.MyEnum.VALUE2 }
            },
            imported2: {
                1: importdirective.Imported.SubMessage.MyEnum.VALUE,
                3: importdirective.Imported.SubMessage.MyEnum.VALUE2
            }
        })
    });


    it("should work with fromObject", () => {
        const tags = Tags.fromObject({
            imported: {
                1: { key: importdirective.Imported.SubMessage.MyEnum.VALUE },
                2: { key: importdirective.Imported.SubMessage.MyEnum.VALUE2 }
            },
            imported2: {
                1: importdirective.Imported.SubMessage.MyEnum.VALUE,
                3: importdirective.Imported.SubMessage.MyEnum.VALUE2
            }
        });
        const transferredTags = Tags.deserialize(tags.serialize());
        expect(transferredTags.toObject()).toEqual({
            imported: {
                1: { key: importdirective.Imported.SubMessage.MyEnum.VALUE },
                2: { key: importdirective.Imported.SubMessage.MyEnum.VALUE2 }
            },
            imported2: {
                1: importdirective.Imported.SubMessage.MyEnum.VALUE,
                3: importdirective.Imported.SubMessage.MyEnum.VALUE2
            }
        })
    });

});