import logoPlant from "../assets/logoPlant.png";
import blackPlantyIcon from "../assets/blackPlantyIcon.svg"
import whitePlantyIcon from "../assets/whitePlantyIcon.svg"
import searchIcon from "../assets/searchIcon.png";
import menuIcon from "../assets/menuIcon.png";
import starIcon from "../assets/starIcon.png";
import starIconDull from "../assets/starIconDull.png";
import deliveryWhiteIcon from "../assets/deliveryWhiteIcon.png";
import fastDeliverIcon from "../assets/fastDeliveryIcon.png";
import growerIcon from "../assets/growerIcon.png";
import growerWhiteIcon from "../assets/growerWhiteIcon.png";
import heartIcon from "../assets/heartIcon.png";
import sereneWhiteIcon from "../assets/sereneWhiteIcon.png";
import everySpaceIcon from "../assets/everySpaceIcon.png";
import everySpaceWhiteIcon from "../assets/everySpaceWhiteIcon.png";
import moneyBackIcon from "../assets/moneyBackIcon.png";
import moneyBackWhiteIcon from "../assets/moneyBackWhiteIcon.png";
import crossIcon from "../assets/crossIcon.png";
import addAddressImage from "../assets/addAddressImage.svg";
import addIcon from "../assets/addIcon.png";
import productListIcon from "../assets/productListIcon.png";
import orderIcon from "../assets/orderIcon.png";
import uploadArea from "../assets/uploadArea.png";
import boxIcon from "../assets/boxIcon.png";



import plantBanner2 from "../assets/plantBanner2.jpg";
import plantBanner2Sm from "../assets/plantBanner2Sm.jpg";
import BottomBanner from "../assets/BottomBanner.jpg";
import BottomBannerSm from "../assets/BottomBannerSm.png";

import blackArrowIcon from "../assets/blackArrowIcon.png";
import whiteArrowIcon from "../assets/whiteArrowIcon.png";

import aloeveraPlant from "../assets/aloeveraPlant.jpg";
import basilPlant from "../assets/basilPlant.jpg";
import cactusPlant from "../assets/cactusPlant.jpg";
import daffodilPlants from "../assets/daffodilPlants.jpg";
import hydrangeasPlant from "../assets/hydrangeasPlant.jpg";
import addToCart from "../assets/addToCart.png";
import mangoPlant from "../assets/mangoPlant.jpg";
import monsteraPlant from "../assets/monsteraPlant.jpg";
import ornatePlant from "../assets/ornatePlant.jpg";
import pansyspringPlant from "../assets/pansyspringPlant.jpg";
import peperomiaPlant from "../assets/peperomiaPlant.jpg";
import pileaflowerPlant from "../assets/pileaflowerPlant.jpg";
import plantVase from "../assets/plantVase.jpg";
import purpleflowerPlant from "../assets/purpleflowerPlant.jpg";
import snakePlant from "../assets/snakePlant.jpg";
import userProfile from "../assets/userProfile.png";

export const assets = {
    logoPlant, 
    blackPlantyIcon,
    whitePlantyIcon,
    searchIcon,
    menuIcon,
    starIcon,
    starIconDull,
    fastDeliverIcon,
    deliveryWhiteIcon,
    growerIcon,
    growerWhiteIcon,
    heartIcon,
    sereneWhiteIcon,
    everySpaceIcon,
    everySpaceWhiteIcon,
    moneyBackIcon,
    moneyBackWhiteIcon,
    crossIcon,
    addAddressImage,
    addIcon,
    productListIcon,
    orderIcon,
    uploadArea,
    boxIcon,

    plantBanner2,
    plantBanner2Sm,
    BottomBanner,
    BottomBannerSm,


    blackArrowIcon,
    whiteArrowIcon,

    aloeveraPlant,
    basilPlant,
    cactusPlant,
    daffodilPlants,
    hydrangeasPlant,
    addToCart,
    mangoPlant,
    monsteraPlant,
    ornatePlant,
    pansyspringPlant,
    peperomiaPlant,
    pileaflowerPlant,
    plantVase,
    purpleflowerPlant,
    snakePlant,
    userProfile
}

export const categories = [
    {
        text: "Succulents",
        path: "Succulents",
        image: cactusPlant,
        bgColor: "#FEF6DA",
    },
    {
        text: "Flowering Plants",
        path: "Flowering",
        image: pansyspringPlant,
        bgColor: "#FEE0E0",
    },
    {
        text: "Ferns",
        path: "Ferns",
        image: ornatePlant,
        bgColor: "#FEF6DA",
    },
    {
        text: "Trees",
        path: "Trees",
        image: snakePlant,
        bgColor: "#D4F1BE",
    },
    {
        text: "Shrubs and Bushes",
        path: "Shrubs and Bushes",
        image: peperomiaPlant,
        bgColor: "#D1C4E9",
    },
    {
        text: "Grasses and Bamboo",
        path: "Grasses and Bamboo",
        image: daffodilPlants,
        bgColor: "#FEF6DA",
    },
    {
        text: "Vines and Climbers ",
        path: "Vines and Climbers",
        image: monsteraPlant,
        bgColor: "#FEE0E0",
    },
    {
        text: "Aquatic Plants",
        path: "Aquatic Plants",
        image: pileaflowerPlant,
        bgColor: "#FEF6DA",
    },
    {
        text: "Bonsai Tree",
        path: "Bonsai Tree",
        image: mangoPlant,
        bgColor: "#D4F1BE",
    },
      {
        text: "Palms",
        path: "Palms",
        image: hydrangeasPlant,
        bgColor: "#D1C4E9",
    },
];

