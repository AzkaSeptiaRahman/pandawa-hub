module.exports = [
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/app/photo/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {

const { jsxDEV: _jsxDEV } = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
/*#__PURE__*/ _jsxDEV("div", {
    className: "\n    grid\n    md:grid-cols-3\n    gap-6\n    ",
    children: photos.map((photo, index)=>/*#__PURE__*/ _jsxDEV("div", {
            className: "\n            rounded-2xl\n            overflow-hidden\n            bg-black/20\n            border\n            border-white/10\n            aspect-square\n            group\n            ",
            children: /*#__PURE__*/ _jsxDEV("img", {
                src: `${("TURBOPACK compile-time value", "http://localhost:5000")}${photo.url}`,
                alt: "Graduation Photo",
                className: "\n                w-full\n                h-full\n                object-cover\n                group-hover:scale-110\n                transition\n                duration-500\n                "
            }, void 0, false, {
                fileName: "[project]/app/photo/page.tsx",
                lineNumber: 21,
                columnNumber: 13
            }, /*TURBOPACK member replacement*/ __turbopack_context__.e)
        }, index, false, {
            fileName: "[project]/app/photo/page.tsx",
            lineNumber: 9,
            columnNumber: 9
        }, /*TURBOPACK member replacement*/ __turbopack_context__.e))
}, void 0, false, {
    fileName: "[project]/app/photo/page.tsx",
    lineNumber: 1,
    columnNumber: 1
}, /*TURBOPACK member replacement*/ __turbopack_context__.e);
{}/*#__PURE__*/ _jsxDEV("div", {
    className: "mt-6 flex justify-center",
    children: /*#__PURE__*/ _jsxDEV("label", {
        className: "\n        cursor-pointer\n        rounded-full\n        bg-white/10\n        border\n        border-white/20\n        px-6\n        py-3\n        text-white\n        hover:bg-white/20\n        transition\n        ",
        children: [
            "Choose File",
            /*#__PURE__*/ _jsxDEV("input", {
                type: "file",
                accept: "image/*",
                className: "hidden",
                multiple: true
            }, void 0, false, {
                fileName: "[project]/app/photo/page.tsx",
                lineNumber: 55,
                columnNumber: 9
            }, /*TURBOPACK member replacement*/ __turbopack_context__.e)
        ]
    }, void 0, true, {
        fileName: "[project]/app/photo/page.tsx",
        lineNumber: 39,
        columnNumber: 5
    }, /*TURBOPACK member replacement*/ __turbopack_context__.e)
}, void 0, false, {
    fileName: "[project]/app/photo/page.tsx",
    lineNumber: 38,
    columnNumber: 1
}, /*TURBOPACK member replacement*/ __turbopack_context__.e);
}),
"[project]/app/photo/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", (function(__turbopack_context__){

__turbopack_context__.n(__turbopack_context__.i("[project]/app/photo/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1t6f8a0._.js.map