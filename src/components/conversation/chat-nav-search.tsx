// @mui
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Iconify from '../iconify/iconify';
// components

// ----------------------------------------------------------------------

type Props = {
  value: string;
  onSearchContact: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClickAway: VoidFunction;
};

export default function ChatNavSearch({
  value,
  onSearchContact,
  onClickAway,
}: Props) {
  return (
    <ClickAwayListener onClickAway={onClickAway}>
      <TextField
        fullWidth
        value={value}
        onChange={onSearchContact}
        placeholder="Buscar Cliente..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
        sx={{ mt: 2.5 }}
      />
    </ClickAwayListener>
  );
}
