import React, { useEffect, useState, useCallback } from "react";
import useUser from "@store/useUser";
import useRoutes from "@configs/useRoutes.config";
import { Routes, Route, BrowserRouter, useNavigate } from "react-router-dom";
import "../src/css/style.css";
import "../src/css/bootstrap.min.css";
import ScrollToTopButton from "@components/ScrollToTopButton/ScrollToTopButton";
import ScrollToTop from "@components/ScrollToTop/ScrollToTop";
import { Provider } from "react-redux";
import { store } from "./services/redux/stores";
import { NotificationContainer } from "react-notifications";
import { ToastContainer } from "react-toastify";
import { LoadingProvider } from "@utils/loading/loadingContext";
import {ToastProvider} from "@utils/toastContext"; 

const App = () => {
  const navigate = useNavigate();
  const { routes } = useRoutes();
  const { token } = useUser();
  const [ready, setReady] = useState(false); // set after
  const renderRoute = (routes) => (
    <Routes>
      {routes.map((route) =>
        "children" in route ? (
          <Route key={route.key} {...route}>
            {renderRoute(route.children)}
          </Route>
        ) : (
          <Route key={route.key} {...route} />
        )
      )}
    </Routes>
  );


  const renderRoutePrivate = (routes) => (
    <Routes>
      {routes.map((route) =>
        "children" in route ? (
          <Route key={route.key} {...route}>
            {renderRoute(route.children)}
          </Route>
        ) : (
          <Route key={route.key} {...route} />
        )
      )}
    </Routes>
  );

  useEffect(() => {
    token ? setReady(true) : setReady(false);
  }, [])
  return (
    <>
      <LoadingProvider>
        <ToastProvider>
          <Provider store={store}>
            <ScrollToTop />
            {renderRoute(routes)}
            <ScrollToTopButton />
          </Provider>
          <ToastContainer position="top-right" autoClose={3000} />
        </ToastProvider>
      </LoadingProvider>
    </>
  );
};

export default () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);