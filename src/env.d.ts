interface ImportMetaEnv {
  readonly CRM_URL: string
  readonly CONSUMER_KEY: string
  readonly CONSUMER_SECRET: string
  readonly ACCESS_TOKEN: string
  readonly TOKEN_SECRET: string
  readonly REALM: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
