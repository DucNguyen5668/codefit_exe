import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import SiteChrome from "@/components/SiteChrome";

export const metadata = {
  title: "Nutricore Tây Nguyên - Thực Phẩm Dinh Dưỡng Eat Clean Sạch",
  description: "Cung cấp các sản phẩm hạt dinh dưỡng sấy giòn, hạt mắc ca, cà phê Robusta mộc, bột cacao nguyên chất vùng Tây Nguyên.",
  keywords: "hạt điều, mắc ca, cà phê robusta, cacao nguyên chất, eat clean, nutricore tây nguyên",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" className="h-full" suppressHydrationWarning>
      <head>

        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Montserrat:wght@500;600;700;800&display=swap" 
          rel="stylesheet" 
        />
        {/* Font Awesome Icons */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className="min-h-full flex flex-col bg-white" suppressHydrationWarning>
        <AuthProvider>
          <SiteChrome>
            {children}
          </SiteChrome>
        </AuthProvider>
      </body>
    </html>
  );
}
