const { readFileSync } = require('fs');
const { normalizeURL, getURLsFromHTML } = require('../src/crawl')

describe('Crawler', () => {
  const expected = 'blog.boot.dev/path'

  describe('normalizeURL', () => {
    it('should return null if no url is passed', () => {
      const result = normalizeURL()
      expect(result).toBeNull()
    })

    it('should return an error if an invalid url is passed', () => {
      expect(() => normalizeURL('lolnotaurl')).toThrow('Invalid URL')
    })

    it('should normalize an http url with a trailing slash', () => {
      const result = normalizeURL('http://blog.boot.dev/path/')
      expect(result).toEqual(expected)
    })

    it('should normalize an http url with no trailing slash', () => {
      const result = normalizeURL('http://blog.boot.dev/path')
      expect(result).toEqual(expected)
    })

    it('should normalize an https url with a trailing slash', () => {
      const result = normalizeURL('https://blog.boot.dev/path/')
      expect(result).toEqual(expected)
    })

    it('should normalize an https url with no trailing slash', () => {
      const result = normalizeURL('https://blog.boot.dev/path')
      expect(result).toEqual(expected)
    })
  })

  describe('getURLsFromHTML', () => {
    let htmlBody

    beforeAll(() => {
      htmlBody = readFileSync('./test/sample.html', 'utf8')
    })

    it('should fetch all of the anchor links from a document', () => {
      const urls = getURLsFromHTML(htmlBody, 'blog.boot.dev')

      console.log(urls)

      expect(urls).toContain('https://blog.boot.dev/')
      expect(urls).toContain('http://blog.boot.dev/')
    })
  })
})
