module.exports = [
"[project]/app/event/[id]/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>EventDetail
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
"use client";
;
;
const eventData = {
    id: 2,
    name: "UIN Syarif Hidayatullah Jakarta",
    title: "Dies Natalis 2026",
    date: "20 October 2026",
    thumbnail: "/images/diesnatalis.jpg",
    gallery: [
        "/images/event1.jpg",
        "/images/event2.jpg",
        "/images/event3.jpg",
        "/images/event4.jpg",
        "/images/event5.jpg",
        "/images/event6.jpg"
    ],
    highlights: [
        {
            title: "Live Streaming Dies Natalis 2026",
            url: "https://youtube.com/live/example"
        },
        {
            title: "After Movie Dies Natalis 2026",
            url: "https://youtube.com/watch/example"
        }
    ]
};
function EventDetail() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "\r\n\n        min-h-screen\r\n\n        p-8\r\n\n      ",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>router.back(),
                className: "\r\n\n          fixed\r\n\n          top-8\r\n\n          left-8\r\n\n          z-50\r\n\n          rounded-full\r\n\n          bg-white/10\r\n\n          border\r\n\n          border-white/20\r\n\n          backdrop-blur-xl\r\n\n          px-5\r\n\n          py-3\r\n\n          text-white\r\n\n          hover:bg-white/20\r\n\n          transition\r\n\n        ",
                children: "← Back"
            }, void 0, false, {
                fileName: "[project]/app/event/[id]/page.tsx",
                lineNumber: 61,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "\r\n\n          max-w-6xl\r\n\n          mx-auto\r\n\n        ",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "\r\n\n            glass\r\n\n            rounded-3xl\r\n\n            overflow-hidden\r\n\n          ",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "\r\n\n              h-72\r\n\n              bg-gradient-to-br\r\n\n              from-slate-900\r\n\n              to-blue-600\r\n\n            ",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                    src: eventData.thumbnail,
                                    alt: eventData.title,
                                    className: "\r\n\n                w-full\r\n\n                h-full\r\n\n                object-cover\r\n\n              "
                                }, void 0, false, {
                                    fileName: "[project]/app/event/[id]/page.tsx",
                                    lineNumber: 117,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/event/[id]/page.tsx",
                                lineNumber: 108,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-8",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        className: "\r\n\n                text-4xl\r\n\n                font-bold\r\n\n              ",
                                        children: eventData.title
                                    }, void 0, false, {
                                        fileName: "[project]/app/event/[id]/page.tsx",
                                        lineNumber: 135,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "\r\n\n                mt-3\r\n\n                text-slate-400\r\n\n                text-lg\r\n\n              ",
                                        children: eventData.name
                                    }, void 0, false, {
                                        fileName: "[project]/app/event/[id]/page.tsx",
                                        lineNumber: 146,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "\r\n\n                mt-5\r\n\n                inline-flex\r\n\n                rounded-full\r\n\n                bg-blue-500/20\r\n\n                px-4\r\n\n                py-2\r\n\n                text-blue-300\r\n\n              ",
                                        children: [
                                            "📅 ",
                                            eventData.date
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/event/[id]/page.tsx",
                                        lineNumber: 158,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/event/[id]/page.tsx",
                                lineNumber: 132,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/event/[id]/page.tsx",
                        lineNumber: 99,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "mt-12",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "\r\n\n              text-3xl\r\n\n              font-bold\r\n\n            ",
                                children: "📸 Gallery"
                            }, void 0, false, {
                                fileName: "[project]/app/event/[id]/page.tsx",
                                lineNumber: 189,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "\r\n\n              grid\r\n\n              md:grid-cols-3\r\n\n              gap-6\r\n\n              mt-6\r\n\n            ",
                                children: eventData.gallery.map((photo, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "\r\n\n                    aspect-square\r\n\n                    rounded-2xl\r\n\n                    overflow-hidden\r\n\n                    bg-gradient-to-br\r\n\n                    from-slate-900\r\n\n                    to-blue-600\r\n\n                    cursor-pointer\r\n\n                    hover:scale-105\r\n\n                    transition\r\n\n                  ",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                            src: photo,
                                            alt: `gallery-${index}`,
                                            className: "\r\n\n                      w-full\r\n\n                      h-full\r\n\n                      object-cover\r\n\n                    "
                                        }, void 0, false, {
                                            fileName: "[project]/app/event/[id]/page.tsx",
                                            lineNumber: 228,
                                            columnNumber: 19
                                        }, this)
                                    }, index, false, {
                                        fileName: "[project]/app/event/[id]/page.tsx",
                                        lineNumber: 213,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/app/event/[id]/page.tsx",
                                lineNumber: 201,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/event/[id]/page.tsx",
                        lineNumber: 186,
                        columnNumber: 9
                    }, this),
                    eventData.highlights.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "\r\n\n                mt-12\r\n\n                pb-10\r\n\n              ",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "\r\n\n                  text-3xl\r\n\n                  font-bold\r\n\n                ",
                                children: "✨ Highlights"
                            }, void 0, false, {
                                fileName: "[project]/app/event/[id]/page.tsx",
                                lineNumber: 272,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "\r\n\n                  grid\r\n\n                  md:grid-cols-3\r\n\n                  gap-6\r\n\n                  mt-6\r\n\n                ",
                                children: eventData.highlights.map((item, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "\r\n\n                        glass\r\n\n                        rounded-2xl\r\n\n                        p-6\r\n\n                        hover:-translate-y-2\r\n\n                        transition\r\n\n                      ",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "\r\n\n                          text-5xl\r\n\n                        ",
                                                children: "🎥"
                                            }, void 0, false, {
                                                fileName: "[project]/app/event/[id]/page.tsx",
                                                lineNumber: 309,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "\r\n\n                          mt-5\r\n\n                          text-xl\r\n\n                          font-bold\r\n\n                        ",
                                                children: item.title
                                            }, void 0, false, {
                                                fileName: "[project]/app/event/[id]/page.tsx",
                                                lineNumber: 320,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "\r\n\n                          mt-2\r\n\n                          text-slate-400\r\n\n                        ",
                                                children: "Watch event recording"
                                            }, void 0, false, {
                                                fileName: "[project]/app/event/[id]/page.tsx",
                                                lineNumber: 333,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                href: item.url,
                                                target: "_blank",
                                                className: "\r\n\n                          inline-flex\r\n\n                          mt-5\r\n\n                          rounded-full\r\n\n                          bg-white/10\r\n\n                          border\r\n\n                          border-white/20\r\n\n                          px-5\r\n\n                          py-2\r\n\n                          text-white\r\n\n                          hover:bg-white/20\r\n\n                          transition\r\n\n                        ",
                                                children: "▶ Watch"
                                            }, void 0, false, {
                                                fileName: "[project]/app/event/[id]/page.tsx",
                                                lineNumber: 345,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, index, true, {
                                        fileName: "[project]/app/event/[id]/page.tsx",
                                        lineNumber: 297,
                                        columnNumber: 21
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/app/event/[id]/page.tsx",
                                lineNumber: 284,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/event/[id]/page.tsx",
                        lineNumber: 264,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/event/[id]/page.tsx",
                lineNumber: 87,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/event/[id]/page.tsx",
        lineNumber: 51,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=app_event_%5Bid%5D_page_tsx_16k8jz4._.js.map