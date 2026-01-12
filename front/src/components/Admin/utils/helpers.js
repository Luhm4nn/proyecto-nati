export function formatearFecha(fecha) {
  return new Date(fecha).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getEstadoColor(estado) {
  switch (estado) {
    case "pendiente":
      return "estado-pendiente";
    case "revisada":
      return "estado-revisada";
    case "contactada":
      return "estado-contactada";
    default:
      return "";
  }
}
