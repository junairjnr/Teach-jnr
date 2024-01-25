"use client";

import Image from "next/image";
import View from "../../../assets/img/news.png";
import { useQuery } from "react-query";
import { get } from "../../../api/api-request";
import { MdSchool } from "react-icons/md";
import { useState } from "react";
import NavbarComp from "../../NavComp";

export default function NewsView({ params }: { params: { id: string } }) {
  const { data: news, isLoading } = useQuery(
    ["newsview"],
    () => get("General/NewsDetails?NewsId=" + params.id).then((res) => res),
    {
      select: (res) => res.data,
    }
  );

  const [active, setActive] = useState();

  return (
    <div className="">
      <div className=" h-full justify-center items-center relative pt-[50px]">
        <NavbarComp name="News & Events" navigation="/news-events" />
        {isLoading && (
          <div className="w-full h-full flex justify-center items-center bg-[#00000063] absolute">
            <MdSchool className="loading-icon fill-teal-500" size={70} />
          </div>
        )}
        <div className="bg-gray-10 h-full ">
          <div className="flex flex-col justify-center w-full">
            <Image
              src={
                active || news?.mainImage
                  ? "data:image/gif;base64," + (active || news?.mainImage)
                  : View
              }
              height={200}
              width={200}
              alt=""
              className="w-full h-[220px] rounded-sm object-contain"
            />
            <div className="flex flex-row w-full bg-white h-[150px] justify-center items-center border-b-2 border-b-gray-400 gap-2 p-2">
              <div className="flex flex-col items-center bg-orange-500 h-[80px] w-[75px] p-4 text-white rounded-md">
                <p className="items-center font-sans font-semibold">
                  {news?.month}
                </p>
                <p className="items-center text-2xl font-sans font-semibold">
                  {news?.day}
                </p>
              </div>
              <div className="flex flex-col ml-3 w-full">
                <p className="text-[16px] font-sans font-semibold text-red-600">
                  {news?.heading}
                </p>
                <div className="flex justify-between mt-2">
                  <p className="text-[14px] font-semibold mt-3">
                    {news?.location}
                  </p>
                  <p className="text-[14px] font-semibold text-red-500 mt-3 ml-3">
                    {news?.time}
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full h-[100px] bg-white flex flex-col justify-center ">
              <div className="w-full h-[60px] justify-center items-center flex gap-2">
                <Image
                  onClick={() => {
                    setActive(news?.subImageImage1);
                  }}
                  src={
                    news?.subImageImage1
                      ? "data:image/gif;base64," + news?.subImageImage1
                      : View
                  }
                  height={100}
                  alt=""
                  width={80}
                  className="object-contain"
                />
                <Image
                  onClick={() => {
                    setActive(news?.subImageImage2);
                  }}
                  src={
                    news?.subImageImage2
                      ? "data:image/gif;base64," + news?.subImageImage2
                      : View
                  }
                  height={100}
                  alt=""
                  width={80}
                  className="object-contain"
                />
                <Image
                  onClick={() => {
                    setActive(news?.subImageImage3);
                  }}
                  src={
                    news?.subImageImage3
                      ? "data:image/gif;base64," + news?.subImageImage3
                      : View
                  }
                  height={100}
                  alt=""
                  width={80}
                  className="object-contain"
                />

                <Image
                  onClick={() => {
                    setActive(news?.mainImage);
                  }}
                  src={
                    news?.subImageImage1
                      ? "data:image/gif;base64," + news?.mainImage
                      : View
                  }
                  height={100}
                  alt=""
                  width={80}
                  className="object-contain"
                />
              </div>
            </div>
            <p className="p-1 bg-white text-[14px] pl-3">
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{news?.story}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
