import React from "react";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
export function LoaderRow({ colSpan }) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} style={{ textAlign: "center" }}>
        Loading...
      </TableCell>
    </TableRow>
  );
}
export function Loader({ text = "Loading..." }) {
  return <div style={{ textAlign: "center", padding: "1rem" }}>{text}</div>;
}
