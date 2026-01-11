import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./component/HomePage";
import Navbar from "./component/Navbar";
import CartPage from "./component/Cart";
import OrdersPage from "./component/Orders";
import Categories from "./component/Categories";
import { Toaster } from "sonner";

function App() {
    return (
        <>
            <BrowserRouter>
                <Navbar />
                <div>
                    <main style={{ paddingTop: "20px" }}>
                        <Toaster position="bottom-right" richColors />
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/cart" element={<CartPage />} />
                            <Route path="orders" element={<OrdersPage/>}/>
                            <Route path="categories" element={<Categories/>}/>
                        </Routes>
                    </main>
                </div>
            </BrowserRouter>
        </>
    );
}

export default App;
