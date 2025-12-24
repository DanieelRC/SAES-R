import { useEffect } from "react";

export function Reglamentos() {
  useEffect(() => {
    window.location.href =
      "https://www.ipn.mx/normatividad/normatividad-interna/normint-reglamentos.html";
  }, []);

  return <p>Redirigiendo a los reglamentos del IPN...</p>;
}
