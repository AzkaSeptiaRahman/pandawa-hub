"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "@/components/Button";


export default function Search() {


  const router = useRouter();


  const [graduationNumber, setGraduationNumber] = useState("");

  const [facultyOpen, setFacultyOpen] = useState(false);

  const [studyOpen, setStudyOpen] = useState(false);


  const [faculty, setFaculty] = useState(
    "Select Faculty"
  );

  const [study, setStudy] = useState(
    "Select Study Program"
  );


  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);





  const handleSearch = async () => {


    setError("");



    if (
      !graduationNumber ||
      faculty === "Select Faculty" ||
      study === "Select Study Program"
    ) {

      setError(
        "Please complete all required fields"
      );

      return;

    }





    const graduationRegex = /^\d{4}$/;


    if(!graduationRegex.test(graduationNumber)){


      setError(
        "Graduation number must be 4 digits"
      );


      return;


    }






    try {


      setLoading(true);



      const response = await fetch(
        "http://localhost:5000/api/photos/search",
        {

          method:"POST",

          headers:{
            "Content-Type":"application/json"
          },


          body:JSON.stringify({

            eventId:1,

            graduationNumber,

            faculty,

            studyProgram:study

          })

        }
      );





      const data = await response.json();





      if(!response.ok){


        setError(
          data.message || "Data not found"
        );


        return;


      }







      sessionStorage.setItem(

        "photoResult",

        JSON.stringify(data)

      );





      router.push("/photo");





    } catch(error){


      setError(
        "Cannot connect to server"
      );



    } finally {


      setLoading(false);


    }



  };









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



      {/* Back */}

      <button

        onClick={()=>router.back()}

        className="
          fixed
          top-8
          left-8
          z-50
          rounded-full
          bg-white/10
          border
          border-white/20
          backdrop-blur-xl
          px-5
          py-3
          text-white
          hover:bg-white/20
          transition
        "

      >

        ← Back

      </button>









      <div
        className="
          glass
          rounded-3xl
          p-10
          w-full
          max-w-lg
        "
      >





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

            Enter your graduation information

          </p>



        </div>









        <div className="mt-8 space-y-5">





          {/* Graduation Number */}

          <input

            type="text"

            value={graduationNumber}

            maxLength={4}

            onChange={(e)=>{


              const value = e.target.value;


              if(/^\d*$/.test(value)){

                setGraduationNumber(value);

              }


            }}

            placeholder="Example: 0001"

            className="
              w-full
              p-4
              rounded-xl
              bg-black/30
              border
              border-white/20
              text-white
              outline-none
              placeholder:text-slate-400
            "

          />









          {/* Faculty */}

          <div className="relative">


            <button

              type="button"

              onClick={()=>setFacultyOpen(!facultyOpen)}

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
              "

            >

              {faculty}

              <span>
                ▼
              </span>


            </button>





            {
              facultyOpen && (

                <div
                  className="
                    absolute
                    z-50
                    mt-2
                    w-full
                    bg-white
                    rounded-xl
                    overflow-hidden
                  "
                >

                  {
                    [
                      "Computer Science",
                      "Engineering",
                      "Economics"
                    ]
                    .map((item)=>(


                      <div

                        key={item}

                        onClick={()=>{

                          setFaculty(item);

                          setFacultyOpen(false);

                        }}

                        className="
                          px-5
                          py-3
                          text-black
                          hover:bg-blue-100
                          cursor-pointer
                        "

                      >

                        {item}

                      </div>


                    ))
                  }


                </div>

              )
            }



          </div>









          {/* Study */}

          <div className="relative">


            <button

              type="button"

              onClick={()=>setStudyOpen(!studyOpen)}

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
              "

            >

              {study}


              <span>
                ▼
              </span>


            </button>





            {
              studyOpen && (

                <div
                  className="
                    absolute
                    z-50
                    mt-2
                    w-full
                    bg-white
                    rounded-xl
                    overflow-hidden
                  "
                >


                  {
                    [
                      "Information Technology",
                      "Computer Science",
                      "Information System"
                    ]
                    .map((item)=>(


                      <div

                        key={item}

                        onClick={()=>{

                          setStudy(item);

                          setStudyOpen(false);

                        }}

                        className="
                          px-5
                          py-3
                          text-black
                          hover:bg-blue-100
                          cursor-pointer
                        "

                      >

                        {item}

                      </div>


                    ))
                  }


                </div>

              )
            }


          </div>









          {/* Error */}

          {
            error && (

              <div
                className="
                  rounded-xl
                  bg-red-500/20
                  border
                  border-red-400/30
                  px-4
                  py-3
                  text-red-300
                  text-sm
                  text-center
                "
              >

                ⚠️ {error}

              </div>

            )
          }









          {/* Button */}

          <div
            className="
              flex
              justify-center
              pt-4
            "
          >


            <Button

              onClick={handleSearch}

            >

              {
                loading
                ?
                "SEARCHING..."
                :
                "SEARCH PHOTO"
              }


            </Button>


          </div>





        </div>


      </div>



    </main>

  );

}