"use client";

import {
    useEffect,
    useState
} from "react";

import {
    useRouter,
    useSearchParams
} from "next/navigation";

import Button from "@/components/Button";


type GraduateOption = {
    faculty:string;
    study_program:string;
};


export default function Search(){

    const router = useRouter();
    const searchParams = useSearchParams();

    const eventId = searchParams.get("event");

    const [graduationNumber,setGraduationNumber] = useState("");

    const [options,setOptions] = useState<GraduateOption[]>([]);

    const [faculty,setFaculty] = useState("");
    const [study,setStudy] = useState("");

    const [facultyOpen,setFacultyOpen] = useState(false);
    const [studyOpen,setStudyOpen] = useState(false);

    const [error,setError] = useState("");
    const [loading,setLoading] = useState(false);
    const [loadingOptions,setLoadingOptions] = useState(true);


    useEffect(()=>{

        if(!eventId){

            setError(
                "Invalid event. Please select event again."
            );

            setLoadingOptions(false);

            return;
        }

        loadOptions();

    },[eventId]);


    const loadOptions = async()=>{

        try{

            setLoadingOptions(true);

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/photos/options?eventId=${eventId}`
            );

            const data = await response.json();

            if(!response.ok){

                setError(
                    data.message ||
                    "Cannot load event data"
                );

                return;
            }

            setOptions(
                data.options || data || []
            );

        }catch(error){

            console.error(error);

            setError(
                "Cannot connect to server"
            );

        }finally{

            setLoadingOptions(false);
        }
    };


    const faculties = Array.from(
        new Set(
            options
                .map(item=>item.faculty)
                .filter(Boolean)
        )
    );


    const studies = Array.from(
        new Set(
            options
                .filter(
                    item=>item.faculty === faculty
                )
                .map(
                    item=>item.study_program
                )
                .filter(Boolean)
        )
    );


    const selectFaculty = (value:string)=>{

        setFaculty(value);

        // reset prodi kalau fakultas berubah
        setStudy("");

        setFacultyOpen(false);
        setStudyOpen(false);
    };


    const handleSearch = async()=>{

        setError("");

        if(!eventId){

            setError(
                "Invalid event. Please select event again."
            );

            return;
        }

        if(
            !graduationNumber ||
            !faculty ||
            !study
        ){

            setError(
                "Please complete all required fields"
            );

            return;
        }


        if(!/^\d{4}$/.test(graduationNumber)){

            setError(
                "Graduation number must be 4 digits"
            );

            return;
        }


        try{

            setLoading(true);


            const payload = {

                eventId:Number(eventId),

                graduationNumber,

                faculty,

                studyProgram:study

            };


            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/photos/search`,
                {
                    method:"POST",

                    headers:{
                        "Content-Type":"application/json"
                    },

                    body:JSON.stringify(payload)
                }
            );


            const data = await response.json();


            if(!response.ok){

                setError(
                    data.message ||
                    "Graduate or photo not found"
                );

                return;
            }


            sessionStorage.setItem(
                "photoSearch",
                JSON.stringify(payload)
            );


            router.push("/photo");

        }catch(error){

            console.error(error);

            setError(
                "Cannot connect to server"
            );

        }finally{

            setLoading(false);
        }
    };


    return(

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


                <div
                    className="
                    mt-8
                    space-y-5
                    "
                >

                    {/* GRADUATION NUMBER */}

                    <input
                        type="text"
                        inputMode="numeric"
                        value={graduationNumber}
                        maxLength={4}
                        onChange={(e)=>{

                            const value =
                                e.target.value;

                            if(/^\d*$/.test(value)){

                                setGraduationNumber(value);
                            }
                        }}
                        placeholder="Graduation Number — Example: 0001"
                        className="
                        w-full
                        p-4
                        rounded-xl
                        bg-black/30
                        border
                        border-white/20
                        text-white
                        outline-none
                        focus:border-blue-400/60
                        "
                    />


                    {/* FACULTY */}

                    <div className="relative">

                        <button
                            type="button"
                            disabled={
                                loadingOptions ||
                                faculties.length === 0
                            }
                            onClick={()=>{

                                setFacultyOpen(
                                    !facultyOpen
                                );

                                setStudyOpen(false);
                            }}
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
                            disabled:opacity-50
                            "
                        >

                            <span>

                                {
                                    loadingOptions
                                    ?
                                    "Loading faculties..."
                                    :
                                    faculty ||
                                    "Select Faculty"
                                }

                            </span>

                            <span>▼</span>

                        </button>


                        {
                            facultyOpen &&

                            <div
                                className="
                                absolute
                                z-50
                                mt-2
                                w-full
                                bg-white
                                rounded-xl
                                overflow-hidden
                                shadow-xl
                                max-h-64
                                overflow-y-auto
                                "
                            >

                                {
                                    faculties.map(item=>(

                                        <button
                                            type="button"
                                            key={item}
                                            onClick={()=>
                                                selectFaculty(item)
                                            }
                                            className="
                                            block
                                            w-full
                                            text-left
                                            px-5
                                            py-3
                                            text-black
                                            hover:bg-blue-100
                                            "
                                        >
                                            {item}
                                        </button>

                                    ))
                                }

                            </div>
                        }

                    </div>


                    {/* STUDY PROGRAM */}

                    <div className="relative">

                        <button
                            type="button"
                            disabled={
                                !faculty ||
                                studies.length === 0
                            }
                            onClick={()=>{

                                setStudyOpen(
                                    !studyOpen
                                );

                                setFacultyOpen(false);
                            }}
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
                            disabled:opacity-50
                            "
                        >

                            <span>
                                {
                                    !faculty
                                    ?
                                    "Select Faculty First"
                                    :
                                    study ||
                                    "Select Study Program"
                                }
                            </span>

                            <span>▼</span>

                        </button>


                        {
                            studyOpen &&

                            <div
                                className="
                                absolute
                                z-50
                                mt-2
                                w-full
                                bg-white
                                rounded-xl
                                overflow-hidden
                                shadow-xl
                                max-h-64
                                overflow-y-auto
                                "
                            >

                                {
                                    studies.map(item=>(

                                        <button
                                            type="button"
                                            key={item}
                                            onClick={()=>{

                                                setStudy(item);
                                                setStudyOpen(false);

                                            }}
                                            className="
                                            block
                                            w-full
                                            text-left
                                            px-5
                                            py-3
                                            text-black
                                            hover:bg-blue-100
                                            "
                                        >
                                            {item}
                                        </button>

                                    ))
                                }

                            </div>
                        }

                    </div>


                    {
                        error &&

                        <div
                            className="
                            rounded-xl
                            bg-red-500/20
                            border
                            border-red-400/30
                            px-4
                            py-3
                            text-red-300
                            text-center
                            "
                        >
                            ⚠️ {error}
                        </div>
                    }


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