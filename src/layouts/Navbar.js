import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./navbar.css";
import Notiflix from "notiflix";
import { useQuery } from "@apollo/react-hooks";
import { GET_BRANCH_BY_ID } from "../pages/profile/gql";
import logo from "../img/logo-app.png";
export default function Navbar() {
  const location = useLocation().pathname;
  const [pageTitle, setPageTitle] = useState("");
  const localToken = JSON.parse(localStorage?.getItem("ANOUSITH_GAME"));
  const userInfo = localToken?.data?.staffLogin?.data;
  useEffect(() => {
    if (location === "/home") {
      setPageTitle("ໜ້າຫຼັກ");
    } else if (location === "/profile") {
      setPageTitle("ລາຍການຜູ້ໂຊກດີ");
    } else if (location === "/list") {
      setPageTitle("ຈັດການຂອງລາງວັນ");
    } else if (location === "/list/add") {
      setPageTitle("ເພີ່ມລາຍການຂອງລາງວັນ");
    } else if (location === "/tracking") {
      setPageTitle("ກວດສອບເຄຶ່ອງ");
    } else if (location === "/scans") {
      setPageTitle("ສະແກນ");
    }
  }, [location]);

  const showMenu = () => {
    const menu = document.querySelector("#navbar-menu");
    menu.classList.add("toggle-menu");
  };

  document.onclick = (e) => {
    if (
      !e.target.closest("#navbar-menu") ||
      !e.target.closest("#btn-show-menu")
    ) {
      document.querySelector("#navbar-menu") &&
        document.querySelector("#navbar-menu").classList.remove("toggle-menu");
    }
  };

  const _onLogout = () => {
    Notiflix.Confirm.show(
      "ຢຶນຢັນ",
      "ທ່ານຕ້ອງການອອກຈາກລະບົບແທ້ຫຼື ບໍ່?",
      "ຕົກລົງ",
      "ຍົກເລີກ",
      () => {
        localStorage.clear();
        sessionStorage.clear();
        Notiflix.Loading.standard("Loading...");
        setTimeout(() => {
          Notiflix.Loading.remove();
          window.location.href = "/login";
        }, 1500);
      },
      () => {
        return false;
      }
    );
  };

  return (
    <>
      <div className="appHeader text-light border-0">
        <div className="left bg-danger">
          {location === "/home" ? (
            <img src={logo} style={{ width: 120 }} alt="" />
          ) : (
            <button
              className="btn"
              onClick={() => {
                window.history.back();
              }}
            >
              <span className="material-icons">arrow_back_ios</span>
            </button>
          )}
        </div>
        {location === "/home" ? (
          <h1 className="text-white pageTitle">ເກມລຸ້ນໂຊກ</h1>
        ) : (
          <div className="pageTitle">{pageTitle}</div>
        )}

        <div className="right">
          {location === "/home" && (
            <a href="#" onClick={() => _onLogout()}>
              <i
                className="icon-log-out text-white"
                style={{ fontSize: 25 }}
              ></i>
            </a>
          )}

          {location === "/tracking" && (
            <button className="btn p-0">
              <img className="img" src="assets/img/QR_Code.svg" alt="" />
            </button>
          )}
          {location === "/scans" && (
            <button className="btn p-0">
              <img className="img" src="assets/img/QR_Code.svg" alt="" />
            </button>
          )}
        </div>
      </div>

      <div id="navbar-menu" className="navbar-menu border-right">
        <div className="person-info mb-2">
          <div>
            <img class="img" src="assets/img/profile.png" alt="" />
          </div>
          <div>
            <span>{userInfo?.firstName + " " + userInfo?.lastName}</span>
            <br />
            <span className="text-secondary">{userInfo?.phoneNumber}</span>
          </div>
        </div>
        <div className="cv_id_branch">
          <span style={{ color: "#cccccc" }}>ID: {userInfo?.customId}</span>
        </div>
        <div className="list-menu">
          <span className="text-secondary">ເມນູ</span>
          <ul>
            <li>
              <Link className="item-link" to="/filter">
                <img
                  className="img"
                  src="assets/img/Shop Location.svg"
                  alt=""
                />{" "}
                ສາຂາບໍລິການ
              </Link>
            </li>
            <li>
              <Link className="item-link" to="/profile">
                <img className="img" src="assets/img/In Transit.svg" alt="" />{" "}
                ລົດຂົນສົ່ງ
              </Link>
            </li>
            <li>
              <Link className="item-link" to="/profile">
                <img
                  className="img"
                  src="assets/img/Activity History.svg"
                  alt=""
                />
                ປະຫວັດການສະແກນເຄື່ອງ
              </Link>
            </li>
          </ul>
        </div>
        <div class="logout border-top">
          <button class="btn" onClick={_onLogout}>
            <span>ອອກຈາກລະບົບ</span>
            <img className="img" src="assets/img/Sign Out.svg" alt="" />
          </button>
        </div>
      </div>
    </>
  );
}
