enum Language {
    UNKNOWN = 0,
    C = 1,
    CPP = 2
}

class Code {
    languge?: string;
    code?: string;

 
    toObject(): {[K in keyof Omit<Code, "toObject" | "serialize">]: Code[K]} {
        return this
    }
    serialize(): Uint8Array {
        return new Uint8Array();
    }
    static fromObject(o: {[K in keyof Code]: Code[K]}) { 

    }
    static deserialize(buffer: Uint8Array): Code {
        return new Code();
    }
}

let t = new Code().toObject()