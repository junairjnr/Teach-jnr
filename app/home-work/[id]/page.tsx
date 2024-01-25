"use client";

import Link from "next/link";
import { TiTick } from "react-icons/ti";
import {  useMutation, useQuery } from "react-query";
import { get, post } from "../../../api/api-request";
import { getUserContext } from "../../../auth/auth-context";
import parse from "../../../utils/json-util";
import { MdOutlineClose } from "react-icons/md";
import { useRouter, useSearchParams } from "next/navigation";
import { useFormik } from "formik";
import format from "date-fns/format";
import { AxiosError, AxiosResponse } from "axios";
import { showError, showSuccess } from "../../../components/Toast";
import { queryClient } from "../../../components/QueryClient";
import * as Yup from "yup";
import TextError from "../../../components/TextError";


const validationSchema = Yup.object().shape({
  subject: Yup.string().required("Subject is required"),
  division: Yup.string().required("Division is required"),
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
});

export default function EditHW({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams();

  const passedData = searchParams.get("hw") ?? "";
  const getData = JSON.parse(passedData);

  const userContext = getUserContext();
  const { EmployeeId: teacherId } = parse(userContext);

  const { data: classes = [] } = useQuery(
    ["class"],
    () =>
      get("Attendance/GetClasses?teacherid=" + teacherId).then((res) => res),
    {
      select: (res) => res.data,
    }
  );

  const router = useRouter();
  const gotoHome = () => {
    router.push("/home-work");
  };

  const formik = useFormik({
    initialValues: {
      homeWorkId: getData.homeWorkId,
      teacherId: 6776,
      date: format(new Date(getData.date), "yyyy-MM-dd"),
      class: getData.classId,
      division: getData.divisionId,
      subject: getData.subjectId,
      title: getData.topicHeader,
      description: getData.description,
      submitDate: format(new Date(getData.submitDate), "yyyy-MM-dd"),
      file: getData.filePath,
    },
    enableReinitialize: true,
    onSubmit: () => {
      editMutation.mutate(values);
    },
    validationSchema
  });


  const editMutation = useMutation(
    (values: any) => {
      const data = new FormData();
      data.append("file", values.file);
      data.append("TeacherId", values.teacherId);
      data.append("homeWorkId", values.homeWorkId);
      data.append("Date", values.date);
      data.append("Divs", values.division);
      data.append("SubjectId", values.subject);
      data.append("TopicHeader", values.title);
      data.append("Description", values.description);
      data.append("SubmissionDate", values.submitDate);
      return post("teacher/CreateHomeWork", data);
    },
    {
      onSuccess: (response: AxiosResponse, variables) => {
        queryClient.invalidateQueries("hw");
        showSuccess("Home-Work Updated Successfully....!");
        gotoHome();
      },
      onError: (error: AxiosError) => {
        showError(error.message);
      },
    }
  );

  const { handleChange, values, handleSubmit, setFieldValue, errors,touched } = formik;

  const { data: division } = useQuery(
    ["division", values.class],
    () =>
      get("Attendance/GetDivisions?classId=" + values.class).then((res) => res),
    {
      select: (res) => res.data,
      enabled: Boolean(values.class),
    }
  );

  const { data: subjects } = useQuery(["subject"], () =>
    get("Teacher/Subjects?TeacherId=" + teacherId).then((res) => res)
  );

  return (
    <div>
      <div className=" h-[100vh]  justify-center">
        <div className="flex text-white  items-center px-4 bg-[#03D3D4]  h-[50px] gap-3">
          <div>
            <Link href="/home-work">
              <MdOutlineClose className="items-center" fill="#fff" size={20} />
            </Link>
          </div>
          <p className="text-xl font-bold items-center">Edit Homework</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="bg-gray-100 h-[760px]  p-3 font-sans">
            <div className="flex justify-between bg-gray-200 rounded-sm ">
              <p className="p-2 text-gray-800 font-sans font-semibold text-[14px]">
                Choose Date :{" "}
              </p>
              <input
                value={values.date}
                name="date"
                onChange={handleChange}
                type="date"
                className="rounded-sm text-[14px] bg-gray-200 outline-none mr-2"
              />
            </div>
            <p className="p-2 text-gray-800 font-sans font-semibold text-[14px]">
              Class :{" "}
            </p>
            <select
              name="class"
              className="w-full  outline-none pl-6 p-1 rounded-sm bg-gray-200 text-[14px]"
              onChange={handleChange}
              value={values.class}
            >
              <option>select class</option>
              {classes.map((clas: any, index: number) => (
                <option key={index} value={clas.classId}>
                  {clas.class}
                </option>
              ))}
            </select>
            <p className="p-2 text-gray-800 font-sans font-semibold text-[14px]">
              Division :{" "}
            </p>
            <select
              onChange={handleChange}
              value={values.division}
              name="division"
              className="w-full  outline-none pl-6 p-1 rounded-sm bg-gray-200 text-[14px]"
            >
              <option value={""}>select Division</option>
              {division?.map((divis: any, index: number) => (
                <option key={index} value={divis.divisionId}>
                  {divis.division}
                </option>
              ))}
            </select>
            <TextError>
              {errors?.division && touched?.division
                ? (errors.division as string)
                : ""}
            </TextError>
            <p className="p-2 text-gray-800 font-sans font-semibold text-[14px]">
              Subject :{" "}
            </p>
            <select
              value={values.subject}
              name="subject"
              className="w-full  outline-none pl-6 p-1 rounded-sm bg-gray-200 text-[14px]"
              onChange={handleChange}
            >
              <option value={""}>select subject</option>
              {subjects?.data.map((sub: any, index: number) => (
                <option key={index} value={sub.sujectMasterId}>
                  {sub.subName}
                </option>
              ))}
            </select>
            <TextError>
              {errors?.subject && touched?.subject
                ? (errors.subject as string)
                : ""}
            </TextError>
            {/* <p className="p-2 text-gray-800 font-sans font-semibold text-[14px]">
              Submit Date :{" "}
            </p> */}
            
            <p className="p-2 text-gray-800 font-sans  font-semibold text-[14px]"></p>
            <div className="flex justify-between  bg-gray-200 rounded-sm">
              <p className="p-2 text-gray-800 font-sans font-semibold text-[14px]">
                Submit Date :{" "}
              </p>
              <input
                value={values.submitDate}
                name="submitDate"
                type="date"
                className="rounded-sm  text-[14px] bg-gray-200 outline-none mr-2"
                onChange={handleChange}
              />
            </div>
            <p className="p-2 text-gray-800 font-sans font-semibold text-[14px]">
              Title :{" "}
            </p>
            <input
              value={values.title}
              name="title"
              type="text"
              className="w-full h-[35px] outline-none pl-2 bg-gray-200 rounded-md text-[14px]"
              onChange={handleChange}
            />
            <TextError>
              {errors?.title && touched?.title ? (errors.title as string) : ""}
            </TextError>
            <p className="p-2 text-gray-800 font-sans font-semibold text-[14px]">
              Description :{" "}
            </p>
            <textarea
              value={values.description}
              name="description"
              className="w-full h-[100px] p-3 rounded-md bg-gray-200 outline-none"
              onChange={handleChange}
              required
            ></textarea>
             <TextError>
              {errors?.description && touched?.description
                ? (errors.description as string)
                : ""}
            </TextError>
            <input
              name="file"
              type="file"
              className="text-[14px]"
              onChange={(e) => setFieldValue("file", e.target.files?.[0])}
            ></input>
            <div className="flex justify-center p-4 border-b-gray-400">
              <button
                type="submit"
                className="flex  justify-center p-1  text-white bg-teal-400 rounded-3xl w-32 text-lg font-bold hover:bg-teal-600"
              >
                <TiTick size={20} className="mt-1 bg-black rounded-2xl mr-2 " />
                Update
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
