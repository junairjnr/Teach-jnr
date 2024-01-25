"use client";

import Link from "next/link";
import { BsFillPlusCircleFill } from "react-icons/bs";
import { getUserContext } from "../../auth/auth-context";
import parse from "../../utils/json-util";
import { useQuery } from "react-query";
import { get } from "../../api/api-request";
import { useState } from "react";
import { MdSchool } from "react-icons/md";
import NavbarComp from "../NavComp";

export default function SchoolDiary() {
  const userContext = getUserContext();
  const { EmployeeId } = parse(userContext);

  const { data: classes = [] } = useQuery(
    ["class"],
    () =>
      get("Attendance/GetClasses?teacherid=" + EmployeeId).then((res) => res),
    {
      select: (res) => res.data,
    }
  );

  const [activeClass, setActiveClass] = useState("");

  const { data: division } = useQuery(
    ["division", activeClass],
    () =>
      get("Attendance/GetDivisions?classId=" + activeClass).then((res) => res),
    {
      select: (res) => res.data,
      enabled: Boolean(activeClass),
    }
  );
  const [activeDivision, setActiveDivision] = useState("0");

  const {
    data: diary,
    isLoading,
  } = useQuery(
    ["diary", activeDivision],
    () =>
      get(
        "teacher/teacherschooldiary?TeacherId=" +
          EmployeeId +
          "&divid=" +
          activeDivision
      ).then((res) => res),
    {
      select: (res) => res.data,
      enabled: Boolean(activeDivision),
    }
  );

  return (
    <div>
      <div className=" h-[100hv]  justify-center pt-[50px]">
        <NavbarComp name="SchoolDiary" navigation="/dashboard" />
        <div className=" h-[760px] bg-gray-50 relative flex flex-col">
          <div className="justify-between h-[40px] flex bg-gray-200 fixed w-[100%]  bg-[#03d4d434] p-1 gap-1">
            <select
              className="text-sm text-center h-[30px] w-[50%] outline-none border-2 "
              onChange={(e) => setActiveClass(e.target.value)}
              value={activeClass}
            >
              <option>select class</option>
              {classes.map((clas: any, index: number) => (
                <option key={index} value={clas.classId}>
                  {clas.class}
                </option>
              ))}
            </select>

            <select
              className="text-sm text-center h-[30px] w-[50%] outline-none border-2 "
              onChange={(e) => setActiveDivision(e.target.value)}
              value={activeDivision}
            >
              <option>select Division</option>
              {division?.map((divis: any, index: number) => (
                <option key={index} value={divis.divisionId}>
                  {divis.division}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col w-full h-full  p-2 font-sans pt-[50px]">
            {isLoading && (
              <div className="w-full h-full flex justify-center items-center bg-[#00000063] absolute">
                <MdSchool className="loading-icon fill-teal-500" size={70} />
              </div>
            )}
            {diary?.map((dair: any, index: number) => (
              <div
                key={index}
                className=" bg-white flex h-full flex-row shadow-md border-b-2 "
              >
                <div className="flex flex-col justify-center items-center w-[25%]  ">
                  <div className="flex flex-col justify-center items-center h-[150px] w-[75px]">
                    <p className="text-xl font-semibold text-red-600">
                      {dair.day}
                    </p>
                    <p className="text-[14px]">
                      {dair.month}-{dair.year}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col p-2 gap-2 h-full  w-[75%] justify-center border-l-2">
                  <div className="flex justify-between p-2">
                    <p className="font-bold font-sans text-red-700  ">
                      {dair.category}
                    </p>
                    <p className="font-semibold font-sans text-gray-700 text-[12px]">
                      {dair.class}-{dair.div}
                    </p>
                  </div>
                  <p className="text-[14] font-sans text-amber-800">
                    {dair.name}
                  </p>
                  <p className="text-[14] font-sans font-semibold ">
                    {dair.title}
                  </p>
                  <p className="text-[12px] font-sans w-[full]">
                    {dair.remark}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Link href="/create-diary">
            <BsFillPlusCircleFill
              // onClick={() => setShowAddForm(true)}
              size={50}
              className="ml-[430px] bottom-5 right-5 fixed fill-teal-600"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
