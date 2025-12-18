/// <reference types="vite/client" />
/// <reference types="react" />

interface ImportMetaEnv {
    readonly VITE_WEB3FORMS_KEY: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

// Make this file a module to use declare global
export { };

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'superblue-voiceai': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
                'agent-id': string;
            };
        }
    }
}
