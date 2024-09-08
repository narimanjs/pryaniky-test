import React, { Dispatch, SetStateAction, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

interface TableData {
  id: string;
  companySigDate: string;
  companySignatureName: string;
  documentName: string;
  documentStatus: string;
  documentType: string;
  employeeNumber: string;
  employeeSigDate: string;
  employeeSignatureName: string;
}

interface DataTableProps {
  token: string;
  data: TableData[];
  setData: Dispatch<SetStateAction<TableData[]>>;
  selectedRecord: TableData | null;
  setSelectedRecord: Dispatch<SetStateAction<TableData | null>>;
  setLoading: (loading: boolean) => void; // Use setLoading passed as prop
  loading: boolean; // Loading state passed from parent
  error: string; // Error state passed from parent
}

const DataTable: React.FC<DataTableProps> = ({
  token,
  data,
  setData,
  selectedRecord,
  setSelectedRecord,
  setLoading,
  loading,
  error,
}) => {
  const [columnDefs] = useState<ColDef[]>([
    {
      field: "companySigDate",
      headerName: "Company Signature Date",
      width: 200,
      filter: "agDateColumnFilter",
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      field: "companySignatureName",
      headerName: "Company Signature Name",
      width: 200,
      filter: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      field: "documentName",
      headerName: "Document Name",
      width: 150,
      filter: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      field: "documentStatus",
      headerName: "Document Status",
      width: 150,
      filter: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      field: "documentType",
      headerName: "Document Type",
      width: 200,
      filter: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      field: "employeeNumber",
      headerName: "Employee Number",
      width: 130,
      filter: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      field: "employeeSigDate",
      headerName: "Employee Signature Date",
      width: 200,
      filter: "agDateColumnFilter",
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      field: "employeeSignatureName",
      headerName: "Employee Signature Name",
      width: 150,
      filter: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
  ]);

  const handleRowClick = (params: any) => {
    setSelectedRecord(params.data);
  };

  return (
    <div
      className='ag-theme-alpine'
      style={{ height: 500, width: "100%" }}
    >
      {loading && (
        <Box
          display='flex'
          justifyContent='center'
          alignItems='center'
          height='100%'
        >
          <CircularProgress
            size={60}
            thickness={4.5}
          />
        </Box>
      )}
      {error && <p>{error}</p>}
      {!loading && !error && (
        <AgGridReact
          rowData={data}
          columnDefs={columnDefs}
          onRowClicked={handleRowClick}
          rowSelection='single'
          domLayout='autoHeight'
        />
      )}
    </div>
  );
};

export default DataTable;
