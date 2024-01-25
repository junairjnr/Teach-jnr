"use client";
import { QueryClient, QueryClientProvider } from "react-query";

export const queryClient = new QueryClient();

function Query_Client({ children }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

export default Query_Client;

// "use client";
// import { QueryClient, QueryClientProvider } from "react-query";
// const queryClient = new QueryClient();
// function Query_Client({ children }) {
//   return (
//     <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
//   );
// }
// export default Query_Client;
