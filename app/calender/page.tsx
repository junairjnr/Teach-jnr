"use client";
import React from "react";
import "../globals.css";
import { MdOutlineArrowLeft, MdSchool } from "react-icons/md";
import { MdOutlineArrowRight } from "react-icons/md";
import { useState } from "react";
import {
  startOfMonth,
  endOfMonth,
  differenceInDays,
  sub,
  add,
  format,
  isSameDay,
} from "date-fns";
import { useSearchParams } from "next/navigation";
import { useQuery } from "react-query";
import { get } from "../../api/api-request";
import { FaCircle } from "react-icons/fa";
import NavbarComp from "../NavComp";

const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const Calender = () => {
  const searchParams = useSearchParams(); // select studentId, studentName when click view-attendance  student row
  const studentId = searchParams?.get("studentId");
  const studentName = searchParams?.get("studentName");
  const activeDate = searchParams?.get("date");

  const [currentDate, setCurrentDate] = useState(
    activeDate ? new Date(activeDate) : new Date()
  );
  const selectedMonth = format(currentDate, "yyyy-MM-dd");
  const startDate = startOfMonth(currentDate);
  const endDate = endOfMonth(currentDate);
  const numDays = differenceInDays(endDate, startDate) + 1;
  const prefixDays = startDate.getDay();
  const suffixDays = 6 - endDate.getDay();

  const prevMonth = () =>
    setCurrentDate && setCurrentDate(sub(currentDate, { months: 1 }));
  const nextMonth = () =>
    setCurrentDate && setCurrentDate(add(currentDate, { months: 1 }));
  // const

  const { data, isLoading } = useQuery(
    [studentId, selectedMonth],
    () =>
      get(
        `Attendance/Attendance?studentId=${studentId}&month=${selectedMonth}`
      ).then((response) => response),
    {
      select: (response) => response.data,
    }
  );

  return (
    <div className="flex items-center justify-center">
      <div className="w-full h-[100vh] items-center relative">
        {isLoading && (
          <div className="w-full h-full flex justify-center items-center bg-[#00000063] absolute">
            <MdSchool className="loading-icon" size={70} />
          </div>
        )}
        <NavbarComp name="Monthly Attendance" navigation="/view-attendance" />

        <div className="flex justify-between bg-[#07a5a5] shadow-md shadow-[#0000005a] h-24 mt-12">
          <MdOutlineArrowLeft
            onClick={prevMonth}
            className="fill-white caleder-arrow  h-[75px] w-[75px] pt-8"
          />

          <div className="text-white flex flex-col items-center">
            <h2 className="pt-5 text-2xl font-bold justify-center items-center">
              {format(currentDate, "yyyy")}
            </h2>

            <h3 className="text-xl flex justify-center items-center">
              {format(currentDate, "LLLL")}
            </h3>
          </div>

          <MdOutlineArrowRight
            onClick={nextMonth}
            className="fill-white caleder-arrow h-[75px] w-[75px] pt-8"
          />
        </div>
        {/* <div className='flex justify-evenly px-3 py-2 text-white bg-[#39c1c1] h-10 w-400'> */}
        <div className="grid grid-cols-7 items-center justify-center text-center text-white bg-[#39c1c1] h-10 w-[full]">
          {daysOfWeek.map((day) => (
            <div
              className="text-sm font-bold w-[57px] h-[40px] flex items-center justify-center"
              key={day}
            >
              {day}
            </div>
          ))}
        </div>

        <div className="flex bg-white h-[305px] flex-wrap">
          {Array.from({ length: prefixDays }).map((_, index) => (
            <div
              className="w-[57px] h-[40px] flex items-center justify-center pt-4"
              key={index}
            ></div>
          ))}

          {Array.from({ length: numDays }).map((_, index) => {
            const date = index + 1;
            const calendarDate = new Date(
              `${currentDate.getFullYear()}-${
                currentDate.getMonth() + 1
              }-${date}`
            );
            const matchedDate = data?.attendance?.find((x: any) =>
              isSameDay(new Date(x.date), calendarDate)
            );

            return (
              <div
                className="w-[57px] h-[40px] flex items-center justify-center pt-4"
                key={date}
              >
                <div
                  className={`rounded-full w-[30px] h-[30px]  flex justify-center items-center
                                 ${
                                   matchedDate?.attendance === "H"
                                     ? "bg-[#0000FF] text-white"
                                     : matchedDate?.attendance === "P"
                                     ? "bg-[#0fa90f] text-white"
                                     : matchedDate?.attendance === "A"
                                     ? "bg-[#FF0000] text-white"
                                     : "bg-white text-black"
                                 }`}
                >
                  {date}
                </div>
              </div>
            );
          })}

          {Array.from({ length: suffixDays }).map((_, index) => (
            <div
              className="w-[57px] h-[40px] flex items-center justify-center pt-4"
              key={index}
            ></div>
          ))}
        </div>
        <div className="w-full flex justify-center items-center border-t-4 border-inherit border-[#606671]">
          <h1 className="text-[16px] text-gray-700 font-semibold pt-5">
            {studentName}
          </h1>
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
            <p className="font-bold text-xs  text-gray-700">Partially Taken</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calender;
