const { argv } = require('node:process')
const { crawlPage } = require('./src/crawl')
const { printReport } = require('./src/report')

if (argv.length !== 3) {
  console.log('ERROR: Invalid arguments.')
  console.log('Usage: pnpm start $URL')
  process.exit(0)
}

const baseUrl = argv[2]
console.log(`Crawler starting at ${baseUrl}...`)

crawlPage(baseUrl, baseUrl, {}).then((pages) => {
  printReport(pages)
  console.log('Crawler has finished')
})

