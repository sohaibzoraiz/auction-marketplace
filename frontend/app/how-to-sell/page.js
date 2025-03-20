
import Breadcrumb2 from "../components/common/Breadcrumb2";
import HowToSell from "../components/how-to-sell/HowToSell";

export const metadata = {
  icons: {
    icon: "/assets/img/fav-icon.svg",
    title:"Probid- Multi Vendor Auction and Bidding Next js Template."
  },
};
const HowToSellPage = () => {
  return (
    <>
 
      <Breadcrumb2 pagetitle="How to Sell" currentPage="How to Sell" />
      <HowToSell/>
      
    </>
  );
};

export default HowToSellPage;
