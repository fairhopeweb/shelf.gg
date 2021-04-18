import { MDBDataTable } from 'mdbreact'
import { useEffect, useState } from 'react'

import Config from '@shelf/helpers/Config'
import './Table.css'

const columns = [
  {
    label: 'created',
    field: 'created',
    width: 100,
  },
  {
    label: 'title',
    field: 'title',
    width: 300,
  },
  {
    label: '# resources',
    field: 'resources_size',
    width: 100,
  },
  {
    label: '# views',
    field: 'views',
    width: 100,
    sort: 'desc',
  },
]

function redirectToShelf(shelfId: string): void {
  window.location.href = '/s/' + shelfId
}

function getDate(epoch: number): string {
  const date = new Date(0)
  date.setUTCSeconds(epoch)

  const day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date)
  const month = new Intl.DateTimeFormat('en', { month: 'short' }).format(date)
  const year = new Intl.DateTimeFormat('en', { year: '2-digit' }).format(date)

  return `${day}-${month}-${year}`.toLowerCase()
}

function Table(): JSX.Element {
  const [load, setLoad] = useState(false)
  const [shelves, setShelves] = useState({
    columns: columns,
    rows: [],
  })

  useEffect(() => {
    setLoad(true)

    const url = `${Config.BaseApiUrl}/api/v1/shelf/all`
    
    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.statusCode === 200) {
          const rows = JSON.parse(data.message)

          for (let i = 0; i < rows.length; i++) {
            rows[i]["created"] = getDate(rows[i]["created"])
            rows[i]["clickEvent"] = () => {
              redirectToShelf(rows[i]["_id"])
            }
          }

          setShelves({
            columns: columns,
            rows: rows,
          })
        }
      })
      .finally(() => setLoad(false))
  }, [])

  return (
    <>
      {load === false &&
        <MDBDataTable data={shelves}/>
      }

      {load === true &&
        <div className="text-center">
          <div className="spinner-border" role="status"></div>
          <p className="spinner-text">loading shelves...</p>
        </div>
      }
    </>
  )
}

export default Table
