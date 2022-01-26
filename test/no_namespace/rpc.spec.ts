describe('No namespace', () => {
    it('should export a class named `NoNamespace`', async () => {
        const message = await import('./no_namespace.js');

        expect(message.NoNamespace.name).toBe('NoNamespace');
    });
});