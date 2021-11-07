require('dotenv').config()

const { Client } = require('@notionhq/client')

const notionSecret = process.env.NOTION_SECRET
const databaseId = process.env.NOTION_DATABASE_ID
const databaseIdNegativa = process.env.NOTION_DB_AGENDA_NEG

const read = async () => {
  const notion = new Client({
    auth: notionSecret,
  })

  const data = await notion.databases.query({
    database_id: databaseId,
    page_size: 100,
  })

  data.results.forEach((result) => {
    const blockedDate = result.properties.Date.date.start
    console.log(blockedDate)
  })
}

read()

console.log(databaseIdNegativa)
