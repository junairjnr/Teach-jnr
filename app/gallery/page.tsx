"use client";

import Link from "next/link";
import "../../app/globals.css";
import { IoMdArrowRoundBack } from "react-icons/io";
import { BsFillPlusCircleFill } from "react-icons/bs";
import { MdOutlineOndemandVideo } from "react-icons/md";
import { useState } from "react";
import Album from "../../assets/img/no-images.png";
import Image from "next/image";
import { getUserContext } from "../../auth/auth-context";
import parse from "../../utils/json-util";
import { useMutation, useQuery } from "react-query";
import { get, post } from "../../api/api-request";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { AxiosError, AxiosResponse } from "axios";
import { showError, showSuccess } from "../../components/Toast";
import { MdSchool } from "react-icons/md";
import { queryClient } from "../../components/QueryClient";

export default function Gallery() {
  const [showAddForm, setShowAddForm] = useState(false);

  const userContext = getUserContext();
  const { EmployeeId: teacherId } = parse(userContext);

  const { data: gallery, isLoading } = useQuery(["gallery"], () =>
    get("General/TeacherGelleryAlbums?teacherId=" + teacherId).then(
      (res) => res
    )
  );

  const router = useRouter();
  const gotoimage = (id: string) => {
    router.push("gallery/" + id);
  };
  const saved = () => setShowAddForm(false);
  const formik = useFormik({
    initialValues: {
      id: 0,
      teacherId: teacherId,
      Name: "",
    },
    onSubmit: () => {
      postAlbum.mutate(values);
    },
  });

  const postAlbum = useMutation(
    (values: any) => {
      return post("teacher/AddAlbum", { ...values });
    },
    {
      onSuccess: (response: AxiosResponse, variables) => {
        queryClient.invalidateQueries(["gallery"]);
        showSuccess("Album Created Successfully...!");
        saved();
        gotoimage(response.data);
      },
      onError: (error: AxiosError) => {
        showError("Something Went Wrong...!");
      },
    }
  );

  const { handleChange, handleSubmit, values } = formik;

  return (
    <div>
      <div className=" h-[100vh]  justify-center relative font-sans pt-[50px]">
        <div className="flex text-white items-center justify-between z-10  px-4 bg-[#03D3D4] fixed top-0 left-0 w-[100%] h-[50px] gap-5">
          <div className="flex gap-3">
            <div>
              <Link href="/dashboard">
                <IoMdArrowRoundBack className=" mt-1" size={25} />
              </Link>
            </div>
            <p className="text-xl font-bold ">Gallery</p>
          </div>
          <Link href="/videos">
            <div className="justify-end flex gap-1">
              <MdOutlineOndemandVideo size={20} className="mt-2" />
              <p className="text-base mt-1 font-bold">videos</p>
            </div>
          </Link>
        </div>
        <div className=" h-[760px] relative flex justify-center">
          {isLoading && (
            <div className="w-full h-full flex justify-center items-center bg-[#00000063] absolute">
              <MdSchool className="loading-icon fill-teal-500" size={70} />
            </div>
          )}
          <div className="flex flex-wrap justify-center items-center h-[100vh] w-full rounded-lg mt-2">
            {gallery?.data.map((gall: any, index: number) => (
              <div key={index} className="flex p-2 rounded-lg">
                <div className="w-[320px] shadow shadow-[#7b7878] rounded-lg">
                  <Image
                    onClick={() => {
                      gotoimage(gall.albumId);
                    }}
                    src={
                      gall.firstImage
                        ? "data:image/gif;base64," + gall.firstImage
                        : Album
                    }
                    height={300}
                    width={300}
                    alt=""
                    className="w-[320px] h-[250px] rounde object-contain"
                  />
                  <div className="flex h-[30px] w-full  bg-gray-400 rounded-b-lg p-">
                    <p className="text-white font-semibold pl-5 pb-1 truncate">
                      {gall.albumName}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            <BsFillPlusCircleFill
              onClick={() => setShowAddForm(true)}
              size={50}
              className="ml-[430px] bottom-6 right-4 fixed fill-teal-600 "
            />
          </div>

          {showAddForm && (
            <div className="flex flex-col w-[300px] bg-white mt-1 justify-center fixed h-[250px] p-5 text-gray-800 rounded-sm">
              <form onSubmit={handleSubmit}>
                <h1 className="text-xl font-bold">Create a New Album</h1>

                <p className="pt-2">
                  enter a name for this new album you are so keen on adding
                </p>

                <div className="w-56 pt-6 p-2">
                  <input
                    onChange={handleChange}
                    name="name"
                    type="text"
                    className="outline-none text-slate-700 bg-white h-[40px] w-full rounded-lg pl-2"
                    placeholder="Album Name..."
                    required
                  />
                </div>
                <div className=" flex justify-center gap-3 pt-2">
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="text-white bg-slate-700 w-20 shadow-lg rounded-xl hover:bg-gray-400 "
                  >
                    Cancel
                  </button>
                  <button className="text-white bg-slate-700 w-20 shadow-lg rounded-xl hover:bg-gray-400 ">
                    Save
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// const CreateAlbum = () =>{
//     return(

//     )
// }
