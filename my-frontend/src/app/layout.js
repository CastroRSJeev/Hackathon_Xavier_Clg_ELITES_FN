// import "./globals.css";
// import { AuthProvider } from "@/context/AuthContext";

// export const metadata = {
//   title: "Next.js Dashboard App",
//   description: "Demo with auth and routing",
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode,
// }) {
//   return (
//     <html lang="en">
//       <body>
//         <AuthProvider>{children}</AuthProvider>
//       </body>
//     </html>
//   );
// }
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "Next.js Dashboard App",
  description: "Demo with auth and routing",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
