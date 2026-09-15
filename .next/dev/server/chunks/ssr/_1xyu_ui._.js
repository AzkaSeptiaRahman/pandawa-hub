module.exports = [
"[project]/app/admin/photos/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AdminPhotoUpload
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
function AdminPhotoUpload() {
    const [graduates, setGraduates] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [graduateId, setGraduateId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [type, setType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("BEBAS");
    const [file, setFile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [preview, setPreview] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        loadGraduates();
    }, []);
    const loadGraduates = async ()=>{
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${("TURBOPACK compile-time value", "http://localhost:5000")}/api/admin/graduates/options`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (!response.ok) {
                setMessage(data.message || "Failed load graduates");
                return;
            }
            setGraduates(data);
        } catch (error) {
            console.error(error);
            setMessage("Cannot load graduates");
        }
    };
    const handleFile = (e)=>{
        const selected = e.target.files?.[0];
        console.log("FILE SELECTED", selected);
        if (!selected) {
            return;
        }
        setFile(selected);
        setPreview(URL.createObjectURL(selected));
        setMessage(selected.name);
    };
    const uploadPhoto = async ()=>{
        setMessage("");
        if (!graduateId) {
            setMessage("Select graduate first");
            return;
        }
        if (!file) {
            setMessage("Please select photo");
            return;
        }
        try {
            setLoading(true);
            const form = new FormData();
            form.append("graduate_id", graduateId);
            form.append("type", type);
            form.append("file", file);
            const token = localStorage.getItem("token");
            const response = await fetch(`${("TURBOPACK compile-time value", "http://localhost:5000")}/api/admin/photos/upload`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: form
            });
            const data = await response.json();
            console.log("UPLOAD RESPONSE", data);
            if (!response.ok) {
                setMessage(data.message || "Upload failed");
                return;
            }
            setMessage("Upload success");
            setFile(null);
            setPreview("");
            const input = document.getElementById("photo");
            if (input) {
                input.value = "";
            }
        } catch (error) {
            console.error(error);
            setMessage("Server error");
        } finally{
            setLoading(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "\r\n\n        min-h-screen\r\n\n        p-8\r\n\n        flex\r\n\n        justify-center\r\n\n        ",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "\r\n\n            glass\r\n\n            rounded-3xl\r\n\n            p-10\r\n\n            w-full\r\n\n            max-w-xl\r\n\n            ",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    className: "\r\n\n                text-3xl\r\n\n                font-bold\r\n\n                text-center\r\n\n                ",
                    children: "Upload Graduate Photo"
                }, void 0, false, {
                    fileName: "[project]/app/admin/photos/page.tsx",
                    lineNumber: 450,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "\r\n\n                mt-8\r\n\n                space-y-5\r\n\n                ",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                            value: graduateId,
                            onChange: (e)=>setGraduateId(e.target.value),
                            className: "\r\n\n                    w-full\r\n\n                    p-4\r\n\n                    rounded-xl\r\n\n                    bg-black/30\r\n\n                    border\r\n\n                    border-white/20\r\n\n                    ",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: "",
                                    children: "Select Graduate"
                                }, void 0, false, {
                                    fileName: "[project]/app/admin/photos/page.tsx",
                                    lineNumber: 500,
                                    columnNumber: 25
                                }, this),
                                graduates.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: item.id,
                                        children: [
                                            item.graduation_number,
                                            " - ",
                                            item.name
                                        ]
                                    }, item.id, true, {
                                        fileName: "[project]/app/admin/photos/page.tsx",
                                        lineNumber: 514,
                                        columnNumber: 29
                                    }, this))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/admin/photos/page.tsx",
                            lineNumber: 478,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                            value: type,
                            onChange: (e)=>setType(e.target.value),
                            className: "\r\n\n                    w-full\r\n\n                    p-4\r\n\n                    rounded-xl\r\n\n                    bg-black/30\r\n\n                    border\r\n\n                    ",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: "BEBAS",
                                    children: "BEBAS"
                                }, void 0, false, {
                                    fileName: "[project]/app/admin/photos/page.tsx",
                                    lineNumber: 567,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: "KUNCIR",
                                    children: "KUNCIR"
                                }, void 0, false, {
                                    fileName: "[project]/app/admin/photos/page.tsx",
                                    lineNumber: 572,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: "IJAZAH",
                                    children: "IJAZAH"
                                }, void 0, false, {
                                    fileName: "[project]/app/admin/photos/page.tsx",
                                    lineNumber: 577,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/admin/photos/page.tsx",
                            lineNumber: 547,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            htmlFor: "photo",
                            className: "\r\n\n                    block\r\n\n                    cursor-pointer\r\n\n                    w-full\r\n\n                    p-4\r\n\n                    rounded-xl\r\n\n                    bg-white/10\r\n\n                    border\r\n\n                    border-white/20\r\n\n                    text-center\r\n\n                    hover:bg-white/20\r\n\n                    ",
                            children: file ? file.name : "Choose Photo"
                        }, void 0, false, {
                            fileName: "[project]/app/admin/photos/page.tsx",
                            lineNumber: 592,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            id: "photo",
                            type: "file",
                            accept: "image/*",
                            onChange: handleFile,
                            className: "\r\n\n                    hidden\r\n\n                    "
                        }, void 0, false, {
                            fileName: "[project]/app/admin/photos/page.tsx",
                            lineNumber: 626,
                            columnNumber: 21
                        }, this),
                        preview && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "\r\n\n                        rounded-xl\r\n\n                        overflow-hidden\r\n\n                        aspect-square\r\n\n                        border\r\n\n                        border-white/20\r\n\n                        ",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: preview,
                                alt: "preview",
                                className: "\r\n\n                            w-full\r\n\n                            h-full\r\n\n                            object-cover\r\n\n                            "
                            }, void 0, false, {
                                fileName: "[project]/app/admin/photos/page.tsx",
                                lineNumber: 663,
                                columnNumber: 29
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/admin/photos/page.tsx",
                            lineNumber: 654,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: uploadPhoto,
                            disabled: loading,
                            className: "\r\n\n                    w-full\r\n\n                    py-4\r\n\n                    rounded-full\r\n\n                    bg-blue-500/20\r\n\n                    border\r\n\n                    ",
                            children: loading ? "UPLOADING..." : "UPLOAD PHOTO"
                        }, void 0, false, {
                            fileName: "[project]/app/admin/photos/page.tsx",
                            lineNumber: 690,
                            columnNumber: 21
                        }, this),
                        message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "\r\n\n                    text-center\r\n\n                    text-sm\r\n\n                    ",
                            children: message
                        }, void 0, false, {
                            fileName: "[project]/app/admin/photos/page.tsx",
                            lineNumber: 734,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/admin/photos/page.tsx",
                    lineNumber: 468,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/admin/photos/page.tsx",
            lineNumber: 440,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/admin/photos/page.tsx",
        lineNumber: 432,
        columnNumber: 9
    }, this);
}
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].ReactJsxDevRuntime;
}),
];

//# sourceMappingURL=_1xyu_ui._.js.map