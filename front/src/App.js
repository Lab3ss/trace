import React, { useEffect, useState } from 'react'
import { compareAsc } from 'date-fns'
import './App.css';

import TracesList from './components/TracesList/TraceList'
import Trace from './components/Trace/Trace'

const getUrlParameter = (location, name) => {
    name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]')
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)')
    var results = regex.exec(location.search)
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '))
}

function App() {

    const urlSessionParam = getUrlParameter(window.location, 's')
    const urlTraceParam = getUrlParameter(window.location, 't')

    const [sessionId, setSessionId] = useState(urlSessionParam)
    const [traces, setTraces] = useState([])
    const [traceId, setTraceId] = useState(urlTraceParam)
    const [trace, setTrace] = useState(null)

    useEffect(() => {
        if(!sessionId) {
            fetch('/api/getNewSessionId').then((res) => res.text()).then((res) => {
                window.location.search = `?s=${res}`
                setSessionId(res)
            })
        } else {
            fetchSessionTraces()
        }
    }, [sessionId])

    useEffect(() => {
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
        setTraceId(id)
        window.location.search = `?s=${sessionId}&t=${id}`
    }

    const createTrace = (name) => {
        const body = new FormData()
        body.append('name', name)
        fetch(`/api/item/${sessionId}`, {
            method: 'POST',
            body
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
    <div style={{ position: 'absolute', zIndex: 20, top: 0, bottom :0, right: 0, left: 0, display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
      <p style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: '900', color: '#84868A', fontSize: '2.6rem', opacity: '0.4', textAlign: 'center'}}>
        Come back here at any time from any where typing :<br />
      {window.location.href}
      </p>
      </div>
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
      <div style={{position: 'relative', zIndex: 30, width: '100%'}}>
      {!traceId && (
          <TracesList traces={traces} select={selectTrace} create={createTrace} remove={deleteItem} />
      )}
      { trace && (
          <Trace trace={trace} addItem={addTraceItem} />
    )}
      </div>
      </div>
  )

}

export default App;
