import "./globals.css";

export const metadata = {
  title: "Hearth Field",
  description: "A quiet public desk that keeps the hours.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="wrap">
          <header className="top">
            <a className="mark" href="/">Hearth Field</a>
            <nav>
              <a href="/">Field</a>
              <a href="/desk">Desk</a>
              <a href="/login">Enter</a>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
