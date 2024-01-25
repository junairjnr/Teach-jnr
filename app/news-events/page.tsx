"use client";

import Image from "next/image";
import Newsicon from "../../assets/img/news.png";
import { getDviceId, getUserContext } from "../../auth/auth-context";
import parse from "../../utils/json-util";
import { useQuery } from "react-query";
import { get } from "../../api/api-request";
import { useRouter } from "next/navigation";
import { MdSchool } from "react-icons/md";
import NavbarComp from "../NavComp";

export default function NewsEvents() {
  const router = useRouter();
  const gotoNewsView = (id: string) => {
    router.push(`news-events/` + id);
  };

  const userContext = getUserContext();
  const { EmployeeId } = parse(userContext);
  const deviceId = getDviceId();

  const { data: newses, isLoading } = useQuery(["news"], () =>
    get(
      "General/TeacherNews?TeacherId=" +
        EmployeeId +
        "&deviceId=" +
        deviceId +
        "&lastItemId=" +
        0
    ).then((res) => res)
  );


  return (
    <div>
      <div className=" h-full justify-center pt-[50px]">
        <NavbarComp name="News & Events" navigation="/dashboard" />
        {isLoading && (
          <div className="w-full h-full flex justify-center items-center bg-[#00000063] absolute">
            <MdSchool className="loading-icon fill-teal-500" size={70} />
          </div>
        )}
        <div className="flex flex-col bg- justify-center h-full overflow-auto">
          {newses?.data.map((news: any, index: number) => (
            <div
              onClick={() => {
                gotoNewsView(news?.newsId);
              }}
              key={index}
              className="flex flex-row w-full cursor-pointer bg-white p-3 h-full border-b-2  mb-2 gap-2  shadow-sm shadow-[#969b9f] "
            >
              <Image
                src={
                  news?.mainImage
                    ? "data:image/gif;base64," + news?.mainImage
                    : Newsicon
                }
                height={200}
                width={200}
                alt=""
                className="h-[85px] w-[90px] pl-1 object-contain"
              />
              <div className="flex flex-col ml-3 w-full">
                <p className="text-[14px] font-sans font-semibold text-red-600">
                  {news?.heading}
                </p>
                <p className="text-[12px] font-sans text-gray-600 w-[240px] truncate">
                  {news?.story}
                </p>
                <div className="flex justify-end items-end">
                  <p className="text-[12px] text-gray-500 mt-7 ml-3">
                    {news?.date}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
