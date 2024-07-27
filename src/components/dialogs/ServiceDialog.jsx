// ServiceDialog.js
import React from "react";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import GenericDialog from "./GenericDialog";

const defaultService = {
  name: "",
  url: "",
  service_type: "",
  api_location: "",
};

export default function ServiceDialog({ open, service, onClose, onAdd, onUpdate }) {
  const [data, setData] = React.useState(defaultService);
  const [errors, setErrors] = React.useState({});

  React.useEffect(() => {
    setData(service || defaultService);
  }, [service]);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: null });
  };

  return (
    <GenericDialog
      open={open}
      onClose={onClose}
      data={data}
      originalData={service}
      typeName="Service"
      baseUrl="/monitoring/services/"
      onAdd={onAdd}
      onUpdate={onUpdate}
      onError={setErrors}
    >
      <TextField
        autoFocus
        margin="dense"
        name="name"
        label="Service Name"
        type="text"
        fullWidth
        value={data.name}
        onChange={handleChange}
        error={Boolean(errors.name)}
        helperText={errors.name ? errors.name.join("\n") : null}
      />
      <TextField
        margin="dense"
        name="url"
        label="URL"
        type="text"
        fullWidth
        value={data.url}
        onChange={handleChange}
        error={Boolean(errors.url)}
        helperText={errors.url ? errors.url.join("\n") : null}
      />
      <FormControl fullWidth margin="normal">
        <InputLabel>Location</InputLabel>
        <Select
          name="api_location"
          value={data.api_location}
          label="api_location"
          onChange={handleChange}
          error={Boolean(errors.api_location)}
        >
          <MenuItem value="cloud">Cloud</MenuItem>
          <MenuItem value="local">Local</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel>Service Type</InputLabel>
        <Select
          name="service_type"
          value={data.service_type}
          label="Service Type"
          onChange={handleChange}
          error={Boolean(errors.service_type)}
        >
          <MenuItem value="utility">Utility</MenuItem>
          <MenuItem value="entertainment">Entertainment</MenuItem>
          <MenuItem value="games">Games</MenuItem>
          <MenuItem value="education">Education</MenuItem>
        </Select>
      </FormControl>
    </GenericDialog>
  );
}
