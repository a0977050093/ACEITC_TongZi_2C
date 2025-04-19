/* 外部 JavaScript 檔案引用 */
import "/media/jui/js/jquery.min.js?d08b5f2049c2bf0567fd095e18630153";
import "/media/jui/js/jquery-noconflict.js?d08b5f2049c2bf0567fd095e18630153";
import "/media/jui/js/jquery-migrate.min.js?d08b5f2049c2bf0567fd095e18630153";
import "/media/plg_system_sl_scrolltotop/js/scrolltotop_jq.js";
import "/plugins/system/jcemediabox/js/jcemediabox.js?0c56fee23edfcb9fbdfe257623c5280e";
import "https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js";
import "/templates/cadiis/plugin/bootstrap/js/bootstrap.min.js";
import "/templates/cadiis/plugin/aos/dist/aos.js";
import "/modules/mod_ebstickycookienotice/tmpl/assets/js/cookie_script.js";
import "/modules/mod_kkcontent_custom/tmpl/assets/js/owl-carousel/owl.carousel.min.js";
import "/modules/mod_kkcontent_custom/tmpl/assets/js/superslider/jquery.themepunch.revolution.min.js";
import "/modules/mod_kkcontent_custom/tmpl/assets/js/superslider/jquery.themepunch.tools.min.js";

/* 內嵌 JavaScript */
// Scroll to Top
jQuery(document).ready(function() {
    jQuery(document.body).SLScrollToTop({
        'image': '/Uploads/icon/top.png',
        'text': '',
        'title': 'Go to top',
        'className': 'scrollToTop',
        'duration': 500
    });
});

// JCEMediaBox Initialization
JCEMediaBox.init({
    popup: {
        width: "",
        height: "",
        legacy: 0,
        lightbox: 0,
        shadowbox: 0,
        resize: 1,
        icons: 1,
        overlay: 1,
        overlayopacity: 0.8,
        overlaycolor: "#000000",
        fadespeed: 500,
        scalespeed: 500,
        hideobjects: 0,
        scrolling: "fixed",
        close: 2,
        labels: {
            'close': '關閉',
            'next': '下一步',
            'previous': '上一步',
            'cancel': '取消',
            'numbers': '{$current} / {$total}'
        },
        cookie_expiry: "",
        google_viewer: 0
    },
    tooltip: {
        className: "tooltip",
        opacity: 0.8,
        speed: 150,
        position: "br",
        offsets: {x: 16, y: 16}
    },
    base: "/",
    imgpath: "plugins/system/jcemediabox/img",
    theme: "shadow",
    themecustom: "",
    themepath: "plugins/system/jcemediabox/themes",
    mediafallback: 0,
    mediaselector: "audio,video"
});

// Accordion Menu
jQuery(function() {
    jQuery(document).ready(function() {
        jQuery('.active').addClass('open');
        jQuery('.active').children('ul').slideDown();
        jQuery('#je_accord95 li.has-sub>a').on('click', function() {
            jQuery(this).removeAttr('href');
            var element = jQuery(this).parent('li');
            if (element.hasClass('open')) {
                element.removeClass('open');
                element.find('li').removeClass('open');
                element.find('ul').slideUp('normal');
            } else {
                element.addClass('open');
                element.children('ul').slideDown('normal');
                element.siblings('li').children('ul').slideUp('normal');
                element.siblings('li').removeClass('open');
                element.siblings('li').find('li').removeClass('open');
                element.siblings('li').find('ul').slideUp('normal');
            }
        });
        jQuery('#je_accord95>ul>li.has-sub>a').append('<span class="holder"></span>');
    });
});

// Mobile Menu Toggle
var width = jQuery(window).width();
jQuery(document).ready(function() {
    jQuery('.menu-btn').click(function() {
        jQuery('.mobilenav').toggleClass('open');
        jQuery(this).toggleClass('close-btn line');
    });
});
jQuery(window).resize(function() {
    if (jQuery(this).width() != width) {
        width = jQuery(this).width();
        jQuery('.mobilenav').removeClass('open');
        jQuery('.menu-btn').removeClass('close-btn');
    }
});

