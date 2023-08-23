import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import React from 'react';

const ItemsList: React.FC<{ rows?: GridRowsProp; columns?: GridColDef[] }> = ({ rows = [], columns = [] }) => {
  return (
    <DataGrid
      disableSelectionOnClick
      paginationMode="client"
      hideFooterSelectedRowCount
      rowsPerPageOptions={[]}
      columns={columns}
      rows={rows}
      autoHeight
    />
  );
};

export default ItemsList;
