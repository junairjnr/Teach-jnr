"use client";

import Link from "next/link";
import { MdOutlineClose } from "react-icons/md";
import { TiTick } from "react-icons/ti";
import { getUserContext } from "../../auth/auth-context";
import parse from "../../utils/json-util";
import { useMutation, useQuery } from "react-query";
import { get, post } from "../../api/api-request";
import { useRef, useState } from "react";
import { useFormik } from "formik";
import { showError, showSuccess } from "../../components/Toast";
import { AxiosError, AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import addDays from "date-fns/addDays";
import * as Yup from "yup";
import RequiredError from "../../components/RequiredError";

const validationSchema = Yup.object().shape({
  subject: Yup.string().required("Subject is required"),
  division: Yup.string().required("Division is required"),
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
});

export default function CreateHW() {
  const userContext = getUserContext();
  const { EmployeeId: teacherId } = parse(userContext);

  const router = useRouter();
  const gotoHome = () => {
    router.push("/home-work");
  };

  const { data: classes = [] } = useQuery(
    ["class"],
    () =>
      get("Attendance/GetClasses?teacherid=" + teacherId).then((res) => res),
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

  const { data: subjects } = useQuery(["subject"], () =>
    get("Teacher/Subjects?TeacherId=" + teacherId).then((res) => res)
  );

  const datetoday = new Date().toISOString().substring(0, 10);
  const dateadd = addDays(new Date(), 1).toISOString().substring(0, 10);

  const formik = useFormik({
    initialValues: {
      homeWorkId: 0,
      teacherId: teacherId,
      date: datetoday,
      class: "",
      division: "",
      subject: "",
      title: "",
      description: "",
      submitDate: dateadd,
      file: null,
    },
    onSubmit: (values: any) => {
      homeworkMutation.mutate(values);
    },
    validationSchema,
  });

  const homeworkMutation = useMutation(
    (values: any) => {
      const data = new FormData();
      data.append("file", values.file);
      data.append("TeacherId", values.teacherId);
      data.append("homeWorkId", "0");
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
        showSuccess("Home-Work Created Successfully...!");
        gotoHome();
      },
      onError: (error: AxiosError) => {
        showError("Something went rong");
      },
    }
  );

  const { handleChange, values, handleSubmit, setFieldValue, errors, touched } =
    formik;

    const inputRef = useRef(null);

  return (
    <div>
      <div className=" h-[100vh]  justify-center pt-[50px]">
        <div className="flex text-white  items-center px-4 bg-[#03D3D4] fixed top-0 left-0 w-[100%] h-[50px] gap-3">
          <div>
            <Link href="/home-work">
              <MdOutlineClose className="items-center" fill="#fff" size={20} />
            </Link>
          </div>
          <p className="text-xl font-bold items-center">Create Homework</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="bg-white h-full p-3 font-sans">
            <label  htmlFor="date" onClick={()=> (inputRef?.current as unknown as HTMLInputElement)?.showPicker()}>
            <div className="flex justify-between bg-gray-200 rounded-sm ">
              <p className="p-2 text-gray-800 font-sans font-semibold text-[14px]">
                Choose Date :{" "}
              </p>
              <input
                value={values.date}
                name="date"
                ref={inputRef}
                onChange={handleChange}
                type="date"
                className="rounded-sm  text-[14px] bg-gray-200 outline-none mr-2"
              />
            </div>
            </label>
            <p className="p-2 text-gray-800 font-sans font-semibold text-[14px]">
              Class :{" "}
            </p>
            <select
              name="class"
              className="w-full  outline-none pl-6 p-1 rounded-sm bg-gray-200 text-[14px]"
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
            <RequiredError>
              {errors?.division && touched?.division
                ? (errors.division as string)
                : ""}
            </RequiredError>
            <p className="p-2 text-gray-800 font-sans font-semibold text-[14px]">
              Subject :{" "}
            </p>
            <select
              value={values.subject}
              name="subject"
              className="w-full  outline-none pl-6 p-1 rounded-sm bg-gray-200 text-[14px] pb-2"
              onChange={handleChange}
            >
              <option value={""}>select subject</option>
              {subjects?.data.map((sub: any, index: number) => (
                <option key={index} value={sub.sujectMasterId}>
                  {sub.subName}
                </option>
              ))}
            </select>
            <RequiredError>
              {errors?.subject && touched?.subject
                ? (errors.subject as string)
                : ""}
            </RequiredError>
            <p className="p-2 text-gray-800 font-sans  font-semibold text-[14px]"></p>
            <label  htmlFor="date" onClick={()=> (inputRef?.current as unknown as HTMLInputElement)?.showPicker()}>
            <div className="flex justify-between bg-gray-200 rounded-sm">
              <p className="p-2 text-gray-800 font-sans  font-semibold text-[14px]">
                Submit Date :{" "}
              </p>
              <input
                value={values.submitDate}
                name="submitDate"
                ref={inputRef}
                type="date"
                className="rounded-sm  text-[14px] bg-gray-200 outline-none mr-2"
                onChange={handleChange}
              />
            </div>
            </label>
            <p className="p-2 text-gray-800 font-sans  font-semibold text-[14px]">
              Title :{" "}
            </p>
            <input
              value={values.title}
              name="title"
              type="text"
              className="w-full h-[35px] outline-none pl-2 bg-gray-200 rounded-md text-[14px]"
              onChange={handleChange}
            />
            <RequiredError>
              {errors?.title && touched?.title ? (errors.title as string) : ""}
            </RequiredError>
            <p className="p-2 text-gray-800 font-sans  font-semibold text-[14px]">
              Description :{" "}
            </p>
            <textarea
              value={values.description}
              name="description"
              className="w-full h-[100px] p-3 rounded-md bg-gray-200 outline-none"
              onChange={handleChange}
            ></textarea>
            <RequiredError>
              {errors?.description && touched?.description
                ? (errors.description as string)
                : ""}
            </RequiredError>
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
                Create
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
