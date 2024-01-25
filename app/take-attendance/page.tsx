"use client";
import React, { useRef } from "react";
import Select from "react-select";
import "../globals.css";
import { useState } from "react";
import Togle from "../Toggleswitch";
import { useMutation, useQuery } from "react-query";
import { getUserContext } from "../../auth/auth-context";
import parse from "../../utils/json-util";
import cloneDeep from "lodash/cloneDeep";
import { useSearchParams } from "next/navigation";
import PopUp from "../Popup";
import ConfirmMessage from "../ConfirmMessage";
import { get, post } from "../../api/api-request";
import { MdSchool } from "react-icons/md";
import NavbarComp from "../NavComp";

const userContext = getUserContext();
const { EmployeeId: teacherId } = parse(userContext);

const TakeAttendance = () => {
  const [toggle, setToggle] = useState(false); //toggle Button
  const [confirmMsg, setConfirmMsg] = useState(false);
  const [popUp, setPopUp] = useState(false);
  const searchParams = useSearchParams(); // select class, division when click attendance status division button
  const classId = searchParams.get("classId");
  const divisionId = searchParams.get("divisionId");
  const activeDate = searchParams.get("date");

  const todayDate = new Date().toISOString().substring(0, 10); //new date
  const [date, setDate] = useState(
    activeDate ? new Date(activeDate) : new Date()
  );
  const formattedDate = date.toISOString().substring(0, 10);

  const { data: classes = [], isLoading } = useQuery(
    ["classes"],
    () =>
      get("Attendance/GetClasses?teacherid=" + teacherId).then(
        (response) => response
      ),
    {
      select: (response) => response.data,
      refetchOnWindowFocus: false,
    }
  );

  const [activeClass, setActiveClass] = useState(classId || "");
  const { data: division } = useQuery(
    ["division", activeClass],
    () =>
      get("Attendance/GetDivisions?classId=" + activeClass).then(
        (response) => response
      ),
    {
      select: (response) => response.data,
      enabled: Boolean(activeClass),
      refetchOnWindowFocus: false,
    }
  );
  const [activeDivision, setActiveDivision] = useState(divisionId || "");

  const { data: hours } = useQuery(
    ["hour", teacherId],
    () =>
      get("Teacher/GetHours?teacherid=" + teacherId).then(
        (response) => response
      ),
    {
      select: (response) => response.data,
      enabled:
        Boolean(teacherId) && Boolean(activeClass) && Boolean(activeDivision),
      refetchOnWindowFocus: false,
    }
  );

  const saveAttendance = useMutation((params: any) =>
    post("Attendance/AttendancePost", params)
  );

  const hourOptions =
    hours?.map((x: any) => ({
      value: x.hourNo,
      label: x.name,
    })) ?? [];

  const [selectedMultiHours, setSelectedMultiHours] = useState([]);
  const hourIds = selectedMultiHours?.map((v: any) => v.value);
  const [attendance, setAttendance] = useState<Array<any>>([]);
  const { data: students } = useQuery(
    ["students", formattedDate, hourIds, activeDivision],
    () =>
      get(
        "Attendance/GetAttendance?divisionId=" +
          activeDivision +
          "&teacherId=" +
          teacherId +
          "&date=" +
          formattedDate +
          "&hour=" +
          hourIds
      ).then((response) => response),
    {
      select: (response) => response.data,
      enabled:
        Boolean(activeDivision) &&
        Boolean(teacherId) &&
        Boolean(formattedDate) &&
        Boolean(hourIds.length),
      refetchOnWindowFocus: false,
      onSuccess(data) {
        setAttendance(data.attendanceList);
      },
    }
  );

  const handleAttendanceCheck = (
    mainIndex: number,
    subIndex: number,
    newStatus: boolean
  ) => {
    const clone = cloneDeep(attendance);
    clone[mainIndex].hours[subIndex].present = newStatus;
    setAttendance(clone);
  };

  const handleSaveMutation = () =>
    saveAttendance.mutate({
      Date: formattedDate,
      TeacherId: teacherId,
      SubjectId: "",
      ListOfAttendances: attendance,
    });

  const absentees =
    attendance?.filter(
      (x) => x.hours.filter((x: any) => !x.present).length > 0
    ) ?? [];

  const inputRef = useRef(null);

  return (
    <div className="flex items-center justify-center ">
      <div className="w-full h-[100vh] items-center relative pt-[50px]">
        {isLoading && (
          <div className="w-full h-full flex justify-center items-center bg-[#00000063] absolute">
            <MdSchool className="loading-icon" size={70} />
          </div>
        )}

        <NavbarComp name="Take Attendance" navigation="/attendance" />
        <div className="w-full h-84 ">
          <div className="bg-[#e3e0e0] w-full h-[155px] p-2">
            <label
              htmlFor="date"
              onClick={() =>
                (inputRef?.current as unknown as HTMLInputElement)?.showPicker()
              }
            >
              <div className="w-full">
                <input
                  className="w-full h-[35px] p-1 text-[14px] font-semibold pr-5 focus:outline-0"
                  type="date"
                  ref={inputRef}
                  name="date"
                  value={formattedDate}
                  onChange={(e) => {
                    e.target.value && setDate(new Date(e.target.value));
                  }}
                />
              </div>
            </label>
            <div className="bg-[#e3e0e0] gap-1 w-full h-[45px] p- flex justify-between items-center">
              <select
                className="w-[50%] text-[14px] font-semibold h-[32px] p-1 focus:outline-0"
                name="class"
                id="class"
                onChange={(e) => setActiveClass(e.target.value)}
                value={activeClass}
              >
                <option value="">Select Class</option>
                {classes?.map((item: any, index: number) => (
                  <option key={index} value={item.classId}>
                    {item.class}
                  </option>
                ))}
              </select>

              <select
                className="w-[50%] text-[14px] font-semibold h-[32px] p-1 focus:outline-0"
                name="division"
                id="divition"
                onChange={(e: any) => setActiveDivision(e.target.value)}
                value={activeDivision}
              >
                <option value="">Select Division</option>
                {division?.map((item: any, index: any) => (
                  <option key={index} value={item.divisionId}>
                    {item.division}
                  </option>
                ))}
              </select>
            </div>

            <Select
              className="w-full h-[30px] text-[14px] font-semibold focus:outline-0"
              isMulti
              value={selectedMultiHours}
              onChange={(v: any) => {
                setSelectedMultiHours(v);
              }}
              options={hourOptions}
            />
          </div>
        </div>
        <div className=" w-full p-2 overflow-x-auto">
          <table className="w-full bg-white mb-10 text-[14px] font-semibold">
            <thead>
              <tr className="bg-[#176e6ee0] text-white h-[42px] text-center">
                <th className="w-[15%]  border border-1 border-[#c8e1e1e0]">
                  Roll No
                </th>
                <th className="w-[40%]  border border-1 border-[#c8e1e1e0] pl-[5px]">
                  Name
                </th>
                {selectedMultiHours.map((x: any, index: number) => (
                  <th
                    className="pr-1 w-[25%]  border border-1 border-[#c8e1e1e0]"
                    key={index}
                  >
                    {x.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {attendance.map((item: any, index: number) => (
                <tr className="text-[14px] " key={index}>
                  <td className="w-[15%] border text-center">{item.rollNo}</td>
                  <td className="pl-2 w-[40%] border">{item.name}</td>
                  {item.hours.map((x: any, subIndex: number) => (
                    <td className="pl-[10px] border" key={subIndex}>
                      {
                        <Togle
                          isSelected={attendance[index].hours[subIndex].present}
                          setIsSelected={(e) =>
                            handleAttendanceCheck(index, subIndex, e)
                          }
                        />
                      }{" "}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="w-full  pb-7 relative">
          <PopUp trigger={popUp} setTrigger={setPopUp}>
            <p className="text-lg pl-14 pt-6 text-green-950">
              {" "}
              Attendance taken successfully{" "}
            </p>
          </PopUp>

          <div className=" flex justify-center relative w-full ">
            <button
              className="font-bold bg-[#3e70cd] text-[14px] text-white rounded-full w-[243px] h-[39px] flex justify-center items-center disabled:true"
              type="button"
              disabled={!activeClass || !activeDivision.trim() ||  selectedMultiHours?.length ===0}
              onClick={() => {
                setConfirmMsg(true);
              }}
            >
              SAVE ATTENDANCE
            </button>
          </div>
        </div>
      </div>
      {/* {confirmMsg && (
        <ConfirmMessage
          trigger={confirmMsg}
          setTrigger={setConfirmMsg}
          setPopUp={setPopUp}
          saveAttendances={handleSaveMutation}
        >
          <div className="text-left">
            {attendance
              .filter((x) => x.hours.filter((x: any) => !x.present).length > 0) ? attendance
              .filter((x) => x.hours.filter((x: any) => !x.present).length > 0)
              .map((x: any, index:number) => (
                <div key={index} className="flex pl-4 gap-2">
                  <p className="text-[#FF0000] border w-10 flex mb-2 justify-center items-center ">{`${x.rollNo}`}</p>
                  <p className="pl-3" key={x.rollNo}>
                    {" "}
                    {x.name}{" "}
                  </p>
                </div>
              )) :""}
          </div>
        </ConfirmMessage>
      )} */}

      {confirmMsg && (
        <ConfirmMessage
          absenteesLength={absentees}
          trigger={confirmMsg}
          setTrigger={(state: any) => {
            setConfirmMsg(state);
            setTimeout(() => {
              setPopUp(false);
            }, 3000);
          }}
          setPopUp={setPopUp}
          saveAttendances={handleSaveMutation}
        >
          <div className="text-left">
            {absentees.map((x: any, index: number) => (
              <div className="flex pl-4" key={index}>
                <p className="text-[#FF0000] border w-10 flex mb-2 justify-center items-center  ">{`${x.rollNo}`}</p>
                <p className="pl-3" key={x.rollNo}>
                  {" "}
                  {x.name}{" "}
                </p>
              </div>
            ))}
          </div>
        </ConfirmMessage>
      )}
    </div>
  );
};

export default TakeAttendance;