// Desktop Menu Image Hover
jQuery(document).ready(function() {
    var imgUrls = {
        "item-344": "https:\/\/www.zeus-helmets.tw\/Uploads\/product\/menu\/ZS-1800B_AM16_tou ming tan xian_hong_1.png",
        // 其他圖片 URL 省略
    };
    jQuery(".menuimg").css("display", "none");
    jQuery(".item-128 > .nav-child > li").mouseenter(function() {
        jQuery(".item-128 .nav-child li").removeClass('main_cate');
        jQuery(this).addClass('main_cate');
    });
    jQuery(".item-128 > .nav-child > li > .nav-child > li > a").hover(function() {
        var currentItem = jQuery(this).parent();
        var parentItem = jQuery(this).closest(".parent");
        changeImg = setTimeout(function() {
            jQuery(".menuimg", parentItem).attr("src", imgUrls[currentItem[0].classList[0]]).fadeIn(300);
        }, 300);
    }, function() {
        clearTimeout(changeImg);
        jQuery(".menuimg").fadeOut(100);
    });
});

// Slider (Desktop)
jQuery(document).ready(function() {
    jQuery('#sc_101').show().revolution({
        dottedOverlay: "none",
        delay: 9000,
        startwidth: 2100,
        startheight: 880,
        hideThumbs: 200,
        thumbWidth: 100,
        thumbHeight: 50,
        thumbAmount: 5,
        navigationType: "bullet",
        navigationArrows: "solo",
        navigationStyle: "round",
        touchenabled: "on",
        onHoverStop: "on",
        swipe_velocity: 0.7,
        swipe_min_touches: 1,
        swipe_max_touches: 1,
        drag_block_vertical: false,
        keyboardNavigation: "off",
        hideTimerBar: "on",
        navigationHAlign: "center",
        navigationVAlign: "bottom",
        navigationHOffset: 0,
        navigationVOffset: 20,
        soloArrowLeftHalign: "left",
        soloArrowLeftValign: "center",
        soloArrowLeftHOffset: -200000,
        soloArrowLeftVOffset: 0,
        soloArrowRightHalign: "right",
        soloArrowRightValign: "center",
        soloArrowRightHOffset: -2000000,
        soloArrowRightVOffset: 0,
        spinner: "spinner1",
        fullScreenOffsetContainer: "",
        shadow: 0,
        fullWidth: "on",
        fullScreen: "off",
        stopLoop: "off",
        stopAfterLoops: -1,
        stopAtSlide: -1,
        shuffle: "off",
        autoHeight: "off",
        forceFullWidth: "off",
        hideThumbsOnMobile: "off",
        hideNavDelayOnMobile: 1500,
        hideBulletsOnMobile: "off",
        hideArrowsOnMobile: "off",
        hideThumbsUnderResolution: 0,
        hideSliderAtLimit: 0,
        hideCaptionAtLimit: 0,
        hideAllCaptionAtLilmit: 0,
        startWithSlide: 0
    });
});

// Slider (Mobile)
jQuery(document).ready(function() {
    jQuery('#sc_132').show().revolution({
        dottedOverlay: "none",
        delay: 9000,
        startwidth: 500,
        startheight: 700,
        hideThumbs: 200,
        thumbWidth: 100,
        thumbHeight: 50,
        thumbAmount: 5,
        navigationType: "none",
        navigationArrows: "solo",
        navigationStyle: "round",
        touchenabled: "off",
        onHoverStop: "on",
        swipe_velocity: 0.7,
        swipe_min_touches: 1,
        swipe_max_touches: 1,
        drag_block_vertical: false,
        keyboardNavigation: "off",
        hideTimerBar: "on",
        navigationHAlign: "center",
        navigationVAlign: "bottom",
        navigationHOffset: 0,
        navigationVOffset: 20,
        soloArrowLeftHalign: "left",
        soloArrowLeftValign: "center",
        soloArrowLeftHOffset: 20,
        soloArrowLeftVOffset: 0,
        soloArrowRightHalign: "right",
        soloArrowRightValign: "center",
        soloArrowRightHOffset: 20,
        soloArrowRightVOffset: 0,
        spinner: "spinner1",
        fullScreenOffsetContainer: "",
        shadow: 0,
        fullWidth: "on",
        fullScreen: "off",
        stopLoop: "off",
        stopAfterLoops: -1,
        stopAtSlide: -1,
        shuffle: "off",
        autoHeight: "off",
        forceFullWidth: "off",
        hideThumbsOnMobile: "off",
        hideNavDelayOnMobile: 1500,
        hideBulletsOnMobile: "off",
        hideArrowsOnMobile: "off",
        hideThumbsUnderResolution: 0,
        hideSliderAtLimit: 0,
        hideCaptionAtLimit: 0,
        hideAllCaptionAtLilmit: 0,
        startWithSlide: 0
    });
});

