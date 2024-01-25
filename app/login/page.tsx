"use client";

import React, { useState } from "react";
import Image from "next/image";
import schola_Logo from "../../assets/brand.png";
import { FaUserTie } from "react-icons/fa";
import { AiFillLock } from "react-icons/ai";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import axios, { AxiosResponse } from "axios";
import {
  getBaseUrl,
  getUserContext,
  storeDeviceId,
  storeUserContext,
} from "../../auth/auth-context";
import TextError from "../../components/TextError";
import parse from "../../utils/json-util";
import { useMutation, useQuery } from "react-query";
import { post } from "../../api/api-request";
import { showError, showSuccess } from "../../components/Toast";
import { MdSchool } from "react-icons/md";

type values = {
  username: string;
  password: string;
  grant_type?: string;
  type?: string;
};

const validationSchema: Yup.Schema<values> = Yup.object().shape({
  username: Yup.string().trim().required("Please type UserName"),
  password: Yup.string().trim().required("Please type Password"),
});

export default function Login() {
  const router = useRouter();

  //
  const gotoDashboard = () => {
    router.push("/dashboard");
  };

  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik<values>({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema,
    onSubmit: (values) => {
      const body = new URLSearchParams();
      body.append("UserName", values.username);
      body.append("Password", values.password);
      body.append("grant_type", "password");
      body.append("type", "T");
      axios
        .post(getBaseUrl() + "api/token", body)
        .then(function (response) {
          storeUserContext(response.data);
          device.mutate(1);
        })
        .catch(function (error) {
          showError("Invalid username or password");
        });
    },
  });

  const device = useMutation(
    (id: any) => {
      const values = {} as any;
      const userContext = getUserContext();
      const { EmployeeId } = parse(userContext);
      values.teacherId = +EmployeeId;
      values.deviceid = id;
      values.OS = "p";
      values.Version = "1.0";
      return post("Register/TeacherSavedeviceid", values);
    },
    {
      onSuccess: (response: AxiosResponse, variables) => {
        setIsLoading(true);
        showSuccess("You are Logged in Successfully");
        storeDeviceId(response.data);
        gotoDashboard();
      },
    }
  );

  const { handleChange, values, handleSubmit, errors } = formik;

  return (
    <div className="main-Container">
      <div className="mobile-container">
        {isLoading && (
          <div className="w-full h-full flex justify-center items-center bg-[#00000063] absolute">
            <MdSchool className="loading-icon fill-teal-500" size={70} />
          </div>
        )}
        <div className="w-full flex flex-col items-center mt-40">
          <Image src={schola_Logo} alt="" className="w-32 mr-auto ml-auto" />
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col input-bt">
              <div className="flex">
                <FaUserTie className="userIcon bg-[#A5F5F9] " />
                <input
                  name="username"
                  type="text"
                  placeholder="Username"
                  className="p-3 bg-[#A5F5F9] w-[250px] outline-none"
                  onChange={handleChange}
                />
              </div>
              <TextError>{errors.username}</TextError>
              <div className="flex mt-4">
                <AiFillLock className="userIcon bg-[#A5F5F9]  " />
                <input
                  name="password"
                  type="password"
                  placeholder="password"
                  className="p-3 bg-[#A5F5F9] w-[250px] outline-none"
                  onChange={handleChange}
                />
              </div>
              <TextError>{errors.password}</TextError>
              <div className="flex justify-center">
                <button
                  disabled={isLoading}
                  type="submit"
                  className="bg-[#FBF103] text-base font-semibold p-1 mt-10 w-40 rounded-full text-black flex justify-center items-center text-center "
                >
                  LOG IN
                </button>
              </div>
            </div>
          </form>
          <div className="flex flex-col">
            <div className="flex mt-[9rem] bottom">
              <p className="mr-1 text-white">
                Powered by
                <a
                  href="http://datastoneglobal.com/"
                  target="_blank"
                  className="pl-2 text-black"
                >
                  Datastone Solutions
                </a>
              </p>
            </div>
            <div className="flex justify-center text-center mt-7">
              <a
                href="https://www.schola.in/"
                target="_blank"
                className="text-blue-950"
              >
                www.schola.in
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
