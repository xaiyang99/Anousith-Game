import React, { useEffect, useState } from "react";
import { useMutation, useLazyQuery } from "@apollo/react-hooks";
import axios from "axios";

import "../../item.css";
import "./index.css";
import { PRE_SIGNED_URL, ADD_REWARD } from "./gql";
import {
  startOfMonth,
  endOfMonth,
  messageSuccess,
  messageError,
} from "../../helper/index";
import placeholder from "../../img/placeholder.png";
import { Formik } from "formik";
import { v4 as uuidv4 } from "uuid";

export default function AddList() {
  // useMutation
  const [getVariables, { data: dataPreSign }] = useLazyQuery(PRE_SIGNED_URL);
  const [createReward] = useMutation(ADD_REWARD);
  const [status, setStatus] = useState(true);
  const [state] = useState(placeholder);
  // useState
  const [file, setFile] = useState(null);
  const [imageName, setImageName] = useState("");
  // ========> fucntion upload pic ====>
  useEffect(() => {
    if (dataPreSign?.preSignedUrl) {
      fileGetResign(dataPreSign?.preSignedUrl);
    }
  }, [dataPreSign]);

  const fileGetResign = async (event) => {
    await axios({
      method: "put",
      url: event.url,
      data: file,
      headers: {
        "Content-Type": " file/*; image/*",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
        "Access-Control-Allow-Headers":
          "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With",
      },
    });
  };

  const handleUpload = async (event) => {
    let imageName = uuidv4() + "." + event.target.files[0].type.split("/")[1];
    setImageName(imageName);
    await setFile(event.target.files[0]);
    await getVariables({
      variables: { name: imageName },
    });
  };

  return (
    <div id="appCapsule" className="container mt-5">
      <Formik
        initialValues={{
          title: "",
          rewardCode: "",
          detail: "",
          image: "",
          qty: "",
          th: "",
          startDate: startOfMonth(),
          endDate: endOfMonth(),
        }}
        enableReinitialize={true}
        validate={(values) => {
          const errors = {};
          if (!values.title) {
            errors.title = "ປ້ອນລາງວັນ";
          }
          if (!values.th) {
            errors.th = "ປ້ອນລາງວັນທີ";
          }
          if (!values.qty) {
            errors.qty = "ປ້ອນຈໍານວນລາງວັນ";
          }

          return errors;
        }}
        onSubmit={async (values) => {
          try {
            // imageName
            if (file === null) {
              let createData = await createReward({
                variables: {
                  data: {
                    ...values,
                    isPublic: status,
                  },
                },
              });
              if (createData) {
                messageSuccess("ການບັນທຶກຂໍ້ມູນສຳເລັດ 123");
                setTimeout(() => {
                  window.location.reload();
                }, 1500);
              } else {
                messageError("ການບັນທຶກຂໍ້ມູນບໍ່ສຳເລັດ 123");
              }
            } else if (file !== null) {
              console.log(" image: imageName,: ", imageName);
              let createData = await createReward({
                variables: {
                  data: {
                    ...values,
                    isPublic: status,
                    image: imageName,
                  },
                },
              });
              if (createData) {
                messageSuccess("ການບັນທຶກຂໍ້ມູນສຳເລັດ");
                setTimeout(() => {
                  window.location.reload();
                }, 1500);
              } else {
                messageError("ການບັນທຶກຂໍ້ມູນບໍ່ສຳເລັດ");
              }
            }
          } catch (error) {
            messageError("ການບັນທຶກຂໍ້ມູນບໍ່ສຳເລັດ");
          }
        }}
      >
        {({ values, errors, handleChange, handleSubmit }) => (
          <div className="row">
            <div className="col-md-3">
              {/* image 3 */}
              <div>
                <div className="img-holder">
                  {file ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt=""
                      id="img"
                      className="img-style"
                    />
                  ) : (
                    <img src={state} alt="" id="img" className="img-style" />
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  name="image-upload"
                  id="input"
                  onChange={handleUpload}
                />
                <div className="label-style">
                  <label className="image-upload" htmlFor="input">
                    <i
                      style={{ paddingTop: "10px" }}
                      className="material-icons"
                    >
                      add_photo_alternate
                    </i>
                    ເລືອກຮູບ
                  </label>
                </div>
              </div>

              {/*  */}
            </div>
            <div className="col-md-9">
              <div className="form-group">
                <label for="">ຊື່ລາງວັນ</label>
                <input
                  onChange={handleChange}
                  name="title"
                  type="text"
                  className={
                    errors.title
                      ? "form-control form-control-lg is-invalid"
                      : "form-control form-control-lg"
                  }
                  placeholder="ໂທລະສັບມືຖື iphone 10s"
                />
              </div>
              <div className="form-group">
                <label for="">ອັກສອນຫຍໍ້</label>
                <input
                  onChange={handleChange}
                  name="rewardCode"
                  type="text"
                  className={"form-control"}
                  placeholder="iphone"
                />
              </div>
              <div className="form-group">
                <div className="row">
                  <div class="col-md-6">
                    <label for="">ລາງວັນທີ</label>
                    <input
                      onChange={handleChange}
                      name="th"
                      type="number"
                      className={
                        errors.th && errors.th
                          ? "form-control form-control-lg is-invalid"
                          : "form-control form-control-lg"
                      }
                      placeholder="ປ້ອນເປັນຕົວເລກ"
                    />
                  </div>
                  <div class="col-md-6">
                    <label for="">ຈຳນວນ</label>
                    <input
                      onChange={handleChange}
                      name="qty"
                      type="number"
                      className={
                        errors.qty && errors.qty
                          ? "form-control form-control-lg is-invalid"
                          : "form-control form-control-lg"
                      }
                      placeholder="ປ້ອນເປັນຕົວເລກ"
                    />
                  </div>
                </div>
              </div>
              <div className="form-group">
                <div className="row">
                  <div class="col-md-6">
                    <label for="">ວັນທີເປີດ</label>
                    <input
                      type="date"
                      name="startDate"
                      onChange={handleChange}
                      className="form-control form-control-lg"
                      value={values.startDate}
                    />
                  </div>
                  <div class="col-md-6">
                    <label for="">ວັນທີປິດ</label>
                    <input
                      type="date"
                      name="endDate"
                      onChange={handleChange}
                      className="form-control form-control-lg"
                      value={values.endDate}
                    />
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label for="">ລາຍລະອຽດ</label>
                <textarea
                  rows="3"
                  onChange={handleChange}
                  name="detail"
                  type="text"
                  className={
                    errors.detail && errors.detail
                      ? "form-control form-control-lg is-invalid"
                      : "form-control form-control-lg"
                  }
                  placeholder="ລາຍລະອຽດ"
                ></textarea>
                <br />
                <div className="btn-group">
                  <button
                    type="button"
                    onClick={() => setStatus(true)}
                    className={
                      status === true ? "btn btn-success" : "btn btn-secondary"
                    }
                  >
                    ເປີດໃຊ້ງານ
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus(false)}
                    className={
                      status === false ? "btn btn-success" : "btn btn-secondary"
                    }
                  >
                    ປິດໃຊ້ງານ
                  </button>
                </div>
              </div>
              <div className="form-group">
                <button
                  type="button"
                  style={{ width: "48%", fontSize: 28 }}
                  onClick={(e) => handleSubmit()}
                  className="btn btn-success btn-lg"
                >
                  <i className="icon-check-circle mr-1"></i> ບັນທຶກ
                </button>
                <button
                  type="button"
                  style={{ width: "48%", fontSize: 28 }}
                  onClick={(e) => window.location.reload()}
                  className="btn btn-danger btn-lg ml-2"
                >
                  <i className="icon-refresh mr-1"></i> ຍົກເລີກ
                </button>
              </div>
            </div>
          </div>
        )}
      </Formik>
    </div>
  );
}
