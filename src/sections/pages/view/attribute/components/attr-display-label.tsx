import { Typography } from "@mui/material";

export default function AttrDisplayLabel({ label }: { label: string }) {
  return (
    <Typography sx={{ fontSize: theme => theme.typography.body2 }}>{label}</Typography>
  );
}
