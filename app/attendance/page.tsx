"use client";
import React, { useRef } from "react";
import "../globals.css";
import Link from "next/link";
import { MdPreview, MdSchool } from "react-icons/md";
import { RiCheckDoubleLine } from "react-icons/ri";
import {
  getHourCount,
  getUserContext,
  storeHourCount,
} from "../../auth/auth-context";
import parse from "../../utils/json-util";
import { useQuery } from "react-query";
import { useState } from "react";
import groupBy from "lodash/groupBy";
import { FaCircle } from "react-icons/fa";
import { get } from "../../api/api-request";
import NavbarComp from "../NavComp";

const userContext = getUserContext();
const { EmployeeId } = parse(userContext);
let hourCount = getHourCount();

const AttendanceStatus = () => {
  const [date, setDate] = useState(new Date());
  const formattedDate = date.toISOString().substring(0, 10);

  const { data: classes = [], isLoading } = useQuery(
    ["classes", formattedDate],
    () =>
      get(
        "Attendance/Status?teacherId=" + EmployeeId + "&date=" + formattedDate
      ).then((response) => response),

    {
      select: (response) => response.data,
      refetchOnWindowFocus: false,
    }
  );
  const groupedClasses = groupBy(classes, "classId");

  const inputRef = useRef(null);

  const { data: hours } = useQuery(
    ["hour", EmployeeId],
    () =>
      get("Teacher/GetHours?teacherid=" + EmployeeId).then(
        (response) => response
      ),
    {
      select: (response) => response.data,
      enabled: Boolean(EmployeeId) && !Boolean(hourCount),
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        hourCount = data.lenght;
        storeHourCount(data.length);
      },
    }
  );

  return (
    <div className="flex items-center justify-center">
      <div className="w-full h-[100vh] items-center relative pt-[55px]">
        {isLoading && (
          <div className="w-full h-full flex justify-center items-center bg-[#00000063] absolute">
            <MdSchool className="loading-icon" size={50} />
          </div>
        )}
        {/* <NavBar>

        <h2 className="text-white font-bold text-lg">Attendance Status</h2>

        </NavBar> */}

        <NavbarComp name="Attendance Status" navigation="/dashboard" />
        <div className="w-full h-[41px] p-1 flex justify-center items-center ">
          <label
            className="w-full"
            htmlFor="date"
            onClick={() =>
              (inputRef?.current as unknown as HTMLInputElement)?.showPicker()
            }
          >
            <div className="bg-[#e3e0e0] w-full  h-[41px] flex justify-center items-center">
              <input
                className="w-full h-[33px] p-3 focus:outline-0"
                type="date"
                ref={inputRef}
                name="date"
                value={formattedDate}
                onChange={(e) => {
                  e.target.value && setDate(new Date(e.target.value));
                }}
                placeholder="Choose Date"
              />
            </div>
          </label>
        </div>

        <div className="">
          <div className=" w-full pt-2 p-2">
            <table className="w-full bg-white text-[14px] mb-10 table-fixed">
              <thead>
                <tr className="bg-[#176e6ee0] text-white h-[36px]">
                  <th className="text-center p-2 border-r-2 w-[150px]">
                    Class
                  </th>
                  <th className="text-center p-2">Divisions</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(groupedClasses as any).map(([key, value]) => {
                  const first = (value as any)?.[0] as any;

                  return (
                    <tr key={key}>
                      <td className="pl-5 text-center"> {first.class}</td>
                      <td className="pl-3">
                        {(value as any[])?.map((x: any, index: number) => (
                          <Link
                            key={index}
                            href={`/take-attendance?classId=${x.classId}&divisionId=${x.divisionId}&date=${formattedDate}`}
                          >
                            <button
                              className={`bg-[#E3E0E0] h-8 shadow-inner rounded  mr-1.5 my-1 px-2 
                                    ${
                                      x.status === +hourCount
                                        ? "text-[#0fa90f]"
                                        : x.status === 0
                                        ? "text-[#FF0000]"
                                        : "text-[#0000FF]"
                                    }`}
                            >
                              {x.division}
                            </button>
                          </Link>
                        ))}
                      </td>
                    </tr>
                  );
                })}
                {/* {classes?.map((item: any, index: number) => (
                  <tr key={index}>
                    <td className="pl-9"> {item.class}</td>
                    <td>
                      <Link href={"/take-attendance"}>
                        <button className="bg-[#eae7e7] hover:bg-blue-500 text-[#FF0000]  hover:text-white w-6 h-7 border border-blue-500 rounded py-[1px] mr-1.5 my-1">
                          {" "}
                          {item.division}
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))} */}
              </tbody>
            </table>
          </div>

          <div className="flex justify-evenly w-full h-[20px] items-center pb-24 pr-3 mt-5">
            <div className="flex pt-2 gap-1">
              <FaCircle className=" fill-[#0fa90f] " size={15} />
              <p className="font-bold text-xs  text-gray-700 ">Taken</p>
            </div>
            <div className="flex pt-2 gap-1">
              <FaCircle className=" fill-[#FF0000] " size={15} />
              <p className="font-bold text-xs  text-gray-700 ">Not Taken</p>
            </div>
            <div className="flex pt-2 gap-1">
              <FaCircle className=" fill-[#0000FF] " size={15} />
              <p className="font-bold text-xs  text-gray-700">
                Partially Taken
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-around w-full h-[50px] absolute bottom-4">
          <Link href={"/view-attendance"}>
            <button className="fixed bottom-4 left-5 w-[51px] h-[50px] bg-[#00008B] rounded-full pl-[10px]">
              <MdPreview className="w-[30px] h-[30px] fill-white" />
            </button>
          </Link>

          <Link href={"/take-attendance"}>
            <button className=" fixed bottom-4 right-5  w-[51px] h-[50px] bg-[#7600a9] rounded-full pl-[10px]">
              <RiCheckDoubleLine className="w-[30px] h-[30px] fill-white" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AttendanceStatus;
