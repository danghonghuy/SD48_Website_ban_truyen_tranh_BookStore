// src/App.js
import React, { useEffect } from "react";
import useUser from "@store/useUser";
import useAppRoutes from "@configs/useRoutes.config";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import "../src/css/style.css";
import "../src/css/bootstrap.min.css";
import ScrollToTopButton from "@components/ScrollToTopButton/ScrollToTopButton";
import ScrollToTop from "@components/ScrollToTop/ScrollToTop";
import { Provider } from "react-redux";
import { store } from "./services/redux/stores";
import { ToastContainer } from "react-toastify";
import { LoadingProvider } from "@utils/loading/loadingContext";
import { ToastProvider } from "@utils/toastContext";
// import AuthGuard from "./guards/AuthGuard"; 
// import GuestGuard from "./guards/GuestGuard"; 

const AppContent = () => {
  const { publicRoutes, privateRoutes } = useAppRoutes();
  const { token } = useUser();

  const renderRoutesRecursive = (routesToRender, isGuarded = false) => {
    if (!routesToRender || routesToRender.length === 0) {
      return null;
    }
    return routesToRender.map((route) => {
      // const element = isGuarded ? <AuthGuard>{route.element}</AuthGuard> : route.element;
      const element = route.element; 

      if (route.children && route.children.length > 0) {
        return (
          <Route key={route.key} path={route.path} element={element}>
            {renderRoutesRecursive(route.children, isGuarded)}
          </Route>
        );
      }
      return <Route key={route.key} path={route.path} element={element} index={route.index} />;
    });
  };

  const routesToDisplay = (
    <Routes>
      {renderRoutesRecursive(publicRoutes || [], false)}
      {renderRoutesRecursive(privateRoutes || [], true)}
      {/* <Route path="*" element={<div>404 Not Found</div>} /> */}
    </Routes>
  );

  return (
    <>
      <LoadingProvider>
        <ToastProvider>
          <Provider store={store}>
            <ScrollToTop />
            {routesToDisplay}
            <ScrollToTopButton />
          </Provider>
          <ToastContainer position="top-right" autoClose={3000} />
        </ToastProvider>
      </LoadingProvider>
    </>
  );
};

const App = () => (
  <BrowserRouter>
    <AppContent />
  </BrowserRouter>
);

export default App;