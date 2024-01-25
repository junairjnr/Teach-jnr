"use client";

import Link from "next/link";
import { RiCloseCircleFill } from "react-icons/ri";
import { IoIosVideocam } from "react-icons/io";
import { useQuery } from "react-query";
import { get } from "../../api/api-request";
import { getUserContext } from "../../auth/auth-context";
import parse from "../../utils/json-util";
import { MdSchool } from "react-icons/md";

export default function Videos() {
  const userContext = getUserContext();
  const { EmployeeId: teacherId } = parse(userContext);

  const { data: video, isLoading } = useQuery(["videos"], () =>
    get("Teacher/VideoGallery?teacherid=" + teacherId).then((res) => res)
  );
  console.log(video, "kittiyath");

  return (
    <div>
      <div className=" h-[100hv] w-full justify-center pt-[50px]">
        <div className="flex text-white justify-between z-10  items-center px-4 bg-[#03D3D4] w-[100%] top-0 left-0 fixed h-[50px] gap-5">
          <p className="text-xl font-bold items-center">Videos</p>
          <div>
            <Link href="/gallery">
              <RiCloseCircleFill className="items-center mt-1" size={25} />
            </Link>
          </div>
        </div>
        {/* <div className=" h-full w-full p-1"> */}
        {isLoading && (
            <div className="w-full h-full flex justify-center items-center bg-[#00000063] absolute">
              <MdSchool className="loading-icon fill-teal-500" size={70} />
            </div>
          )}
          <div className="flex flex-col p-2 h-full  justify-center items-center">
            {video?.data.map((item: any, index: number) => (
              <div key={index} className="flex justify-center p-2 items-center">
                <div className="flex flex-col justify-center items-center p-3 shadow shadow-[#7b7878] bg-gray-50">
                  <iframe
                    className="w-full p-3"
                    width="450"
                    height="200"
                    src={`https://www.youtube.com/embed/${item.youtubeId}`}
                    title=""
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                  {/* </div> */}
                  <div className="flex flex-col h-full w-full  p-1">
                    <p className=" flex gap-1 pl-1 text-[14px] font-sans font-bold items-center">
                      <IoIosVideocam className="mt-1" size={25} fill="red" />
                      {item.name}
                    </p>

                    <p className="text-gray-800 p-1 flex items-center text-[14px]">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        {/* </div> */}
      </div>
    </div>
  );
}
{
  /* <iframe width="1280" height="545" src="https://www.youtube.com/embed/2GNTovYb00s" title="INDO SUB [Huge Shark] Si Cantik bertemu hiu besar saat berselancar! | YOUKU" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe> */
}
