import React, { useEffect, useState } from "react";
import { useMutation, useLazyQuery } from "@apollo/react-hooks";
import "../../item.css";
import useReactRouter from "use-react-router";
import { REWARD_LIST, UPDATE_REWARD } from "./gql";

import {
  aws_url_image,
  startLoading,
  stopLoading,
  formatDate,
  messageSuccess,
  messageError,
  FONT_SIZE,
  messageWarning,
  sprinerLoading,
} from "../../helper/index";
import placeholder from "../../img/placeholder.png";
import Notiflix from "notiflix";
export default function List() {
  const { history } = useReactRouter();

  const [rewardQuery, { data: rewardData, loading }] =
    useLazyQuery(REWARD_LIST);

  const [updateRewardById] = useMutation(UPDATE_REWARD);

  const [searchValue, setSearchValue] = useState();

  useEffect(() => {
    rewardQuery({
      variables: {
        where: {
          title: searchValue,
        },
      },
    });
  }, [rewardData, searchValue]);

  useEffect(() => {
    if (loading) {
      startLoading();
    } else {
      stopLoading();
    }
  }, [loading]);

  // function:
  const _onClickDelete = async (e, rewardId, title, isPublic) => {
    e.preventDefault();
    Notiflix.Confirm.show(
      "ເເຈ້ງເຕືອນ",
      `ຕ້ອງການ${isPublic === true ? "ລຶບ" : "ກູ້ຄືນ"}ລາງວັນ${
        title && title ? title : "-"
      } ເເທ້ ຫຼື ບໍ?`,
      "ຕົກລົງ",
      "ຍົກເລີກ",
      async function () {
        try {
          if (isPublic === true) {
            // updateRewardById:
            var result = await updateRewardById({
              variables: {
                data: {
                  isPublic: false,
                },
                where: {
                  id: rewardId && rewardId,
                },
              },
            });

            if (result) {
              messageSuccess("ການລຶບຂໍ້ມູນສໍາເລັດ");
              setTimeout(() => {
                window.location.reload();
              }, 1500);
            } else {
              messageError("ການລຶບຂໍ້ມູນບໍ່ສຳເລັດ");
            }
          } else if (isPublic === false) {
            // updateRewardById:
            var _result = await updateRewardById({
              variables: {
                data: {
                  isPublic: true,
                },
                where: {
                  id: rewardId && rewardId,
                },
              },
            });

            if (_result) {
              messageSuccess("ການກູ້ຄືນຂໍ້ມູນສໍາເລັດ");
              setTimeout(() => {
                window.location.reload();
              }, 1500);
            }
          }
        } catch (error) {
          messageWarning("ສິດນໍາໃຊ້ລະບົບຂອງທ່ານບໍ່ສາມາດລຶບຂໍ້ມູນນີ້ໄດ້");
        }
      }
    );
  };

  const onSearch = async (e) => {
    let value = e?.target?.value;
    if (!value) value = undefined;
    setSearchValue(value);
  };
  const _onClikDetail = (e, rewardId, isPublic) => {
    e.preventDefault();
    history.push(`list/detail/${rewardId}/${isPublic}`);
  };

  return (
    <div id="appCapsule" className="list-container bg-light">
      <div className="inner-group p-2 mt-2">
        <div>
          <button
            className="btn btn-danger btn-lg float-right"
            onClick={() => history.push("list/add")}
            style={(FONT_SIZE, { fontSize: 20 })}
          >
            <i
              style={(FONT_SIZE, { fontSize: 20 })}
              className="icon-plus-circle mr-1"
            ></i>{" "}
            ເພີ່ມລາງວັນ
          </button>
          <br />
          <label className="text-secondary">ຄົ້ນຫາ</label>
          <input
            placeholder="ຄົ້ນຫາລາງວັນ"
            type="search"
            className="form-control form-control-lg"
            onChange={(e) => {
              onSearch(e);
            }}
          ></input>
        </div>

        <div className="border-bottom mt-3 mb-1 pb-1">ລາຍການເຄື່ອງ</div>

        <div style={{ cursor: "pointer" }} className="items-group">
          {rewardData &&
            rewardData?.rewards?.data?.map((x, index) => (
              <div
                className="item"
                style={{
                  backgroundColor: x.isPublic === false ? "#cccc" : "none",
                }}
              >
                <div
                  onClick={(e) => _onClikDetail(e, x.id, x.isPublic)}
                  style={{ backgroundColor: "#f1f1f1f1" }}
                  className="detail showdetail"
                  title="ກົດເເກ້ໄຂ"
                >
                  <img
                    className="img"
                    src={x?.image ? `${aws_url_image}${x?.image}` : placeholder}
                    alt="img"
                    data-darkbox-group="two"
                  />
                </div>
                <div className="right">
                  <div
                    onClick={(e) => _onClikDetail(e, x.id, x.isPublic)}
                    className="detail"
                  >
                    <h3>{x.title && x.title}</h3>
                    <p>{x.rewardCode && x.rewardCode}</p>
                    <p>
                      {formatDate(x.createdAt) + "-" + formatDate(x.endDate)}
                    </p>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "right",
                    }}
                  >
                    <div className="Action">
                      <button
                        hidden={x.isPublic === false ? true : false}
                        onClick={(e) => _onClikDetail(e, x.id, x.isPublic)}
                        className={"btn btn-delete pl-2 pr-2"}
                      >
                        <i className="icon-edit mr-2" />
                        {"ເເກ້ໄຂ"}
                      </button>
                    </div>

                    <div style={{ padding: "10px" }} />
                    <button
                      onClick={(e) => {
                        _onClickDelete(e, x.id, x.title, x.isPublic);
                      }}
                      className={
                        x.isPublic === false
                          ? "btn btn-delete pl-2 pr-2"
                          : "btn btn-delete btn-success pl-2 pr-2"
                      }
                    >
                      {x.isPublic === false ? "ປິດໃຊ້ງານ" : "ເປີດໃຊ້ງານ"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
