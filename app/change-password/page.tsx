"use client";

import { useFormik } from "formik";
import { useMutation } from "react-query";
import { post } from "../../api/api-request";
import { getUserContext } from "../../auth/auth-context";
import parse from "../../utils/json-util";
import { AxiosError, AxiosResponse } from "axios";
import { showError, showSuccess } from "../../components/Toast";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import TextError from "../../components/TextError";
import NavbarComp from "../NavComp";

const validationSchema = Yup.object().shape({
  currentPassword: Yup.string().required("current password required"),
  newPassword: Yup.string().required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required(),
});

export default function ChangePassword() {
  const userContext = getUserContext();
  const { EmployeeId: teacherId } = parse(userContext);

  const router = useRouter();
  const gotoHome = () => {
    router.push("/dashboard");
  };

  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      teacherId: teacherId,
      type: 2,
    },
    onSubmit: (values: any) => {
      changeMutation.mutate(values);
    },
    validationSchema,
  });

  const { values, handleChange, handleSubmit, errors, touched } = formik;

  const changeMutation = useMutation(
    (values: any) => {
      const v = { ...values };
      v.currentPassword = values.currentPassword;
      v.newPassword = values.newPassword;
      v.confirmPassword = values.confirmPassword;
      v.userId = values.teacherId;
      v.type = values.type;
      return post("GlobalApp/ChangePassword", v);
    },
    {
      onSuccess: (response: AxiosResponse, variables) => {
        if (!response.data.isSuccess) {
          showError(response.data.message);
          return;
        }
        showSuccess("Password Changed Successfully...!");
        gotoHome();
      },
      onError: (error: AxiosError) => {
        showError("Something Went Wrong...!");
      },
    }
  );

  return (
    <div>
      <div className=" h-[100vh] justify-center">
        <NavbarComp name="Change Password" navigation="/dashboard" />
        <div className="bg-white h-full">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col justify-center w-[600] h-[500px] p-8 font-sans text-[14px] gap-2 ">
              <div className="bg-gray-100 shadow shadow-[#7b7878] mt-6">
                <div className="flex flex-col p-5 border-b-2 gap-2 text-[14px] text-gray-700 font-semibold">
                  Current Password
                  <input
                    name="currentPassword"
                    value={values.currentPassword}
                    onChange={handleChange}
                    type="password"
                    className="outline-none p-1 rounded text-[14px] h-[30px] w-full pl-3"
                    placeholder="Type your current password"
                    required
                  />
                </div>
                <div className="p-5 border-b-2 flex flex-col gap-2 text-[14px] text-gray-700 font-semibold">
                  New Password
                  <input
                    name="newPassword"
                    value={values.newPassword}
                    onChange={handleChange}
                    type="password"
                    className="outline-none p-1 rounded text-[14px] h-[30px] w-full pl-3"
                    placeholder="Type your new password"
                    required
                  />
                </div>
                <div className="p-5 border-b-2 flex flex-col gap-2 text-[14px] text-gray-700 font-semibold">
                  Confirm Password
                  <input
                    name="confirmPassword"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    type="password"
                    className="outline-none p-1 rounded text-[14px] h-[30px] w-full pl-3"
                    placeholder="Confirm Password"
                    required
                  />
                  <TextError>
                    {errors.confirmPassword &&
                      touched.confirmPassword &&
                      "password mismatch"}
                  </TextError>
                </div>
                <div className="w-full h-[60px]">
                  <div className="flex justify-center items-center p-3">
                    <button className="flex justify-center items-center bg-cyan-500 rounded-lg text-lg text-white hover:bg-gray-300 shadow-lg w-[100px] h-[40px]">
                      Change
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
