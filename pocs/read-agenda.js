require('dotenv').config()

const { Client } = require('@notionhq/client')

const notionSecret = process.env.NOTION_SECRET
const databaseId = process.env.NOTION_DATABASE_ID

const read = async () => {
  const notion = new Client({
    auth: notionSecret,
  })

  const data = await notion.databases.query({
    database_id: databaseId,
    page_size: 100,
    filter: {
      and: [
        {
          property: 'Date',
          date: {
            on_or_after: '2021-11-03',
          },
        },
        {
          property: 'Date',
          date: {
            on_or_before: '2021-11-06',
          },
        },
      ],
    },
  })
  const dates = data.results[0].properties
  console.log(dates)
  const blockedDays = data.results
    .map((result) => result.properties.Date.date.start)
    .map((date) => date.split('T')[0])
    .reduce((prev, curr) => {
      if (!prev[curr]) {
        prev[curr] = 0
      }
      prev[curr]++
      return prev
    }, {})

  console.log(blockedDays)
}

read()
