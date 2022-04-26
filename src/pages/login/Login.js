import React from "react";
import { Formik } from "formik";
import { useMutation } from "@apollo/react-hooks";
import "./login.css";
import { LOGIN_USER } from "./gql";
import Notiflix from "notiflix";
import logo from "../../img/logo_next_day.png";
import coverImage from "../../img/cover.png";
import { messageError, TOKEN } from "../../helper";
import poster from "../../img/poster.jpeg";
export default function Login() {
  const [loginUser] = useMutation(LOGIN_USER);

  return (
    <div className="row">
      <div className="col-md-8 p-0">
        <img
          src={poster}
          style={{ width: "101%", height: "100vh", margin: 0 }}
          alt=""
        />
      </div>
      <div className="col-md-4">
        <div className="card" style={{ borderRadius: 0 }}>
          <div className="card-body" style={{ height: "100vh" }}>
            <div>
              <img className="img w-100 mt-3" src={logo} alt="" />
              <h1 className="text-center mt-4">ລະບົບຈັດການເກມແຈກລາງວັນ</h1>
            </div>
            <Formik
              initialValues={{
                username: "",
                password: "",
              }}
              enableReinitialize={true}
              validate={(values) => {
                const errors = {};
                if (!values.username) errors.username = true;
                if (!values.password) errors.password = true;
                return errors;
              }}
              onSubmit={async (values) => {
                try {
                  let user = await loginUser({
                    variables: {
                      where: { ...values },
                    },
                  });

                  if (user) {
                    localStorage.setItem(
                      TOKEN,
                      JSON.stringify(user?.data?.staffLogin)
                    );

                    Notiflix.Loading.standard("Loading...");
                    setTimeout(() => {
                      Notiflix.Loading.remove();
                      window.location.href = "/home";
                    }, 1500);
                  }
                } catch (error) {
                  messageError("ຊື່ຜູ້ໃຊ້ ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ");
                }
              }}
            >
              {({ values, errors, touched, handleChange, handleSubmit }) => (
                <div className="p-2 mt-2">
                  <input
                    type="text"
                    name="username"
                    className="form-control mb-4 form-control-lg"
                    placeholder="ຊື່ຜູ້ໃຊ້"
                    onChange={handleChange}
                    style={{ borderRadius: 1 }}
                  />
                  <input
                    type="password"
                    name="password"
                    className="form-control mb-4 form-control-lg"
                    placeholder="ລະຫັດຜ່ານ"
                    onChange={handleChange}
                    style={{ borderRadius: 1 }}
                  />
                  <button
                    type="submit"
                    className="btn btn-block btn-lg text-white"
                    style={{ backgroundColor: "#b90e0e", borderRadius: 1 }}
                    onClick={handleSubmit}
                  >
                    ເຂົ້າສູ່ລະບົບ
                  </button>
                </div>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}
