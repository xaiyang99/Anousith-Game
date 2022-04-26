import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "./bottomNav.css";

export default function BottomNav() {
  return (
    <div className="appBottomMenu">
      <NavLink className="item" to="/list">
        <div className="col">
          <span class="material-icons-outlined material-icons">sort</span>
          <strong>ຂອງລາງວັນ</strong>
        </div>
      </NavLink>
      <NavLink className="item" to="/home">
        <div className="col">
          <span className="material-icons">home</span>
          <strong>ໜ້າຫຼັກ</strong>
        </div>
      </NavLink>
      <NavLink className="item" to="/lucky/1">
        <div className="col">
          <span className="material-icons">person</span>
          <strong>ຜູ້ໂຊກດີ</strong>
        </div>
      </NavLink>
    </div>
  );
}
