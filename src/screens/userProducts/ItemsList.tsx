import { Box } from '@mui/material';
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import React from 'react';

const ItemsList: React.FC<{ rows?: GridRowsProp; columns?: GridColDef[] }> = ({ rows = [], columns = [] }) => {
  return (
    <Box>
      <DataGrid
        paginationMode="client"
        hideFooterSelectedRowCount
        columns={columns}
        pageSize={15}
        rows={rows}
        autoHeight
      />
    </Box>
  );
};

export default ItemsList;
