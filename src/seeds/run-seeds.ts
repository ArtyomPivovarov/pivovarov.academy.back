import { readdirSync } from 'fs'
import { join } from 'path'

export async function runAllSeeds() {
  console.log('Running seeds...')

  const seedsDir = join(__dirname)
  console.log('Seeds directory:', seedsDir)

  const seedFiles = readdirSync(seedsDir).filter(
    file => file.endsWith('.seed.ts') || file.endsWith('.seed.js')
  )

  console.log('Found seeds:', seedFiles)

  for (const file of seedFiles) {
    const { runSeed } = await import(join(seedsDir, file))
    console.log(`Running seed: ${file}`)
    await runSeed()
  }

  console.log('All seeds executed successfully.')
}
