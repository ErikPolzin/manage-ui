import React from "react";
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

export default function ConnectedClientsList({
  clients,
  minTimeOverride,
  maxTimeOverride,
  ...params
}) {
  /**
   * Clients that have ended their session in the currently viewed time range.
   */
  const visibleAccounts = React.useCallback(
    () => clients.filter((c) => new Date(c.acctstoptime || new Date()) > (minTimeOverride || 0)),
    [clients, minTimeOverride],
  );
  /**
   * Total bytes used by all clients, used to get an indication of how much
   * data each client has used, proportionally.
   */
  const totalBytes = React.useCallback(() => {
    return visibleAccounts().reduce((a, c) => a + c.acctinputoctets + c.acctoutputoctets, 0);
  }, [visibleAccounts]);
  /**
   * The earliest start time for all clients. Can be overridden by the 'minTimeOverride' prop.
   */
  const minTime = React.useCallback(() => {
    return (
      minTimeOverride ||
      new Date(
        Math.min(
          ...visibleAccounts()
            .filter((c) => c.acctstarttime)
            .map((c) => new Date(c.acctstarttime)),
        ),
      )
    );
  }, [minTimeOverride, visibleAccounts]);
  /**
   * The latest end time for all clients (usually the current time). Can be overridden by the 'maxTimeOverride' prop.
   */
  const maxTime = React.useCallback(() => maxTimeOverride || new Date(), [maxTimeOverride]);
  return (
    <StripedDataGrid
      getRowId={(acc) => acc.radacctid}
      // Nested border looks weird
      sx={{ border: "none" }}
      getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd")}
      autosizeOnMount
      rows={visibleAccounts().map((c) => {
        // Start time is unix epoch is not specified (shouldn't really ever be the case, but just in case)
        let acctStartTime = new Date(c.acctstarttime || 0);
        // End time is now if unspecified
        let acctStopTime = new Date(c.acctstoptime || new Date());
        // These date conversions are sending me, JS implicit type conversion sucks!!!
        let visibleStartTime = new Date(Math.max(minTime(), acctStartTime));
        let visibleEndTime = new Date(Math.min(maxTime(), acctStopTime));
        return {
          ...c,
          // Total data usage is bytes send plus bytes received
          data_usage: c.acctinputoctets + c.acctoutputoctets,
          // A session is active if it has no end time
          active: !Boolean(c.acctstoptime),
          start_time: visibleStartTime,
          end_time: visibleEndTime,
          session_length: visibleEndTime - visibleStartTime,
        };
      })}
      density="compact"
      hideFooter
      columns={[
        { field: "callingstationid", headerName: "MAC Address", minWidth: 200 },
        { field: "username", headerName: "Username", flex: 1 },
        {
          field: "active",
          headerName: "Active",
          headerAlign: "center",
          renderCell: (params) => <ActiveIndicator active={params.value} />,
        },
        {
          field: "session_length",
          headerName: "Session Length",
          minWidth: 150,
          valueGetter: (value, row) => (value ? humanizeDuration(value, { round: true }) : "--"),
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
              sentBytes={params.row.acctoutputoctets}
              recvBytes={params.row.acctinputoctets}
              totalBytes={totalBytes()}
            />
          ),
        },
      ]}
      {...params}
    />
  );
}
