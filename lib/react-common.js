function react_app_main(ui, useTS) {
  const imports = [
    'import React from "react";',
    'import ReactDOM from "react-dom/client";',
    'import { RouterProvider } from "react-router-dom";',
    'import { QueryClient, QueryClientProvider } from "@tanstack/react-query";',
    'import "./styles/global.css";',
    'import { router } from "./routes";',
    'import { LanguageProvider } from "./context/LanguageContext"',
  ];
  const wrappers = { open: [], close: [] };
  switch (ui) {
    case "mui":
      imports.unshift("import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';");
      wrappers.open.push("<ThemeProvider theme={createTheme()}><CssBaseline />");
      wrappers.close.unshift("</ThemeProvider>");
      break;
    case "antd":
      imports.unshift("import { ConfigProvider } from 'antd';", "import 'antd/dist/reset.css';");
      wrappers.open.push("<ConfigProvider>");
      wrappers.close.unshift("</ConfigProvider>");
      break;
    case "chakra":
      imports.unshift("import { ChakraProvider } from '@chakra-ui/react';");
      wrappers.open.push("<ChakraProvider>");
      wrappers.close.unshift("</ChakraProvider>");
      break;
    case "bootstrap":
      imports.unshift("import 'bootstrap/dist/css/bootstrap.min.css';");
      break;
    default:
      break;
  }
  const render = `const qc = new QueryClient();
ReactDOM.createRoot(document.getElementById("root")${useTS ? " as HTMLElement" : ""}).render(
  <React.StrictMode>
    <QueryClientProvider client={qc}>
      <LanguageProvider>
        ${wrappers.open.join("")}<RouterProvider router={router} />${wrappers.close.join("")}
      </LanguageProvider>
    </QueryClientProvider>
  </React.StrictMode>
);`;
  return imports.join("\n") + "\n\n" + render + "\n";
}

function react_index_css(ui) {
  if (ui === "tailwind") return `@tailwind base;
@tailwind components;
@tailwind utilities;`;
  return `:root{--fg:#111;--bg:#fff}*{box-sizing:border-box}html,body,#root{height:100%}body{margin:0;color:var(--fg);background:var(--bg);font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto}`;
}

module.exports = { react_app_main, react_index_css };
