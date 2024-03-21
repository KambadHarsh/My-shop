import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import "../app.css";


export function TopBar() {

  return (
    <div>
      <div className="topbar-section">
        <div className="logo-block">
            <img className="logo" src="../assets/logo.png" alt="logo" />
            <h1 className='text-bold h4'> Shop Dashboard</h1>
            <NavLink to="/newImport"> Import</NavLink>
            <NavLink to="/newExport"> Export</NavLink>
            <NavLink to="/Product"> Product</NavLink>
        </div>
      </div>
    </div>
  )
}


