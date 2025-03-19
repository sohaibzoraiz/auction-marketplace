"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { useCountdownTimer } from "@/customHooks/useCountdownTimer";

const Home2latestAuction = () => {
  const [auctions, setAuctions] = useState([]);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await fetch("/api/auctions/latest"); // Fetch latest auctions
        const data = await response.json();
        setAuctions(data);
      } catch (error) {
        console.error("Error fetching auction data:", error);
      }
    };

    fetchAuctions();
  }, []);

  const settings = useMemo(() => ({
    slidesPerView: "auto",
    speed: 1500,
    spaceBetween: 25,
    centerSlides: true, // ✅ Corrected
    autoplay: { delay: 2500, disableOnInteraction: false },
    navigation: { nextEl: ".auction-slider-next", prevEl: ".auction-slider-prev" },
    breakpoints: {
      280: { slidesPerView: 1 },
      768: { slidesPerView: 2 },
      992: { slidesPerView: 3 },
      1200: { slidesPerView: 4 },
    },
    modules: [Autoplay, Navigation, Pagination],
  }), []);
  

  return (
    <div className="home2-latest-auction-section mb-110">
      <div className="container">
        <div className="row mb-60">
          <div className="col-lg-12 d-flex align-items-center justify-content-between">
            <div className="section-title">
              <h2>Latest <span>Auction</span></h2>
            </div>
            <div className="slider-btn-grp">
              <div className="slider-btn auction-slider-prev">{"<"}</div>
              <div className="slider-btn auction-slider-next">{">"}</div>
            </div>
          </div>
        </div>
        <div className="auction-slider-area mb-60">
          <Swiper {...settings} className="swiper auction-slider">
            {auctions.map(auction => {
              const auctionEndTime = auction.end_time; // Get end_time from API
              const { days, hours, minutes, seconds } = useCountdownTimer(auctionEndTime);

              return (
                <SwiperSlide key={auction.id} className="swiper-slide">
                  <div className="auction-card style-2">
                    <div className="auction-card-img-wrap">
                      <Link href={`/car-auction/${auction.id}`} className="card-img">
                        <img src={auction.car_photos_jsonb?.[0] || "/default-image.jpg"} alt={auction.car_make} />
                      </Link>
                      <div className="batch"><span className="live">Live</span></div>
                    </div>
                    <div className="auction-card-content">
                      <h6>
                        <Link href={`/car-auction/${auction.id}`}>
                          {auction.car_make} - {auction.year_model}
                        </Link>
                      </h6>
                      <div className="price-and-code-area">
                        <div className="price">
                          <span>Current Bid:</span> <strong>${auction.current_bid}</strong>
                        </div>
                        <Link href={`/car-auction/${auction.id}`} className="bid-btn">Bid Now</Link>
                      </div>

                      {/* Countdown Timer - Dynamically updates based on auction end time */}
                      <div className="offer-timer mt-2">
                        <span>Auction Ends In:</span>
                        <div className="countdown-timer">
                          {days > 0 || hours > 0 || minutes > 0 || seconds > 0 ? (
                            <ul>
                              <li>{days}<span>Days</span></li>
                              <li>{hours}<span>Hours</span></li>
                              <li>{minutes}<span>Min</span></li>
                              <li>{seconds}<span>Sec</span></li>
                            </ul>
                          ) : (
                            <span className="text-red-500">Auction Ended</span>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default Home2latestAuction;
