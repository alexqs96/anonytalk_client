"use client";

import { useTheme } from "next-themes";

export default function DarkMode({ className }: { className?: string }) {
  const { setTheme } = useTheme();

  return (
    <div className={"nav-items" + (className ? " " + className : "")}>
      <button
        onClick={() => setTheme("light")}
        aria-label="Boton de tema claro"
      >
        <svg
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          shapeRendering="geometricPrecision"
          viewBox="0 0 24 24"
          height="100%"
          width="1.2em"
          color="currentColor"
        >
          <title>Modo Claro</title>
          <circle cx="12" cy="12" r="5"></circle>
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path>
        </svg>
      </button>
      <button
        onClick={() => setTheme("dark")}
        aria-label="Boton de tema oscuro"
      >
        <svg
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          shapeRendering="geometricPrecision"
          viewBox="0 0 24 24"
          height="100%"
          width="1.2em"
          color="currentColor"
        >
          <title>Modo Oscuro</title>
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"></path>
        </svg>
      </button>
      <button
        onClick={() => setTheme("system")}
        aria-label="Boton de tema del sistema"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1.15em"
          height="100%"
          viewBox="0 0 16 16"
          fill="currentColor"
        >
          <title>Tema Automatico</title>
          <path d="M0 4s0-2 2-2h12s2 0 2 2v6s0 2-2 2h-4c0 .667.083 1.167.25 1.5H11a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1h.75c.167-.333.25-.833.25-1.5H2s-2 0-2-2V4zm1.398-.855a.758.758 0 0 0-.254.302A1.46 1.46 0 0 0 1 4.01V10c0 .325.078.502.145.602.07.105.17.188.302.254a1.464 1.464 0 0 0 .538.143L2.01 11H14c.325 0 .502-.078.602-.145a.758.758 0 0 0 .254-.302 1.464 1.464 0 0 0 .143-.538L15 9.99V4c0-.325-.078-.502-.145-.602a.757.757 0 0 0-.302-.254A1.46 1.46 0 0 0 13.99 3H2c-.325 0-.502.078-.602.145z" />
        </svg>
      </button>
    </div>
  );
}
