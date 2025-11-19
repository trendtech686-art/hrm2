/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE_URL?: string
  readonly VITE_API_URL?: string
  readonly VITE_GHTK_API_URL?: string
  readonly VITE_GHTK_TOKEN?: string
  // Add other env variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
