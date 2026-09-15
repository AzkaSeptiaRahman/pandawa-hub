"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/Button";

export default function Photo() {
  const router = useRouter();

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



      {/* Main Card */}
      <div
        className="
          glass
          rounded-3xl
          p-10
          max-w-3xl
          w-full
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
            Your Photos
          </h1>


          <p
            className="
              mt-3
              text-slate-400
            "
          >
            Your graduation memories are ready
          </p>

        </div>



        {/* Photo Grid */}
        <div
          className="
            grid
            grid-cols-3
            gap-5
            mt-10
          "
        >

          {[1, 2, 3].map((i) => (

            <div
              key={i}
              className="
                aspect-square
                rounded-2xl
                bg-gradient-to-br
                from-slate-900
                to-blue-600
                flex
                items-center
                justify-center
                text-5xl
                cursor-pointer
                hover:scale-105
                transition
                duration-300
              "
            >
              📸
            </div>

          ))}

        </div>




        {/* User Information */}
        <div
          className="
            mt-10
            rounded-2xl
            bg-black/20
            border
            border-white/10
            p-6
          "
        >

          <div className="space-y-5">


            <div>
              <p className="text-sm text-slate-400">
                Name
              </p>

              <p className="text-lg font-semibold">
                Ahmad Fauzan
              </p>
            </div>



            <div>
              <p className="text-sm text-slate-400">
                Graduation Number
              </p>

              <p className="text-lg font-semibold">
                WIS-2026-001
              </p>
            </div>



            <div>
              <p className="text-sm text-slate-400">
                Faculty
              </p>

              <p className="text-lg font-semibold">
                Computer Science
              </p>
            </div>



            <div>
              <p className="text-sm text-slate-400">
                Study Program
              </p>

              <p className="text-lg font-semibold">
                Information Technology
              </p>
            </div>


          </div>


        </div>





        {/* Action Buttons */}
        <div
          className="
            flex
            flex-col
            items-center
            gap-4
            mt-8
          "
        >

          {/* Download */}
          <Button>
            DOWNLOAD ALL PHOTOS
          </Button>



          {/* Return Home */}
          <button
            onClick={() => router.push("/")}
            className="
              rounded-full
              px-6
              py-3
              bg-white/10
              border
              border-white/20
              text-slate-200
              backdrop-blur-xl
              hover:bg-white/20
              transition
            "
          >
            ← Return to Home
          </button>


        </div>




        {/* Report */}
        <p
          className="
            text-center
            mt-8
            text-sm
            text-slate-300
          "
        >

          Wrong photo?

          <a
            href="mailto:graduation@university.ac.id"
            className="
              text-cyan-400
              ml-2
              hover:underline
            "
          >
            Report
          </a>

        </p>



      </div>


    </main>
  );
}