import Home1About from "../components/about-section/Home1About";
import Home5About from "../components/about-section/Home5About";
import Breadcrumb2 from "../components/common/Breadcrumb2";
import Home2Faq from "../components/faq/Home2Faq";
import Home2ProcessSection from "../components/process-section/Home2ProcessSection";

import React from "react";
export const metadata = {
  title: "Probid- Multi Vendor Auction and Bidding Next js Template.",
  icons: {
    icon: "/assets/img/fav-icon.svg",
  },
};
const AboutPage = () => {
  return (
    <>
      <Breadcrumb2 pagetitle="About Us" currentPage="About Us" />
      <Home5About />
      <Home1About />
      <Home2ProcessSection />
      <Home2Faq />
   
    </>
  );
};

export default AboutPage;
