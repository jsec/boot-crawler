const { JSDOM } = require('jsdom')

const crawlPage = async (baseUrl, currentUrl, pages) => {
  const base = new URL(baseUrl)
  const current = new URL(currentUrl)

  if (current.hostname !== base.hostname) {
    return pages
  }

  const normalized = normalizeURL(currentUrl)

  if (pages[normalized] > 0) {
    pages[normalized]++
    return pages
  }

  pages[normalized] = 1

  let body
  try {
    const response = await fetch(currentUrl)
    if (response.status >= 400) {
      console.log(`ERROR: HTTP ${response.status}`)
      return pages
    }

    const contentType = response.headers.get('content-type')
    if (!contentType.includes('text/html')) {
      console.log(`Non-HTML response: ${contentType}`)
    }

    body = await response.text()
  } catch (err) {
    console.log(err.message)
  }

  const urls = getURLsFromHTML(body, baseUrl)
  for (const url of urls) {
    pages = await crawlPage(baseUrl, url, pages)
  }

  return pages
}

const normalizeURL = (urlString) => {
  if (!urlString) {
    return null
  }

  const url = new URL(urlString)
  const normalized = url.hostname + url.pathname

  if (normalized.charAt(normalized.length - 1) == '/') {
    return normalized.slice(0, -1)
  }

  return normalized
}

const getURLsFromHTML = (body, baseUrl) => {
  const dom = new JSDOM(body)
  const links = dom.window.document.querySelectorAll('a')

  const urls = []

  for (const link of links) {
    if (link.href.slice(0, 1) === '/') {
      try {
        urls.push(new URL(link.href, baseUrl).href)
      } catch (err) {
        console.log(err.message)
      }
    } else {
      try {
        urls.push(new URL(link.href).href)
      } catch (err) {
        console.log(err.message)
      }
    }
  }

  return urls
}

module.exports = {
  crawlPage,
  getURLsFromHTML,
  normalizeURL
}
