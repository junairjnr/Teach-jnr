"use client";

import { RiFolderUploadLine } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
import {  useRef, useState } from "react";
import Albums from "../../../assets/img/no-images.png";
import Image from "next/image";
import { useMutation, useQuery } from "react-query";
import { getUserContext } from "../../../auth/auth-context";
import parse from "../../../utils/json-util";
import { get, post } from "../../../api/api-request";
import { MdSchool } from "react-icons/md";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Navigation, Scrollbar, A11y, Pagination } from "swiper/modules";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/navigation";
import { EffectFade } from "swiper/modules";
import "swiper/css/pagination";
import { AxiosError, AxiosResponse } from "axios";
import { queryClient } from "../../../components/QueryClient";
import { showError, showSuccess } from "../../../components/Toast";
import NavbarComp from "../../NavComp";

export default function ImageView({ params }: { params: { id: string } }) {
  const userContext = getUserContext();
  const { EmployeeId: teacherId } = parse(userContext);

  const [showAddForm, setShowAddForm] = useState(false);
  const albumId = params.id;

  const { data: imageview, isLoading } = useQuery(
    ["imageview", albumId],
    () => get("General/AlbumEntries?albumId=" + albumId).then((res) => res),
    {
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    }
  );

  const deleteImage = useMutation(
    (id: any) => {
      return post("teacher/DeletePhoto", { id, teacherId });
    },
    {
      onSuccess: (response: AxiosResponse, variables) => {
        queryClient.invalidateQueries(["imageview"]);
        showSuccess("Image Deleted Succesfully...!");
      },
      onError: (error: AxiosError) => {
        showError(error.message);
      },
    }
  );

  const slideActiveRef = useRef(0);

  const handleDelete = () => {
    const item = imageview?.data?.[slideActiveRef.current];
    if (!item) {
      return;
    }
    if (window.confirm("Are you sure want to delete this?")) {
      deleteImage.mutate(item.id);
    }
  };

  const uploadMutation = useMutation((fileBase64: any) => {
    return post("teacher/UploadPhoto", {
      teacherId: teacherId,
      albumId: albumId,
      image: fileBase64,
    });
  });
  const save = () => setShowAddForm(false);

  const handleSubmit = (fileBase64: any) => {
    uploadMutation.mutate(fileBase64, {
      onSuccess: () => {
        queryClient.invalidateQueries(["imageview"]);
        showSuccess("Image Upload Successfully");
        save();
        // notify();
      },
      onError: (error: any) => {
        showError("Something Went Wrong...!");
      },
    });
  };

  return (
    <div className="">
      <div className=" h-[100vh] justify-center items-center  relative pt-[50px]">
        <NavbarComp name="Gallery" navigation="/gallery"/>
        <div className=" h-[760px]">
          <div className="p-5 ">
            <Swiper
              onSlideChange={(e) => (slideActiveRef.current = e.activeIndex)}
              className="flex flex-col w-full justify-center h-[410px] rounded-md border shadow shadow-[#7b7878] bg-slate-200"
              modules={[Navigation, Scrollbar, A11y, EffectFade, Pagination]}
              scrollbar={{ draggable: true }}
              effect="fade"
              pagination={{ clickable: true }}
              spaceBetween={50}
              slidesPerView={1}
            >
              {isLoading && (
                <div className="w-full h-full flex justify-center items-center bg-[#00000063] absolute">
                  <MdSchool
                    className="loading-icon mr-7 fill-teal-500"
                    size={70}
                  />
                </div>
              )}
              {imageview?.data.map((item: any, index: number) => (
                <SwiperSlide key={item.id} className="w-full h-full">
                  <Image
                    src={
                      item.image
                        ? "data:image/gif;base64," + item.image
                        : Albums
                    }
                    height={100}
                    width={100}
                    alt=""
                    className="w-full h-[350px] rounded-sm  bg-white object-contain"
                  />
                  <div className="flex h-[50px] w-full bg-slate-200 rounded-sm items-center justify-between">
                    <p className="text-gray-600 font-sans text-[14px] mb-3 font-semibold ml-2">
                      {item.imageName}
                    </p>
                    <div className="flex gap-3 justify-center items-center mr-3 mb-2">
                      <MdDelete
                        onClick={handleDelete}
                        size={20}
                        className="fill-red-500 cursor-pointer "
                      />
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <RiFolderUploadLine
            onClick={() => setShowAddForm(true)}
            size={50}
            className=" ml-[430px] bottom-6 right-5 fixed fill-teal-600 "
          />

          {showAddForm && (
            <div className="flex w-full flex-col justify-center bottom-3  bg-gray-200  fixed font-sans font-semibold h-[120px] p-2 text-gray-700 rounded-lg">
              <div className="flex flex-col justify-center p-2 items-start">
                <div className="relative bg-white mt-2 w-full">
                  <input
                    className="opacity-0 "
                    type="file"
                    required
                    onChange={(e: any) => {
                      const reader = new FileReader();

                      const file = e.target.files[0];
                      reader.onload = function (e: any) {
                        const base64Data = e.target?.result?.split(",")[1]; // Extracting base64 data
                        handleSubmit(base64Data);
                      };

                      reader.readAsDataURL(file);
                    }}
                  />
                  <div className=" ml-2 absolute left-0 top-0 w-[100%] h-[100%] pointer-events-none cursor-pointer">
                    Upload
                  </div>
                </div>
                <div
                  className="w-full cursor-pointer ml-2"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
