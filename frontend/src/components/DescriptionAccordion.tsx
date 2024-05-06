import React, { useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export const DescriptionAccordion: React.FC<{ description: string }> = ({ description }) => {
  return (
    <Accordion sx={{ width: "100%", bgcolor: "transparent", boxShadow: "none" }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 'bold' , ml: -2}}>
            Description
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>
          {description || "No description provided."}
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
}