// Product Carousel
jQuery(document).ready(function() {
    var carousel = jQuery('#owlcarousel-content-104');
    var duration = 500;
    var c_items = 4;
    function arrowInit(e) {
        jQuery('#oc_104 .controls-left').css('display', 'none');
        jQuery('#oc_104 .controls-right').removeAttr("style");
    }
    carousel.owlCarousel({
        loop: false,
        nav: false,
        dots: true,
        margin: 30,
        items: c_items,
        autoplay: false,
        autoplaySpeed: duration,
        onInitialized: arrowInit,
        responsive: {
            0: { items: 1 },
            768: { items: 2 },
            992: { items: 3 },
            1200: { items: 3 }
        }
    }).on('changed.owl.carousel', function(e) {
        if (e.item.index == (e.item.count - e.page.size)) {
            jQuery('#oc_104 .controls-right').css('display', 'none');
            jQuery('#oc_104 .controls-left').removeAttr("style");
        } else if (e.item.index == 0) {
            jQuery('#oc_104 .controls-left').css('display', 'none');
            jQuery('#oc_104 .controls-right').removeAttr("style");
        } else {
            jQuery('#oc_104 .controls-right, #oc_104 .controls-left').removeAttr("style");
        }
    });
    jQuery('#oc_104 .controls-right').click(function() {
        carousel.trigger('next.owl.carousel');
    });
    jQuery('#oc_104 .controls-left').click(function() {
        carousel.trigger('prev.owl.carousel');
    });
});

// News Carousel
jQuery(document).ready(function() {
    var carousel = jQuery('#owlcarousel-content-105');
    var duration = 500;
    var c_items = 99;
    function arrowInit(e) {
        jQuery('#oc_105 .controls-left').css('display', 'none');
        jQuery('#oc_105 .controls-right').removeAttr("style");
    }
    carousel.owlCarousel({
        loop: true,
        nav: false,
        dots: true,
        margin: 30,
        items: c_items,
        autoplay: false,
        autoplaySpeed: duration,
        onInitialized: arrowInit,
        responsive: {
            0: { items: 1 },
            768: { items: 2 },
            992: { items: 2, stagePadding: 130 },
            1200: { items: 2, stagePadding: 150 },
            1400: { items: 3, stagePadding: 170 }
        }
    }).on('changed.owl.carousel', function(e) {
        if (e.item.index == (e.item.count - e.page.size)) {
            jQuery('#oc_105 .controls-right').css('display', 'none');
            jQuery('#oc_105 .controls-left').removeAttr("style");
        } else if (e.item.index == 0) {
            jQuery('#oc_105 .controls-left').css('display', 'none');
            jQuery('#oc_105 .controls-right').removeAttr("style");
        } else {
            jQuery('#oc_105 .controls-right, #oc_105 .controls-left').removeAttr("style");
        }
    });
    jQuery('#oc_105 .controls-right').click(function() {
        carousel.trigger('next.owl.carousel');
    });
    jQuery('#oc_105 .controls-left').click(function() {
        carousel.trigger('prev.owl.carousel');
    });
});

// Language Toggle
jQuery(document).ready(function($) {
    $('.langChoose').click(function() {
        if ($('.langChoose').hasClass('langOpen')) {
            $('.langList').fadeIn(300);
            $('.langChoose').removeClass('langOpen');
        } else {
            $('.langList').fadeOut(300);
            $('.langChoose').addClass('langOpen');
        }
    });
});

// AOS Initialization
AOS.init({
    duration: 1000,
    once: true
});

// Google Analytics
window.dataLayer = window.dataLayer || [];
function gtag() {
    dataLayer.push(arguments);
}
gtag('js', new Date());
gtag('config', 'UA-153796783-1');

// Cookies Check
check_cookie(getBaseURL());