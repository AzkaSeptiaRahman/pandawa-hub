"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function Photo(){


  const router = useRouter();


  const [data,setData] = useState<any>(null);




  useEffect(()=>{


    const result = sessionStorage.getItem(
      "photoResult"
    );


    if(result){

      setData(JSON.parse(result));

    }


  },[]);







  if(!data){


    return (

      <main
        className="
          min-h-screen
          flex
          items-center
          justify-center
        "
      >

        <p className="text-slate-400">
          No photo data found
        </p>


      </main>

    );


  }








  return (

    <main
      className="
        min-h-screen
        p-8
      "
    >



      {/* Back */}

      <button
        onClick={()=>router.back()}
        className="
          rounded-full
          bg-white/10
          px-5
          py-3
          border
          border-white/20
        "
      >
        ← Back
      </button>







      <div
        className="
          max-w-6xl
          mx-auto
          mt-10
        "
      >





        {/* Student Detail */}

        <div
          className="
            glass
            rounded-3xl
            p-8
          "
        >

          <h1
            className="
              text-4xl
              font-bold
            "
          >

            {data.student.name}

          </h1>



          <div
            className="
              mt-5
              text-slate-300
              leading-8
            "
          >

            Graduation Number:
            {" "}
            {data.student.graduation_number}

            <br />

            Faculty:
            {" "}
            {data.student.faculty}


            <br />

            Program:
            {" "}
            {data.student.study_program}


          </div>


        </div>









        {/* Photo Section */}

        <PhotoSection

          title="📸 BEBAS"

          photos={data.photos.BEBAS}

        />



        <PhotoSection

          title="🎓 KUNCIR"

          photos={data.photos.KUNCIR}

        />



        <PhotoSection

          title="📜 IJAZAH"

          photos={data.photos.IJAZAH}

        />





      </div>



    </main>

  );

}








function PhotoSection({
  title,
  photos
}:{
  title:string;
  photos:any[];
}){


  if(!photos || photos.length === 0){

    return null;

  }



  return (

    <section
      className="
        mt-12
      "
    >


      <h2
        className="
          text-3xl
          font-bold
        "
      >

        {title}

      </h2>





      <div
        className="
          grid
          md:grid-cols-3
          gap-6
          mt-6
        "
      >

        {
          photos.map((photo,index)=>(


            <div

              key={index}

              className="
                rounded-2xl
                overflow-hidden
                glass
                aspect-square
              "

            >

              <img

                src={photo.url}

                alt="graduation photo"

                className="
                  w-full
                  h-full
                  object-cover
                "

              />


            </div>


          ))
        }


      </div>


    </section>

  );

}