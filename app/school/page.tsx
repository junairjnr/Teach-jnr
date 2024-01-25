"use client";


import { MdSchool } from "react-icons/md";
import { HiHome } from "react-icons/hi";
import { FaAddressCard } from "react-icons/fa";
import { MdCall } from "react-icons/md";
import { MdMarkEmailUnread } from "react-icons/md";
import { FaGlobeAsia } from "react-icons/fa";
import Image from "next/image";
import Album from "../../assets/img/school.png";
import { getUserContext } from "../../auth/auth-context";
import parse from "../../utils/json-util";
import { useQuery } from "react-query";
import { get } from "../../api/api-request";
import NavbarComp from "../NavComp";

export default function School() {
  const userContext = getUserContext();
  const { EmployeeId } = parse(userContext);

  const { data: school, isLoading } = useQuery(
    ["about"],
    () => get("Teacher/AboutSchool?teacherid=" + EmployeeId).then((res) => res),
    {
      select: (res) => res.data,
    }
  );

  return (
    <div>
      <div className=" h-[760px] w-full justify-center pt-[50px]">
        <NavbarComp name="School" navigation="/dashboard" />
        {isLoading && (
          <div className="w-full h-full flex justify-center items-center bg-[#00000063] absolute">
            <MdSchool className="loading-icon fill-teal-500" size={70} />
          </div>
        )}
        <div className=" h-full w-full flex flex-col">
          <div className="p-3 ">
            <div className="flex flex-col rounded-md  p-3 shadow shadow-[#7b7878]">
              <Image
                // src={Album}
                src={"data:image/gif;base64," + school?.photo || Album}
                width={50}
                height={50}
                alt=""
                className="w-full h-[220px] rounded-t-md object-contain"
              />
              <div className="flex h-[30px] w-full gap-1 bg-slate-200 rounded-sm justify-center items-center">
                <MdSchool size={20} />
                <p className="rounded-b-sm p-1 font-sans font-semibold text-[16px]">
                  {school?.title}
                </p>
              </div>
            </div>
            <div className="w-full p-3 flex flex-col">
              <p className="flex gap-1 p-1 font-sans text-gray-700 font-semibold">
                <HiHome className="mt-1 text-black" />
                About
              </p>
              <p className="font-sans text-[14px] p-2 mt-2 border-b-2 pb-6 pl-1 ">
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{school?.description}
              </p>
              <p className="flex gap-1 font-sans p-1 text-gray-700 pt-2 font-semibold">
                <FaAddressCard size={17} className="mt-1 text-black" />
                Address
              </p>
              <p className="font-sans text-[14px] p-1 mt-2 border-b-2 pb-6 pl-3 ">
                {school?.address}
              </p>
              <p className="flex gap-1 font-sans p-1 text-gray-700 pt-2 font-semibold">
                <MdCall size={17} className="mt-1 text-black" />
                Phone
              </p>
              <p className="font-sans text-[14px] p-1 mt-2 border-b-2 pb-6 pl-3 text-blue-500 ">
                <a href={school?.phone ? `tel:${school?.phone}` : ""}>
                  {school?.phone}
                </a>
              </p>
              <p className="flex gap-1 font-sans p-1 text-gray-700 pt-2 font-semibold">
                <MdMarkEmailUnread size={17} className="mt-1 text-black" />
                E-Mail
              </p>
              <p className="font-sans text-[14px] p-1 mt-2 border-b-2 pb-6 pl-3 text-blue-500 cursor-pointer">
                <a href={school?.email ? `mailto:${school?.email}` : ""}>
                  {school?.email}
                </a>
              </p>
              <p className="flex gap-1 font-sans p-1 text-gray-700 pt-2 font-semibold">
                <FaGlobeAsia size={17} className="mt-1 text-black" />
                Website
              </p>
              <p className="font-sans text-[14px] p-1 mt-2 border-b-2 pb-6 pl-3 text-blue-500  ">
                <a target="_blank" href={school?.web ? `${school?.web}` : ""}>
                  {school?.web}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
