import React from "react";
import { BrowserRouter,Routes,Route } from "react-router-dom";
import Main from './components/Main';
import Home from './components/Home';
import Details from "./components/Details";

const Routing = () => {
   return(
     <BrowserRouter>
    <Routes>
    <Route  path='/' element={<Main/>}>
        <Route index element={<Home/>}/>
     
    </Route>
    <Route  path="/detail" element={<Details/>}/>
    </Routes>
    </BrowserRouter>
   )
}

export default Routing;