/**
 * Extract lesson summaries from old therapists-portal HTML files
 * and convert them into a structured JSON file for the v2 portal.
 */
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const OLD_PROJECT = 'C:/Users/saraa/OneDrive/שולחן העבודה/הלל/therapists-portal'
const OUTPUT = 'C:/Users/saraa/therapist-platform-v2/public/data/lesson-summaries.json'

function extractBodyContent(html) {
  // Get content between <div class="content"> and the bottom-nav
  const contentMatch = html.match(/<div class="content">([\s\S]*?)<\/div>\s*(?:<div class="bottom-nav">|<\/body>)/i)
  if (!contentMatch) return ''
  return contentMatch[1].trim()
}

function extractTitle(html) {
  const match = html.match(/<h1>(.*?)<\/h1>/)
  return match ? match[1].trim() : ''
}

function extractSubtitle(html) {
  const match = html.match(/<div class="hero-sub">(.*?)<\/div>/)
  return match ? match[1].trim() : ''
}

function extractSections(bodyHtml) {
  const sections = []
  // Split by section divs
  const sectionRegex = /<div class="section">([\s\S]*?)(?=<div class="section">|<div class="ref-bar">|$)/g
  let match

  while ((match = sectionRegex.exec(bodyHtml)) !== null) {
    const sectionHtml = match[1]
    const section = parseSection(sectionHtml)
    if (section) sections.push(section)
  }

  return sections
}

