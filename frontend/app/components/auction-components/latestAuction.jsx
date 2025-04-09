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
                        {/*<ul className="view-and-favorite-area">
                          <li>
                            <a href="#">
                              <svg width={16} height={15} viewBox="0 0 16 15" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.00013 3.32629L7.32792 2.63535C5.75006 1.01348 2.85685 1.57317 1.81244 3.61222C1.32211 4.57128 1.21149 5.95597 2.10683 7.72315C2.96935 9.42471 4.76378 11.4628 8.00013 13.6828C11.2365 11.4628 13.03 9.42471 13.8934 7.72315C14.7888 5.95503 14.6791 4.57128 14.1878 3.61222C13.1434 1.57317 10.2502 1.01254 8.67234 2.63441L8.00013 3.32629ZM8.00013 14.8125C-6.375 5.31378 3.57406 -2.09995 7.83512 1.8216C7.89138 1.87317 7.94669 1.9266 8.00013 1.98192C8.05303 1.92665 8.10807 1.87349 8.16513 1.82254C12.4253 -2.10182 22.3753 5.31284 8.00013 14.8125Z" />
                              </svg>
                            </a>
                          </li>
                          <li>
                            <a href="#">
                              <svg width={17} height={11} viewBox="0 0 17 11" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M15.4028 5.44118C14.0143 7.8425 11.3811 9.33421 8.53217 9.33421C5.68139 9.33421 3.04821 7.8425 1.65968 5.44118C1.55274 5.25472 1.55274 5.05762 1.65968 4.87132C3.04821 2.47003 5.68139 0.978484 8.53217 0.978484C11.3811 0.978484 14.0143 2.47003 15.4028 4.87132C15.5116 5.05762 15.5116 5.25472 15.4028 5.44118ZM16.2898 4.39522C14.7224 1.68403 11.7499 0 8.53217 0C5.31258 0 2.3401 1.68403 0.772715 4.39522C0.492428 4.87896 0.492428 5.43355 0.772715 5.91693C2.3401 8.62812 5.31258 10.3125 8.53217 10.3125C11.7499 10.3125 14.7224 8.62812 16.2898 5.91693C16.5701 5.43358 16.5701 4.87896 16.2898 4.39522ZM8.53217 7.1634C9.68098 7.1634 10.6159 6.26305 10.6159 5.15617C10.6159 4.04929 9.68098 3.14894 8.53217 3.14894C7.38152 3.14894 6.44663 4.04929 6.44663 5.15617C6.44663 6.26305 7.38156 7.1634 8.53217 7.1634ZM8.53217 2.17045C6.82095 2.17045 5.43061 3.50998 5.43061 5.1562C5.43061 6.80278 6.82098 8.14176 8.53217 8.14176C10.2416 8.14176 11.6319 6.80275 11.6319 5.1562C11.6319 3.50998 10.2416 2.17045 8.53217 2.17045Z" />
                              </svg>
                            </a>
                          </li>
                        </ul>*/}
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
                          <div className="price"><span>Current Bid at:</span> <strong>PKR {(listing.current_bid ?? 0).toLocaleString()  || "N/A"}</strong></div>
                          <br/><Link href={`/auctions/${listing.car_make}-${listing.year_model}-${listing.id}`} className="bid-btn">Bid Now</Link>
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
