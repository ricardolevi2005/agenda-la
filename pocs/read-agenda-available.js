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
    filter: {
      and: [
        {
          property: 'Date',
          date: {
            on_or_after: '2021-11-05',
          },
        },
        {
          property: 'Date',
          date: {
            on_or_before: '2021-11-05',
          },
        },
      ],
    },
  })

  const startHour1 = 8
  const endHour1 = 12

  const startHour2 = 14
  const endHour2 = 17

  const numberPad = (number) => (number < 10 ? '0' + number : number.toString())
  const hours = []

  for (let i = startHour1; i < endHour1; i++) {
    hours.push({
      hour: numberPad(i) + ':00:00',
      available: true,
    })
  }
  for (let i = startHour2; i < endHour2; i++) {
    hours.push({
      hour: numberPad(i) + ':00:00',
      available: true,
    })
  }

  const blockedHours = data.results
    .map((result) => result.properties.Date.date.start)
    .map((date) => date.split('T')[1])
    .map((date) => date.split('.')[0])
    .sort()

  const availableHours = hours.map((hour) => {
    return {
      ...hour,
      available: blockedHours.indexOf(hour.hour) < 0,
    }
  })

  console.log(availableHours)

  console.log(blockedHours)
}

read()
