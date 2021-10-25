import React, { useEffect, useState } from 'react'
import { format, compareAsc } from 'date-fns'
import './App.css';

import TracesList from './components/TracesList/TraceList'
import Trace from './components/Trace/Trace'

function App() {

    const pathname = window.location.pathname;
    const tmp = pathname.split('/')

    const [sessionId, setSessionId] = useState(tmp[1])
    const [traces, setTraces] = useState([])
    const [traceId, setTraceId] = useState(tmp[2])
    const [trace, setTrace] = useState(null)

    useEffect(() => {
        if(!sessionId) {
            fetch('/api/getNewSessionId').then((res) => res.text()).then((res) => {
                window.location.pathname = res
                setSessionId(res)
            })
        } else {
            fetchSessionTraces()
        }
    }, [sessionId])

    useEffect(() => {
        console.log(traceId, traces)
        if (traces && traces.length > 0 && traceId) {
            const selected = traces.find((t) => t.id === traceId)
            if (selected) {
                setTrace(selected)
            }
        }
    }, [traceId, traces])

    const fetchSessionTraces = () => {
            fetch(`/api/getSessionItems/${sessionId}`).then((res) => res.json()).then((res) => {
                setTraces(res.map(e => ({ id: e['_id'], title: e.title, date: e.date, items: e.items.sort((a, b) => compareAsc(new Date(a.date), new Date(b.date))) })).sort((a, b) => a.date > b.date ? -1 : 1 ))
            })
    }

    const selectTrace = (id) => {
       console.log('ID : ', id)
        setTraceId(id)
        window.location.pathname = `/${sessionId}/${id}`
    }

    const createTrace = () => {
        fetch(`/api/item/${sessionId}`, {
            method: 'POST',
        }).then((res) => {
            fetchSessionTraces()
        })
    }

    const deleteItem = (id) => {
        fetch(`/api/item/${sessionId}/${id}`, {
            method: 'DELETE'
        }).then(() => {
            fetchSessionTraces()
        })
    }

    const addTraceItem = (traceId, { date, title, content }) => {
        const body = new FormData()
        body.append('title', title)
        body.append('content', content)
        body.append('date', date)
        fetch(`/api/item/${sessionId}/${traceId}`, {
            method: 'POST',
            body
        }).then((res) => {
            fetchSessionTraces()
        })
    }

  return (
    <div className="App">
      <ul class="circles">
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
            </ul>
      {!traceId && (
          <TracesList traces={traces} select={selectTrace} create={createTrace} remove={deleteItem} />
      )}
      { trace && (
          <Trace trace={trace} addItem={addTraceItem} />
    )}
      </div>
  )

}

export default App;