function decodeEntities(str) {
  return str
    .replace(/&#9733;/g, '⭐')
    .replace(/&#9881;/g, '⚙')
    .replace(/&#129504;/g, '🧠')
    .replace(/&#128172;/g, '💬')
    .replace(/&#129309;/g, '🤝')
    .replace(/&#9889;/g, '⚡')
    .replace(/&#128273;/g, '🔑')
    .replace(/&#127873;/g, '🎁')
    .replace(/&#128218;/g, '📚')
    .replace(/&#128214;/g, '📖')
    .replace(/&#127891;/g, '🎓')
    .replace(/&#128170;/g, '💪')
    .replace(/&#128161;/g, '💡')
    .replace(/&#128640;/g, '🚀')
    .replace(/&#128165;/g, '💥')
    .replace(/&#127793;/g, '🌱')
    .replace(/&#10229;/g, '→')
    .replace(/&#10004;/g, '✔')
    .replace(/&#128300;/g, '🔬')
    .replace(/&#127942;/g, '🏆')
    .replace(/&#128736;/g, '🔰')
    .replace(/&#128176;/g, '💰')
    .replace(/&#\d+;/g, (m) => {
      const code = parseInt(m.slice(2, -1))
      return String.fromCodePoint(code)
    })
    .replace(/&bull;/g, '•')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
}

function parseSection(sectionHtml) {
  // Extract icon
  const iconMatch = sectionHtml.match(/<div class="section-icon">(.*?)<\/div>/)
  const icon = iconMatch ? decodeEntities(iconMatch[1].trim()) : ''

  // Extract title
  const titleMatch = sectionHtml.match(/<div class="section-title">(.*?)<\/div>/)
  const title = titleMatch ? decodeEntities(titleMatch[1].trim()) : ''

  if (!title) return null

  const blocks = []

  // Extract topics
  const topicRegex = /<div class="topic"[^>]*>([\s\S]*?)(?=<div class="(?:topic|highlight-box|principle|homework)"|$)/g
  let topicMatch
  while ((topicMatch = topicRegex.exec(sectionHtml)) !== null) {
    const topicHtml = topicMatch[1]
    const topicTitleMatch = topicHtml.match(/<div class="topic-title"[^>]*>(.*?)<\/div>/)
    const topicTitle = topicTitleMatch ? decodeEntities(topicTitleMatch[1].trim()) : null

    // Check for color
    const colorMatch = topicMatch[0].match(/color:\s*(#[a-f0-9]+|[a-z]+)/i)
    const color = colorMatch ? colorMatch[1] : undefined

    const items = extractListItems(topicHtml)
    const block = { type: 'topic', title: topicTitle, items }
    if (color) block.color = color
    blocks.push(block)
  }

  // Extract highlight boxes
  const highlightRegex = /<div class="highlight-box">([\s\S]*?)<\/div>\s*<\/div>/g
  let hlMatch
  while ((hlMatch = highlightRegex.exec(sectionHtml)) !== null) {
    const hlHtml = hlMatch[1]
    const boxTitleMatch = hlHtml.match(/<div class="box-title">(.*?)<\/div>/)
    const boxTitle = boxTitleMatch ? decodeEntities(boxTitleMatch[1].trim()) : null
    const items = extractListItems(hlHtml)
    // Also extract paragraph text
    const pTexts = extractParagraphs(hlHtml)
    const allItems = [...items, ...pTexts].filter(Boolean)
    blocks.push({ type: 'highlight', title: boxTitle, items: allItems })
  }

  // Extract principles
  const principleRegex = /<div class="principle">([\s\S]*?)<\/div>\s*<\/div>/g
  let princMatch
  const principles = []
  while ((princMatch = principleRegex.exec(sectionHtml)) !== null) {
    const textMatch = princMatch[1].match(/<div class="principle-text">(.*?)<\/div>/)
    if (textMatch) principles.push(decodeEntities(textMatch[1].trim()))
  }
  if (principles.length > 0) {
    blocks.push({ type: 'principle', items: principles })
  }

  // Extract homework
  const homeworkMatch = sectionHtml.match(/<div class="homework">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/)
  if (homeworkMatch) {
    const hwItems = []
    const hwRegex = /<div class="homework-item">([\s\S]*?)(?=<div class="homework-item">|<\/div>\s*<\/div>)/g
    let hwMatch
    while ((hwMatch = hwRegex.exec(homeworkMatch[1])) !== null) {
      const taskMatch = hwMatch[1].match(/<strong>(.*?)<\/strong>/)
      const noteMatch = hwMatch[1].match(/<div class="homework-note">(.*?)<\/div>/)
      hwItems.push({
        task: taskMatch ? decodeEntities(taskMatch[1].trim()) : '',
        note: noteMatch ? decodeEntities(noteMatch[1].trim()) : ''
      })
    }
    if (hwItems.length > 0) {
      blocks.push({ type: 'homework', items: hwItems })
    }
  }

  return { icon, title, blocks }
}

function extractListItems(html) {
  const items = []
  const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/g
  let match
  while ((match = liRegex.exec(html)) !== null) {
    let text = match[1]
      .replace(/<strong>/g, '**')
      .replace(/<\/strong>/g, '**')
      .replace(/<em>/g, '_')
      .replace(/<\/em>/g, '_')
      .replace(/<[^>]+>/g, '')
      .trim()
    items.push(decodeEntities(text))
  }
  return items
}

function extractParagraphs(html) {
  const items = []
  const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/g
  let match
  while ((match = pRegex.exec(html)) !== null) {
    let text = match[1]
      .replace(/<strong>/g, '**')
      .replace(/<\/strong>/g, '**')
      .replace(/<em>/g, '_')
      .replace(/<\/em>/g, '_')
      .replace(/<[^>]+>/g, '')
      .trim()
    if (text) items.push(decodeEntities(text))
  }
  return items
}

function extractReferences(bodyHtml) {
  const refMatch = bodyHtml.match(/<div class="ref-bar">([\s\S]*?)<\/div>\s*<\/div>/)
  if (!refMatch) return ''
  const spans = []
  const spanRegex = /<span[^>]*>[\s\S]*?<span class="ref-icon">[^<]*<\/span>\s*(.*?)<\/span>/g
  let m
  while ((m = spanRegex.exec(refMatch[1])) !== null) {
    spans.push(decodeEntities(m[1].trim()))
  }
  return spans.join(' | ')
}

function extractHomeworkFromBody(bodyHtml) {
  const homework = []
  // Find the homework section specifically
  const hwSectionMatch = bodyHtml.match(/<div class="homework">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/)
  if (hwSectionMatch) {
    const hwRegex = /<div class="homework-item">([\s\S]*?)(?=<div class="homework-item">|$)/g
    let hwMatch
    while ((hwMatch = hwRegex.exec(hwSectionMatch[1])) !== null) {
      const taskMatch = hwMatch[1].match(/<strong>(.*?)<\/strong>/)
      const noteMatch = hwMatch[1].match(/<div class="homework-note">(.*?)<\/div>/)
      homework.push({
        task: taskMatch ? decodeEntities(taskMatch[1].trim()) : '',
        note: noteMatch ? decodeEntities(noteMatch[1].trim()) : ''
      })
    }
  }
  return homework
}

function processFile(filePath, lessonNumber) {
  const html = readFileSync(filePath, 'utf-8')
  const title = extractTitle(html)
  const subtitle = extractSubtitle(html)
  const bodyContent = extractBodyContent(html)
  const sections = extractSections(bodyContent)
  const references = extractReferences(bodyContent)
  const homework = extractHomeworkFromBody(bodyContent)

  return {
    lessonNumber,
    title: decodeEntities(title),
    subtitle: decodeEntities(subtitle),
    sections,
    homework,
    references
  }
}

// Process all files
const practitioner = []
for (let i = 1; i <= 8; i++) {
  const filePath = join(OLD_PROJECT, 'pages', 'summaries', `lesson-${i}.html`)
  try {
    const data = processFile(filePath, i)
    practitioner.push(data)
    console.log(`✓ Practitioner lesson ${i}: ${data.title} (${data.sections.length} sections)`)
  } catch (e) {
    console.error(`✗ Practitioner lesson ${i}: ${e.message}`)
  }
}

const master = []
for (let i = 1; i <= 7; i++) {
  const filePath = join(OLD_PROJECT, 'pages', 'summaries-master', `master-lesson-${i}.html`)
  try {
    const data = processFile(filePath, i)
    master.push(data)
    console.log(`✓ Master lesson ${i}: ${data.title} (${data.sections.length} sections)`)
  } catch (e) {
    console.error(`✗ Master lesson ${i}: ${e.message}`)
  }
}

const result = { practitioner, master }
writeFileSync(OUTPUT, JSON.stringify(result, null, 2), 'utf-8')

console.log(`\nDone! Written to ${OUTPUT}`)
console.log(`Practitioner: ${practitioner.length} lessons`)
console.log(`Master: ${master.length} lessons`)
console.log(`File size: ${(readFileSync(OUTPUT).length / 1024).toFixed(1)} KB`)
