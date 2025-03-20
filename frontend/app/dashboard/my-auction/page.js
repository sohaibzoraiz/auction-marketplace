import Breadcrumb2 from "../../components/common/Breadcrumb2";
import CarAuctiionMyAuction from "../../components/dashboard/CarAuctiionMyAuction";

//import Link from "next/link";
import React from "react";
export const metadata = {
  icons: {
    icon: "/assets/img/fav-icon.svg",
    title:"Probid- Multi Vendor Auction and Bidding Next js Template."
  },
};
const MyAuctionPage = () => {
  return (
    <>
     
      <Breadcrumb2 pagetitle={"My Auction"} currentPage={"My Auction"} />
      <CarAuctiionMyAuction/>
     
    </>
  );
};

export default MyAuctionPage;
