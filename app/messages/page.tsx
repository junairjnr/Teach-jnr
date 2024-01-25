"use client";

import { getDviceId, getUserContext } from "../../auth/auth-context";
import parse from "../../utils/json-util";
import { useQuery } from "react-query";
import { get } from "../../api/api-request";
import { MdSchool } from "react-icons/md";
import NavbarComp from "../NavComp";

export default function Messages() {
  const userContext = getUserContext();
  const { EmployeeId } = parse(userContext);
  const deviceId = getDviceId();

  const { data: message, isLoading } = useQuery(["message"], () =>
    get(
      "General/TeacherGetMessages?teacherId=" +
        EmployeeId +
        "&deviceId=" +
        deviceId +
        "&lastId=" +
        0
    ).then((res) => res)
  );

  return (
    <div>
      <div className=" h-full  justify-center pt-[50px]">
        <NavbarComp name="Messages" navigation="/dashboard" />

        <div className="bg-gray-0 h-full">
          {isLoading && (
            <div className="w-full h-full flex justify-center items-center bg-[#00000063] absolute">
              <MdSchool className="loading-icon fill-teal-500" size={70} />
            </div>
          )}
          <div className="flex flex-col items-center justify-center bg-gray-100 h-full p-2">
            {message?.data.map((mess: any, index: number) => (
              <div
                key={index}
                className="flex flex-col mt-3 mb-3 h-full w-[95%] rounded-md shadow-md shadow-[#74777a] bg-green-50 p-4 font-sans"
              >
                <h1 className="font-sans text-lg font-semibold">
                  {mess.title}
                </h1>
                <p className="mt-3 text-[13px]">{mess.messageText}</p>
                <div className="flex justify-between mt-5 text-sm text-gray-600">
                  <p>{mess.date}</p>
                  <p>{mess.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
