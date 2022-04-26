import React, { useEffect, useState } from "react";
import { useMutation, useLazyQuery } from "@apollo/react-hooks";
import axios from "axios";
import useReactRouter from "use-react-router";

import "../../item.css";
import {
  PRE_SIGNED_URL,
  UPDATE_REWARD,
  GET_REWARD_BY_ID,
  DELETE_REWARD,
} from "./gql";
import {
  messageSuccess,
  messageError,
  startLoading,
  stopLoading,
  toDayDash,
  formatDateDash,
  sprinerLoading,
  messageWarning,
} from "../../helper/index";
import placeholder from "../../img/placeholder.png";
import { Formik } from "formik";
import { v4 as uuidv4 } from "uuid";
import Notiflix from "notiflix";

export default function Detail() {
  const { match } = useReactRouter();

  const _reWardId = match?.params?.id;
  const _isPublic = match?.params?.isPublic;

  // useMutation
  const [getVariables, { data: dataPreSign }] = useLazyQuery(PRE_SIGNED_URL);
  const [fetchRewardById, { data: dataRewardById, loading }] =
    useLazyQuery(GET_REWARD_BY_ID);

  const [fetchSignURL, { data: dataSignURL }] = useLazyQuery(PRE_SIGNED_URL, {
    variables: {
      name: dataRewardById?.reward?.image,
    },
  });

  const [updateReward, { loading: _loading }] = useMutation(UPDATE_REWARD);
  const [deleteReward, { loading: _deleteLoading }] =
    useMutation(DELETE_REWARD);

  // useState
  const [file, setFile] = useState(null);
  const [imageName, setImageName] = useState("");

  const [status, setStatus] = useState(_isPublic);
  // useEffect
  useEffect(() => {
    if (dataPreSign?.preSignedUrl) {
      fileGetResign(dataPreSign?.preSignedUrl);
    }
    fetchRewardById({
      variables: {
        rewardWhere: {
          id: _reWardId,
        },
      },
    });
    fetchSignURL();
    const publicStatus = () => {
      if (_isPublic === "false") {
        setStatus(false);
      } else if (_isPublic === "true") {
        setStatus(true);
      }
    };
    publicStatus();
  }, [dataPreSign, dataRewardById, dataSignURL]);

  useEffect(() => {
    if (loading) {
      startLoading();
    } else {
      stopLoading();
    }
  }, [loading, dataPreSign]);

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

  const _onDelete = async (e, _reWardId) => {
    e.preventDefault();
    Notiflix.Confirm.show(
      "ເເຈ້ງເຕືອນ",
      `ຕ້ອງການລຶບລາງວັນ ເເທ້ ຫຼື ບໍ?`,
      "ຕົກລົງ",
      "ຍົກເລີກ",
      async function () {
        try {
          // deleteReward:
          var _result = await deleteReward({
            variables: {
              where: {
                id: _reWardId && _reWardId,
              },
            },
          });

          if (_result) {
            messageSuccess("ການລຶບຂໍ້ມູນສໍາເລັດ");
            setTimeout(() => {
              window.location.reload();
            }, 1500);
          }
        } catch (error) {
          messageWarning("ການລຶບຂໍ້ມູນບໍ່ສໍາເລັດ");
        }
      }
    );
  };

  return (
    <div id="appCapsule" className="container mt-5">
      <Formik
        initialValues={{
          title: dataRewardById?.reward?.title,
          rewardCode: dataRewardById?.reward?.rewardCode,
          detail: dataRewardById?.reward?.detail,
          image: imageName,
          qty: dataRewardById?.reward?.qty,
          th: dataRewardById?.reward?.th,
          startDate: dataRewardById?.reward?.startDate ?? toDayDash(),
          endDate: dataRewardById?.reward?.endDate ?? toDayDash(),
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
          // upate with old image:
          const _updateRewardNoImage = async () => {
            let result = await updateReward({
              variables: {
                data: {
                  title: values.title,
                  rewardCode: values.rewardCode,
                  detail: values.detail,
                  qty: values.qty,
                  th: values.th,
                  isPublic: status,
                  startDate: values.startDate,
                  endDate: values.endDate,
                  image: dataRewardById?.reward?.image,
                },
                where: {
                  id: _reWardId && _reWardId,
                },
              },
            });
            if (result) {
              messageSuccess("ການເເກ້ໄຂຂໍ້ມູນສຳເລັດ");
              setTimeout(() => {
                window.location.reload();
              }, 1000);
            } else {
              messageError("ການເເກ້ໄຂຂໍ້ມູນບໍ່ສຳເລັດ");
            }
          };

          // update with new images
          const _updateRewardWithImage = async () => {
            let result = await updateReward({
              variables: {
                data: {
                  title: values.title,
                  rewardCode: values.rewardCode,
                  detail: values.detail,
                  qty: values.qty,
                  th: values.th,
                  isPublic: status,
                  startDate: values.startDate,
                  endDate: values.endDate,
                  image: imageName,
                },
                where: {
                  id: _reWardId && _reWardId,
                },
              },
            });
            if (result) {
              messageSuccess("ການບັນທຶກຂໍ້ມູນສຳເລັດ");
              setTimeout(() => {
                window.location.reload();
              }, 1000);
            } else {
              messageError("ການບັນທຶກຂໍ້ມູນບໍ່ສຳເລັດ");
            }
          };

          // function update:
          try {
            if (!file) {
              _updateRewardNoImage();
            } else {
              _updateRewardWithImage();
            }
          } catch (error) {
            messageError("ການບັນທຶກຂໍ້ມູນບໍ່ສຳເລັດ");
          }
        }}
      >
        {({ values, errors, handleChange, handleSubmit }) => (
          <div className="row">
            <div className="col-md-3">
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
                    <img
                      src={
                        dataSignURL?.preSignedUrl?.url === ""
                          ? placeholder
                          : dataSignURL?.preSignedUrl?.url.split("?")[0]
                      }
                      alt=""
                      id="img"
                      className="img-style"
                    />
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
            </div>
            <div className="col-md-9">
              <div className="form-group">
                <label for="">ຊື່ລາງວັນ</label>
                <input
                  onChange={handleChange}
                  name="title"
                  type="text"
                  className={
                    errors.title ? "form-control is-invalid" : "form-control"
                  }
                  placeholder="ໂທລະສັບມືຖື iphone 10s"
                  value={values.title}
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
                  value={values.rewardCode}
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
                          ? "form-control is-invalid"
                          : "form-control"
                      }
                      placeholder="ປ້ອນເປັນຕົວເລກ"
                      value={values.th}
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
                          ? "form-control is-invalid"
                          : "form-control"
                      }
                      placeholder="ປ້ອນເປັນຕົວເລກ"
                      value={values.qty}
                    />
                  </div>
                </div>
              </div>
              <div className="form-group">
                <div className="row">
                  <div class="col-md-6">
                    <label for="">ວັນທີເປີດ</label>
                    <input
                      name="startDate"
                      type="date"
                      placeholder="ປ້ອນວັນເດືອນປີເກີດ"
                      onChange={handleChange}
                      className={"form-control"}
                      value={formatDateDash(values.startDate)}
                    />
                  </div>
                  <div class="col-md-6">
                    <label for="">ວັນທີປິດ</label>
                    <input
                      type="date"
                      name="endDate"
                      className="form-control"
                      value={formatDateDash(values.endDate)}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label for="">ລາຍລະອຽດ</label>
                <textarea
                  rows="5"
                  onChange={handleChange}
                  name="detail"
                  type="text"
                  className={"form-control"}
                  placeholder="ລາຍລະອຽດ"
                  value={values.detail}
                ></textarea>
              </div>
              <div className="btn-group mb-1 mt-1">
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
              <br />
              <div className="form-group">
                <button
                  type="button"
                  style={{ width: "48%", fontSize: 28 }}
                  onClick={(e) => handleSubmit()}
                  className="btn btn-success btn-lg"
                >
                  {_loading ? (
                    sprinerLoading("white", "")
                  ) : (
                    <i className="icon-check-circle mr-2" />
                  )}{" "}
                  ບັນທຶກ
                </button>
                <button
                  type="button"
                  style={{ width: "48%", fontSize: 28 }}
                  className="btn btn-danger btn-lg ml-2"
                  onClick={(e) => _onDelete(e, _reWardId)}
                >
                  {_deleteLoading ? (
                    sprinerLoading("white", "")
                  ) : (
                    <i className="icon-trash mr-2" />
                  )}{" "}
                  ລຶບ
                </button>
              </div>
            </div>
          </div>
        )}
      </Formik>
    </div>
  );
}
