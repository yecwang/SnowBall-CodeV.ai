import { DatePicker as MDatePicker } from '@mui/x-date-pickers';
import withUIComponent from '../with-ui-component';

export * from './Attribute';
export * from './config';
export const DatePicker = withUIComponent(MDatePicker);
