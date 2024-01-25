"use client";
import { useState } from "react";
import Image from "next/image";
import { IoMdArrowDropright } from "react-icons/io";
import { IoMdArrowDropdown } from "react-icons/io";
import { useQuery } from "react-query";
import { MdSchool } from "react-icons/md";
import { get } from "../../../api/api-request";
import NavbarComp from "../../NavComp";

const Profile = ({ params }: { params: { id: string } }) => {
  const [details, setDetails] = useState(true);
  const [familyDet, setFamilyDet] = useState(false);
  const [medical, setMedical] = useState(false);
  const studentId = params.id;

  const { data, isLoading, isError } = useQuery(
    ["profileData"],
    () => get("Student/Profile?studentId=" + studentId).then((res) => res),
    {
      select: (data) => data.data,
      refetchOnWindowFocus: false,
      onSuccess() {
        //height == "0px" && setHeight("auto");
      },
    }
  );
  return (
    <div className="profileConatiner">
      <div className="w-full h-full pt-[50px]">
        <NavbarComp name="Profile" navigation="/students" />
        {isLoading && (
          <div className="w-full h-full flex justify-center items-center bg-[#00000063] absolute">
            <MdSchool className="loading-icon" size={70} />
          </div>
        )}
        <div className="flex flex-col ">
          <div className="flex flex-col gap-3 items-center bg-[#EFEEEF] text-[14px] p-5">
            <Image
              src={"data:image/gif;base64," + data?.photo}
              width={200}
              height={200}
              alt="profile Image"
              className="bg-transparent w-16 h-16 object-contain rounded-full border-[5px] border-[#E1E0E5] border-spacing-4 text-grey"
            />
            <h3 className="font-bold">{data?.name}</h3>
            <div className="flex gap-4">
              <h4>
                Class : <b> {data?.class}</b>
              </h4>
              <h4>
                Division : <b> {data?.div}</b>
              </h4>
            </div>
            <h4>
              Admission No : <b>{data?.admissionNo}</b>
            </h4>
            <h4>
              Class Teacher : <b>{data?.classTeacher}</b>
            </h4>
          </div>
          <div className="p-2 flex flex-col gap-2 text-[13px]">
            <div className="profile-personal-details">
              <div
                className="h-8 text-white items-center p-2 bg-[#FF506F] flex justify-between cursor-pointer"
                onClick={() => setDetails((old) => !old)}
              >
                <p className="text-[14px]">Personal Details</p>
                {!details && <IoMdArrowDropdown />}
                {details && <IoMdArrowDropright />}
              </div>
              {details && (
                <div className="personal-details-div">
                  <table className="w-full border-b-2 mt-2">
                    <tbody>
                      <tr className="flex border-b-2">
                        <td className="w-[40%]">Birth Date</td>
                        <td className="">: {data?.dob}</td>
                      </tr>
                      <tr className="flex border-b-2">
                        <td className="w-[40%]">Birth Place</td>
                        <td>: {data?.birthPlace}</td>
                      </tr>
                      <tr className="flex border-b-2">
                        <td className="w-[40%]">Blood Group</td>
                        <td>: {data?.bloodGroup}</td>
                      </tr>
                      <tr className="flex border-b-2">
                        <td className="w-[40%]">Religion</td>
                        <td>: {data?.religion}</td>
                      </tr>
                      <tr className="flex border-b-2">
                        <td className="w-[40%]">Aadhar No</td>
                        <td>: {data?.uid}</td>
                      </tr>
                      <tr className="flex border-b-2">
                        <td className="w-[40%]">Passport No</td>
                        <td>: {data?.passportNo}</td>
                      </tr>
                      <tr className="flex border-b-2">
                        <td className="w-[40%]">Student Mob No</td>
                        <td>: {data?.studentMobile}</td>
                      </tr>
                      <tr className="flex border-b-2">
                        <td className="w-[40%]">Present Address</td>
                        <td>: {data?.presentAddress}</td>
                      </tr>
                      <tr className="flex">
                        <td className="w-[40%]">Permenent Address</td>
                        <td>: {data?.permenentAddress}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className="profile-personal-details">
              <div
                className="h-8 text-white  items-center p-2  bg-[#B391E9] flex justify-between cursor-pointer"
                onClick={() => setFamilyDet((old) => !old)}
              >
                <p className="text-[14px]">Family Details</p>
                {!familyDet && <IoMdArrowDropdown />}
                {familyDet && <IoMdArrowDropright />}
              </div>
              {familyDet && (
                <div className="personal-details-div">
                  <table className="w-full border-b-2 mt-2">
                    <tbody>
                      <tr className="flex border-b-2 bg-slate-100">
                        <td className="w-[40%]">Father Name</td>
                        <td className="">: {data?.fatherName}</td>
                      </tr>
                      <tr className="flex border-b-2">
                        <td className="w-[40%]">Primary Mob No</td>
                        <td>: {data?.fatherMobile1}</td>
                      </tr>
                      <tr className="flex border-b-2">
                        <td className="w-[40%]">Secondary Mob No</td>
                        <td>: {data?.fatherMobile2}</td>
                      </tr>
                      <tr className="flex border-b-2  bg-slate-100">
                        <td className="w-[40%]">Mother Name</td>
                        <td>: {data?.motherName}</td>
                      </tr>
                      <tr className="flex border-b-2">
                        <td className="w-[40%]">Primary Mob No</td>
                        <td>: {data?.motherMobile1}</td>
                      </tr>
                      <tr className="flex border-b-2">
                        <td className="w-[40%]">Secondary Mob No</td>
                        <td>: {data?.motherMobile2}</td>
                      </tr>
                      <tr className="flex border-b-2  bg-slate-100 ">
                        <td className="w-[40%]">Guardian Name</td>
                        <td className="text-[12px]">: {data?.guardianName}</td>
                      </tr>
                      <tr className="flex border-b-2">
                        <td className="w-[40%]">Mob No</td>
                        <td>: {data?.guardianMobile}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className="profile-personal-details">
              <div
                className="h-8 text-white p-2 items-center bg-[#4ECDCC] flex justify-between cursor-pointer"
                onClick={() => setMedical((old) => !old)}
              >
                <p className="text-[14px]">Medical Details</p>
                {!medical && <IoMdArrowDropdown />}
                {medical && <IoMdArrowDropright />}
              </div>
              {medical && (
                <div className="personal-details-div">
                  <table className="w-full border-b-2 mt-2">
                    <tbody>
                      <tr className="flex border-b-2">
                        <td className="w-[40%]">Height</td>
                        <td className="">: {data?.height}</td>
                      </tr>
                      <tr className="flex border-b-2">
                        <td className="w-[40%]">Weight</td>
                        <td>: {data?.weight}</td>
                      </tr>
                      <tr className="flex border-b-2">
                        <td className="w-[40%]">Eye Sight Left</td>
                        <td>: {data?.eyeSightL}</td>
                      </tr>
                      <tr className="flex border-b-2">
                        <td className="w-[40%]">Eye Sight Right</td>
                        <td>: {data?.eyeSightR}</td>
                      </tr>
                      <tr className="flex border-b-2">
                        <td className="w-[40%]">Dental Hygiene</td>
                        <td>: {data?.dentalHygiene}</td>
                      </tr>
                      <tr className="flex border-b-2">
                        <td className="w-[40%]">Allergies</td>
                        <td>: {data?.allergies}</td>
                      </tr>
                      <tr className="flex border-b-2">
                        <td className="w-[40%]">medical Remarls</td>
                        <td>: {data?.medicalRemarks}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Profile;
