import { LinearProgress } from '@mui/material';
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import React from 'react';
interface IProps {
  rows?: GridRowsProp;
  columns?: GridColDef[];
  rowCount?: number;
  loading?: boolean;
  page?: number;
  pageSize?: number;
  handlePageChange(page: number): void;
}

const DataTable: React.FC<IProps> = ({
  rows = [],
  columns = [],
  rowCount = 0,
  pageSize = 40,
  page = 0,
  handlePageChange,
  loading = false,
}) => {
  return (
    <DataGrid
      pageSize={pageSize}
      rowsPerPageOptions={[]} // disable rows per page
      components={{
        LoadingOverlay: LinearProgress,
      }}
      rowCount={rowCount}
      onPageChange={(p) => handlePageChange(p)}
      loading={loading}
      hideFooterSelectedRowCount
      paginationMode="server"
      page={page}
      rows={rows}
      columns={columns}
    />
  );
};

export default DataTable;
