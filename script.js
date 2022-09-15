"use strict";
// assigning variables
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");
const btnNavOpen = document.querySelector(".open-mobile-icon");
const btnNavClose = document.querySelector(".close-mobile-icon");
const header = document.querySelector(".header");
const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");
const nav = document.querySelector(".nav");
const everySection = document.querySelectorAll(".section");
const imgTars = document.querySelectorAll("img[data-src]");
const loader = document.querySelector(".loader-overlay");

/////////////////////////////////////////////
// preloader
window.addEventListener("load", () => {
  loader.classList.add("hidden");
});
///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};
btnsOpenModal.forEach((mol) => mol.addEventListener("click", openModal));

//old method
// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener("click", openModal);

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});
/////////////////////////////////////////////////
///// sticky nav
//// using scroll event (bad for performance) and hos an issue with reloarding so dont use it
//
// const initalY = section1.getBoundingClientRect();
// window.addEventListener("scroll", () => {
//   if (window.scrollY > initalY.top) {
//     nav.classList.add("sticky");
//   } else {
//     nav.classList.remove("sticky");
//   }
// });
//// using the intersection observer api(best way)
const navHeight = nav.getBoundingClientRect().height;

const obsOption = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
};
const stickyNav = function (entries) {
  const [entry] = entries;
  if (entry.isIntersecting === false) nav.classList.add("sticky");
  else {
    nav.classList.remove("sticky");
  }
};
const headerObserver = new IntersectionObserver(stickyNav, obsOption);
headerObserver.observe(header);
/////////////////////////////////////////////////
// mobile nav

btnNavOpen.addEventListener("click", function () {
  header.classList.add("nav-open");
});
btnNavClose.addEventListener("click", function () {
  header.classList.remove("nav-open");
});
const allLinks = document.querySelectorAll("a:link");

allLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (link.classList.contains("nav__link")) {
      header.classList.remove("nav-open");
    }
  });
});
////////////////btn and smooth scrolling

btnScrollTo.addEventListener("click", function (e) {
  const s1cord = section1.getBoundingClientRect();

  section1.scrollIntoView({
    behavior: "smooth",
  });
});
///////////// page navigation and smooth scrolling
//in efficent
// document.querySelectorAll(".nav__link").forEach((el) =>
//   el.addEventListener("click", (e) => {
//     e.preventDefault();
//     const id = el.getAttribute("href");
//     document.querySelector(id).scrollIntoView({
//       behavior: "smooth",
//     });
//   })
// );
// efficent
// 1) add the event listerner to common parent element
document.querySelector(".nav__links").addEventListener("click", (e) => {
  e.preventDefault();
  // console.log(e.target.get);
  // marching
  // 2) determine what elment originated the event
  if (e.target.classList.contains("nav-nav")) {
    // console.log("true");
    const id = e.target.getAttribute("href");
    document.querySelector(id).scrollIntoView({
      behavior: "smooth",
    });
  }
});

/////////////////////////////////// tabbed component

tabsContainer.addEventListener("click", (e) => {
  const cliked = e.target.closest(".operations__tab");
  // guard clause
  if (!cliked) return;
  // .classList.contains("operations__tab--active");
  // showing activve tab
  tabs.forEach((t) => t.classList.remove("operations__tab--active"));
  cliked.classList.add("operations__tab--active");
  // remove content
  tabsContent.forEach((tc) =>
    tc.classList.remove("operations__content--active")
  );

  // activate content
  document
    .querySelector(`.operations__content--${cliked.dataset.tab}`)
    .classList.add("operations__content--active");
});
///////////////////////// fading menu animation
const opacityEffect = function (e) {
  if (e.target.classList.contains("nav__link")) {
    const link = e.target;

    const slibings = link.closest(".nav").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector("img");
    slibings.forEach((el) => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};
// passing "argument" into handler function
nav.addEventListener("mouseover", opacityEffect.bind(0.5));
nav.addEventListener("mouseout", opacityEffect.bind(1));
/// reveling element
const revSection = (ent, obs) => {
  const [entry] = ent;
  // console.log(entry);
  if (!entry.isIntersecting) return;

  entry.target.classList.remove("section--hidden");
  obs.unobserve(entry.target);
};
const revobj = {
  root: null,
  threshold: 0.15,
};
const sectionObs = new IntersectionObserver(revSection, revobj);
everySection.forEach((sec) => {
  sectionObs.observe(sec);
  // add the class programatically for users who disable javascript
  sec.classList.add("section--hidden");
});
////lazy loading images(increses performance)
const imgloading = (ent, obs) => {
  const [entry] = ent;
  if (!entry.isIntersecting) return;
  // replace the src with data src
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener("load", function () {
    entry.target.classList.remove("lazy-img");
  });
  obs.unobserve(entry.target);
};
const loadingobj = {
  root: null,
  threshold: 0,
  rootMargin: "200px",
};
const imgObs = new IntersectionObserver(imgloading, loadingobj);
imgTars.forEach((img) => imgObs.observe(img));
//////////////////////////////////////////////// ////////carsossel component
const carsossel = function () {
  const slide = document.querySelectorAll(".slide");
  const slider = document.querySelector(".slider");
  const dotsContainer = document.querySelector(".dots");
  let currSlide = 0;
  const maxSlide = slide.length;
  // functions
  // creating the dots
  const createDots = () => {
    slide.forEach((s, i) => {
      dotsContainer.insertAdjacentHTML(
        "beforeend",
        `<button class = 'dots__dot' data-slide = '${i}'></button> `
      );
    });
  };

  const showActiveDot = (slides = 0) => {
    document.querySelectorAll(".dots__dot").forEach((dot) => {
      dot.classList.remove("dots__dot--active");
      document
        .querySelector(`.dots__dot[data-slide="${slides}"]`)
        .classList.add("dots__dot--active");
    });
  };

  const goToSlide = (slides = 0) => {
    slide.forEach((s, i) => {
      s.style.transform = `translateX(${100 * (i - slides)}%)`;
    });
  };
  const btnLeft = document.querySelector(".slider__btn--left");
  const btnRight = document.querySelector(".slider__btn--right");

  // nxt slide
  const nxtSlide = () => {
    if (currSlide === maxSlide - 1) {
      currSlide = 0;
    } else {
      currSlide++;
    }
    goToSlide(currSlide);
    showActiveDot(currSlide);
  };
  const preSlide = () => {
    if (currSlide === 0) {
      currSlide = maxSlide - 1;
    } else {
      currSlide--;
    }

    goToSlide(currSlide);
    showActiveDot(currSlide);
  };
  const initailization = function () {
    createDots();
    showActiveDot();
    goToSlide();
  };
  initailization();
  setInterval(nxtSlide, 10000);
  // event handelers
  btnRight.addEventListener("click", nxtSlide);
  btnLeft.addEventListener("click", preSlide);
  // attaching keyboard event to slider
  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") nxtSlide();
    if (e.key === "ArrowLeft") preSlide();
  });
  //  impletmenting dots
  dotsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("dots__dot")) {
      const slides = e.target.dataset.slide;
      goToSlide(slides);
      showActiveDot(slides);
    }
  });
};
carsossel();
// to add an event before the user closes the page
// window.addEventListener("beforeunload", function (e) {
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = "";
// });

