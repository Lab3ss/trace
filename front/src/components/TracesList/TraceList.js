import React, { useEffect, useState } from 'react'
import { format, differenceInDays } from 'date-fns'
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { grey } from '@mui/material/colors';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import useWindowSize from '../../hooks/useWindowSize'
import CustomTextField from '../TextField'
import '../../App.css';


const MIN_WIDTH = 256;
const BORDER_SIZE = 40;

function TracesList({ traces, select, create, remove }) {

    const dimensions = useWindowSize();
    const [itemsByLine, setItemsByLine] = useState();
    const [itemsWidth, setItemsWidth] = useState();
    const [newTraceName, setNewTraceName] = useState('')

    useEffect(() => {
        const nb = Math.floor((dimensions.width - BORDER_SIZE) / (MIN_WIDTH + BORDER_SIZE))
        setItemsByLine(nb <= 0 ? 1 : nb)
    }, [dimensions.width])

    useEffect(() => {
        setItemsWidth(Math.floor((dimensions.width - BORDER_SIZE) / itemsByLine) - BORDER_SIZE)
    }, [dimensions.width, itemsByLine])

    const selectTrace = (id) => {
        select(id)
    }

    const createTrace = () => {
        create(newTraceName)
    }

    const deleteItem = (id, e) => {
        remove(id)
        e.stopPropagation()
    }


const newTraceNameHandler = (e) => {
    setNewTraceName(e.target.value)
}

  return (
      <div style={{ flex: 1, marginTop: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'center'}}>
      <TextField
        placeholder='Trace name'
        value={newTraceName}
        onChange={newTraceNameHandler}
        id="new-trace-name"
        variant="outlined"
        sx={{
  '& .MuiInputBase-root': {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    lineHeight: '1.5',
    fontSize: '1.2rem',
    fontFamily: 'IBM Plex Sans, sans-serif',
    color: 'text.main',
      '&:hover fieldset': {
        borderColor: 'text.main',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'text.main',
      },
    '& .MuiInputBase-input': {
        width: '280px',
        transitionProperty: 'width',
        transitionDuration: '300ms',
        transitionDelay: '0.1s',
        borderColor: 'secondary.main',
    },
    '& .MuiInputBase-input:focus': {
            width: '420px',
    }
  }}}
      />
      { newTraceName && (
      <IconButton aria-label="add" onClick={createTrace} disabled={!newTraceName} size="large" color="info" sx={{ marginLeft: '16px'}} >
        <AddIcon fontSize="inherit" />
      </IconButton>
      )}

        </div>
<Box style={{ display: 'flex', flexWrap: 'wrap' }}>
      { traces.map((trace) => console.log(trace) || <Paper onClick={() => selectTrace(trace.id)} key={trace.id} sx={{ width: `${itemsWidth}px`, height: '280px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', marginTop: `${BORDER_SIZE}px`, marginLeft: `${BORDER_SIZE}px`, backgroundColor: 'primary.ligth', cursor: 'pointer'}} elevation={3}>
        <div style={{ padding: '0px 16px' , display: 'flex', alignItems: 'center', justifyContent: 'space-around', position: 'relative', zIndex: 1000, backgroundColor: '#ffdfc8' }}>
         <div><h3 style={{ fontFamily: 'IBM Plex Sans, sans-serif', color: '#282c34', fontSize: '1.4rem', fontWeight: 500 }}>{trace.title}</h3></div>
      </div>
        <div style={{ padding: '0px 16px'}}>
          {trace.items.length === 0 && (
                <Typography variant="caption" color="caption">
                    Click here to open this trace
                </Typography>
          )}
        { trace.items.length > 0 && (
           <Timeline position="alternate">
        <TimelineItem>
          <TimelineOppositeContent sx={{color: 'secondary.dark'}}>
          <span style={{ opacity: 0.7, fontFamily: 'IBM Plex Sans, sans-serif' }}>{format(new Date(trace.items[trace.items.length - 1].date), 'eee, MMM do')} </span>
            <br />
          </TimelineOppositeContent>
          <TimelineSeparator sx={{opacity: 0.7}}>
            <TimelineDot sx={{ backgroundColor: 'secondary.dark' }}/>
            <TimelineConnector sx={{position: 'relative', bottom: trace.items.length > 1 ? '110px' : '0px', backgroundColor: "secondary.dark"}} />
          </TimelineSeparator>
          <TimelineContent sx={{height: '100px', position: 'relative', bottom: '4px'}}>
              <div>
                <Typography variant="h6" sx={{color: 'primary.dark', fontWeight: 900}}>
                    {trace.items[trace.items.length - 1].title}
                </Typography>
                <Typography sx={{color: 'secondary.dark', fontFamily: 'IBM Plex Sans, sans-serif'}}>
                    {trace.items[trace.items.length - 1].content}
                </Typography>
              </div>
            </TimelineContent>
        </TimelineItem>
              </Timeline>)}
      </div>
      <div style={{ width: `${itemsWidth}px`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1000, backgroundColor: '#ffdfc8' }}>
          <div style={{ marginLeft: '16px' }}>
            {trace.items.length > 0 && (
                <Typography variant="caption" color="caption">
                    {differenceInDays(new Date(Date.now()), new Date(trace.items[trace.items.length - 1].date)) } days ago
                </Typography>
            )}

          </div>
          <div>
          <IconButton aria-label="delete" onClick={(e) => deleteItem(trace.id, e)} color="primary" sx={{ opacity: '0.1', ':hover': { opacity: 0.8 } }}>
  <DeleteIcon sx={{ color: '#282c34' }}/>
</IconButton>
          </div>
      </div>
          </Paper>)}
    </Box>
      </div>
  );
}

export default TracesList;
