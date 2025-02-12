interface ImportMetaEnv {
  readonly CRM_URL: string
  readonly CONSUMER_KEY: string
  readonly CONSUMER_SECRET: string
  readonly TOKEN: string
  readonly TOKEN_SECRET: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
