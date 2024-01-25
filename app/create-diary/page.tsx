"use client";

import Link from "next/link";
import { TiTick } from "react-icons/ti";
import { useMutation, useQuery } from "react-query";
import { get, post } from "../../api/api-request";
import { getUserContext } from "../../auth/auth-context";
import parse from "../../utils/json-util";
import { useRef } from "react";
import { useFormik } from "formik";
import Select from "react-select";
import { MdOutlineClose, MdViewQuilt } from "react-icons/md";
import { AxiosError, AxiosResponse } from "axios";
import { showError, showSuccess } from "../../components/Toast";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import RequiredError from "../../components/RequiredError";

const validationSchema = Yup.object().shape({
  category: Yup.string().required("Category is required"),
  class: Yup.string().required("Class is required"),
  division: Yup.string().required("Division is required"),
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
});

export default function CreateDairy() {
  const { data: category } = useQuery(
    ["directory"],
    () => get("Teacher/DiaryCategory").then((res) => res),
    {
      select: (res) => res.data,
    }
  );

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
    router.push("/school-diary");
  };

  const formik = useFormik({
    initialValues: {
      date: new Date().toISOString().substring(0, 10),
      teacherId: teacherId,
      description: "",
      title: "",
      category: "",
      class: "",
      division: "",
      students: [],
    },
    onSubmit: (values: any) => {
      diaryMutation.mutate(values);
    },
    validationSchema,
  });
  const { handleChange, values, handleSubmit, setFieldValue, errors, touched } =
    formik;

  const { data: division } = useQuery(
    ["division", values.class],
    () =>
      get("Attendance/GetDivisions?classId=" + values.class).then((res) => res),
    {
      select: (res) => res.data,
      enabled: Boolean(values.class),
    }
  );

  const { data: students } = useQuery(
    ["student", values.division],
    () =>
      get(
        "Teacher/GetStudents?teacherid=" +
          teacherId +
          "&divid=" +
          values.division
      ).then((res) => res),
    {
      select: (res) => res.data,
      enabled: Boolean(values.division),
    }
  );

  const studOptions =
    students?.map((x: any) => ({
      value: x.studentId,
      label: x.name,
    })) ?? [];

  const diaryMutation = useMutation(
    (values: any) => {
      const v: any = {};
      v.Date = values.date;
      v.TeacherId = values.teacherId;
      v.Remarks = values.description;
      v.Title = values.title;
      v.CategoryId = values.category;
      v.Students = values.students.map((x: any) => x.value);
      return post("teacher/AddDiary", v);
    },
    {
      onSuccess: (response: AxiosResponse, variables) => {
        showSuccess("Diary Created Successfully...!");
        gotoHome();
      },
      onError: (error: AxiosError) => {
        showError("Something Went Wrong...!");
      },
    }
  );

  const inputRef = useRef(null);

  return (
    <div>
      <div className=" h-[100vh]  justify-center pt-[50px]">
        <div className="flex text-white  items-center px-4 bg-[#03D3D4] fixed top-0 left-0 w-[100%] h-[50px] gap-5">
          <div>
            <Link href="/school-diary">
              <MdOutlineClose className="items-center" fill="#fff" size={20} />
            </Link>
          </div>
          <p className="text-xl font-bold items-center">Create Dairy</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="bg-gray h-[760px]  p-4 font-sans">
            <label htmlFor="date" onClick={()=> (inputRef?.current as unknown as HTMLInputElement)?.showPicker()}>
            <div className="flex justify-between bg-gray-200 rounded-sm">
              <p className="p-2 text-gray-800 font-sans font-semibold text-[14px]">
                Choose Date :
              </p>
              <input
                value={values.date}
                name="date"
                ref={inputRef}
                onChange={handleChange}
                type="date"
                className="rounded-sm bg-gray-200 text-[14px] outline-none mr-2"
                required
              />
            </div>
            </label>
            <p className="p-2 text-gray-800 font-sans font-semibold text-[14px]">
              Category :
            </p>
            <select
              name="category"
              value={values.category}
              className="w-full bg-gray-200 outline-none pl-6 p-1 text-[14px]  rounded-sm"
              onChange={handleChange}
              required
            >
              <option>select</option>
              {category?.map((dcat: any, index: number) => (
                <option key={index} value={dcat.diaryCategoryId}>
                  {dcat.diaryCategoryName}
                </option>
              ))}
            </select>
            <RequiredError>
              {errors?.category && touched?.category
                ? (errors.category as string)
                : ""}
            </RequiredError>
            <p className="p-2 text-gray-800 font-sans font-semibold text-[14px]">
              Class :
            </p>
            <select
              name="class"
              className="w-full bg-gray-200 outline-none pl-6 text-[14px] p-1 rounded-sm"
              onChange={handleChange}
              value={values.class}
            >
              <option>select</option>
              {classes.map((clas: any, index: number) => (
                <option key={index} value={clas.classId}>
                  {clas.class}
                </option>
              ))}
            </select>
            <p className="p-2 text-gray-800 font-sans font-semibold text-[14px]">
              Division :
            </p>
            <select
              name="division"
              className="w-full bg-gray-200 outline-none pl-6 text-[14px] p-1 rounded-sm "
              onChange={handleChange}
              value={values.division}
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
            <div className="flex justify-between ">
              <p className="p-2 text-gray-800 font-sans font-semibold text-[14px]">
                Students :
              </p>
              <div className="flex justify-between items-center gap-2 p-1">
                <p className="text-gray-800 font-sans font-semibold text-[14px]">
                  Select All
                </p>
                <input
                  type="checkbox"
                  onChange={(e) => {
                    let val = [];
                    if (e.target.checked) {
                      val = studOptions;
                    }
                    setFieldValue("students", val);
                  }}
                  className=""
                />
              </div>
            </div>

            <Select
              className="w-full bg-gray-200 text-gray-800 outline-none text-[14px] p-1 rounded-sm"
              isMulti
              value={values.students}
              onChange={(v) => setFieldValue("students", v)}
              options={studOptions}
            />
            <p className="p-2 text-gray-800 font-sans font-semibold text-[14px]">
              Title :
            </p>
            <input
              value={values.title}
              onChange={handleChange}
              name="title"
              type="text"
              className="w-full bg-gray-50 h-[35px] outline-none  text-[14px] pl-2 rounded-md"
            />
            <RequiredError>
              {errors?.title && touched?.title ? (errors.title as string) : ""}
            </RequiredError>
            <p className="p-2 text-gray-800 font-sans font-semibold text-[14px]">
              Description :
            </p>
            <textarea
              onChange={handleChange}
              name="description"
              className="w-full bg-gray-50 h-[100px] p-3 rounded-md outline-none"
            >
              {values.description}
            </textarea>
            <RequiredError>
              {errors?.description && touched?.description
                ? (errors.description as string)
                : ""}
            </RequiredError>
            <div className="flex justify-center p-4 border-b-gray-400">
              <button className="flex  justify-center p-1  text-white bg-teal-400 rounded-3xl w-32 text-lg font-bold hover:bg-teal-600">
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
