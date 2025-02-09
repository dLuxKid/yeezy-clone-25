"use client";

import { SolarCartOutline } from "@/components/assets/icons/cart";
import { PajamasHamburger } from "@/components/assets/icons/hamburger";
import {
  Fa6SolidLessThan,
  LineMdChevronLeft,
} from "@/components/assets/icons/less-than";
import { LineMdPlus } from "@/components/assets/icons/plus";
import { MaterialSymbolsQuestionMarkRounded } from "@/components/assets/icons/question-mark";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useMemo, useState } from "react";

export default function Home() {
  const [showNav, setShowNav] = useState(false);
  const [column, setColumn] = useState(3);
  const [showCart, setShowCart] = useState(false);
  const [showClothOptions, setShowClothOptions] = useState<number | null>(null);
  const [sizeOptions, setSizeOptions] = useState<"number" | "alphabet">(
    "number"
  );
  const [cart, setCart] = useState<
    {
      title: string;
      image: string;
      size: number;
      quantity: number;
      price: number;
    }[]
  >([]);
  const [isAdding, setIsAdding] = useState(false);

  const { isLoading, error, data } = useQuery<
    { title: string; image: string; id: number; price: number }[]
  >({
    queryKey: ["data"],
    queryFn: async () =>
      (
        await axios.get(
          "https://fakestoreapi.com/products/category/men's clothing"
        )
      ).data,
  });

  const addQuantity = (item: {
    title: string;
    image: string;
    size: number;
    price: number;
  }) => {
    setIsAdding(true);
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (cartItem) =>
          cartItem.title === item.title && cartItem.size === item.size
      );

      if (existingItemIndex !== -1) {
        return prevCart.map((cartItem, index) =>
          index === existingItemIndex
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }

      return [...prevCart, { ...item, quantity: 1 }];
    });

    setTimeout(() => {
      setIsAdding(false);
      setShowClothOptions(null);
    }, 1000);
  };

  const reduceQuantity = (item: {
    title: string;
    image: string;
    size: number;
    price: number;
  }) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (cartItem) =>
          cartItem.title === item.title && cartItem.size === item.size
      );

      if (existingItemIndex !== -1) {
        return prevCart
          .map((cartItem, index) =>
            index === existingItemIndex
              ? { ...cartItem, quantity: cartItem.quantity - 1 }
              : cartItem
          )
          .filter((cartItem) => cartItem.quantity > 0);
      }

      return prevCart;
    });
  };

  const getTotalPrice = useMemo(
    () =>
      cart
        .reduce((total, item) => total + item.price * item.quantity, 0)
        .toFixed(2),
    [cart]
  );

  const scrollIntoView = (id: string) => {
    setColumn(0);
    setShowNav(false);
    const targetElement = document.getElementById(id);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  if (error) return <div>Error fetching posts</div>;

  if (isLoading) return null;

  return (
    <div className="w-full min-h-screen bg-white">
      <nav className="h-12 px-[2.5%] fixed top-0 z-50 bg-white w-full items-center flex justify-between">
        <div className="flex items-center">
          {showNav || showCart || column < 3 ? (
            <span
              onClick={() => {
                if (column < 3) setColumn((prev) => Math.min(prev + 1, 3));
                if (showCart) setShowCart(false);
                else setShowNav(false);
                setShowClothOptions(null);
              }}
            >
              <LineMdChevronLeft color="black" cursor={"pointer"} />
            </span>
          ) : (
            <span onClick={() => setShowNav(true)}>
              <PajamasHamburger color="black" cursor={"pointer"} />
            </span>
          )}

          <div className={`overflow-hidden pl-6 ${!showNav && "size-0"}`}>
            <ul
              className={`transform w-full flex gap-4 items-center ${
                showNav ? "translate-x-0" : "translate-x-[-100%]"
              } transition-transform duration-300`}
            >
              <li className="text-base capitalize">SUPPORT</li>
              <li className="text-base capitalize">TERMS</li>
              <li className="text-base capitalize">PRIVACY</li>
              <li className="text-base capitalize">ACCESSIBILITY</li>
              <li className="text-base capitalize">COOKIES</li>
            </ul>
          </div>

          {!showNav && !!column && !showCart && (
            <span onClick={() => setColumn((prev) => Math.max(prev - 1, 0))}>
              <LineMdPlus color="black" cursor={"pointer"} className="ml-4" />
            </span>
          )}
        </div>
        <span
          onClick={() => setShowCart((prev) => !prev)}
          className="flex items-center gap-1"
        >
          <SolarCartOutline color="black" cursor={"pointer"} />
          {!!cart.length && (
            <span className="text-sm font-bold">{cart.length}</span>
          )}
        </span>
      </nav>
      <div className="size-full relative">
        <div
          className={`${
            showCart ? "translate-x-0" : "translate-x-[100%]"
          } transition-transform duration-500 transform fixed inset-0 top-10 z-10 flex items-center justify-center`}
        >
          <div
            className="absolute bg-white z-20 inset-0"
            onClick={() => setShowCart(false)}
          />
          {cart.length ? (
            <div className="h-[calc(100svh-48px)] py-[2.5%] flex flex-col justify-between w-full max-w-2xl items-center gap-8 relative z-50">
              <div className="size-full overflow-y-auto flex flex-col gap-4 px-4">
                {cart.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center w-full justify-between"
                  >
                    <div className="size-52 flex items-center">
                      <img
                        alt="clothing image"
                        src={item.image}
                        className="size-4/5 object-fill"
                      />
                    </div>
                    <div className="flex flex-col gap-4 justify-end">
                      <p className="font-medium uppercase flex items-center justify-between gap-8">
                        <span>{item.title.split(" ")[0]}</span>
                        <span>${item.price}</span>
                      </p>
                      <p className="font-medium uppercase flex items-center justify-between gap-8">
                        <span>size</span>
                        <span>{item.size}</span>
                      </p>
                      <div className="font-medium uppercase flex items-center justify-between gap-8">
                        <span>QTY</span>
                        <div className="flex items-center gap-4">
                          <span
                            className="cursor-pointer"
                            onClick={() => reduceQuantity(item)}
                          >
                            -
                          </span>
                          <span>{item.quantity}</span>
                          <span
                            className="cursor-pointer"
                            onClick={() => addQuantity(item)}
                          >
                            +
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-4 w-full">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">TOTAL</h4>
                  <p className="font-bold">{getTotalPrice}</p>
                </div>
                <h4 className="font-medium uppercase">
                  Tax and Shipping Not Included
                </h4>
                <div className="flex items-center mt-4 justify-between">
                  <h4 className="font-medium">CONTINUE</h4>
                  <span className="rotate-180">
                    <LineMdChevronLeft color="black" cursor={"not-allowed"} />
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="size-full flex items-center justify-center relative z-50">
              <h1>NO ITEM</h1>
            </div>
          )}
        </div>
        <div
          className={`w-full gap-y-4 mt-12 grid ${
            column === 3
              ? "grid-cols-9"
              : column === 2
              ? "grid-cols-6"
              : column === 1
              ? "grid-cols-3"
              : "grid-cols-1"
          }`}
        >
          {data &&
            [
              ...data,
              ...data,
              ...data,
              ...data,
              ...data,
              ...data,
              ...data,
              ...data,
              ...data,
              ...data,
              ...data,
              ...data,
              ...data,
              ...data,
            ].map((item, i) => {
              const id = `item-${i + 1}`;
              return (
                <div
                  key={id}
                  id={id}
                  onClick={() => scrollIntoView(id)}
                  className={`py-4 flex justify-center items-center flex-col gap-4 ${
                    column === 0 ? "py-0 w-full h-[calc(100svh-48px)]" : ""
                  }`}
                >
                  <div className="size-4/5 md:size-3/4 lg:size-3/5 max-w-sm max-h-[384px]">
                    <img
                      src={item.image}
                      alt="clothing image"
                      className="object-contain object-center size-full cursor-pointer my-auto"
                    />
                  </div>
                  <div
                    className={`${
                      column <= 1 && "mt-20"
                    } flex items-center justify-center gap-12 flex-col max-w-80 w-full`}
                  >
                    <div
                      className={`w-full flex items-center ${
                        showClothOptions === i
                          ? "justify-between"
                          : "justify-center"
                      }`}
                    >
                      <span
                        className="size-6"
                        onClick={() =>
                          setSizeOptions((prev) =>
                            prev === "alphabet" ? "number" : "alphabet"
                          )
                        }
                      >
                        {showClothOptions === i && (
                          <MaterialSymbolsQuestionMarkRounded
                            color="black"
                            cursor={"pointer"}
                          />
                        )}
                      </span>

                      <div className="h-6 overflow-y-hidden">
                        <p
                          className={`text-base font-normal text-black uppercase transform transition-transform duration-300 text-center ${
                            showClothOptions === i
                              ? "-translate-y-[100%]"
                              : "translate-y-0"
                          }`}
                        >
                          {item.title.split(" ")[0]}
                        </p>
                        <p
                          className={`text-base font-normal text-black uppercase transform transition-transform duration-300 text-center ${
                            showClothOptions === i
                              ? isAdding
                                ? "-translate-y-[200%]"
                                : "-translate-y-[100%]"
                              : "translate-y-0"
                          }`}
                        >
                          select size
                        </p>
                        <p
                          className={`text-base font-normal text-black uppercase transform transition-transform duration-300 text-center ${
                            isAdding ? "-translate-y-[200%]" : "translate-y-0"
                          }`}
                        >
                          ADDING
                        </p>
                      </div>

                      <span
                        onClick={() => setShowClothOptions(null)}
                        className="size-6"
                      >
                        {showClothOptions === i && (
                          <Fa6SolidLessThan color="black" cursor={"pointer"} />
                        )}
                      </span>
                    </div>

                    {column <= 1 && showClothOptions !== i && (
                      <span onClick={() => setShowClothOptions(i)}>
                        <LineMdPlus color="black" cursor={"pointer"} />
                      </span>
                    )}
                    {showClothOptions !== null && showClothOptions === i && (
                      <div className="h-6 overflow-y-hidden w-full px-2">
                        <div
                          className={`w-full flex items-center justify-between transform transition-transform duration-300 ${
                            sizeOptions === "number"
                              ? "translate-y-0"
                              : "-translate-y-[100%]"
                          }`}
                        >
                          <p
                            className="font-bold text-base cursor-pointer"
                            onClick={() =>
                              addQuantity({
                                title: item.title,
                                image: item.image,
                                size: 1,
                                price: item.price,
                              })
                            }
                          >
                            1
                          </p>
                          <p
                            className="font-bold text-base cursor-pointer"
                            onClick={() =>
                              addQuantity({
                                title: item.title,
                                image: item.image,
                                size: 2,
                                price: item.price,
                              })
                            }
                          >
                            2
                          </p>
                          <p
                            className="font-bold text-base cursor-pointer"
                            onClick={() =>
                              addQuantity({
                                title: item.title,
                                image: item.image,
                                size: 3,
                                price: item.price,
                              })
                            }
                          >
                            3
                          </p>
                        </div>
                        <div
                          className={`w-full flex items-center justify-between transform transition-transform duration-300 ${
                            sizeOptions === "alphabet"
                              ? "-translate-y-[100%]"
                              : "-translate-y-0"
                          }`}
                        >
                          <p
                            className="font-bold text-base cursor-pointer"
                            onClick={() =>
                              addQuantity({
                                title: item.title,
                                image: item.image,
                                size: 1,
                                price: item.price,
                              })
                            }
                          >
                            S-M
                          </p>
                          <p
                            className="font-bold text-base cursor-pointer"
                            onClick={() =>
                              addQuantity({
                                title: item.title,
                                image: item.image,
                                size: 2,
                                price: item.price,
                              })
                            }
                          >
                            M-L
                          </p>
                          <p
                            className="font-bold text-base cursor-pointer"
                            onClick={() =>
                              addQuantity({
                                title: item.title,
                                image: item.image,
                                size: 3,
                                price: item.price,
                              })
                            }
                          >
                            XL-XXL
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
