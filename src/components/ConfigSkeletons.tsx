import { Grid } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';

const ConfigSkeletons = ({ rows, columns, height = 200 }: { rows: number; columns: number; height?: number }) => {
  return (
    <Grid container spacing={2} sx={{ my: 1 }}>
      {Array(rows * columns)
        .fill(null)
        .map((el, i) => (
          <Grid item xs={12} md={12 / columns} key={i}>
            <Skeleton variant="rectangular" width="100%" height={height} />
          </Grid>
        ))}
    </Grid>
  );
};

export default ConfigSkeletons;
