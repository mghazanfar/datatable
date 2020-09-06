import React, { useEffect, useState } from "react";
import {
  TableContainer,
  Table,
  TableHead,
  Paper,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Box,
  CircularProgress,
  Button,
  IconButton,
} from "@material-ui/core";
import CountryDetailDialog from "./components/DetailModal";
import Visibility from "@material-ui/icons/Visibility";
import Axios from "axios";

function App() {
  const [data, setData] = useState([]);
  const [fullData, setFullData] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = () => {
    let url = `http://apiv3.iucnredlist.org/api/v3/country/getspecies/AZ?token=9bb4facb6d23f48efbf424bb05c0c1ef1cf6f468393bc745d42179ac4aca5fee`;
    Axios.get(url).then((res) => {
      let data = res.data.result;
      let reduced = res.data.result.slice(page, 99);
      setFullData(data);
      setData(reduced);
      setLoading(false);
      setPage(page + 1);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showMore = () => {
    let slicedData = fullData.slice(page * 100 - 1, page * 100 + 99);
    let newData = data.concat(slicedData);
    setData(newData);
    setPage(page + 1);
  };
  return (
    <Box bgcolor="#1976d2" p={8} minHeight="92vh" pb={0}>
      <CountryDetailDialog
        handleClickOpen={() => setIsModalOpen(true)}
        handleClose={() => setIsModalOpen(false)}
        open={isModalOpen}
        name={name}
      />
      <Typography style={{ color: "white" }} variant="h3">
        Data
      </Typography>
      <TableContainer component={Paper} elevation={14} style={{ padding: 20 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Category</TableCell>
              <TableCell>Rank</TableCell>
              <TableCell>Scientific Name</TableCell>
              <TableCell>Sub Population</TableCell>
              <TableCell>Sub Species</TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.name}>
                <TableCell>{row.category || "---"}</TableCell>
                <TableCell>{row.rank || "---"}</TableCell>
                <TableCell>{row.scientific_name || "---"}</TableCell>
                <TableCell>{row.subpopulation || "---"}</TableCell>{" "}
                <TableCell component="th" scope="row">
                  {row.subspecies || "---"}
                </TableCell>
                <TableCell>{row.taxonid || "---"}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => {
                      setIsModalOpen(true);
                      setName(row.scientific_name);
                    }}
                  >
                    <Visibility />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {loading && (
        <Box display="flex" justifyContent="center" p={8}>
          <CircularProgress size={100} color="secondary" />
        </Box>
      )}
      <Box display="flex" justifyContent="center" p={8}>
        <Button
          variant={
            loading || fullData.length === data.length ? "text" : "contained"
          }
          color="secondary"
          disabled={loading || fullData.length === data.length}
          onClick={() => showMore()}
        >
          {loading
            ? "Loading..."
            : fullData.length !== data.length
            ? `Show More (${fullData.length - data.length})`
            : "No More data to show!"}
        </Button>
      </Box>
    </Box>
  );
}

export default App;
