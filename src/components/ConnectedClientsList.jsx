import { useTheme } from "@mui/material/styles";
import StripedDataGrid from "./StripedDataGrid";
import Tooltip from "@mui/material/Tooltip";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import humanizeDuration from "humanize-duration";


function DataUsageIndicator({ sentBytes, recvBytes, totalBytes }) {
  const theme = useTheme();
  // Indicator width in pixels, assume parent element is 150px
  const indicatorWidth = () => ((sentBytes + recvBytes) / totalBytes) * 150;

  return indicatorWidth() < 0.5 ? (
    <div style={{ textAlign: "center" }}>No Usage</div>
  ) : (
    <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
      <span
        style={{
          height: "15px",
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
      </span>
    </div>
  );
}

function SessionTimeIndicator({ sessionStart, sessionEnd, t0, tN }) {
  const theme = useTheme();
  const m0 = () => ((sessionStart - t0) / (tN - t0)) * 100;
  const width = () => ((sessionEnd - sessionStart) / (tN - t0)) * 100;

  return width() < 5 ? (
    <div style={{ textAlign: "center" }}>Short session at {sessionStart.toLocaleString()}</div>
  ) : (
    <Tooltip
      PopperProps={{
        modifiers: [
          {
            name: "offset",
            // Align the tooltip roughly in the center of the row
            options: {
              offset: [0, -8],
            },
          },
        ],
      }}
      title={`${sessionStart.toLocaleString()} - ${sessionEnd.toLocaleString()}`}
      disableInteractive
      arrow
    >
      <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
        <div
          style={{
            marginLeft: `${m0()}%`,
            width: `${width()}%`,
            height: "15px",
            backgroundColor: theme.palette.graphs.sessionTime,
            borderRadius: "2px",
          }}
        ></div>
      </div>
    </Tooltip>
  );
}

function ActiveIndicator({ active }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        width: "100%",
      }}
    >
      {active ? <CheckCircleOutlineIcon color="success" /> : <CancelOutlinedIcon color="error" />}
    </div>
  );
}

function ConnectedClientsList({ clients, ...params }) {
  function totalBytes() {
    return clients.reduce((a, c) => a + c.bytes_sent + c.bytes_recv, 0);
  }
  function minTime() {
    return Math.min(...clients.map((c) => c.start_time));
  }
  function maxTime() {
    return Math.max(...clients.map((c) => c.end_time));
  }
  return (
    <StripedDataGrid
      // Nested border looks weird
      sx={{ border: "none" }}
      getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd")}
      autosizeOnMount
      rows={clients.map((c) => ({
        data_usage: c.bytes_sent + c.bytes_recv,
        active: new Date() - c.end_time < 1000 * 60 * 10,
        session_length: c.end_time - c.start_time,
        ...c,
      }))}
      density="compact"
      hideFooter
      columns={[
        { field: "mac", headerName: "MAC Address", minWidth: 200 },
        { field: "user", headerName: "Username", flex: 1 },
        {
          field: "active",
          headerName: "Active",
          headerAlign: "center",
          renderCell: (params) => <ActiveIndicator active={params.value} />,
        },
        {
          field: "session_length",
          headerName: "Session Length",
          valueGetter: (value, row) =>
            value ? humanizeDuration(value, { round: true }) : "--",
        },
        {
          field: "end_time",
          headerName: "Session Time",
          minWidth: 300,
          renderCell: (params) => (
            <SessionTimeIndicator
              sessionStart={params.row.start_time}
              sessionEnd={params.row.end_time}
              t0={minTime()}
              tN={maxTime()}
            />
          ),
        },
        {
          field: "data_usage",
          headerName: "Data Usage",
          minWidth: 150,
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
