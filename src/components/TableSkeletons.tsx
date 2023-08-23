import Skeleton from '@mui/material/Skeleton';

const TableSkeletons = ({ height = 500 }: { height?: number }) => {
  return <Skeleton sx={{ my: 1 }} variant="rectangular" width="100%" height={height} />;
};

export default TableSkeletons;
