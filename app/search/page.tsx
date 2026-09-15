"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "@/components/Button";

export default function Search() {
  const router = useRouter();

  const [facultyOpen, setFacultyOpen] = useState(false);
  const [studyOpen, setStudyOpen] = useState(false);

  const [faculty, setFaculty] = useState("Select Faculty");
  const [study, setStudy] = useState("Select Study Program");


  return (
    <main
      className="
        min-h-screen
        flex
        items-center
        justify-center
        p-8
        relative
      "
    >

      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="
          fixed
          top-8
          left-8
          z-50
          flex
          items-center
          gap-2
          rounded-full
          bg-white/10
          border
          border-white/20
          backdrop-blur-xl
          px-5
          py-3
          text-slate-200
          hover:bg-white/20
          transition
        "
      >
        ← Back
      </button>



      {/* Card */}
      <div
        className="
          glass
          rounded-3xl
          p-10
          w-full
          max-w-lg
          shadow-[0_20px_60px_rgba(0,0,0,.35)]
        "
      >


        {/* Header */}
        <div className="text-center">

          <h1
            className="
              text-4xl
              font-bold
            "
          >
            Find Your Photo
          </h1>


          <p
            className="
              mt-3
              text-slate-400
            "
          >
            Enter your graduation information to find your photos
          </p>

        </div>



        {/* Form */}
        <div className="mt-8 space-y-5">


          {/* Graduation Number */}
          <input
            type="text"
            placeholder="Graduation Number"
            className="
              w-full
              p-4
              rounded-xl
              bg-black/30
              border
              border-white/20
              outline-none
              text-white
              placeholder:text-slate-400
              focus:border-blue-400
              transition
            "
          />



          {/* Faculty Dropdown */}
          <div className="relative">

            <button
              type="button"
              onClick={() => setFacultyOpen(!facultyOpen)}
              className="
                w-full
                p-4
                rounded-xl
                bg-black/30
                border
                border-white/20
                text-white
                flex
                justify-between
                items-center
                focus:border-blue-400
                transition
              "
            >

              {faculty}

              <span className="text-slate-300 text-sm">
                ▼
              </span>

            </button>



            {facultyOpen && (

              <div
                className="
                  absolute
                  z-50
                  mt-2
                  w-full
                  rounded-xl
                  overflow-hidden
                  bg-white
                  shadow-xl
                  border
                  border-slate-200
                "
              >

                {[
                  "Faculty of Science",
                  "Faculty of Engineering",
                  "Faculty of Economics",
                ].map((item) => (

                  <div
                    key={item}
                    onClick={() => {
                      setFaculty(item);
                      setFacultyOpen(false);
                    }}
                    className="
                      px-5
                      py-3
                      text-black
                      cursor-pointer
                      hover:bg-blue-100
                      transition
                    "
                  >
                    {item}
                  </div>

                ))}

              </div>

            )}

          </div>




          {/* Study Program Dropdown */}
          <div className="relative">

            <button
              type="button"
              onClick={() => setStudyOpen(!studyOpen)}
              className="
                w-full
                p-4
                rounded-xl
                bg-black/30
                border
                border-white/20
                text-white
                flex
                justify-between
                items-center
                focus:border-blue-400
                transition
              "
            >

              {study}

              <span className="text-slate-300 text-sm">
                ▼
              </span>

            </button>



            {studyOpen && (

              <div
                className="
                  absolute
                  z-50
                  mt-2
                  w-full
                  rounded-xl
                  overflow-hidden
                  bg-white
                  shadow-xl
                  border
                  border-slate-200
                "
              >

                {[
                  "Computer Science",
                  "Information System",
                  "Management",
                ].map((item) => (

                  <div
                    key={item}
                    onClick={() => {
                      setStudy(item);
                      setStudyOpen(false);
                    }}
                    className="
                      px-5
                      py-3
                      text-black
                      cursor-pointer
                      hover:bg-blue-100
                      transition
                    "
                  >
                    {item}
                  </div>

                ))}

              </div>

            )}

          </div>




          {/* Button */}
          <div className="flex justify-center pt-4">

            <Button
              onClick={() => router.push("/photo")}
            >
              SEARCH PHOTO
            </Button>

          </div>


        </div>


      </div>


    </main>
  );
}