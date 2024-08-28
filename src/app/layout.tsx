'use client';
import AppFooter from "@/component/app.footer";
import AppHeader from "@/component/app.header";
import 'semantic-ui-css/semantic.min.css'
import "./globals.css";
import SongPlayBottom from "@/component/songPlayBottom/songPlayBottom.component";
import { SongPlayContextProvider } from "@/contexts/SongPlayContext";
import { Provider } from "react-redux";
import { persistor, store } from "@/store";
import { PersistGate } from "redux-persist/integration/react";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <html lang="en">
          <body>
            <SongPlayContextProvider>
              <div className="container">
                <AppHeader />
                <div className="container_main">
                  {children}
                </div>
                <AppFooter />
                <SongPlayBottom />
              </div>
            </SongPlayContextProvider>
          </body>
        </html>
      </PersistGate>

    </Provider>

  );
}
