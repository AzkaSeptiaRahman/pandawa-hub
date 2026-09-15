"use client";

import { useEffect, useRef, useState } from "react";

type EventItem = {
    id: number;
    name: string;
};

type Graduate = {
    id: number;
    event_id: number;
    nim: string;
    graduation_number: string;
    name: string;
    faculty: string;
    study_program: string;
};

type ImportFailed = {
    row?: {
        nim?: string;
        graduation_number?: string;
        name?: string;
        faculty?: string;
        study_program?: string;
    };
    reason?: string;
};

export default function GraduatesPage(){

    const [events,setEvents] = useState<EventItem[]>([]);
    const [graduates,setGraduates] = useState<Graduate[]>([]);

    const [eventId,setEventId] = useState("");
    const [file,setFile] = useState<File | null>(null);

    const [message,setMessage] = useState("");
    const [messageType,setMessageType] =
        useState<"success" | "error" | "">("");

    const [loading,setLoading] = useState(false);
    const [loadingGraduates,setLoadingGraduates] = useState(false);

    const [importSuccess,setImportSuccess] =
        useState<number | null>(null);

    const [importFailed,setImportFailed] =
        useState<ImportFailed[]>([]);

    const fileInputRef =
        useRef<HTMLInputElement | null>(null);


    // ==============================
    // LOAD INITIAL DATA
    // ==============================

    useEffect(()=>{

        loadEvents();

    },[]);


    // ==============================
    // EVENT CHANGED
    // ==============================

    useEffect(()=>{

        setFile(null);

        setMessage("");
        setMessageType("");

        setImportSuccess(null);
        setImportFailed([]);

        if(fileInputRef.current){
            fileInputRef.current.value = "";
        }

        if(eventId){

            loadGraduates(eventId);

        }else{

            setGraduates([]);

        }

    },[eventId]);


    // ==============================
    // TOKEN
    // ==============================

    const getToken = ()=>{

        return localStorage.getItem("token");

    };


    // ==============================
    // LOAD EVENTS
    // ==============================

    const loadEvents = async()=>{

        try{

            const token = getToken();

            const res = await fetch(

                `${process.env.NEXT_PUBLIC_API_URL}/api/admin/events/options`,

                {
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                }

            );


            const data = await res.json();


            if(!res.ok){

                setMessage(
                    data.message ||
                    "Failed to load events"
                );

                setMessageType("error");

                return;
            }


            if(Array.isArray(data)){

                setEvents(data);

            }else if(Array.isArray(data.events)){

                setEvents(data.events);

            }else{

                setEvents([]);

            }


        }catch(error){

            console.error(error);

            setMessage(
                "Cannot connect to server"
            );

            setMessageType("error");

        }

    };


    // ==============================
    // LOAD GRADUATES
    // ==============================

    const loadGraduates = async(
        selectedEventId?: string
    )=>{

        const id =
            selectedEventId || eventId;


        if(!id){
            return;
        }


        try{

            setLoadingGraduates(true);

            const token = getToken();


            const res = await fetch(

                `${process.env.NEXT_PUBLIC_API_URL}/api/admin/graduates?eventId=${id}`,

                {
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                }

            );


            const data = await res.json();


            if(!res.ok){

                setGraduates([]);

                setMessage(
                    data.message ||
                    "Failed to load graduates"
                );

                setMessageType("error");

                return;
            }


            setGraduates(
                Array.isArray(data.graduates)
                    ? data.graduates
                    : []
            );


        }catch(error){

            console.error(error);

            setGraduates([]);

            setMessage(
                "Cannot load graduate data"
            );

            setMessageType("error");

        }finally{

            setLoadingGraduates(false);

        }

    };


    // ==============================
    // CHOOSE FILE
    // ==============================

    const chooseFile = ()=>{

        if(!eventId){

            setMessage(
                "Select event first"
            );

            setMessageType("error");

            return;
        }


        fileInputRef.current?.click();

    };


    // ==============================
    // FILE CHANGED
    // ==============================

    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>
    )=>{

        const selectedFile =
            e.target.files?.[0];


        if(!selectedFile){

            setFile(null);

            return;
        }


        const extension =
            selectedFile.name
                .split(".")
                .pop()
                ?.toLowerCase();


        if(
            extension !== "xlsx" &&
            extension !== "xls"
        ){

            setFile(null);

            setMessage(
                "File must be .xlsx or .xls"
            );

            setMessageType("error");

            e.target.value = "";

            return;
        }


        setFile(selectedFile);

        setMessage("");
        setMessageType("");

        setImportSuccess(null);
        setImportFailed([]);

    };


    // ==============================
    // REMOVE FILE
    // ==============================

    const removeFile = ()=>{

        setFile(null);

        if(fileInputRef.current){

            fileInputRef.current.value = "";

        }

    };


    // ==============================
    // IMPORT EXCEL
    // ==============================

    const importExcel = async()=>{

        setMessage("");
        setMessageType("");

        setImportSuccess(null);
        setImportFailed([]);


        if(!eventId){

            setMessage(
                "Select event first"
            );

            setMessageType("error");

            return;
        }


        if(!file){

            setMessage(
                "Choose Excel file first"
            );

            setMessageType("error");

            return;
        }


        try{

            setLoading(true);


            const form =
                new FormData();


            form.append(
                "event_id",
                eventId
            );


            form.append(
                "file",
                file
            );


            const token =
                getToken();


            const res = await fetch(

                `${process.env.NEXT_PUBLIC_API_URL}/api/admin/graduates/import`,

                {
                    method:"POST",

                    headers:{
                        Authorization:`Bearer ${token}`
                    },

                    body:form
                }

            );


            const data =
                await res.json();


            if(!res.ok){

                setMessage(
                    data.message ||
                    "Import failed"
                );

                setMessageType("error");

                return;
            }


            const successCount =
                typeof data.success === "number"
                    ? data.success
                    : 0;


            const failedRows =
                Array.isArray(data.failed)
                    ? data.failed
                    : [];


            setImportSuccess(
                successCount
            );


            setImportFailed(
                failedRows
            );


            setMessage(
                `Import completed: ${successCount} success, ${failedRows.length} failed`
            );


            setMessageType(
                failedRows.length > 0
                    ? "error"
                    : "success"
            );


            removeFile();


            await loadGraduates(
                eventId
            );


        }catch(error){

            console.error(error);

            setMessage(
                "Cannot connect to server"
            );

            setMessageType("error");

        }finally{

            setLoading(false);

        }

    };


    // ==============================
    // SELECTED EVENT
    // ==============================

    const selectedEvent =
        events.find(
            item =>
                String(item.id) ===
                String(eventId)
        );


    // ==============================
    // RENDER
    // ==============================

    return(

        <div className="space-y-8">


            {/* HEADER */}

            <div>

                <h1 className="text-4xl font-bold">
                    Graduates Management
                </h1>

                <p className="mt-2 text-slate-400">
                    Import and manage graduate data for each event.
                </p>

            </div>


            {/* IMPORT PANEL */}

            <div className="glass rounded-3xl p-8 space-y-6">


                {/* EVENT */}

                <div>

                    <label className="block mb-2 text-sm text-slate-400">
                        Event
                    </label>


                    <select

                        value={eventId}

                        onChange={(e)=>
                            setEventId(
                                e.target.value
                            )
                        }

                        className="
                            w-full
                            rounded-xl
                            border
                            border-white/10
                            bg-black/30
                            p-4
                            text-white
                            outline-none
                            focus:border-blue-400/50
                        "

                    >

                        <option value="">
                            Select Event
                        </option>


                        {events.map((item)=>(

                            <option
                                key={item.id}
                                value={item.id}
                            >
                                {item.name}
                            </option>

                        ))}

                    </select>

                </div>


                {/* FORMAT */}

                <div
                    className="
                        rounded-2xl
                        border
                        border-white/10
                        bg-white/5
                        p-5
                    "
                >

                    <p className="font-semibold">
                        Excel Format
                    </p>


                    <p className="mt-2 text-sm text-slate-400">
                        Gunakan header berikut:
                    </p>


                    <div
                        className="
                            mt-4
                            overflow-x-auto
                            rounded-xl
                            bg-black/20
                            p-4
                        "
                    >

                        <code className="whitespace-nowrap text-sm text-blue-300">
                            nim | graduation_number | name | faculty | study_program
                        </code>

                    </div>


                    <p className="mt-3 text-xs text-slate-500">
                        event_id tidak perlu ada di Excel.
                        Event mengikuti pilihan di atas.
                    </p>

                </div>


                {/* FILE UPLOAD */}

                <div>

                    <label className="block mb-2 text-sm text-slate-400">
                        Excel File
                    </label>


                    {/* REAL INPUT - HIDDEN */}

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={handleFileChange}
                        className="hidden"
                    />


                    {/* CUSTOM FILE BOX */}

                    <div
                        className="
                            flex
                            flex-col
                            gap-4
                            rounded-2xl
                            border
                            border-dashed
                            border-white/20
                            bg-black/20
                            p-6
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                        "
                    >

                        <div>

                            {file ? (

                                <>
                                    <p className="font-semibold text-white">
                                        {file.name}
                                    </p>

                                    <p className="mt-1 text-sm text-slate-400">
                                        {(file.size / 1024).toFixed(1)} KB
                                    </p>
                                </>

                            ) : (

                                <>
                                    <p className="font-semibold text-white">
                                        No Excel file selected
                                    </p>

                                    <p className="mt-1 text-sm text-slate-400">
                                        .xlsx or .xls
                                    </p>
                                </>

                            )}

                        </div>


                        <div className="flex gap-3">


                            <button

                                type="button"

                                onClick={chooseFile}

                                disabled={!eventId || loading}

                                className="
                                    rounded-xl
                                    border
                                    border-blue-400/30
                                    bg-blue-500/20
                                    px-6
                                    py-3
                                    font-medium
                                    text-blue-300
                                    transition
                                    hover:bg-blue-500/30
                                    disabled:cursor-not-allowed
                                    disabled:opacity-40
                                "

                            >

                                {file
                                    ? "CHANGE FILE"
                                    : "CHOOSE FILE"
                                }

                            </button>


                            {file && (

                                <button

                                    type="button"

                                    onClick={removeFile}

                                    disabled={loading}

                                    className="
                                        rounded-xl
                                        border
                                        border-red-400/30
                                        bg-red-500/10
                                        px-5
                                        py-3
                                        text-red-300
                                        transition
                                        hover:bg-red-500/20
                                    "

                                >
                                    REMOVE
                                </button>

                            )}

                        </div>

                    </div>


                    {!eventId && (

                        <p className="mt-3 text-sm text-yellow-300">
                            Select event first to choose Excel file.
                        </p>

                    )}

                </div>


                {/* IMPORT */}

                <button

                    type="button"

                    onClick={importExcel}

                    disabled={
                        loading ||
                        !eventId ||
                        !file
                    }

                    className="
                        rounded-full
                        border
                        border-blue-400/30
                        bg-blue-500/20
                        px-8
                        py-4
                        font-semibold
                        text-blue-300
                        transition
                        hover:bg-blue-500/30
                        disabled:cursor-not-allowed
                        disabled:opacity-40
                    "

                >

                    {
                        loading
                            ? "IMPORTING..."
                            : "IMPORT EXCEL"
                    }

                </button>


                {/* MESSAGE */}

                {message && (

                    <div
                        className={`
                            rounded-xl
                            border
                            p-4
                            ${
                                messageType === "success"
                                    ? "border-green-400/20 bg-green-500/10 text-green-300"
                                    : "border-red-400/20 bg-red-500/10 text-red-300"
                            }
                        `}
                    >
                        {message}
                    </div>

                )}


                {/* RESULT */}

                {importSuccess !== null && (

                    <div className="grid gap-4 sm:grid-cols-2">


                        <div
                            className="
                                rounded-2xl
                                border
                                border-green-400/20
                                bg-green-500/10
                                p-5
                            "
                        >

                            <p className="text-sm text-slate-400">
                                Success
                            </p>

                            <p className="mt-1 text-3xl font-bold text-green-300">
                                {importSuccess}
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

                            <p className="text-sm text-slate-400">
                                Failed
                            </p>

                            <p className="mt-1 text-3xl font-bold text-red-300">
                                {importFailed.length}
                            </p>

                        </div>


                    </div>

                )}


                {/* FAILED ROWS */}

                {importFailed.length > 0 && (

                    <div
                        className="
                            rounded-2xl
                            border
                            border-red-400/20
                            bg-red-500/5
                            p-5
                        "
                    >

                        <h3 className="font-semibold text-red-300">
                            Failed Rows
                        </h3>


                        <div className="mt-4 max-h-60 space-y-2 overflow-y-auto">

                            {importFailed.map((item,index)=>(

                                <div
                                    key={index}
                                    className="
                                        rounded-xl
                                        bg-black/20
                                        px-4
                                        py-3
                                        text-sm
                                    "
                                >

                                    <span className="text-slate-300">

                                        {item.row?.nim || "-"}

                                        {item.row?.name
                                            ? ` - ${item.row.name}`
                                            : ""
                                        }

                                    </span>


                                    <span className="ml-2 text-red-300">

                                        (
                                            {item.reason || "Import failed"}
                                        )

                                    </span>

                                </div>

                            ))}

                        </div>

                    </div>

                )}

            </div>


            {/* GRADUATE LIST */}

            <div className="glass rounded-3xl p-8">


                <div
                    className="
                        mb-6
                        flex
                        flex-wrap
                        items-center
                        justify-between
                        gap-4
                    "
                >

                    <div>

                        <h2 className="text-2xl font-bold">
                            Graduate List
                        </h2>


                        {selectedEvent && (

                            <p className="mt-1 text-sm text-slate-400">
                                Event: {selectedEvent.name}
                            </p>

                        )}

                    </div>


                    {eventId && (

                        <div
                            className="
                                rounded-full
                                border
                                border-white/10
                                bg-white/10
                                px-5
                                py-2
                                text-sm
                            "
                        >
                            {graduates.length} Graduates
                        </div>

                    )}

                </div>


                {!eventId ? (

                    <div
                        className="
                            rounded-2xl
                            bg-black/20
                            p-10
                            text-center
                            text-slate-400
                        "
                    >
                        Select an event to view graduate data.
                    </div>

                ) : loadingGraduates ? (

                    <div
                        className="
                            rounded-2xl
                            bg-black/20
                            p-10
                            text-center
                            text-slate-400
                        "
                    >
                        Loading graduates...
                    </div>

                ) : graduates.length === 0 ? (

                    <div
                        className="
                            rounded-2xl
                            bg-black/20
                            p-10
                            text-center
                            text-slate-400
                        "
                    >
                        No graduate data for this event.
                    </div>

                ) : (

                    <div className="overflow-x-auto">

                        <table className="w-full min-w-[900px]">


                            <thead>

                                <tr
                                    className="
                                        border-b
                                        border-white/10
                                        text-sm
                                        text-slate-400
                                    "
                                >

                                    <th className="p-3 text-left">
                                        No
                                    </th>

                                    <th className="p-3 text-left">
                                        NIM
                                    </th>

                                    <th className="p-3 text-left">
                                        Graduation Number
                                    </th>

                                    <th className="p-3 text-left">
                                        Name
                                    </th>

                                    <th className="p-3 text-left">
                                        Faculty
                                    </th>

                                    <th className="p-3 text-left">
                                        Study Program
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {graduates.map((item,index)=>(

                                    <tr
                                        key={item.id}
                                        className="
                                            border-b
                                            border-white/10
                                            transition
                                            hover:bg-white/5
                                        "
                                    >

                                        <td className="p-3 text-slate-400">
                                            {index + 1}
                                        </td>

                                        <td className="p-3 font-medium">
                                            {item.nim}
                                        </td>

                                        <td className="p-3">
                                            {item.graduation_number}
                                        </td>

                                        <td className="p-3">
                                            {item.name}
                                        </td>

                                        <td className="p-3">
                                            {item.faculty}
                                        </td>

                                        <td className="p-3">
                                            {item.study_program}
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>

    );

}