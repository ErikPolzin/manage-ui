import { useTheme } from "@mui/material/styles";
import { DataGrid } from "@mui/x-data-grid";

function DataUsageIndicator({ sentBytes, recvBytes, totalBytes }) {
  const theme = useTheme();

  return (
    <div
      style={{
        height: "20px",
        display: "flex",
        width: `${((sentBytes + recvBytes) / totalBytes) * 100}%`,
      }}
    >
      <div
        style={{
          width: `${(recvBytes / (sentBytes + recvBytes)) * 100}%`,
          backgroundColor: theme.palette.graphs.dataRecv,
          borderTopLeftRadius: "2px",
          borderBottomLeftRadius: "2px",
          height: "100%",
        }}
      />
      <div
        style={{
          width: `${(sentBytes / (sentBytes + recvBytes)) * 100}%`,
          backgroundColor: theme.palette.graphs.dataSent,
          borderTopRightRadius: "2px",
          borderBottomRightRadius: "2px",
          height: "100%",
        }}
      />
    </div>
  );
}

function ConnectedClientsList({ clients, ...params }) {
  function totalBytes() {
    return clients.reduce((a, c) => a + c.bytes_sent + c.bytes_recv, 0);
  }
  return (
    <DataGrid
      autosizeOnMount
      rows={clients.map((c) => ({ data_usage: c.bytes_sent + c.bytes_recv, ...c }))}
      density="compact"
      hideFooter
      sx={{
        disableTransition: {
          transition: 'none',
        }
      }}
      columns={[
        { field: "username", headerName: "Username", flex: 1 },
        { field: "mac", headerName: "MAC Address", flex: 1 },
        {
          field: "start_time",
          headerName: "Session Start",
          type: "dateTime",
          valueGetter: (value, row) => new Date(value),
          align: "right",
        },
        {
          field: "end_time",
          headerName: "Session End",
          type: "dateTime",
          valueGetter: (value, row) => new Date(value),
        },
        {
          field: "data_usage",
          headerName: "Data Usage",
          renderCell: (params) => (
            <DataUsageIndicator
              sentBytes={params.row.bytes_sent}
              recvBytes={params.row.bytes_recv}
              totalBytes={totalBytes()}
            />
          ),
        },
      ]}
      {...params}
    />
  );
}

export default ConnectedClientsList;
