import React, { useState, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, EffectFade, Pagination } from "swiper/modules";

const AuctionDetailsSlider = ({images}) => {
   // console.log(images);
  const [activeIndex, setActiveIndex] = useState(0);

  const settings = useMemo(() => ({
    slidesPerView: 5,  // Fix infinite width issue
    speed: 1500,
    spaceBetween: 15,
    grabCursor: true,
    autoplay: { delay: 2500, disableOnInteraction: false, pauseOnMouseEnter: true },
    navigation: {
      nextEl: ".category-slider-next",
      prevEl: ".category-slider-prev",
    },
    modules: [Autoplay, EffectFade,  Navigation, Pagination],
    breakpoints: {
      280: { slidesPerView: 2 },
      350: { slidesPerView: 3, spaceBetween: 10 },
      576: { slidesPerView: 3, spaceBetween: 15 },
      768: { slidesPerView: 4 },
      992: { slidesPerView: 5, spaceBetween: 15 },
      1200: { slidesPerView: 5 },
      1400: { slidesPerView: 5 },
    },
  }), []);
  return (
    
    <div className="auction-details-img">
    {/* ✅ MAIN IMAGE DISPLAY - Ensures correct Bootstrap tab functionality */}
    <div className="tab-content" id="v-pills-tabContent">
      {images.map((img, index) => (
        <div
          key={index}
          className={`tab-pane fade ${index === activeIndex ? "show active" : ""}`}
          id={`v-pills-img${index + 1}`}
          role="tabpanel"
        >
          <div className="auction-details-tab-img">
            <img src={img} alt={`Auction Car ${index + 1}`} />
          </div>
        </div>
      ))}
    </div>
  
    {/* ✅ Thumbnails with Bootstrap tab controls */}
    <div className="nav nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
      <Swiper {...settings} className="swiper auction-details-nav-slider">
        {images.map((img, index) => (
          <SwiperSlide key={index} className="swiper-slide">
            <div className="nav-item" role="presentation">
              <button
                className={`nav-link ${index === activeIndex ? "active" : ""}`}
                id={`v-pills-img${index + 1}-tab`}
                data-bs-toggle="pill"
                data-bs-target={`#v-pills-img${index + 1}`}
                type="button"
                role="tab"
                aria-controls={`v-pills-img${index + 1}`}
                aria-selected={index === activeIndex ? "true" : "false"}
                onClick={() => setActiveIndex(index)}
              >
                <img src={img} alt={`Thumbnail ${index + 1}`} />
              </button>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  </div>
  
  );
};

export default AuctionDetailsSlider;
