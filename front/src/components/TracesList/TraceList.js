import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import useWindowSize from '../../hooks/useWindowSize'
import '../../App.css';


const MIN_WIDTH = 380;
const BORDER_SIZE = 40;

function TracesList({ traces, select, create, remove }) {

    const dimensions = useWindowSize();
    const [itemsByLine, setItemsByLine] = useState();
    const [itemsWidth, setItemsWidth] = useState();

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
        create()
    }

    const deleteItem = (id) => {
        remove(id)
    }

  return (
<Box style={{ position: 'absolute', display: 'flex', flexWrap: 'wrap' }}>
         <Button variant="contained" onClick={createTrace}>Nouveau</Button>
      { traces.map((e) => console.log(e) || <Paper onClick={() => selectTrace(e.id)} key={e.id} style={{ width: `${itemsWidth}px`, height: '256px', marginTop: `${BORDER_SIZE}px`, marginLeft: `${BORDER_SIZE}px`, backgroundColor: e.color ? e.color: '#FFF', cursor: 'pointer'}} elevation={3}>
        <div style={{ padding: '8px 16px' , display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFF'}}>
         <div><h3>{e.title}</h3></div>
      </div>
        <div style={{ padding: '8px 16px', height: '107px'}}>
          { e.content }
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px', flexDirection: 'row-reverse' }}>
         <Button color="error" variant="outlined" onClick={() => deleteItem(e.id)}>Delete</Button>
      </div>
          </Paper>)}
    </Box>
  );
}

export default TracesList;
