"use client";

import { useState } from "react";
import { LuSearch } from "react-icons/lu";
import { get } from "../../api/api-request";
import { useQuery } from "react-query";
import { getUserContext } from "../../auth/auth-context";
import parse from "../../utils/json-util";
import { useRouter } from "next/navigation";
import { MdSchool } from "react-icons/md";
import NavbarComp from "../NavComp";

export default function Students() {
  const router = useRouter();
  const gotoProfile = (id: string) => {
    router.push("students/" + id);
  };

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

  const [activeDivision, setActiveDivision] = useState("");

  const [search, setSearch] = useState("");

  const { data: students, isLoading } = useQuery(
    ["student", activeDivision],
    () =>
      get(
        "Teacher/GetStudents?teacherid=" +
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
      <div className=" h-[100hv] pt-[50px] w-full justify-center">
        <NavbarComp name="Students" navigation="/dashboard" />
        <div className=" h-[760px] w-full flex flex-col">
          <div className=" text-white h-[50px] flex flex-row bg-gray-200 p-2">
            <div className="flex gap-1 w-full">
              <LuSearch
                size={30}
                className=" mt-1 text-white rounded-md bg-green-600"
              />
              <input
                className="h-[35px] w-full bg-white text-gray-700  pl-2 outline-none ml-1  rounded-md"
                type="text"
                placeholder="search....."
                onChange={(e) => setSearch(e.target.value)}
                value={search}
              />
            </div>
          </div>
          <div className="justify-between flex bg-gray-200 p-1 gap-2">
            <select
              className="text-sm text-center h-[30px] w-[50%] outline-none border-2 cursor-pointer "
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
              className="text-sm text-center h-[30px] w-[50%] outline-none border-2 cursor-pointer "
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
          <div className="p-2 ">
            <table className="w-full bg-white mb-10 border ">
              <thead>
                <tr className="bg-teal-900 text-white text-[12px]">
                  <th className="text-center  font-sans p-2 border border-1 border-black">
                    Roll No
                  </th>
                  <th className="text-center  font-sans p-2 border border-1 border-black">
                    AdNo
                  </th>
                  <th className="text-center  font-sans p-2 border border-1 border-black">
                    Name
                  </th>
                </tr>
              </thead>
              {isLoading && (
                <div className="w-full h-full flex justify-center items-center bg-[#00000063] absolute">
                  <MdSchool className="loading-icon fill-teal-500" size={70} />
                </div>
              )}
              <tbody className="w-full">
                {students
                  ?.filter((x: any) => {
                    if (!search) {
                      return true;
                    }

                    return x.name.toLowerCase().includes(search.toLowerCase());
                  })
                  ?.map((item: any, index: number) => (
                    <tr key={index} className="text-[12px]">
                      <td className="text-center p-2 border border-1 cursor-pointer">
                        {item.rollNo}
                      </td>
                      <td className="text-center p-2 border border-1 cursor-pointer">
                        {item.admissionNo}
                      </td>
                      <td
                        onClick={() => gotoProfile(item.studentId)}
                        className="text-left p-2  border border-1 cursor-pointer"
                      >
                        {item.name}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
