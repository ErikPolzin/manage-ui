import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useTheme } from '@mui/material/styles';

function ConnectedClientsList({ clients }) {
  const theme = useTheme();
  console.log(theme.palette.graphs.dataSent);

  function totalBytes() {
    return clients.reduce((a, c) => a + c.bytes_sent + c.bytes_recv, 0);
  }
  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Username</TableCell>
            <TableCell>MAC</TableCell>
            <TableCell align="right">Session Start</TableCell>
            <TableCell align="left">Session End</TableCell>
            <TableCell>Data Usage</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {clients.map((c) => (
            <TableRow key={c.mac}>
              <TableCell component="th" scope="row">
                {c.username}
              </TableCell>
              <TableCell>{c.mac}</TableCell>
              <TableCell align="right">{new Date(c.start_time).toLocaleString()}</TableCell>
              <TableCell align="left">{new Date(c.end_time).toLocaleString()}</TableCell>
              <TableCell>
                <div style={{ height: "20px", display: "flex", width: `${(c.bytes_sent + c.bytes_recv)/totalBytes()*100}%` }}>
                  <div
                    style={{
                      width: `${(c.bytes_recv / (c.bytes_sent + c.bytes_recv)) * 100}%`,
                      backgroundColor: theme.palette.graphs.dataRecv,
                      borderTopLeftRadius: "2px",
                      borderBottomLeftRadius: "2px",
                      height: "100%",
                    }}
                  />
                  <div
                    style={{
                      width: `${(c.bytes_sent / (c.bytes_sent + c.bytes_recv)) * 100}%`,
                      backgroundColor: theme.palette.graphs.dataSent,
                      borderTopRightRadius: "2px",
                      borderBottomRightRadius: "2px",
                      height: "100%",
                    }}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ConnectedClientsList;
