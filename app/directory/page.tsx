"use client";

import { LuSearch } from "react-icons/lu";
import { FiPhoneCall } from "react-icons/fi";
import { useState } from "react";
import { useQuery } from "react-query";
import { get } from "../../api/api-request";
import { getUserContext } from "../../auth/auth-context";
import parse from "../../utils/json-util";
import { MdSchool } from "react-icons/md";
import NavbarComp from "../NavComp";

export default function Directory() {
  const [showSchool, setShowSchool] = useState(true);
  const [showTeacher, setTeacher] = useState(false);
  const [activeList, setActiveList] = useState(true);
  const [notActiveList, setNotActiveList] = useState(false);

  const [search, setSearch] = useState("");

  const userContext = getUserContext();
  const { EmployeeId } = parse(userContext);

  const { data: directory, isLoading } = useQuery(["directory"], () =>
    get("Teacher/Contacts?teacherId=" + EmployeeId).then((res) => res)
  );

  const data = directory?.data?.filter((x: any) => {
    if (!search) {
      return true;
    }
    return x.name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div>
      <div className=" h-full bg-gray-50 justify-center pt-[50px]">
        <NavbarComp name="Directory" navigation="/dashboard"/>
        <div className="bg-white flex flex-col">
          <div className="w-full h-[35px] flex flex-row bg-white border-b-1 border-gray-800">
            <div className="bg-white w-[50px] items-center  justify-self-center">
              <LuSearch size={20} className="ml-2 mt-2" fill="#eef3f3" />
            </div>
            <div className="w-full">
              <input
                className="h-[35px] w-full bg-white outline-none text-gray-700 rounded-md"
                type="text"
                placeholder="search"
                onChange={(e) => setSearch(e.target.value)}
                value={search}
              />
            </div>
          </div>
          <div className="justify-between flex font-sans font-bold">
            <button
              onClick={() => {
                setShowSchool(true);
                setTeacher(false);
                setActiveList(true);
                setNotActiveList(false);
              }}
              className={`bg-slate-100 text-sm  h-[35px] w-[50%] inline text-gray-500
                        ${
                          activeList && !notActiveList
                            ? "border-b-2 border-blue-600 text-blue-500 "
                            : ""
                        }`}
            >
              SCHOOL CONTACTS
            </button>
            <button
              onClick={() => {
                setTeacher(true);
                setShowSchool(false);
                setActiveList(false);
                setNotActiveList(true);
              }}
              className={`bg-slate-100 text-sm w-[50%] h-[35px] inline text-gray-500 
                        ${
                          notActiveList && !activeList
                            ? "border-b-2 border-blue-600 text-blue-500 "
                            : ""
                        }`}
            >
              TEACHER CONTACTS
            </button>
          </div>
          {showSchool && !showTeacher && (
            <SchoolContact data={data} isLoading={isLoading} />
          )}
          {showTeacher && !showSchool && (
            <TeacherContact data={data} isLoading={isLoading} />
          )}
        </div>
      </div>
    </div>
  );
}

const SchoolContact = ({ data, isLoading }: { data: any; isLoading: any }) => {
  return (
    <div className=" h-[100vh] flex flex-col bg-white ">
      {isLoading && (
        <div className="w-full h-full flex justify-center items-center bg-[#00000063] absolute">
          <MdSchool className="loading-icon fill-teal-500" size={70} />
        </div>
      )}
      <div className="   flex flex-col">
        {data
          ?.filter((x: any) => x.type === "S")
          .map((tcont: any, index: number) => (
            <div
              key={index}
              className="flex justify-center items-center p-3 border-b-2 border-b-gray-300 w-full gap-4"
            >
              <div className="flex justify-center items-center bg-gray-300 w-[60px] h-[60px] rounded-2xl">
                {/* <RxAvatar size={60} className='bg-emerald-300 rounded-xl' /> */}
                <p className="text-2xl font-semibold text-gray-700">
                  {tcont.name
                    .split(" ")
                    .slice(0, 2)
                    .map((x: string) => x[0])
                    .join("")}
                </p>
              </div>
              <div className="flex justify-between ">
                <div className="w-[250px] ">
                  <ul className="mt-2 ml-4  mb-3">
                    <li className="text-[14px] font-sans font-semibold text-gray-700">
                      {tcont.name}
                    </li>
                    <li className="text-[12px] font-sans text-gray-800">
                      {tcont.designation}
                    </li>
                    <li className="text-[12px] font-sans text-gray-800">
                      <a href={`tel:${tcont.phoneOne}`}> {tcont.phoneOne}</a>
                      {tcont.phoneOne && tcont.phoneTwo && ","}
                      <a href={`tel:${tcont.phoneTwo}`}> {tcont.phoneTwo}</a>
                    </li>
                  </ul>
                </div>

                <div className="flex justify-center items-center">
                  <a href={`tel:${tcont.phoneOne || tcont.phoneTwo}`}>
                    <FiPhoneCall size={30} className=" fill-blue-400" />
                  </a>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
const TeacherContact = ({ data, isLoading }: { data: any; isLoading: any }) => {
  return (
    <div className=" h-full flex flex-col bg-white ">
      {isLoading && (
        <div className="w-full h-full flex justify-center items-center bg-[#00000063] absolute">
          <MdSchool className="loading-icon fill-teal-500" size={70} />
        </div>
      )}
      <div className=" flex flex-col">
        {data
          ?.filter((x: any) => x.type === "E")
          .map((tcont: any, index: number) => (
            <div
              key={index}
              className="flex  p-3 border-b-2 border-b-gray-300 w-full gap-4 justify-center items-center"
            >
              <div className="flex justify-center items-center bg-gray-300 w-[60px] h-[60px] rounded-2xl">
                {/* <RxAvatar size={60} className='bg-emerald-300 rounded-xl' /> */}
                <p className="text-2xl font-semibold text-gray-600">
                  {tcont.name
                    .split(" ")
                    .slice(0, 2)
                    .map((x: string) => x[0])
                    .join("")}
                </p>
              </div>
              <div className="flex justify-between ">
                <div className="w-[250px] ">
                  <ul className="mt-2 ml-4  mb-3">
                    <li className="text-[14px] font-sans font-semibold text-gray-700">
                      {tcont.name}
                    </li>
                    <li className="text-[12px] font-sans text-gray-800">
                      {tcont.designation}
                    </li>
                    <li className="text-[12px] font-sans text-gray-800">
                      <a href={`tel:${tcont.phoneOne}`}> {tcont.phoneOne}</a>
                      {tcont.phoneOne && tcont.phoneTwo && ","}
                      <a href={`tel:${tcont.phoneTwo}`}> {tcont.phoneTwo}</a>
                    </li>
                  </ul>
                </div>

                <div className="flex justify-center items-center">
                  <a href={`tel:${tcont.phoneOne || tcont.phoneTwo}`}>
                    <FiPhoneCall size={30} className=" fill-blue-400" />
                  </a>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
