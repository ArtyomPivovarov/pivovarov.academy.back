import { readdirSync } from 'fs'
import { join } from 'path'

async function runAllSeeds() {
  const seedsDir = join(__dirname)
  const seedFiles = readdirSync(seedsDir).filter(file =>
    file.endsWith('.seed.ts')
  )

  for (const file of seedFiles) {
    const { runSeed } = await import(join(seedsDir, file))
    console.log(`Running seed: ${file}`)
    await runSeed()
  }

  console.log('All seeds executed successfully.')
}

runAllSeeds().catch(err => {
  console.error('Error running seeds:', err)
  process.exit(1)
})
