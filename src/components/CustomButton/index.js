import { Button, Stack } from "@mui/material";

export default function CustomButton({
  text,
  backgroundColor,
  onClick,
  width = "100px",
}) {
  return (
    <Button
      variant="contained"
      sx={{ backgroundColor: { backgroundColor }, width: { width } }}
      onClick={onClick}
    >
      {text}
    </Button>
  );
}
