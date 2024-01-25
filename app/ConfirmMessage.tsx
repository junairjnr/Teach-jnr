"use client"


import React from "react";
import "./globals.css";
import { FaRegWindowClose } from "react-icons/fa";
import { showSuccess } from "../components/Toast";
const ConfirmMessage = (props: any) => {
  return props.trigger ? (
    <div className="w-[400px] h-[100vh] fixed flex justify-center items-center bg-transparent">
      <div className="container w-[350px] h-[350px] bg-white content-center">
        <div className="flex justify-end">
          <button
            className="closeBtn bg-transparent border-none "
            onClick={() => props.setTrigger(false)}
          >
            <FaRegWindowClose className="fill-[#DC143C]" />{" "}
          </button>
        </div>
        <div className="inline-block text-center pb-7">
          <h1 className="text-xl font-sans font-semibold">
            {props.absenteesLength?.length < 1
              ?  "No absentees,Confirm Submission "
              : "Confirm Absentees"}
          </h1>
        </div>
        <div className="overflow-auto ">{props.children}</div>
        <div className="footer">
          <button id="cancelBtn" onClick={() => props.setTrigger(false)}>
            CANCEL
          </button>
          <button
            onClick={() => {
              props.setTrigger(false);
              props.setPopUp(true);
              props.saveAttendances();
              showSuccess("Attendance taken successfully..");
            }}
          >
          OK
          </button>
        </div>
      </div>
    </div>
  ) : (
    ""
  );
};
export default ConfirmMessage;
