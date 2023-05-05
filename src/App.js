import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";
function App() {
  let url =
    "https://eb863a74-7a4e-4daf-9540-d2db8470c18e.mock.pstmn.io/marketplace/orders/123";
  const [orders, setOrders] = useState();
  const [salePrice, setSalePrice] = useState(0);
  const [salePriceComm, setSalePriceComm] = useState(0);
  const [commision, setCommission] = useState(0);
  const [sellerFee, setSellerFee] = useState(0);
  const [earnings, setEarnings] = useState(0);
  const [orderStatus, setOrderStatus] = useState();

  useEffect(() => {
    axios.get(url).then((result) => {
      if (result.status === 200) {
        setOrders(result.data);
        setSalePrice(result.data.salePriceCents / 100);
        setSellerFee(result.data.sellerFeeCents / 100);
        setEarnings(result.data.payoutAmountCents / 100);
        setCommission(result.data.commissionRateBips * 0.01);
        setSalePriceComm(
          (result.data.salePriceCents / 100) *
            (result.data.commissionRateBips * 0.001) +
            result.data.salePriceCents / 100
        );
      }
    });
  }, []);

  const acceptSale = (status) => {
    status &&
      status === "accept" &&
      axios.post(url + status).then((result) => {
        if (result.status === 200) {
          setOrderStatus(result.data);
        }
      });
    status &&
      status === "decline" &&
      axios.post(url + status).then((result) => {
        if (result.status === 200) {
          setOrderStatus(result.data);
        }
      });
  };
  return (
    <>
      <div className="modal">
        <div className="modal-info">
          <span>CONGRATS!</span>
          <span>Your watch sold!</span>
          <p>
            You have 1 business day to accept the sale.
            <br />
            If you do not accept, it will be automatically rejected.
          </p>
          <div>
            <button className="acceptButton">accept sale</button>
            <button className="rejectButton">reject sale</button>
          </div>
        </div>
        {orders && (
          <div className="modal-itemSummary">
            <hr />
            <div className="modal-itemSummaryInfo">
              <div>
                <span>
                  {orders.listing.model.brand.displayName}{" "}
                  {orders.listing.model.displayName}
                </span>
                <span>
                  {orders.listing.condition}/{orders.listing.manufactureYear}
                </span>
              </div>
              <div>
                <img src={orders.listing.images[0].image.url} alt="watchFace"/>
              </div>
            </div>

            <hr />
            <div className="modal-itemSummaryCostInfo">
              <span>
                selling price:<span>${salePrice.toFixed(2)}</span>
              </span>
              <span>
                level 1 commision ({commision.toFixed(2)}):
                <span>${salePriceComm.toFixed(2)}</span>
              </span>
              <span>
                seller fee:<span>${sellerFee.toFixed(2)}</span>
              </span>
              <span>
                insured shipping:<span>FREE</span>
              </span>
              <span id="bezel">
                bezel authentication:<span>FREE</span>
              </span>
              <hr />
              <span>
                earnings:<span>${earnings.toFixed(2)}</span>
              </span>
            </div>
          </div>
        )}
        <i id="icon" className="fa fa-times" aria-hidden="true"></i>
      </div>
    </>
  );
}

export default App;
