"use client";

import Link from "next/link";
import { SiMdbook } from "react-icons/si";
import { BsFillPlusCircleFill } from "react-icons/bs";
import { HiPencil } from "react-icons/hi";
import { MdDeleteForever, MdSchool } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { useRef, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { get, post } from "../../api/api-request";
import { getUserContext } from "../../auth/auth-context";
import parse from "../../utils/json-util";
import { AxiosError, AxiosResponse } from "axios";
import { showError, showSuccess } from "../../components/Toast";
import { queryClient } from "../../components/QueryClient";
import NavbarComp from "../NavComp";

export default function HomeWork() {
  const dateTime = new Date();

  const [filterDate, setFilterDate] = useState(new Date());
  var filtered = filterDate.toISOString().substring(0, 10);

  const userContext = getUserContext();
  const { EmployeeId } = parse(userContext);

  const { data: homework, isLoading } = useQuery(
    ["homework", filtered],
    () =>
      get(
        "Teacher/HomeWork?TeacherId=" + EmployeeId + "&date=" + filtered
      ).then((res) => res),
    {
      select: (res) => res.data,
    }
  );

  const deleteMutation = useMutation(
    (id: string) => {
      return post(
        "teacher/DeleteHomeWork?teacherid=" + EmployeeId + "&homeWorkId=" + id,
        null
      );
    },
    {
      onSuccess: (response: AxiosResponse, variables) => {
        queryClient.invalidateQueries(["homework"]);
        showSuccess("Home-Work Deleted Successfully");
      },
      onError: (error: AxiosError) => {
        showError(error.message);
      },
    }
  );

  const handleDelete = (hw: any) => {
    if (window.confirm("Are you sure want to delete this?")) {
      deleteMutation.mutate(hw);
    }
  };

  const inputRef = useRef(null);

  return (
    <div>
      <div className=" h-[100vh] pt-[50px] justify-center">
        <NavbarComp name="Homework" navigation="/dashboard" />
        <div className=" h-full absolute w-full  flex flex-col">
          <div className="w-full fixed z-10 bg-gray-50">
            <p className="flex justify-center items-center text-[12px] p-3 text-amber-700 border-b-2">
              TODAY : {dateTime.toLocaleDateString()}
            </p>
            <label htmlFor="date" onClick={()=> (inputRef?.current as unknown as HTMLInputElement)?.showPicker()}>
              <div className="flex justify-between p-3  rounded-sm">
                <p className="p-2 text-gray-800 font-sans font-semibold text-[14px]">
                  Choose Date :
                </p>
                <input
                  type="date"
                  name="dates"
                  ref={inputRef}
                  value={filtered}
                  onChange={(e) => {
                    e.target.value && setFilterDate(new Date(e.target.value));
                  }}
                  className="rounded-sm outline-none bg-gray-50 text-[14px]"
                />
              </div>
            </label>
          </div>

          {isLoading && (
            <div className="w-full h-full flex justify-center items-center bg-[#00000063] absolute">
              <MdSchool className="loading-icon fill-teal-500" size={70} />
            </div>
          )}

          <div className="flex flex-col justify-center relative items-center p-3 gap-3 mt-[110px]">
            {homework?.map((hw: any, index: number) => (
              <div
                key={index}
                className="flex flex-col  bg-gray-200 h-full w-full rounded-md shadow-sm shadow-[#040C16]"
              >
                <div className="flex flex-row justify-between p-2">
                  <p className="flex  gap-1 text-[12px] text-amber-700 font-sans">
                    <SiMdbook className="fill-black mt-1" />
                    {hw.subject}
                  </p>
                  <p className=" text-[12px] text-red-800 font-sans">
                    {hw.class}-{hw.div}
                  </p>
                </div>
                <div className="flex flex-col p-5 gap-3">
                  <p className="text-lg font-semibold font-sans">
                    {hw.topicHeader}
                  </p>
                  <p className="text-[14px] text-gray-600 font-sans font-semibold">
                    {hw.description}
                  </p>
                  <div className="flex flex-row gap-3">
                    <p className=" font-sans font-semibold text-[14px]">
                      Submit on :
                    </p>
                    <p className="font-sans text-white bg-red-500 font-semibold  rounded-md pr-2 pl-2 text-[14px]">
                      {hw.submitDate}
                    </p>
                    <MdDeleteForever
                      onClick={() => {
                        handleDelete(hw.homeWorkId);
                      }}
                      className="bg-sky-50 rounded-sm "
                      size={20}
                    />

                    <Link
                      href={{
                        pathname: "/home-work/" + hw.homeWorkId,
                        query: { hw: JSON.stringify(hw) },
                      }}
                    >
                      <HiPencil className="bg-sky-50 rounded-sm " size={20} />
                    </Link>
                  </div>
                  <p className="flex gap-2 text-[14px] p-1">
                    <FaEye className="mt-1" /> Submissions
                  </p>
                  <div className="flex justify-end items-end">
                    <p className="text-[14px] text-gray-600">
                      {new Date(hw.date).toISOString().substring(0, 10)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Link href="/create-homework">
            <BsFillPlusCircleFill
              size={50}
              className="ml-[430px] bottom-5 right-5 fixed fill-teal-600 "
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
