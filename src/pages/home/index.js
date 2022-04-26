import React, { useEffect, useState } from "react";
import { useMutation, useLazyQuery } from "@apollo/react-hooks";
import logo from "../../img/logo-app.png";
import poster from "../../img/poster.jpeg";
import sound from "../../audio/sound.wav";
import _ from "lodash";
import moment from "moment";
import Modal from "react-bootstrap/Modal";
import "./index.css";
import {
  GET_ALL_REWARD,
  CREATE_CATALOG,
  LIST_CATALOG,
  LIST_ITEM,
  DELETE_ITEM,
  UPDATE_ITEM,
} from "./gql";
import {
  startLoading,
  stopLoading,
  aws_url_image,
  sprinerLoading,
  messageSuccess,
  formatDateTime,
} from "../../helper/index";

export default function Home() {
  const [newData, setNewData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [getFinalData, setFinalData] = useState();

  const [callCatalog, { data: CataloData, catalogLoading }] = useLazyQuery(
    LIST_CATALOG,
    { fetchPolicy: "network-only" }
  );
  const [callItem, { data: ItemData, loading: LoadingItem }] = useLazyQuery(
    LIST_ITEM,
    {
      fetchPolicy: "network-only",
    }
  );
  
  

  const [rewardQuery, { data: rewardData, loading }] =
    useLazyQuery(GET_ALL_REWARD);
  const rewardID = rewardData?.rewards?.data[0]?.id;
  const rewardName = rewardData?.rewards?.data[0]?.title;
  const rewardImage = rewardData?.rewards?.data[0]?.image;
  const rewardTh = rewardData?.rewards?.data[0]?.th;

  const [createLuckyCatalog] = useMutation(CREATE_CATALOG);
  const [updateItem] = useMutation(UPDATE_ITEM);
  const arr1 = ["0", "0", "0", "0", "0", "0", "0", "0"];
  const [result, setResult] = useState(arr1);

  const fetchCatalog = () => {
    callCatalog({
      variables: {
        limit: 10,
        where: {
          rewardId: rewardID,
          createdAt_gte: moment(new Date()).format("YYYY-MM-DD"),
          createdAt_lt: moment(new Date()).add(1, "days").format("YYYY-MM-DD"),
        },
        orderBy: "createdAt_DESC",
      },
    });
  };

  const _onSave = async (e) => {
    const onFilter = ItemData?.itemForRewards?.data.filter(
      (item) => item.trackingId === e.toString()
    );

    // update status
    let itemId = onFilter[0]?.id;
    updateItem({
      variables: { where: { id: itemId }, data: { isPublic: false } },
    });

    fetchCatalog();

    const _NewData = {
      rewardId: rewardID.toString(),
      luckyNumber: e?.toString(),
      luckyName: onFilter[0]?.itemName?.toString(),
      note: onFilter[0]?.customerId?.toString(),
    };
    const created = createLuckyCatalog({
      variables: {
        data: _NewData,
      },
    });
    if (created) messageSuccess("ບັນທຶກສຳເລັດ");
    setResult(arr1);
  };

  useEffect(() => {
    callItem({
      variables: {
        where: { isPublic: true },
      },
    });
  }, []);

  useEffect(() => {
    if (CataloData?.luckyCatalogs) {
      setNewData(CataloData?.luckyCatalogs?.data);
    }
  }, [CataloData]);

  useEffect(() => {
    callCatalog({
      variables: {
        limit: 10,
        where: {
          rewardId: rewardID,
          createdAt_gte: moment(new Date()).format("YYYY-MM-DD"),
          createdAt_lt: moment(new Date()).add(1, "days").format("YYYY-MM-DD"),
        },
        orderBy: "createdAt_DESC",
      },
    });
    rewardQuery({
      variables: {
        where: {
          isPublic: true,
        },
        limit: 1,
      },
    });
  }, [rewardData, rewardQuery]);

  const randomHandler = async () => {
    let arr = [];
    for (var i = 0; i < ItemData?.itemForRewards?.data?.length; i++) {
      var res = ItemData?.itemForRewards?.data[i]?.trackingId;
      arr.push(res);
    }
    let refreshIntervalId = setInterval(async () => {
      const randomIndex = await Math.floor(Math.random() * arr.length);
      const item = await arr[randomIndex]?.split("");
      setResult(item);
    }, [70]);
    setTimeout(async () => {
      fetchCatalog();
      clearInterval(refreshIntervalId);
      setShowPopup(true);
      const audioEl = document.getElementsByClassName("audio-element")[0];
      audioEl.play();
    }, 20000);
  };
  return (
    <div>
      <audio className="audio-element">
        <source src={sound}></source>
      </audio>
      <div className="row" id="appCapsule">
        <div
          className="col-md-5 m-2 p-3"
          style={{
            backgroundColor: "#fff0f6",
            borderRadius: 10,
            height: "500px",
            overflow: "scroll",
          }}
        >
          {catalogLoading ? sprinerLoading("danger", "loading...") : false}
          {newData &&
            newData.map((x, index) => (
              <a href={"http://anousith-reward-php.anousith-services.com/services/reward/index.php?trackingNumber=" + x.luckyNumber} target="_blank" style={{color: "black"}}>
              <div className="card m-1">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-2">
                      <img
                        src={
                          x?.rewardId?.image
                            ? `${aws_url_image}${x?.rewardId?.image}`
                            : poster
                        }
                        alt=""
                        style={{ width: "100%", height: 80 }}
                      />
                    </div>
                    <div className="col-md-6 pt-1 pl-4">
                      <span style={{ fontSize: 28, fontFamily: "Impact" }}>
                        {x.luckyNumber}
                      </span>
                      <p>ໄອດີຜູ້ໂຊກດີ: {x?.note}</p>
                    </div>
                  </div>
                </div>
              </div>
              </a>
            ))}
        </div>
        <div
          className="col-md-6 bg-white m-2"
          style={{ borderRadius: 10, paddingLeft: 20 }}
        >
          <div className="row">
            {result &&
              result.map((val) => {
                return <div className="col-md-1 number">{val && val} </div>;
              })}
            <div className="col-md-8 mt-4 ml-2">
              <button
                onClick={() => {
                  randomHandler();
                }}
                type="button"
                disabled={LoadingItem ? true : false}
                className="btn btn-danger btn-block btn-lg p-4 w-100"
                style={{ fontSize: 30, fontWeight: "bold" }}
              >
                <i className="icon-play mr-1"></i>
                {LoadingItem ? "ກຳລັງໂຫລດຂໍ້ມູນ..." : "ເລີ່ມເກມ"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div
          className="col-md-6 bg-danger winder-bar"
          style={{
            height: 130,
            borderTopRightRadius: 70,
            bottom: 50,
            position: "absolute",
          }}
        >
          <div className="row">
            <div className="col-md-8">
              <img src={logo} alt="" style={{ width: "95%", marginTop: -40 }} />
            </div>
            <div className="col-md-4">
              <p
                style={{
                  fontSize: 85,
                  marginTop: 50,
                  fontWeight: "bold",
                  fontFamily: "Impact",
                }}
              >
                GAME
              </p>
            </div>
          </div>
        </div>

        <div
          className="col-md-6"
          style={{ position: "absolute", right: 0, bottom: 60 }}
        >
          <div className="row">
            <div className="col-md-4"></div>
            {rewardData?.rewards?.data?.map((val, index) => {
              return (
                <div className="col-md-4">
                  <div className="count-reward">
                    {val?.title} ຈຳນວນ {val?.qty} ລາງວັນ
                  </div>
                  <img
                    src={val?.image ? `${aws_url_image}${val?.image}` : poster}
                    alt=""
                    style={{ width: "100%", height: 200, marginBottom: 15 }}
                  />
                  <button
                    type="button"
                    className="btn btn-danger btn-block btn-lg winder"
                    style={{ fontSize: 28, padding: 30 }}
                    onClick={(e) => {
                      // _createCatalog();
                    }}
                  >
                    ລາງວັນທີ {val?.th}
                  </button>
                </div>
              );
            })}

            <div className="col-md-12 mt-3">
              <div
                className="winder-bar p-3"
                style={{ borderRadius: 5, backgroundColor: "#223A5E" }}
              >
                <marquee>
                  <strong
                    style={{
                      fontSize: 24,
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    🤷‍♀️ ແຈກໂຊກຄັ້ງຍິ່ງໃຫຍ່, ຜູ້ໂຊກດີອາດເປັນທ່ານ🥰 🎉🎁&nbsp;
                    ເງື່ອນໄຂງ່າຍໆ ສຳລັບການລຸ້ນຮັບຂອງລາງວັນຈາກ Anousith Express
                    ຂອງພວກເຮົາ... 🎁🎊 💵🎊 &nbsp;ລວມມູນຄ່າຫຼາຍກວ່າ 100,000,000
                    ກີບ. &nbsp; 🤷‍♀️ ພຽງແຕ່ທ່ານເຂົ້າມາໃຊ້ບໍລິການກັບພວກເຮົາ
                    ບໍ່ວ່າຈະເປັນຜູ້ຝາກ ຫລື ຜູ້ຮັບ
                    ທ່ານກໍ່ມີສິດລຸ້ນຮັບລາງວັນໃຫຍ່ຈາກພວກເຮົາໄປເລີຍ.&nbsp; ✅
                    ລາງວັນທີ1 ລົດຈັກ Honda zoomer x 1 ລາງວັນ&nbsp; ✅ ລາງວັນທີ2
                    IPhone 13 pro 1 ລາງວັນ.&nbsp; ✅ ລາງວັນທີ3 ສາຍຄໍຄຳ 1ສະຫຼືງ 4
                    ລາງວັນ.&nbsp; ✅ ລາງວັນທີ4 ເງີນສົດມູນຄ່າ 500,000ກີບ 10
                    ລາງວັນ. .....................🎊🎁
                    🛵📱🥇💸🎊.............&nbsp; 🥳🎁 ພິເສດໄປກວ່ານັ້ນ
                    ພວກເຮົາຍັງມີການແລນດອມຊອກຫາລາຍຊື່ຜູ້ໂຊກດີ
                    ຈາກເລກພັດສະດຸຂອງທ່ານທຸກໆ ທ້າຍອາທິດໄປຈົນເຖິງທ້າຍປີ2021.&nbsp;
                    😱🎊ຊຶ່ງຂອງລາງວັນລວມມີຫລາຍກວ່າ 1,000 ລາງວັນ, ມູນຄ່າຫຼາຍກວ່າ
                    50,000,000 ກີບ.&nbsp; ✅ ປຣິ່ນເຕີ 100 ລາງວັນ,&nbsp; ✅
                    ເສື້ອຍືດ 120 ລາງວັນ,&nbsp; ✅ ຖົງຜ້າ 120 ລາງວັນ,&nbsp; ✅
                    ໝວກ 120 ລາງວັນ,&nbsp; ✅ ຜ້າພັນຄໍ 100 ລາງວັນ&nbsp; ✅
                    ຜ້າອັດປາກ 500 ລາງວັນ. 🎰🎉 ເຊີ່ງການແລນດອມຫາຜູ້ໂຊກດີ
                    ແມ່ນຈະມີການປະກາດຜົນຜ່ານ Facebook Fage, Anousith Express
                    ຊ່ອງທາງດຽວເທົ່ານັ້ນ. 🚚 ຝາກເລີຍ,ຍິ່ງຝາກຫລາຍຍິ່ງມີສິດລຸ້ນຫລາຍ
                    📦
                  </strong>
                </marquee>
              </div>
            </div>
          </div>
        </div>
        {/*  */}
      </div>

      <Modal centered size={"lg"} show={showPopup}>
        <Modal.Body style={{ backgroundColor: "red", height: 600 }}>
          <div className="row">
            <div className="col-md-12 text-center">
              <h1 style={{ color: "yellow" }}>ເລກພັດສະດຸຜູ້ໂຊກດີ</h1>
              <hr style={{ backgroundColor: "white" }} />
            </div>
            <div className="col-md-12 text-center">
              <img
                src={rewardImage ? `${aws_url_image}${rewardImage}` : poster}
                alt=""
                style={{ width: 150 }}
              />
            </div>
            <div className="col-md-12 row">
              <div className="col-md-1"></div>
              {result &&
                result?.map((val) => {
                  return (
                    <div
                      className="col-md-1 mt-5 number"
                      style={{ border: "1px solid white", color: "yellow" }}
                    >
                      {val && val}
                    </div>
                  );
                })}
            </div>
            <div className="col-md-12 pt-3 text-center">
              <h2 className="text-white">ຂອງລາງວັນ: {rewardName}</h2>
              <h2 className="text-white">ລາງວັນທີ: {rewardTh}</h2>
            </div>
            <div className="col-md-4"></div>
            <div
              className="col-md-12 mt-3 text-center"
              style={{ fontSize: 35, width: 200 }}
            >
              <button
                type="button"
                className="btn btn-danger mt-5 btn-block btn-lg"
                style={{ fontsize: 40 }}
                onClick={() => {
                  setShowPopup(false);
                  _onSave(parseFloat(_.join(result).replace(/,/g, "")));
                }}
              >
                {" "}
                <span style={{ fontsize: 30 }}>ເລີ່ມເກມໃໝ່</span>
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
