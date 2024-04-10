import { ThemeProvider } from 'next-themes';
import { ContextProvider } from '../context';

function Template({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ContextProvider>
      <main>{children}</main>
      </ContextProvider>
    </ThemeProvider>
  )
}

export default Template