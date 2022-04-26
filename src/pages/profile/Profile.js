import React, { useEffect, useState } from "react";
import "./profile.css";
import useReactRouter from "use-react-router";
import poster from "../../img/poster.jpeg";
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import { GET_RANK_BY_ID, LIST_CATALOG } from "./gql";
import { Pagination } from "react-bootstrap";

import {
  startLoading,
  stopLoading,
  TOKEN,
  sprinerLoading,
  currency,
  formatDateTime,
  aws_url_image,
} from "../../helper";

export default function Profile() {
  const { history, match } = useReactRouter();
  const numberPage = match?.params?.page;
  const [numberRows, setNumberRows] = useState(20);
  const localToken = JSON.parse(localStorage?.getItem(TOKEN));
  const userInfo = localToken?.data?.staffLogin?.data;
  const [newData, setNewData] = useState([]);
  const [callCatalog, { data: CataloData, loading: catalogLoading }] =
    useLazyQuery(LIST_CATALOG, { fetchPolicy: "network-only" });

  const fetchCatalog = () => {
    callCatalog({
      variables: {
        orderBy: "createdAt_DESC",
        skip: numberRows * (numberPage - 1),
        limit: numberRows,
      },
    });
  };

  useEffect(() => {
    fetchCatalog();
  }, []);

  useEffect(() => {
    if (CataloData?.luckyCatalogs) {
      setNewData(CataloData?.luckyCatalogs?.data);
    }
  }, [CataloData]);

  if (catalogLoading) {
    startLoading();
  } else {
    stopLoading();
  }

  // pagination :
  var total = CataloData?.luckyCatalogs?.total;
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams && queryParams.get("rows")) {
      setNumberRows(parseInt(queryParams.get("rows")));
    }
  }, []);

  const countPage = [];
  for (var i = 1; i <= Math.ceil(total / numberRows); i++) {
    countPage.push(i);
  }
  const onBack = () => {
    if (parseInt(numberPage) - 1 < 1) {
      history.push(`/profile/${1}`);
    } else {
      history.push(`/profile/${parseInt(numberPage) - 1}`);
    }
  };

  const NO = (index) => {
    const no = numberRows * numberPage - numberRows;
    return no + index + 1;
  };

  const onNext = () => {
    if (parseInt(numberPage) + 1 > countPage.length) {
      history.push(`/profile/${countPage.length}`);
    } else {
      history.push(`/profile/${parseInt(numberPage) + 1}`);
    }
  };
  const _onChangePageList = (e) => {
    let itemPage = e?.target?.value;
    history.push(`/profile/${itemPage}?rows=${numberRows}`);
  };
  const _onChangeRows = (e) => {
    let value = e?.target?.value;
    setNumberRows(parseInt(value));
  };

  return (
    <div id="appCapsule" className="profile bg-white">
      <div className="row">
        <div className="col-md-12 pt-5">
          <center>
            {" "}
            <h2>ລາຍການຜູ້ໂຊກດີ</h2>
          </center>
          <hr />
          <div className="m-2">
            <div className="float-left">
              <span>
                ສະເເດງ {numberRows * numberPage - numberRows + 1} {"-"}{" "}
                {numberRows * numberPage} ລາຍການ ໃນຂໍ້ມູນທັງໜົດ{" "}
                {currency(CataloData?.luckyCatalogs?.total) ?? ""} ລາຍການ
              </span>
            </div>

            <div className="mb-2 form-inline justify-content-end">
              <label for="sel-rows">ສະແດງ:</label>
              <div style={{ padding: "4px" }} />
              <select
                id="sel-rows"
                className="form-control ml-2"
                onChange={(e) => {
                  _onChangeRows(e);
                }}
                value={numberRows}
              >
                <option
                  value={CataloData?.luckyCatalogs?.total ?? ""}
                  selected={numberRows === "" ? true : false}
                >
                  ທັງໝົດ
                </option>
                <option value="20" selected={numberRows === 20 ? true : false}>
                  20 ລາຍການ
                </option>
                <option value="50" selected={numberRows === 50 ? true : false}>
                  50 ລາຍການ
                </option>
                <option
                  value="100"
                  selected={numberRows === 100 ? true : false}
                >
                  100 ລາຍການ
                </option>
                <option
                  value="500"
                  selected={numberRows === 500 ? true : false}
                >
                  500 ລາຍການ
                </option>
                <option
                  value="1000"
                  selected={numberRows === 1000 ? true : false}
                >
                  1000 ລາຍການ
                </option>
                <option
                  value="5000"
                  selected={numberRows === 5000 ? true : false}
                >
                  5000 ລາຍການ
                </option>
                <option
                  value="5000"
                  selected={numberRows === 10000 ? true : false}
                >
                  10000 ລາຍການ
                </option>
              </select>
            </div>
          </div>
          {newData &&
            newData.map((x, index) => (
              <div className="card m-1">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-1">
                      <img
                        src={
                          x?.rewardId?.image
                            ? `${aws_url_image}${x?.rewardId?.image}`
                            : poster
                        }
                        alt=""
                        style={{ width: "100%", height: 100, marginBottom: 15 }}
                      />
                    </div>
                    <div className="col-md-6 pt-1 pl-3">
                      <p style={{ fontSize: 25 }}>
                        ລາງວັນ: {x?.rewardId?.title}
                      </p>
                      <p style={{ fontSize: 16 }}>
                        ເລກພັດສະດຸຜູ້ໂຊກດີ: {x.luckyNumber}
                      </p>
                      <p>ໄອດີຜູ້ໂຊກດີ: {x?.note}</p>
                    </div>
                    <div className="col-md-3">
                      <p>ລາງວັນທີ່: {x?.rewardId?.th}</p>
                      <p>ຄັ້ງວັນທີ: {formatDateTime(x?.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          <Pagination
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: 20,
            }}
          >
            <Pagination.Prev onClick={onBack} />
            {countPage.map((Item) => {
              if (Item <= 10) {
                return (
                  <Pagination.Item
                    key={Item}
                    active={
                      parseInt(Item) === parseInt(numberPage) ? "active" : null
                    }
                    onClick={() =>
                      history.push(`/profile/${Item}?rows=${numberRows}`)
                    }
                  >
                    {Item}
                  </Pagination.Item>
                );
              }
            })}
            {countPage.length > 10 && (
              <div className="form-inline">
                <select
                  className="form-control"
                  onChange={(e) => {
                    _onChangePageList(e);
                  }}
                  value={numberPage}
                >
                  {countPage.map((Item) => {
                    if (Item > 10) {
                      return <option value={Item}>{Item}</option>;
                    }
                  })}
                </select>
              </div>
            )}
            <Pagination.Next onClick={onNext} />
          </Pagination>
        </div>
      </div>
    </div>
  );
}
