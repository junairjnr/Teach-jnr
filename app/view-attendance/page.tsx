"use client";
import React, { useRef } from "react";
import "../globals.css";
import { getUserContext } from "../../auth/auth-context";
import parse from "../../utils/json-util";
import { useQuery } from "react-query";
import { useState } from "react";
import format from "date-fns/format";
import { useRouter } from "next/navigation";
import { get } from "../../api/api-request";
import NavbarComp from "../NavComp";

const userContext = getUserContext();
const { EmployeeId } = parse(userContext);

const ViewAttendance = () => {
  const [date, setDate] = useState(new Date());
  const formattedDate = format(date, "yyyy-MM");
  // const dateForApi = format(date, "yyyy/MM/dd")

  const { data: classes = [], isLoading } = useQuery(
    ["classes"],
    () =>
      get("Attendance/GetClasses?teacherid=" + EmployeeId).then(
        (response) => response
      ),
    {
      select: (response) => response.data,
      refetchOnWindowFocus: false,
    }
  );

  const [activeClass, setActiveClass] = useState("");
  const { data: division } = useQuery(
    ["division", activeClass],
    () =>
      get("Attendance/GetDivisions?classId=" + activeClass).then(
        (response) => response
      ),
    {
      select: (response) => response.data,
      enabled: Boolean(activeClass),
      refetchOnWindowFocus: false,
    }
  );
  const [activeDivision, setActiveDivision] = useState(undefined);
  const { data: students } = useQuery(
    ["students", activeDivision, formattedDate, EmployeeId],
    () =>
      get(
        "Attendance/GetMonthData?date=" +
          formattedDate +
          "&divisionId=" +
          activeDivision +
          "&teacherid=" +
          EmployeeId
      ).then((response) => response),
    {
      select: (response) => response.data,
      enabled:
        Boolean(activeDivision) &&
        Boolean(formattedDate) &&
        Boolean(EmployeeId),
      refetchOnWindowFocus: false,
    }
  );

  const router = useRouter();
  const gotoCalender = (item: any) => {
    //pass qparamtr to calender
    router.push(
      `/calender?studentId=${item.studentId}&studentName=${item.studentName}&date=${formattedDate}`
    );
  };
  const inputRef = useRef(null)

  return (
    <div>
      <div className=" h-[100hv] w-full justify-center pt-[50px]">
        <NavbarComp name="View Attendance" navigation="/attendance" />
        <div className="w-full h-84 flex justify-center items-center">
          <div className="bg-[#e3e0e0] w-full h-[84px] p-1">
            <label htmlFor="date" onClick={()=> (inputRef?.current as unknown as HTMLInputElement)?.showPicker()}>
            <div className="w-full ">
            <input
              className="w-full h-[30px] p-3 text-[14px] font-semibold text-gray-700 focus:outline-0"
              type="month"
              ref={inputRef}
              onChange={(e) => {
                const newDate = new Date(`${e.target.value}-01`);
                setDate(newDate);
              }}
              value={formattedDate}
              placeholder="Choose Date"
            />
            </div>
            </label>
            <div className=" gap-1 w-full h-[45px] flex justify-between items-center">
              <select
                className="w-[50%] h-[30px] p-1 text-sm text-center font-semibold text-gray-700 items-center focus:outline-0"
                name="class"
                id="class"
                onChange={(e) => setActiveClass(e.target.value)}
                value={activeClass}
              >
                <option value="">Select Class</option>
                {classes?.map((item: any, index: number) => (
                  <option value={item.classId} key={index}>
                    {item?.class}
                  </option>
                ))}
              </select>

              <select
                className="w-[50%] h-[30px] p-1 text-sm text-center font-semibold text-gray-700 focus:outline-0"
                name="divition"
                id="divition"
                onChange={(e: any) => setActiveDivision(e.target.value)}
              >
                <option value="">Select Division</option>
                {division?.map((item: any, index: number) => (
                  <option value={item.divisionId} key={index}>
                    {item?.division}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="">
          <div className=" w-400 p-2">
            <table className="w-full bg-white table-fixed ">
              <thead>
                <tr className="bg-[#176e6ee0] text-white h-[42px] text-center">
                  <th className="w-[20%] border border-1 border-[#c8e1e1e0]">
                    Roll No
                  </th>
                  <th className="w-[60%] border border-1 border-[#c8e1e1e0]">
                    Name
                  </th>
                  <th className="w-[20%] border border-1 border-[#c8e1e1e0]">
                    Present
                  </th>
                </tr>
              </thead>
              <tbody className="text-[12px]">
                {students?.map((item: any, index: number) => (
                  // <Link href={"/calender"}>

                  <tr
                    onClick={() => {
                      gotoCalender(item);
                    }}
                    className="text-[12px] font-medium h-[40px] cursor-pointer"
                    key={index}
                  >
                    <td className="w-[20%] text-center  border">
                      {item.rollNo}
                    </td>
                    <td className="w-[60%] text-center border">
                      {item.studentName}
                    </td>
                    <td className="w-[20%] text-center border ">
                      {item.total}
                      {/* <button className="pl-3">
                            
                            <MdOutlineArrowRight className="outline-arrow hover:scale-125" />
                          
                          </button> */}
                    </td>
                  </tr>
                  // </Link>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAttendance;
