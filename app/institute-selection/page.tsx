"use client";

import React, { useState } from "react";
import Image from "next/image";
import schola_Logo from "../../assets/brand.png";
import { IoMdArrowDropright } from "react-icons/io";
import { MdSchool } from "react-icons/md";
import { useMutation } from "react-query";
import { AxiosError, AxiosResponse } from "axios";
import * as Yup from "yup";
import { useFormik } from "formik";
import { get } from "../../api/api-request";
import { showError, showSuccess } from "../../components/Toast";
import { storeBaseUrl, storeCustomerId } from "../../auth/auth-context";
import TextError from "../../components/TextError";
import { useRouter } from "next/navigation";

type values = {
  instituteId: string;
};

const validationSchema = Yup.object().shape({
  instituteId: Yup.string().trim().required("Please type Institute ID."),
});

export default function InstituteSelection() {
  const router = useRouter();
  const gotoLogin = () => {
    router.push("/login");
  };
  const [showLoader, setShowLoader] = useState(false);

  const formik = useFormik({
    initialValues: {
      instituteId: "",
    },
    validationSchema,
    onSubmit: (values) => {
      InstituteSelection.mutate(values);
    },
  });

  const queryKey = ["InstituteId"];
  const InstituteSelection = useMutation(
    (values: values) => {
      const url =
        "https://mobileapp.schola.in/api/customer?customercode=" +
        values.instituteId;
      return get(url);
    },
    {
      onSuccess: (response: AxiosResponse, variables) => {
        storeBaseUrl(response.data.Url);
        storeCustomerId(response.data.CustomerId);
        gotoLogin();
        setShowLoader(true);
        showSuccess("Institute Selected Successfully");
      },
      onError: (error: AxiosError) => {
        showError("Invalid Institute");
      },
    }
  );

  const { handleChange, values, handleSubmit, errors } = formik;

  return (
    <div className="main-Container">
      <div className="mobile-container">
        {showLoader && (
          <div className="w-full h-full flex justify-center items-center bg-[#00000063] absolute">
            <MdSchool className="loading-icon fill-teal-500" size={70} />
          </div>
        )}
        <div className="w-full flex flex-col items-center mt-40">
          <Image src={schola_Logo} alt="" className="w-32 mr-auto ml-auto " />
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col input-bt">
              <div className="flex">
                <MdSchool
                  className="w-[35px] pl-1 pr-1 h-[48px] bg-[#00000063] "
                  fill="#0C9B9C"
                />
                <input
                  name="instituteId"
                  className="p-3 bg-[#A5F5F9] w-full outline-none"
                  type="text"
                  placeholder="Institution ID"
                  onChange={handleChange}
                />
              </div>
              <TextError>{errors.instituteId}</TextError>
              <div className="flex justify-center">
                <button
                  disabled={showLoader}
                  type="submit"
                  className="bg-[#073435] text-xs p-2 font-semibold mt-10 w-36 rounded-full text-white flex justify-center items-center text-center "
                >
                  NEXT <IoMdArrowDropright size={20} />
                </button>
              </div>
            </div>
          </form>
          <div className="flex flex-col">
            <div className="flex mt-[9rem] ">
              <p className="mr-1 text-white p-0">Powered by </p>
              <a
                href="http://datastoneglobal.com/"
                target="_blank"
                className="mr-1"
              >
                Datastone Solutions
              </a>
            </div>
            <div className="flex justify-center text-center">
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

// import React from "react";
// import * as Yup from "yup";
// import Image from "next/image";
// import schola_Logo from "../../assets/brand.png";
// import { IoMdArrowDropright } from "react-icons/io";
// import { MdSchool } from "react-icons/md";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useFormik } from "formik";
// import { useMutation, useQuery } from "react-query";
// import { storeBaseUrl } from "../../auth/auth-context";
// import { showError, showSuccess } from "../../components/Toast";
// import { AxiosError, AxiosResponse } from "axios";
// import { get } from "../../api/api-request";
// import TextError from "../../components/TextError";
// type values = {
//   instituteId: string;
// };
// const validationSchema = Yup.object().shape({
//   instituteId: Yup.string().trim().required("Please type Institute ID."),
//   //   email: Yup.string()
//   //     .trim()
//   //     .email("Please enter a valid email address!")
//   //     .required("Please type your valid email address!!"),
// });
// const InstituteSelection = () => {
//   const router = useRouter();
//   const gotoLogin = () => {
//     router.push("/login");
//   };
//   const formik = useFormik({
//     initialValues: {
//       instituteId: "",
//     },
//     validationSchema,
//     // validationSchema: {
//     //   instituteId: Yup.string().required("Required"),
//     // },
//     onSubmit: (values) => {
//       InstituteSelection.mutate(values);
//     },
//   });
//   const queryKey = ["InstituteId"];
//   const InstituteSelection = useMutation(
//     (values: values) => {
//       //const _v = { ...values };
//       const url =
//         "http://mobileapp.schola.in/api/customer?customercode=" +
//         values.instituteId;
//       //const { data } = useQuery(queryKey, () => get(url));
//       return get(url);
//       //return data;
//     },
//     {
//       onSuccess: (response: AxiosResponse, variables) => {
//         showSuccess(), storeBaseUrl(response.data.Url);
//         gotoLogin();
//       },
//       onError: (error: AxiosError) => {
//         showError(error.message);
//       },
//     }
//   );
//   const { handleChange, values, handleSubmit, errors } = formik;
//   return (
//     <div className="main-Container">
//       <div className="mobile-container">
//         <div className="w-full flex flex-col items-center mt-[26%]">
//           <Image src={schola_Logo} alt="" className="w-32 mr-auto ml-auto" />
//           <form onSubmit={handleSubmit} className="flex flex-col input-bt">
//             <div className="flex">
//               <MdSchool className="schoolIcon bg-[#A5F5F9] w-7" />
//               <input
//                 type="text"
//                 name="instituteId"
//                 placeholder="Institute ID"
//             onChange={handleChange}
//                 className="p-3 bg-[#A5F5F9] w-[250px] outline-none"
//               />
//             </div>
//             <TextError>{errors.instituteId}</TextError>
//             <div className="flex justify-center">
//               {/* <Link href={"/login"}>  */}
//               <button className="bg-[#073435] text-xs p-[10px] mt-10 w-32 rounded-full text-white flex justify-center items-center text-center fixed">
//                 NEXT <IoMdArrowDropright />
//               </button>
//               {/* </Link> */}
//             </div>
//           </form>
//           <div className="flex flex-col">
//             <div className="flex mt-[9rem] bottom">
//               <p className="mr-1 text-white p-0">Powered by </p>
//               <a href="http://datastoneglobal.com/" className="mr-1">
//                 Datastone Solution
//               </a>
//             </div>
//             <div className="flex justify-center text-center">
//               <a href="https://www.schola.in/" className="text-blue-950">
//                 www.schola.in
//               </a>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default InstituteSelection;
