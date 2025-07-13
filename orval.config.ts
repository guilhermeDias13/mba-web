import { defineConfig } from 'orval'

export default defineConfig({
  marketplace: {
    input: {
      target: './mba-marketplace-api.json',
    },
    output: {
      mode: 'tags-split',
      target: 'src/api/marketplace.ts',
      schemas: 'src/api/model',
      client: 'react-query',
      biome: true,
      override: {
        mutator: {
          path: './src/lib/axios-instance.ts',
          name: 'customInstance',
        },
      },
    },
  },
})
