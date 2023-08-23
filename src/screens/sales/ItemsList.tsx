import Typography from '@mui/material/Typography';
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import React from 'react';

const ItemsList: React.FC<{ rows?: GridRowsProp; columns?: GridColDef[]; title: string }> = ({
  rows = [],
  columns = [],
  title,
}) => {
  return (
    <>
      <Typography sx={{ mb: 2 }}>{title}</Typography>
      <DataGrid
        disableSelectionOnClick
        paginationMode="client"
        hideFooterSelectedRowCount
        rowsPerPageOptions={[]}
        columns={columns}
        rows={rows}
        autoHeight
      />
    </>
  );
};

export default ItemsList;
