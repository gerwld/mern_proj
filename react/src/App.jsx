import React from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/layout";
import Public from "./components/Public";
import Login from "./components/Login";

const App = () => {
   return (
      <Routes>
         <Route path="/" element={<Layout />}>
            <Route index element={<Public />} />
            <Route path="login" element={<Login />} />
         </Route>
      </Routes>
   );
};

export default App;
