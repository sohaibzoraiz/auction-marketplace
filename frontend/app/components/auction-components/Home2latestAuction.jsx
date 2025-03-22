"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import Link from "next/link";
import { useCountdownTimer } from "@/customHooks/useCountdownTimer";
import { useMemo } from "react";

const Home2latestAuction = ({ listings = [] }) => {
  const timers = useCountdownTimer(listings);
  const settings = useMemo(() => ({
    slidesPerView: 1,
    speed: 1500,
    spaceBetween: 25,
    autoplay: { delay: 2500, disableOnInteraction: false, pauseOnMouseEnter: true },
    navigation: { nextEl: ".auction-slider-next", prevEl: ".auction-slider-prev" },
    pagination: { clickable: true },
    modules: [Autoplay, Navigation, Pagination],
    breakpoints: {
      280: { slidesPerView: 1 },
      576: { slidesPerView: 2 },
      768: { slidesPerView: 3 },
      992: { slidesPerView: 4 },
      1200: { slidesPerView: 4 },
    },
  }), []);

  return (
    <div className="home2-latest-auction-section mb-110">
      <div className="container">
        <div className="row mb-60 wow animate fadeInDown">
          <div className="col-lg-12 d-flex align-items-center justify-content-between flex-wrap gap-3">
            <div className="section-title">
              <h2>Latest <span>Auction</span></h2>
            </div>
            <div className="slider-btn-grp">
                <div className="slider-btn auction-slider-prev">
                  <svg width={9} height={15} viewBox="0 0 9 15" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 7.50009L9 0L3.27273 7.50009L9 15L0 7.50009Z" />
                  </svg>
                </div>
                <div className="slider-btn auction-slider-next">
                  <svg width={9} height={15} viewBox="0 0 9 15" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 7.50009L0 0L5.72727 7.50009L0 15L9 7.50009Z" />
                  </svg>
                </div>
              </div>
          </div>
        </div>
        
        <div className="auction-slider-area mb-60 wow animate fadeInUp">
          <Swiper {...settings} className="swiper auction-slider">
            {listings.length > 0 ? (
              listings.map((listing) => {
                const timer = timers[listing.id] || { days: "00", hours: "00", minutes: "00", seconds: "00" };
                return (
                  <SwiperSlide key={listing.id} className="swiper-slide">
                    <div className="auction-card style-2">
                      <div className="auction-card-img-wrap">
                        <Link href={`/auctions/${listing.car_make}-${listing.year_model}-${listing.id}`} className="card-img">
                          <img src={listing.car_photos_jsonb?.[0]} alt={listing.car_make} />
                        </Link>
                        <div className="batch"><span className="live">Live</span></div>
                        <div className="countdown-timer">
                          <ul>
                            <li className="times">{timer.days}<span>Days</span></li>
                            <li className="colon">:</li>
                            <li className="times">{timer.hours}<span>Hours</span></li>
                            <li className="colon">:</li>
                            <li className="times">{timer.minutes}<span>Min</span></li>
                            <li className="colon">:</li>
                            <li className="times">{timer.seconds}<span>Sec</span></li>
                          </ul>
                        </div>
                      </div>
                      <div className="auction-card-content">
                        <h6><Link href={`/auctions/${listing.car_make}-${listing.year_model}-${listing.id}`}>{listing.car_make}</Link></h6>
                        <div className="price-and-code-area">
                          <div className="price"><span>Current Bid at:</span> <strong>${listing.current_bid || "N/A"}</strong></div>
                          <Link href={`/auctions/${listing.car_make}-${listing.year_model}-${listing.id}`} className="bid-btn">Bid Now</Link>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })
            ) : (
              <p>No latest auctions available.</p>
            )}
          </Swiper>
        </div>
        <div className="view-all-auctions text-center mt-4">
            <Link href="/auctions" className="view-all-btn">
              View All Auctions
            </Link>
        </div>
      </div>
    </div>
  );
};

export default Home2latestAuction;
