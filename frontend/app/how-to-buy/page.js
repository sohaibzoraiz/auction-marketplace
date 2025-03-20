
import Breadcrumb2 from "../components/common/Breadcrumb2";
import HowTobuy from "../components/how-to-buy/HowTobuy";

export const metadata = {
  icons: {
    icon: "/assets/img/fav-icon.svg",
    title:"Probid- Multi Vendor Auction and Bidding Next js Template."
  },
};

const HowToBuePage = () => {
  return (
    <>
     
      <Breadcrumb2 pagetitle="How To Buy" currentPage="How To Buy" />
      <HowTobuy/>
      
    </>
  );
};
export default HowToBuePage;