import React from "react";
import { NavLink } from "react-router-dom";

function Navbar() {
    return (
        <div className="d-flex justify-content-center gap-3 my-4 fixed-top">
            <NavLink to="/" className={({ isActive }) => `btn ${isActive ? "btn-primary" : "btn-outline-primary"}`}>
                Home
            </NavLink>

            <NavLink to="/cart" className={({ isActive }) => `btn ${isActive ? "btn-primary" : "btn-outline-primary"}`}>
                Cart
            </NavLink>
            <NavLink to="/orders" className={({ isActive }) => `btn ${isActive ? "btn-primary" : "btn-outline-primary"}`}>
                My Orders
            </NavLink>
            <NavLink to="/categories" className={({ isActive }) => `btn ${isActive ? "btn-primary" : "btn-outline-primary"}`}>
                Categories
            </NavLink>
        </div>
    );
}

export default Navbar;
