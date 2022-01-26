import { NoNamespace } from './noNamespace.js';

describe('No namespace', () => {
    it('should export a class named `NoNamespace`', async () => {
        const message = await import('./noNamespace.js');

        expect(message.NoNamespace.name).toBe('NoNamespace');
    });
});