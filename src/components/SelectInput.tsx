import { InputBase, Stack, Typography } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { styled } from '@mui/system';

interface Data {
  id: string;
  label: string;
  value: string;
}

interface Props {
  placeholder: string;
  label?: string;
  name: string;
  value?: string;
  disabled?: boolean;
  handleChange?(event: { target: { value: string; name: string } } | string | null): void;
  data: Data[];
}

const CustomBaseInput = styled(InputBase)(({ theme }) => ({
  '& .MuiInputBase-input': {
    py: 0.6,
    borderRadius: theme.spacing(0.5),
    width: '100%',
    padding: theme.spacing(1.4, 2),
    background: theme.palette.action.hover,
    border: `1px solid ${theme.palette.divider}`,
    '&:hover': {
      border: `1px solid ${theme.palette.primary.main}`,
    },
  },
}));

export default function SelectInput({ name, placeholder, value, label, data, disabled = false, handleChange }: Props) {
  return (
    <Stack sx={{ width: 1, position: 'relative' }} spacing={1}>
      {label && <Typography>{label}</Typography>}
      <FormControl variant="filled" sx={{ width: 1 }} disabled={disabled}>
        <Select
          sx={{ py: 0, border: 'none' }}
          labelId="demo-simple-select-filled-label"
          id="demo-simple-select-filled"
          value={value}
          name={name}
          displayEmpty
          input={<CustomBaseInput />}
          onChange={handleChange}
        >
          <MenuItem value="">
            <Typography color="text.secondary">{placeholder}</Typography>
          </MenuItem>
          {data?.map((el) => (
            <MenuItem value={el.value} key={el.id}>
              {el.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
}
