import { format, compareAsc, differenceInDays } from 'date-fns'
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import React, { useEffect, useState } from 'react'
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField'
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import AdapterMoment from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import StaticDateTimePicker from '@mui/lab/StaticDateTimePicker';
import MobileDateTimePicker from '@mui/lab/MobileDateTimePicker';

import './Trace.css';

const customFields = ({ theme }) => ({
    margin: '16px !important',
    '& label': {
        color: theme.palette.text.main
    },
    '& input': {
        color: theme.palette.text.main
    },
    '& div.MuiInput-root::before': {
        borderBottom: `1px solid ${theme.palette.text.main}`
    }
})

const StyledTitleField = styled(TextField)(customFields)
const StyledContentField = styled(TextField)(customFields)
const StyledDateField = styled(TextField)(customFields)

const StyledTimeline = styled(Timeline)(({ theme }) => ({
    color: theme.palette.secondary.main,
    padding: '32px',
    '& span.item-diff': {
        color: theme.palette.secondary.main
    }
}))

function Trace({ trace, addItem }) {

    const [displayForm, setDisplayForm] = useState(false)
    const [date, setDate] = useState(new Date());
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const add = () => {
        addItem(trace.id, { date, title, content })
        setDisplayForm(false)
    }

  return (
          <div
                style={{
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    textAlign: 'center',
                    flexDirection: 'column',
                    padding: '32px',
                    fontFamily: 'IBM Plex Sans, sans-serif'
                }}>
                <Typography variant="h1" sx={{ color: 'primary.ligth'}}>
                    {trace.title}
                </Typography>
           <StyledTimeline position="alternate">
      { trace.items.map((item, index) => {
            const current = new Date(item.date)
            const hideDate = index > 0 && format(current, 'dd/MM/yyyy') === format(new Date(trace.items[index-1].date), 'dd/MM/yyyy')
            const diff = index > 0 ? differenceInDays(current, new Date(trace.items[index-1].date)) : 0
          return (
        <TimelineItem>
          <TimelineOppositeContent color="text.main">
          { hideDate ? null : <span className='item-date'>{format(new Date(item.date), 'eee, MMM do')} </span>}
            <br />
            {!hideDate && index > 0 && diff > 0 && <span className='item-diff'>{`${diff} days after`}</span>}
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent sx={{position: 'relative', bottom: '12px'}}>
              <div>
                <Typography variant="h4" color="primary.main">
                    {item.title}
                </Typography>
                <Typography color="text.main">
                    {item.content}
                </Typography>
              </div>
            </TimelineContent>
        </TimelineItem>
      )}) }
      </StyledTimeline>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>

      <div>
      { displayForm ?
          <Button size='large' variant="contained" onClick={add} disabled={!date || !title} sx={{opacity: !date || !title ? 0 : 1, fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: 'bold' }}>Confirm</Button> :
          <Button size='large' variant="contained" onClick={() => setDisplayForm(!displayForm)} sx={{ fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: 'bold' }}>New item</Button> }
      </div>
        <Fade
          in={displayForm}
        >
       <Box sx={{ display: 'flex', height: '180px' }}>
      <div>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
       <MobileDateTimePicker
          value={date}
            showToolbar={false}
            ampm={false}
          onChange={(newValue) => {
            setDate(newValue);
          }}
          renderInput={(params) => <StyledDateField {...params} variant="standard" label="Date" />}
        />
                </LocalizationProvider>
                <StyledTitleField value={title} onChange={(e) => setTitle(e.target.value)} id="title" label="Titre" variant="standard" />
                <StyledContentField value={content} onChange={(e) => setContent(e.target.value)} id="content" label="Details" variant="standard" />
      </div>
      </Box>
        </Fade>

      </div>
      </div>
  );
}

export default Trace;
