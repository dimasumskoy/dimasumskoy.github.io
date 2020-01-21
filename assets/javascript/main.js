$(function () {
  $('.hamburger').on('click', function () {
    $(this).toggleClass('is-active');
    $('.menu').toggleClass('opened');
    $('body').toggleClass('darkened');
  });

  $('.courses-shedule .course').on('click', function () {
    $(this).toggleClass('opened');
  });

  $('a[href*="#"]').on('click', function (e) {
    e.preventDefault()

    $('html, body').animate(
      {
        scrollTop: $($(this).attr('href')).offset().top,
      },
      500,
      'linear'
    )
  })

  $('.certificate').on('click', function () {
    $(this).toggleClass('active');
  });

  $('.close-modal').on('click', function () {
    $('body').removeClass('darkened');
    $(this).parents('.modal').toggleClass('opened');
  });

  $('.open-modal-by-id').on('click', function (event) {
    event.preventDefault();
    openModal($(`#${$(this).data().modalId}`));
  });

  $('.faq-head').on('click', function (event) {
    $(this).parents('.faq').toggleClass('is-opened');
  });

  $('.program-head').on('click', function (event) {
    $(this).parents('.program').toggleClass('is-opened');
  });

  $('.carousel-body').slick({
    nextArrow: $('.next-course'),
    dots: true,
    appendDots: '.slides-control',
    speed: 800,
    autoplay: true,
    autoplaySpeed: 3000,
  });

  $('.controller').slick({
    speed: 250,
    vertical: true,
    verticalSwiping: true,
    slidesToShow: 1,
    asNavFor: '.graduates',
    centerMode: true,
    focusOnSelect: true,
    centerPadding: "75%",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          centerPadding: "85%"
        }
      },
      {
        breakpoint: 480,
        settings: {
          centerPadding: "85%"
        }
      }
    ],
    
  });

  $('.graduates').slick({
    speed: 250,
    slidesToShow: 1,
    arrows: false,
    asNavFor: '.controller',
  });

  changePreview();

  $('.graduates').on('afterChange', function(event, slick, currentSlide, nextSlide){
    changePreview();
  });
});

const openModal = (modal) => {
  $('body').addClass('darkened');
  modal.addClass('opened');
}

const changePreview = () => {
  const src = $('.slick-current .graduate-image-box img').attr('src');

  $('.current-slide-img img.slide-img').attr('src', src);
}
