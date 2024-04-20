const printReport = (pages) => {
  pages = sortLinks(pages)
  for (const [url, count] of Object.entries(pages)) {
    console.log(`Found ${count} internal links to ${url}`)
  }
}

const sortLinks = (pages) => Object.entries(pages)
  .sort(([, a], [, b]) => b - a)
  .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});

module.exports = {
  printReport
}