export const dummyProducts = [
    {
        _id: "abc123",
        name: "Aloe Vera",
        category: "Succulents",
        price: 300,
        offerPrice: 200,
        image: [cactusPlant, cactusPlant, cactusPlant, cactusPlant],
        description: [
            "Low Maintenance",
            "Air Purifying",
            "Minimal Water",
        ],
        createdAt: "2025-07-03T09:25:46.018Z",
        updatedAt: "2025-07-03T09:25:46.018Z",
        inStock: true,
    },
    {
        _id: "abc124",
        name: "Jade Plant",
        category: "Succulents",
        price: 500,
        offerPrice: 400,
        image: [hydrangeasPlant, hydrangeasPlant, hydrangeasPlant, hydrangeasPlant],
        description: [
            "Low Maintenance",
            "Air Purifying",
            "Minimal Water",
        ],
        createdAt: "2025-07-03T09:25:46.018Z",
        updatedAt: "2025-07-03T09:25:46.018Z",
        inStock: true,
    },
    {
        _id: "abc125",
        name: "Snake Plant",
        category: "Succulents",
        price: 400,
        offerPrice: 300,
        image: [snakePlant, snakePlant, snakePlant, snakePlant],
        description: [
            "Low Maintenance",
            "Air Purifying",
            "Minimal Water",
        ],
        createdAt: "2025-07-03T09:25:46.018Z",
        updatedAt: "2025-07-03T09:25:46.018Z",
        inStock: true,
    },
    {
        _id: "abc126",
        name: "Snake Plant",
        category: "Succulents",
        price: 400,
        offerPrice: 300,
        image: [pansyspringPlant, pansyspringPlant, pansyspringPlant, pansyspringPlant],
        description: [
            "Low Maintenance",
            "Air Purifying",
            "Minimal Water",
        ],
        createdAt: "2025-07-03T09:25:46.018Z",
        updatedAt: "2025-07-03T09:25:46.018Z",
        inStock: true,
    },
    {
        _id: "abc127",
        name: "Snake Plant",
        category: "Succulents",
        price: 400,
        offerPrice: 300,
        image: [pileaflowerPlant, pileaflowerPlant, pileaflowerPlant, pileaflowerPlant],
        description: [
            "Low Maintenance",
            "Air Purifying",
            "Minimal Water",
        ],
        createdAt: "2025-07-03T09:25:46.018Z",
        updatedAt: "2025-07-03T09:25:46.018Z",
        inStock: true,
    },
]



export const features = [
    {
        icon: deliveryWhiteIcon,
        title: "Fast Delivery", 
        description: "Plants delivered on time",
    },
    {
        icon: everySpaceWhiteIcon,
        title: "Discover Plants for Every Space", 
        description: "Whether small or large, we have the perfect plant for every home.",
    },
    {
        icon: growerWhiteIcon,
        title: "Shop Directly from Growers", 
        description: "We source our plants directly from trusted growers for the best quality.",
    },
    {
        icon: sereneWhiteIcon,
        title: "Plants That Add Charm and Calm", 
        description: "Discover plants that create a serene and stylish atmosphere.",
    },
    {
        icon: moneyBackWhiteIcon,
        title: "Satisfaction or Your Money Back", 
        description: "Shop plants that are perfect for the season and your home’s needs.",
    },
]

export const footerLinks = [
    {
        title: "Quick Links",
        links: [
            {text: "Home", url: "#"},
            {text: "Best Sellers", url: "#"},
            {text: "Offers & Deals", url: "#"},
            {text: "Contact Us", url: "#" },
            {text: "FAQs", url: "#"},
        ],
    },
    {
        title: "Need Help?",
        links: [
            {text: "Delivery Information", url: "#"},
            {text: "Return and Refund Policy", url: "#"},
            {text: "Payment Methods", url: "#"},
            {text: "Track your order", url: "#" },
            {text: "Contact Us", url: "#"},
        ],
    },
    {
        title: "Follow Us",
        links: [
            {text: "Instagram", url: "#"},
            {text: "Twitter", url: "#"},
            {text: "Facebook", url: "#"},
            {text: "Youtube", url: "#" },
        ],
    },
];

export const dummyAddress = [
  {
    _id: "123abc91",
    userId: "123abc92",
    firstName: "Binato",
    lastName: "Light",
    email: "user.binatolight@gmail.com",
    street: "Street 123",
    city: "Kathmandu",
    state: "Bagmati",
    zipcode: 440600,
    country: "NP",
    phone: "9823820869",
  },
];

export const dummyOrders = [
  {
    _id: "67e2589a8f87e63366786400",
    userId: "67b5880e4d09769c5ca61644",
    items: [
      {
        product: dummyProducts[3],
        quantity: 2,
        _id: "67e2589a8f87e63366786401",
      },
    ],
    amount: 89,
    address: dummyAddress[0],
    status: "Order Placed",
    paymentType: "Online",
    isPaid: true,
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
  },
  {
    _id: "67e258798f87e633667863f2",
    userId: "67b5880e4d09769c5ca61644",
    items: [
      {
        product: dummyProducts[0],
        quantity: 1,
        _id: "67e258798f87e633667863f3",
      },
      {
        product: dummyProducts[1],
        quantity: 1,
        _id: "67e258798f87e633667863f4",
      },
    ],
    amount: 43,
    address: dummyAddress[0],
    status: "Order Placed",
    paymentType: "COD",
    isPaid: false,
    createdAt: "2025-03-25T07:17:13.068Z",
    updatedAt: "2025-03-25T07:17:13.068Z",
  },
];