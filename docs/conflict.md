# Conflicts with built-in types

It is certain that some built-in types such as `Map`, `Buffer`, you name it. Currently, `protoc-gen-ts`
does not do anything to avoid this conflict. There are a few reasons for this.

- We would have to manipulate the name of your messages.
- It does not make sense to use for instance `Map` or `Buffer` as a name. It lacks precision.
- `protoc-gen-ts` believes your generates sources should match the proto messages.


Though these reasons apply to needs of today, it might still change in the future if there is demand from
the community.

