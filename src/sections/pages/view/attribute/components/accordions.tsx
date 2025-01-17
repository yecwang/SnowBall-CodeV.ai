import * as React from 'react';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  ':last-child': {
    borderBottom: 0,
  },
  '&::before': {
    display: 'none',
  },
  boxShadow: 'none !important',
  borderRadius: '0 !important',
  fontSize: '13px',
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, .05)'
      : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
}));

type TProps = {
  title: string;
  children: React.ReactNode;
}
export default function AttributeAccordions({ title, children }: TProps) {
  return <Accordion defaultExpanded>
    <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
      <Typography sx={{ fontSize: '13px' }}>{title}</Typography>
    </AccordionSummary>
    <AccordionDetails sx={{ fontSize: '12px' }}> { children } </AccordionDetails>
  </Accordion>
}
