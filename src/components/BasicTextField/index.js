import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

export default function BasicTextField({ label, defaultValue, width = "100%", value, onChange }) {
  return (
    <Box component="form" sx={{ "& > :not(style)": { m: 1, width: {width} } }}>
      <TextField
        id="outlined-basic"
        label={label}
        variant="outlined"
        defaultValue={defaultValue}
        value={value}
        onChange={onChange}
        size="small"
        slotProps={{
          input: {
            sx: { fontSize: "14px" }, // Tamaño de la letra del input
          },
          inputLabel: {
            sx: { fontSize: "14px" }, // Tamaño de la letra del label
          },
        }}
      />
    </Box>
  );
}
