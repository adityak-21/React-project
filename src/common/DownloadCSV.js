import Swal from "sweetalert2";

export const DownloadCSV = (fields = [], data = [], filename = "data.csv") => {
  if (!Array.isArray(fields) || fields.length === 0) {
    Swal.fire("Error", "No fields specified for CSV export", "error");
    return;
  }
  if (!Array.isArray(data) || data.length === 0) {
    Swal.fire("Error", "No data to export", "error");
    return;
  }
  const csvHeader = fields.join(",");
  const csvRows = data.map((item) =>
    fields
      .map((field) => {
        let value =
          item[field] !== undefined && item[field] !== null ? item[field] : "";
        value = String(value).replace(/"/g, '""');
        return /[",\n]/.test(value) ? `"${value}"` : value;
      })
      .join(",")
  );
  const csvContent = [csvHeader, ...csvRows].join("\n");
  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  Swal.fire("Success", "CSV downloaded successfully", "success");
};
