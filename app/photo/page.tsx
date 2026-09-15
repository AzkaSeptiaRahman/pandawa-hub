"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function Photo() {


  const router = useRouter();


  const [data, setData] = useState<any>(null);




  useEffect(() => {


    const result = sessionStorage.getItem(
      "photoResult"
    );


    if(result){

      setData(
        JSON.parse(result)
      );

    }


  }, []);







  if(!data){


    return (

      <main
        className="
          min-h-screen
          flex
          items-center
          justify-center
          p-8
        "
      >

        <div
          className="
            glass
            rounded-3xl
            p-10
            text-center
          "
        >

          <h1
            className="
              text-2xl
              font-bold
            "
          >

            No Photo Data Found

          </h1>


          <button
            onClick={()=>router.push("/events")}
            className="
              mt-5
              rounded-full
              bg-white/10
              px-6
              py-3
              border
              border-white/20
            "
          >

            Return To Events

          </button>


        </div>


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
          fixed
          top-8
          left-8
          z-50
          rounded-full
          bg-white/10
          border
          border-white/20
          px-5
          py-3
          text-white
          backdrop-blur-xl
        "

      >

        ← Back

      </button>








      <div
        className="
          max-w-6xl
          mx-auto
        "
      >







        {/* Student Detail */}

        <div
          className="
            glass
            rounded-3xl
            p-8
            text-center
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

            <p>
              Graduation Number:
              {" "}
              {data.student.graduation_number}
            </p>


            <p>
              Faculty:
              {" "}
              {data.student.faculty}
            </p>


            <p>
              Program:
              {" "}
              {data.student.study_program}
            </p>


          </div>


        </div>









        {/* Photos */}

        <PhotoCategory

          title="📸 Foto Bebas"

          photos={data.photos.BEBAS}

        />



        <PhotoCategory

          title="🎓 Foto Kuncir"

          photos={data.photos.KUNCIR}

        />



        <PhotoCategory

          title="📜 Foto Ijazah"

          photos={data.photos.IJAZAH}

        />









        {/* Download Button */}

        <div
          className="
            flex
            justify-center
            mt-12
            pb-10
          "
        >

          <button

            className="
              rounded-full
              bg-blue-500/20
              border
              border-blue-400/30
              px-8
              py-4
              text-blue-300
              hover:bg-blue-500/30
              transition
            "

          >

            DOWNLOAD ALL PHOTOS

          </button>


        </div>





      </div>





    </main>

  );

}









function PhotoCategory({

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
                glass
                rounded-2xl
                overflow-hidden
                aspect-square
              "

            >


              <img

                src={photo.url}

                alt={photo.type}

                className="
                  w-full
                  h-full
                  object-cover
                  hover:scale-110
                  transition
                  duration-500
                "

              />


            </div>


          ))
        }



      </div>




    </section>

  );

}