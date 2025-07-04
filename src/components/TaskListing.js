import { Tooltip } from "../common/Tooltip";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";

export const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "assigned", label: "Assigned" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "verified", label: "Verified" },
];

export const SORT_BY_OPTIONS = [
  { value: "", label: "Default" },
  { value: "title", label: "Title" },
  { value: "due_date", label: "Due Date" },
  { value: "status", label: "Status" },
];

export const SORT_ORDER_OPTIONS = [
  { value: "", label: "Default" },
  { value: "asc", label: "Ascending" },
  { value: "desc", label: "Descending" },
];

export function FilterField({ label, tooltip, ...rest }) {
  return (
    <Tooltip text={tooltip}>
      {rest.type === "select" ? (
        <select {...rest}>{rest.children}</select>
      ) : (
        <input {...rest} />
      )}
    </Tooltip>
  );
}

export function NoTasksRow({ colSpan }) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} style={{ textAlign: "center" }}>
        No tasks found
      </TableCell>
    </TableRow>
  );
}
