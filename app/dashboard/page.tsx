"use client";

import { useEffect, useState } from "react";
import Image, { StaticImageData } from "next/image";
import Student from "../../assets/img/student.png";
import HomeWork from "../../assets/img/home-work.png";
import NewsEvents from "../../assets/img/news-and-events.png";
import School from "../../assets/img/school.png";
import Attendance from "../../assets/img/attendance.png";
import ExamResult from "../../assets/img/exam-result.png";
import Directory from "../../assets/img/directory.png";
import Gallery from "../../assets/img/gallery.png";
import SchoolDiary from "../../assets/img/school-diary.png";
import Messages from "../../assets/img/communication.png";
import Link from "next/link";
import Navbar from "../Navbar";
import { getCustomerId } from "../../auth/auth-context";
import { MdSchool } from "react-icons/md";

export default function Dashboard() {
  const basePath = "assets/img/";
  const icons: { [key: string]: StaticImageData } = {
    [`${basePath}student.png`]: Student,
    [`${basePath}home-work.png`]: HomeWork,
    [`${basePath}news-and-events.png`]: NewsEvents,
    [`${basePath}school.png`]: School,
    [`${basePath}attendance.png`]: Attendance,
    [`${basePath}exam-result.png`]: ExamResult,
    [`${basePath}directory.png`]: Directory,
    [`${basePath}gallery.png`]: Gallery,
    [`${basePath}school-diary.png`]: SchoolDiary,
    [`${basePath}communication.png`]: Messages,
    [`${basePath}time-table.png`]: Messages,
  };

  const path: { [key: string]: string } = {
    [`Dashboard`]: "/dashboard",
    [`Students`]: "/students",
    [`News & Events`]: "/news-events",
    [`Homework`]: "/home-work",
    [`School`]: "/school",
    [`Attendance`]: "/attendance",
    [`Exam Result`]: "/exam-result",
    [`Directory`]: "/directory",
    [`Gallery`]: "/gallery",
    [`School Diary`]: "/school-diary",
    [`Messages`]: "/messages",
    ["Class Room"]: "",
  };

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        "https://mobileapp.schola.in/api/module?CustomerId=" +
          getCustomerId() +
          "&type=T"
      );
      const json = await res.json();
      setData(json);
      setIsLoading(false);
    };
    fetchData();
  }, [setData]);

  return (
    <div>
      <div className="bg-white h-[100vh] w-full items-center justify-center">
        {isLoading && (
          <div className="w-full h-full flex justify-center items-center bg-[#00000063] absolute">
            <MdSchool className="loading-icon fill-teal-500" size={70} />
          </div>
        )}
        <Navbar />
        <div className="flex justify-center items-center w-full">
          <div className="flex justify-center items-center p-2 w-full">
            <div className=" grid grid-cols-3 gap-5 justify-center items-center text-center w-full">
              {data?.map((item: any, index: number) => (
                <div
                  key={index}
                  className="flex justify-center items-center w-full"
                >
                  <div className="w-[90px] h-[110px] shadow-lg bg-white">
                    <Link href={path[item.ModuleName]}>
                      <div
                        className="rounded-md flex justify-center "
                        style={{
                          backgroundColor: `#${item.Color}`,
                        }}
                      >
                        <Image
                          src={icons[item.Image]}
                          alt=""
                          width={100}
                          height={100}
                          className="object-contain w-[50px] h-[80px]  "
                        />
                      </div>
                    </Link>
                    <p className="py-1 font-sans text-[12px] truncate font-bold text-slate-500">
                      {item.ModuleName}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
