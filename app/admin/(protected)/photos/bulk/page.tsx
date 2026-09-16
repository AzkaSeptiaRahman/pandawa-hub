"use client";

import {
    useEffect,
    useState
} from "react";


type Event = {
    id: number;
    name: string;
    type: string;
};


type GraduateOption = {
    id?: number;
    graduation_number?: string;
    name?: string;
    faculty: string;
    study_program?: string;
};


type FailedFile = {
    file: string;
    reason: string;
};


type SuccessFile = {
    file: string;
    graduate_id?: number;
    graduate?: string;
    graduation_number?: string;
    faculty?: string;
    type?: string;
};


export default function BulkUpload(){

    const [events,setEvents] =
        useState<Event[]>([]);

    const [graduates,setGraduates] =
        useState<GraduateOption[]>([]);

    const [eventId,setEventId] =
        useState("");

    const [faculty,setFaculty] =
        useState("");

    const [file,setFile] =
        useState<File | null>(null);

    const [message,setMessage] =
        useState("");

    const [loading,setLoading] =
        useState(false);

    const [loadingFaculty,setLoadingFaculty] =
        useState(false);

    const [failedFiles,setFailedFiles] =
        useState<FailedFile[]>([]);

    const [successFiles,setSuccessFiles] =
        useState<SuccessFile[]>([]);

    const [hasResult,setHasResult] =
        useState(false);

    const [copied,setCopied] =
        useState(false);


    // =====================================================
    // LOAD EVENTS
    // =====================================================

    useEffect(()=>{

        loadEvents();

    },[]);


    const loadEvents = async()=>{

        try{

            const token =
                localStorage.getItem("token");


            const response =
                await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/admin/events/options`,
                    {
                        headers:{
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );


            const data =
                await response.json();


            if(!response.ok){

                setMessage(
                    data.message ||
                    "Failed load events"
                );

                return;
            }


            const eventData =
                Array.isArray(data)
                    ? data
                    : data.events || [];


            // BULK hanya PERSONAL
            setEvents(
                eventData.filter(
                    (item:Event)=>
                        item.type === "PERSONAL"
                )
            );


        }catch(error){

            console.error(
                "LOAD EVENTS ERROR:",
                error
            );

            setMessage(
                "Failed load events"
            );

        }

    };


    // =====================================================
    // LOAD GRADUATES BY EVENT
    // =====================================================

    const loadGraduates = async(
        selectedEventId:string
    )=>{

        if(!selectedEventId){

            setGraduates([]);
            setFaculty("");

            return;
        }


        try{

            setLoadingFaculty(true);
            setMessage("");


            const token =
                localStorage.getItem("token");


            const response =
                await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/admin/graduates/options?eventId=${selectedEventId}`,
                    {
                        headers:{
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );


            const contentType =
                response.headers.get(
                    "content-type"
                );


            if(
                !contentType ||
                !contentType.includes(
                    "application/json"
                )
            ){

                const text =
                    await response.text();


                console.error(
                    "INVALID GRADUATE RESPONSE:",
                    text
                );


                setGraduates([]);

                setMessage(
                    "Invalid response when loading faculty"
                );

                return;
            }


            const data =
                await response.json();


            if(!response.ok){

                setGraduates([]);

                setMessage(
                    data.message ||
                    "Failed load faculty"
                );

                return;
            }


            const graduateData =
                Array.isArray(data)
                    ? data
                    : data.graduates ||
                      data.options ||
                      [];


            setGraduates(
                graduateData
            );


            if(
                graduateData.length === 0
            ){

                setMessage(
                    "No graduate data found for this event"
                );

            }


        }catch(error){

            console.error(
                "LOAD GRADUATES ERROR:",
                error
            );


            setGraduates([]);


            setMessage(
                "Failed load faculty"
            );


        }finally{

            setLoadingFaculty(false);

        }

    };


    // =====================================================
    // UNIQUE FACULTIES
    // =====================================================

    const faculties =
        Array.from(
            new Set(
                graduates
                    .map(
                        item=>
                            item.faculty?.trim()
                    )
                    .filter(
                        (item):item is string =>
                            Boolean(item)
                    )
            )
        ).sort();


    // =====================================================
    // RESET FILE INPUT
    // =====================================================

    const resetFileInput = ()=>{

        setFile(null);


        const input =
            document.getElementById(
                "zip"
            ) as HTMLInputElement | null;


        if(input){

            input.value="";

        }

    };


    // =====================================================
    // EVENT CHANGE
    // =====================================================

    const handleEventChange = (
        e:React.ChangeEvent<HTMLSelectElement>
    )=>{

        const selectedId =
            e.target.value;


        setEventId(
            selectedId
        );


        setFaculty("");

        setGraduates([]);

        resetFileInput();

        setMessage("");

        setFailedFiles([]);

        setSuccessFiles([]);

        setHasResult(false);

        setCopied(false);


        if(selectedId){

            loadGraduates(
                selectedId
            );

        }

    };


    // =====================================================
    // FACULTY CHANGE
    // =====================================================

    const handleFacultyChange = (
        e:React.ChangeEvent<HTMLSelectElement>
    )=>{

        setFaculty(
            e.target.value
        );


        resetFileInput();

        setMessage("");

        setFailedFiles([]);

        setSuccessFiles([]);

        setHasResult(false);

        setCopied(false);

    };


    // =====================================================
    // ZIP CHANGE
    // =====================================================

    const handleZipChange = (
        e:React.ChangeEvent<HTMLInputElement>
    )=>{

        const selected =
            e.target.files?.[0];


        if(!selected){

            return;

        }


        if(
            !selected.name
                .toLowerCase()
                .endsWith(".zip")
        ){

            setFile(null);

            setMessage(
                "Only ZIP file allowed"
            );

            e.target.value="";

            return;

        }


        setFile(
            selected
        );


        setMessage(
            `Selected: ${selected.name}`
        );

    };


    // =====================================================
    // COPY FAILED FILENAMES
    // =====================================================

    const copyFailedFilenames = async()=>{

        if(
            failedFiles.length === 0
        ){

            return;

        }


        const filenames =
            failedFiles
                .map(
                    item=>item.file
                )
                .join("\n");


        try{

            await navigator.clipboard.writeText(
                filenames
            );


            setCopied(true);


            setTimeout(()=>{

                setCopied(false);

            },2000);


        }catch(error){

            console.error(
                "COPY ERROR:",
                error
            );


            setMessage(
                "Failed to copy filenames"
            );

        }

    };


    // =====================================================
    // CLEAR RESULT
    // =====================================================

    const clearResult = ()=>{

        setFailedFiles([]);

        setSuccessFiles([]);

        setHasResult(false);

        setCopied(false);

        setMessage("");

    };


    // =====================================================
    // UPLOAD
    // =====================================================

    const upload = async()=>{

        setMessage("");

        setCopied(false);


        if(!eventId){

            setMessage(
                "Please select event first"
            );

            return;

        }


        if(!faculty){

            setMessage(
                "Please select faculty first"
            );

            return;

        }


        if(!file){

            setMessage(
                "Please choose ZIP file"
            );

            return;

        }


        try{

            setLoading(true);

            setHasResult(false);

            setFailedFiles([]);

            setSuccessFiles([]);


            const form =
                new FormData();


            form.append(
                "event_id",
                eventId
            );


            form.append(
                "faculty",
                faculty
            );


            form.append(
                "file",
                file
            );


            const token =
                localStorage.getItem(
                    "token"
                );


            const response =
                await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/admin/photos/bulk-upload`,
                    {
                        method:"POST",

                        headers:{
                            Authorization:
                                `Bearer ${token}`
                        },

                        body:form
                    }
                );


            const contentType =
                response.headers.get(
                    "content-type"
                );


            if(
                !contentType ||
                !contentType.includes(
                    "application/json"
                )
            ){

                const text =
                    await response.text();


                console.error(
                    "NON JSON RESPONSE:",
                    text
                );


                setMessage(
                    `Server returned invalid response (${response.status})`
                );


                return;

            }


            const data =
                await response.json();


            console.log(
                "BULK RESULT:",
                data
            );


            if(!response.ok){

                setMessage(
                    data.message ||
                    "Upload failed"
                );

                return;

            }


            const success =
                Array.isArray(data.success)
                    ? data.success
                    : [];


            const failed =
                Array.isArray(data.failed)
                    ? data.failed
                    : [];


            setSuccessFiles(
                success
            );


            setFailedFiles(
                failed
            );


            setHasResult(true);


            if(
                failed.length === 0
            ){

                setMessage(
                    `Upload completed successfully. ${success.length} file(s) uploaded.`
                );

            }else{

                setMessage(
                    `Upload completed with ${failed.length} failed file(s).`
                );

            }


            // file input dikosongkan
            // hasil success/failed TETAP tampil
            resetFileInput();


        }catch(error){

            console.error(
                "BULK UPLOAD ERROR:",
                error
            );


            setMessage(
                "Cannot connect to server"
            );


        }finally{

            setLoading(false);

        }

    };


    const zipEnabled =
        Boolean(
            eventId &&
            faculty &&
            !loadingFaculty
        );


    return(

        <main
            className="
            min-h-screen
            p-8
            flex
            justify-center
            "
        >

            <div
                className="
                w-full
                max-w-3xl
                space-y-6
                "
            >

                {/* UPLOAD FORM */}

                <div
                    className="
                    glass
                    rounded-3xl
                    p-10
                    "
                >

                    <h1
                        className="
                        text-3xl
                        font-bold
                        "
                    >
                        Bulk Photo Upload
                    </h1>


                    <p
                        className="
                        text-slate-400
                        mt-2
                        "
                    >
                        Upload personal graduation photos by event and faculty.
                    </p>


                    <div
                        className="
                        mt-8
                        space-y-5
                        "
                    >

                        {/* EVENT */}

                        <div>

                            <label
                                className="
                                block
                                text-sm
                                text-slate-400
                                mb-2
                                "
                            >
                                Personal Event
                            </label>


                            <select
                                value={eventId}
                                onChange={
                                    handleEventChange
                                }
                                className="
                                w-full
                                p-4
                                rounded-xl
                                bg-black/30
                                border
                                border-white/20
                                "
                            >

                                <option value="">
                                    Select Event
                                </option>


                                {
                                    events.map(
                                        (item)=>(

                                            <option
                                                key={item.id}
                                                value={item.id}
                                            >
                                                {item.name}
                                            </option>

                                        )
                                    )
                                }

                            </select>

                        </div>


                        {/* FACULTY */}

                        <div>

                            <label
                                className="
                                block
                                text-sm
                                text-slate-400
                                mb-2
                                "
                            >
                                Faculty
                            </label>


                            <select
                                value={faculty}
                                onChange={
                                    handleFacultyChange
                                }
                                disabled={
                                    !eventId ||
                                    loadingFaculty
                                }
                                className="
                                w-full
                                p-4
                                rounded-xl
                                bg-black/30
                                border
                                border-white/20
                                disabled:opacity-50
                                disabled:cursor-not-allowed
                                "
                            >

                                <option value="">

                                    {
                                        !eventId

                                        ?

                                        "Select Event First"

                                        :

                                        loadingFaculty

                                        ?

                                        "Loading Faculty..."

                                        :

                                        faculties.length === 0

                                        ?

                                        "No Faculty Found"

                                        :

                                        "Select Faculty"
                                    }

                                </option>


                                {
                                    faculties.map(
                                        (item)=>(

                                            <option
                                                key={item}
                                                value={item}
                                            >
                                                {item}
                                            </option>

                                        )
                                    )
                                }

                            </select>


                            {
                                eventId &&
                                !loadingFaculty &&
                                faculties.length > 0 &&

                                <p
                                    className="
                                    text-xs
                                    text-slate-500
                                    mt-2
                                    "
                                >
                                    Faculty loaded from graduate data.
                                </p>
                            }

                        </div>


                        {/* ZIP SELECTOR */}

                        <label
                            htmlFor={
                                zipEnabled
                                    ? "zip"
                                    : undefined
                            }
                            onClick={(e)=>{

                                if(!zipEnabled){

                                    e.preventDefault();


                                    setMessage(
                                        "Select event and faculty first"
                                    );

                                }

                            }}
                            className={`
                            block
                            text-center
                            rounded-xl
                            border
                            border-white/20
                            p-4
                            transition

                            ${
                                zipEnabled

                                ?

                                "cursor-pointer bg-white/10 hover:bg-white/20"

                                :

                                "cursor-not-allowed opacity-50 bg-gray-500/20"
                            }
                            `}
                        >

                            {
                                file

                                ?

                                file.name

                                :

                                zipEnabled

                                ?

                                "Choose ZIP File"

                                :

                                "Select Event & Faculty First"
                            }

                        </label>


                        <input
                            id="zip"
                            type="file"
                            accept=".zip,application/zip"
                            disabled={!zipEnabled}
                            className="hidden"
                            onChange={
                                handleZipChange
                            }
                        />


                        {/* FORMAT */}

                        <div
                            className="
                            rounded-xl
                            bg-white/5
                            border
                            border-white/10
                            p-4
                            "
                        >

                            <p
                                className="
                                text-sm
                                text-slate-400
                                "
                            >
                                ZIP filename format
                            </p>


                            <div
                                className="
                                mt-3
                                grid
                                sm:grid-cols-3
                                gap-2
                                text-sm
                                "
                            >

                                <div
                                    className="
                                    bg-black/20
                                    rounded-lg
                                    p-3
                                    "
                                >
                                    BEBAS_0001.jpg
                                </div>

                                <div
                                    className="
                                    bg-black/20
                                    rounded-lg
                                    p-3
                                    "
                                >
                                    KUNCIR_0001.jpg
                                </div>

                                <div
                                    className="
                                    bg-black/20
                                    rounded-lg
                                    p-3
                                    "
                                >
                                    IJAZAH_0001.jpg
                                </div>

                            </div>

                        </div>


                        {/* UPLOAD BUTTON */}

                        <button
                            onClick={upload}
                            disabled={
                                loading ||
                                !eventId ||
                                !faculty ||
                                !file
                            }
                            className={`
                            w-full
                            py-4
                            rounded-full
                            border
                            border-white/20
                            transition
                            font-medium

                            ${
                                loading ||
                                !eventId ||
                                !faculty ||
                                !file

                                ?

                                "opacity-50 cursor-not-allowed"

                                :

                                "bg-blue-500/20 hover:bg-blue-500/30"
                            }
                            `}
                        >

                            {
                                loading
                                    ? "UPLOADING..."
                                    : "UPLOAD ZIP"
                            }

                        </button>


                        {
                            message &&

                            <div
                                className="
                                rounded-xl
                                bg-white/5
                                border
                                border-white/10
                                p-4
                                text-center
                                text-sm
                                "
                            >
                                {message}
                            </div>
                        }

                    </div>

                </div>


                {/* RESULT */}

                {
                    hasResult &&

                    <div
                        className="
                        glass
                        rounded-3xl
                        p-8
                        "
                    >

                        <div
                            className="
                            flex
                            items-center
                            justify-between
                            gap-4
                            flex-wrap
                            "
                        >

                            <div>

                                <h2
                                    className="
                                    text-2xl
                                    font-bold
                                    "
                                >
                                    Upload Result
                                </h2>

                                <p
                                    className="
                                    text-slate-400
                                    text-sm
                                    mt-1
                                    "
                                >
                                    Review the result before preparing the next ZIP.
                                </p>

                            </div>


                            <button
                                onClick={
                                    clearResult
                                }
                                className="
                                px-4
                                py-2
                                rounded-full
                                bg-white/10
                                border
                                border-white/20
                                text-sm
                                hover:bg-white/20
                                transition
                                "
                            >
                                Clear Result
                            </button>

                        </div>


                        {/* SUMMARY */}

                        <div
                            className="
                            grid
                            grid-cols-2
                            gap-4
                            mt-6
                            "
                        >

                            <div
                                className="
                                rounded-2xl
                                border
                                border-green-400/20
                                bg-green-500/10
                                p-5
                                "
                            >

                                <p
                                    className="
                                    text-sm
                                    text-green-300
                                    "
                                >
                                    SUCCESS
                                </p>

                                <p
                                    className="
                                    text-3xl
                                    font-bold
                                    mt-1
                                    text-green-300
                                    "
                                >
                                    {successFiles.length}
                                </p>

                            </div>


                            <div
                                className="
                                rounded-2xl
                                border
                                border-red-400/20
                                bg-red-500/10
                                p-5
                                "
                            >

                                <p
                                    className="
                                    text-sm
                                    text-red-300
                                    "
                                >
                                    FAILED
                                </p>

                                <p
                                    className="
                                    text-3xl
                                    font-bold
                                    mt-1
                                    text-red-300
                                    "
                                >
                                    {failedFiles.length}
                                </p>

                            </div>

                        </div>


                        {/* FAILED FILES */}

                        {
                            failedFiles.length > 0 &&

                            <div
                                className="
                                mt-8
                                "
                            >

                                <div
                                    className="
                                    flex
                                    items-center
                                    justify-between
                                    gap-4
                                    flex-wrap
                                    "
                                >

                                    <div>

                                        <h3
                                            className="
                                            text-xl
                                            font-bold
                                            text-red-300
                                            "
                                        >
                                            Failed Files
                                        </h3>

                                        <p
                                            className="
                                            text-sm
                                            text-slate-400
                                            mt-1
                                            "
                                        >
                                            Fix these files and include only them in the next ZIP.
                                        </p>

                                    </div>


                                    <button
                                        onClick={
                                            copyFailedFilenames
                                        }
                                        className="
                                        px-5
                                        py-2
                                        rounded-full
                                        bg-red-500/10
                                        border
                                        border-red-400/20
                                        text-red-300
                                        text-sm
                                        hover:bg-red-500/20
                                        transition
                                        "
                                    >

                                        {
                                            copied
                                                ? "✓ COPIED"
                                                : "COPY FAILED FILENAMES"
                                        }

                                    </button>

                                </div>


                                <div
                                    className="
                                    mt-4
                                    space-y-3
                                    max-h-[500px]
                                    overflow-y-auto
                                    pr-1
                                    "
                                >

                                    {
                                        failedFiles.map(
                                            (item,index)=>(

                                                <div
                                                    key={
                                                        `${item.file}-${index}`
                                                    }
                                                    className="
                                                    rounded-xl
                                                    bg-red-500/5
                                                    border
                                                    border-red-400/20
                                                    p-4
                                                    "
                                                >

                                                    <div
                                                        className="
                                                        flex
                                                        gap-3
                                                        "
                                                    >

                                                        <div
                                                            className="
                                                            flex
                                                            items-center
                                                            justify-center
                                                            w-7
                                                            h-7
                                                            shrink-0
                                                            rounded-full
                                                            bg-red-500/20
                                                            text-red-300
                                                            text-xs
                                                            "
                                                        >
                                                            {index + 1}
                                                        </div>


                                                        <div
                                                            className="
                                                            min-w-0
                                                            "
                                                        >

                                                            <p
                                                                className="
                                                                font-medium
                                                                text-white
                                                                break-all
                                                                "
                                                            >
                                                                {item.file}
                                                            </p>

                                                            <p
                                                                className="
                                                                text-sm
                                                                text-red-300
                                                                mt-1
                                                                "
                                                            >
                                                                {item.reason}
                                                            </p>

                                                        </div>

                                                    </div>

                                                </div>

                                            )
                                        )
                                    }

                                </div>

                            </div>
                        }


                        {/* ALL SUCCESS */}

                        {
                            failedFiles.length === 0 &&
                            successFiles.length > 0 &&

                            <div
                                className="
                                mt-8
                                rounded-2xl
                                bg-green-500/10
                                border
                                border-green-400/20
                                p-6
                                text-center
                                "
                            >

                                <div
                                    className="
                                    text-3xl
                                    "
                                >
                                    ✓
                                </div>

                                <h3
                                    className="
                                    text-xl
                                    font-bold
                                    text-green-300
                                    mt-2
                                    "
                                >
                                    All Files Uploaded
                                </h3>

                                <p
                                    className="
                                    text-slate-400
                                    text-sm
                                    mt-2
                                    "
                                >
                                    No failed files need to be re-uploaded.
                                </p>

                            </div>
                        }


                        {/* SECOND CHANCE INFO */}

                        {
                            failedFiles.length > 0 &&

                            <div
                                className="
                                mt-6
                                rounded-xl
                                bg-blue-500/10
                                border
                                border-blue-400/20
                                p-5
                                "
                            >

                                <p
                                    className="
                                    font-medium
                                    text-blue-300
                                    "
                                >
                                    Second Chance Upload
                                </p>

                                <p
                                    className="
                                    text-sm
                                    text-slate-300
                                    mt-2
                                    leading-relaxed
                                    "
                                >
                                    Perbaiki file yang gagal, buat ZIP baru yang hanya berisi file tersebut, lalu upload kembali dengan Event dan Faculty yang sama. File yang sudah berhasil tidak perlu dimasukkan lagi.
                                </p>

                            </div>
                        }

                    </div>
                }

            </div>

        </main>

    );

}