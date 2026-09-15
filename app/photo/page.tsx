"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function Photo() {


  const router = useRouter();


  const [data, setData] = useState<any>(null);

  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);





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








  const downloadPhotos = () => {


    window.open(

      `http://localhost:5000/api/download/${data.student.id}`,

      "_blank"

    );


  };









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

          photos={data.photos?.BEBAS}

          onClick={setSelectedPhoto}

        />



        <PhotoCategory

          title="🎓 Foto Kuncir"

          photos={data.photos?.KUNCIR}

          onClick={setSelectedPhoto}

        />



        <PhotoCategory

          title="📜 Foto Ijazah"

          photos={data.photos?.IJAZAH}

          onClick={setSelectedPhoto}

        />












        {/* Download */}


        <div

          className="
            flex
            justify-center
            mt-12
            pb-10
          "

        >


          <button


            onClick={downloadPhotos}



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









      {/* Preview Modal */}


      {
        selectedPhoto && (

          <div

            onClick={()=>setSelectedPhoto(null)}

            className="
              fixed
              inset-0
              z-50
              bg-black/80
              flex
              items-center
              justify-center
              p-8
            "

          >


            <img


              onClick={(e)=>e.stopPropagation()}


              src={

                selectedPhoto.url.startsWith("http")

                ?

                selectedPhoto.url

                :

                `http://localhost:5000${selectedPhoto.url}`

              }


              alt="preview"


              className="
                max-h-[85vh]
                max-w-5xl
                rounded-3xl
                object-contain
              "


            />


          </div>


        )
      }





    </main>

  );

}









function PhotoCategory({

  title,

  photos,

  onClick


}:{

  title:string;

  photos:any[];

  onClick:(photo:any)=>void;

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


              onClick={()=>onClick(photo)}


              className="
                glass
                rounded-2xl
                overflow-hidden
                aspect-square
                cursor-pointer
              "

            >


              <img


                src={

                  photo.url.startsWith("http")

                  ?

                  photo.url

                  :

                  `http://localhost:5000${photo.url}`

                }


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