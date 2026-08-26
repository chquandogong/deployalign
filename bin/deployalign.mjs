#!/usr/bin/env node
// Runs the TypeScript CLI directly through tsx (a runtime dependency), so no build step is needed.
import { register } from 'tsx/esm/api'

const unregister = register()
try {
  const { main } = await import('../cli/main.ts')
  process.exitCode = await main(process.argv.slice(2))
} finally {
  unregister()
}
