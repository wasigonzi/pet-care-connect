(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/dashboard/estimates/data:c65db1 [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "convertEstimateToInvoice",
    ()=>$$RSC_SERVER_ACTION_2
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
/* __next_internal_action_entry_do_not_use__ [{"402c3c81728bc14828d7612ecd784f385a1f8315c8":"convertEstimateToInvoice"},"app/dashboard/estimates/actions.ts",""] */ "use turbopack no side effects";
;
const $$RSC_SERVER_ACTION_2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("402c3c81728bc14828d7612ecd784f385a1f8315c8", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "convertEstimateToInvoice");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
 //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vYWN0aW9ucy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzZXJ2ZXJcIjtcclxuXHJcbmltcG9ydCB7IGNyZWF0ZUNsaWVudCB9IGZyb20gXCJAL2xpYi9zdXBhYmFzZS9zZXJ2ZXJcIjtcclxuaW1wb3J0IHsgcmV2YWxpZGF0ZVBhdGggfSBmcm9tIFwibmV4dC9jYWNoZVwiO1xyXG5pbXBvcnQgeyByZWRpcmVjdCB9IGZyb20gXCJuZXh0L25hdmlnYXRpb25cIjtcclxuaW1wb3J0IHsgeiB9IGZyb20gXCJ6b2RcIjtcclxuXHJcbmNvbnN0IGl0ZW1TY2hlbWEgPSB6Lm9iamVjdCh7XHJcbiAgICBkZXNjcmlwdGlvbjogei5zdHJpbmcoKS5taW4oMSwgXCJEZXNjcmlwdGlvbiBpcyByZXF1aXJlZFwiKSxcclxuICAgIHF1YW50aXR5OiB6LmNvZXJjZS5udW1iZXIoKS5taW4oMSksXHJcbiAgICB1bml0X3ByaWNlOiB6LmNvZXJjZS5udW1iZXIoKS5taW4oMCksXHJcbn0pO1xyXG5cclxuY29uc3QgZXN0aW1hdGVTY2hlbWEgPSB6Lm9iamVjdCh7XHJcbiAgICBjbGllbnRfaWQ6IHouc3RyaW5nKCkudXVpZCgpLFxyXG4gICAgdmFsaWRfdW50aWw6IHouc3RyaW5nKCkubWluKDEsIFwiVmFsaWQgdW50aWwgZGF0ZSBpcyByZXF1aXJlZFwiKSxcclxuICAgIG5vdGVzOiB6LnN0cmluZygpLm9wdGlvbmFsKCksXHJcbiAgICBpdGVtczogei5hcnJheShpdGVtU2NoZW1hKS5taW4oMSwgXCJBdCBsZWFzdCBvbmUgaXRlbSBpcyByZXF1aXJlZFwiKSxcclxufSk7XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0RXN0aW1hdGVzKCkge1xyXG4gICAgY29uc3Qgc3VwYWJhc2UgPSBhd2FpdCBjcmVhdGVDbGllbnQoKTtcclxuICAgIGNvbnN0IHsgZGF0YSwgZXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlXHJcbiAgICAgICAgLmZyb20oXCJlc3RpbWF0ZXNcIilcclxuICAgICAgICAuc2VsZWN0KGBcclxuICAgICAgICAgICAgKixcclxuICAgICAgICAgICAgY2xpZW50cyAoXHJcbiAgICAgICAgICAgICAgICBmaXJzdF9uYW1lLFxyXG4gICAgICAgICAgICAgICAgbGFzdF9uYW1lLFxyXG4gICAgICAgICAgICAgICAgZW1haWxcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgIGApXHJcbiAgICAgICAgLm9yZGVyKFwiY3JlYXRlZF9hdFwiLCB7IGFzY2VuZGluZzogZmFsc2UgfSk7XHJcblxyXG4gICAgaWYgKGVycm9yKSB0aHJvdyBuZXcgRXJyb3IoZXJyb3IubWVzc2FnZSk7XHJcbiAgICByZXR1cm4gZGF0YTtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNyZWF0ZUVzdGltYXRlQWN0aW9uKGZvcm1EYXRhOiBGb3JtRGF0YSkge1xyXG4gICAgY29uc3QgcmF3SXRlbXMgPSBmb3JtRGF0YS5nZXQoXCJpdGVtc1wiKTtcclxuICAgIGNvbnN0IGl0ZW1zID0gcmF3SXRlbXMgPyBKU09OLnBhcnNlKHJhd0l0ZW1zIGFzIHN0cmluZykgOiBbXTtcclxuXHJcbiAgICBjb25zdCByYXdEYXRhID0ge1xyXG4gICAgICAgIGNsaWVudF9pZDogZm9ybURhdGEuZ2V0KFwiY2xpZW50X2lkXCIpLFxyXG4gICAgICAgIHZhbGlkX3VudGlsOiBmb3JtRGF0YS5nZXQoXCJ2YWxpZF91bnRpbFwiKSxcclxuICAgICAgICBub3RlczogZm9ybURhdGEuZ2V0KFwibm90ZXNcIiksXHJcbiAgICAgICAgaXRlbXMsXHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IHZhbGlkYXRlZCA9IGVzdGltYXRlU2NoZW1hLnNhZmVQYXJzZShyYXdEYXRhKTtcclxuXHJcbiAgICBpZiAoIXZhbGlkYXRlZC5zdWNjZXNzKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgZXJyb3I6IHZhbGlkYXRlZC5lcnJvci5mbGF0dGVuKCkuZmllbGRFcnJvcnMgfTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCB7IGNsaWVudF9pZCwgdmFsaWRfdW50aWwsIG5vdGVzLCBpdGVtczogdmFsaWRJdGVtcyB9ID0gdmFsaWRhdGVkLmRhdGE7XHJcblxyXG4gICAgLy8gQ2FsY3VsYXRlIHRvdGFsXHJcbiAgICBjb25zdCB0b3RhbF9hbW91bnQgPSB2YWxpZEl0ZW1zLnJlZHVjZSgoc3VtLCBpdGVtKSA9PiBzdW0gKyAoaXRlbS5xdWFudGl0eSAqIGl0ZW0udW5pdF9wcmljZSksIDApO1xyXG5cclxuICAgIGNvbnN0IHN1cGFiYXNlID0gYXdhaXQgY3JlYXRlQ2xpZW50KCk7XHJcblxyXG4gICAgLy8gSW5zZXJ0IGVzdGltYXRlXHJcbiAgICBjb25zdCB7IGRhdGE6IGVzdGltYXRlLCBlcnJvcjogZXN0aW1hdGVFcnJvciB9ID0gYXdhaXQgc3VwYWJhc2VcclxuICAgICAgICAuZnJvbShcImVzdGltYXRlc1wiKVxyXG4gICAgICAgIC5pbnNlcnQoe1xyXG4gICAgICAgICAgICBjbGllbnRfaWQsXHJcbiAgICAgICAgICAgIHZhbGlkX3VudGlsLFxyXG4gICAgICAgICAgICBub3RlcyxcclxuICAgICAgICAgICAgdG90YWxfYW1vdW50LFxyXG4gICAgICAgICAgICBzdGF0dXM6ICdkcmFmdCdcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5zZWxlY3QoKVxyXG4gICAgICAgIC5zaW5nbGUoKTtcclxuXHJcbiAgICBpZiAoZXN0aW1hdGVFcnJvcikgcmV0dXJuIHsgZXJyb3I6IGVzdGltYXRlRXJyb3IubWVzc2FnZSB9O1xyXG5cclxuICAgIC8vIEluc2VydCBpdGVtc1xyXG4gICAgY29uc3QgeyBlcnJvcjogaXRlbXNFcnJvciB9ID0gYXdhaXQgc3VwYWJhc2VcclxuICAgICAgICAuZnJvbShcImVzdGltYXRlX2l0ZW1zXCIpXHJcbiAgICAgICAgLmluc2VydChcclxuICAgICAgICAgICAgdmFsaWRJdGVtcy5tYXAoaXRlbSA9PiAoe1xyXG4gICAgICAgICAgICAgICAgZXN0aW1hdGVfaWQ6IGVzdGltYXRlLmlkLFxyXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IGl0ZW0uZGVzY3JpcHRpb24sXHJcbiAgICAgICAgICAgICAgICBxdWFudGl0eTogaXRlbS5xdWFudGl0eSxcclxuICAgICAgICAgICAgICAgIHVuaXRfcHJpY2U6IGl0ZW0udW5pdF9wcmljZVxyXG4gICAgICAgICAgICB9KSlcclxuICAgICAgICApO1xyXG5cclxuICAgIGlmIChpdGVtc0Vycm9yKSByZXR1cm4geyBlcnJvcjogaXRlbXNFcnJvci5tZXNzYWdlIH07XHJcblxyXG4gICAgcmV2YWxpZGF0ZVBhdGgoXCIvZGFzaGJvYXJkL2VzdGltYXRlc1wiKTtcclxuICAgIHJlZGlyZWN0KFwiL2Rhc2hib2FyZC9lc3RpbWF0ZXNcIik7XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjb252ZXJ0RXN0aW1hdGVUb0ludm9pY2UoZXN0aW1hdGVJZDogc3RyaW5nKSB7XHJcbiAgICBjb25zdCBzdXBhYmFzZSA9IGF3YWl0IGNyZWF0ZUNsaWVudCgpO1xyXG5cclxuICAgIC8vIDEuIEZldGNoIEVzdGltYXRlIGFuZCBJdGVtc1xyXG4gICAgY29uc3QgeyBkYXRhOiBlc3RpbWF0ZSwgZXJyb3I6IGZldGNoRXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlXHJcbiAgICAgICAgLmZyb20oXCJlc3RpbWF0ZXNcIilcclxuICAgICAgICAuc2VsZWN0KGBcclxuICAgICAgICAgICAgKixcclxuICAgICAgICAgICAgZXN0aW1hdGVfaXRlbXMgKCopXHJcbiAgICAgICAgYClcclxuICAgICAgICAuZXEoXCJpZFwiLCBlc3RpbWF0ZUlkKVxyXG4gICAgICAgIC5zaW5nbGUoKTtcclxuXHJcbiAgICBpZiAoZmV0Y2hFcnJvciB8fCAhZXN0aW1hdGUpIHtcclxuICAgICAgICByZXR1cm4geyBlcnJvcjogXCJFc3RpbWF0ZSBub3QgZm91bmRcIiB9O1xyXG4gICAgfVxyXG5cclxuICAgIC8vIDIuIENyZWF0ZSBJbnZvaWNlXHJcbiAgICBjb25zdCBkdWVEYXRlID0gbmV3IERhdGUoKTtcclxuICAgIGR1ZURhdGUuc2V0RGF0ZShkdWVEYXRlLmdldERhdGUoKSArIDMwKTsgLy8gRGVmYXVsdCBOZXQzMFxyXG5cclxuICAgIGNvbnN0IHsgZGF0YTogaW52b2ljZSwgZXJyb3I6IGludm9pY2VFcnJvciB9ID0gYXdhaXQgc3VwYWJhc2VcclxuICAgICAgICAuZnJvbShcImludm9pY2VzXCIpXHJcbiAgICAgICAgLmluc2VydCh7XHJcbiAgICAgICAgICAgIGNsaWVudF9pZDogZXN0aW1hdGUuY2xpZW50X2lkLFxyXG4gICAgICAgICAgICBzdGF0dXM6ICdkcmFmdCcsXHJcbiAgICAgICAgICAgIHRvdGFsX2Ftb3VudDogZXN0aW1hdGUudG90YWxfYW1vdW50LFxyXG4gICAgICAgICAgICBkdWVfZGF0ZTogZHVlRGF0ZS50b0lTT1N0cmluZygpLFxyXG4gICAgICAgICAgICBub3RlczogYENvbnZlcnRlZCBmcm9tIEVzdGltYXRlICMke2VzdGltYXRlLmlkLnNsaWNlKDAsIDgpLnRvVXBwZXJDYXNlKCl9LiAke2VzdGltYXRlLm5vdGVzIHx8ICcnfWBcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5zZWxlY3QoKVxyXG4gICAgICAgIC5zaW5nbGUoKTtcclxuXHJcbiAgICBpZiAoaW52b2ljZUVycm9yKSByZXR1cm4geyBlcnJvcjogaW52b2ljZUVycm9yLm1lc3NhZ2UgfTtcclxuXHJcbiAgICAvLyAzLiBDcmVhdGUgSW52b2ljZSBJdGVtc1xyXG4gICAgY29uc3QgaW52b2ljZUl0ZW1zID0gZXN0aW1hdGUuZXN0aW1hdGVfaXRlbXMubWFwKChpdGVtOiBhbnkpID0+ICh7XHJcbiAgICAgICAgaW52b2ljZV9pZDogaW52b2ljZS5pZCxcclxuICAgICAgICBkZXNjcmlwdGlvbjogaXRlbS5kZXNjcmlwdGlvbixcclxuICAgICAgICBxdWFudGl0eTogaXRlbS5xdWFudGl0eSxcclxuICAgICAgICB1bml0X3ByaWNlOiBpdGVtLnVuaXRfcHJpY2UsXHJcbiAgICAgICAgLy8gVHJpZ2dlciBhdXRvLWNhbGN1bGF0ZXMgdG90YWwgdXN1YWxseSwgYnV0IHdlIGNoZWNrIHNjaGVtYVxyXG4gICAgfSkpO1xyXG5cclxuICAgIGNvbnN0IHsgZXJyb3I6IGl0ZW1zRXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlXHJcbiAgICAgICAgLmZyb20oXCJpbnZvaWNlX2l0ZW1zXCIpXHJcbiAgICAgICAgLmluc2VydChpbnZvaWNlSXRlbXMpO1xyXG5cclxuICAgIGlmIChpdGVtc0Vycm9yKSByZXR1cm4geyBlcnJvcjogaXRlbXNFcnJvci5tZXNzYWdlIH07XHJcblxyXG4gICAgLy8gNC4gVXBkYXRlIEVzdGltYXRlIFN0YXR1c1xyXG4gICAgYXdhaXQgc3VwYWJhc2VcclxuICAgICAgICAuZnJvbShcImVzdGltYXRlc1wiKVxyXG4gICAgICAgIC51cGRhdGUoeyBzdGF0dXM6ICdjb252ZXJ0ZWQnIH0pXHJcbiAgICAgICAgLmVxKFwiaWRcIiwgZXN0aW1hdGVJZCk7XHJcblxyXG4gICAgcmV2YWxpZGF0ZVBhdGgoXCIvZGFzaGJvYXJkL2VzdGltYXRlc1wiKTtcclxuICAgIHJldmFsaWRhdGVQYXRoKFwiL2Rhc2hib2FyZC9iaWxsaW5nXCIpO1xyXG4gICAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSB9O1xyXG59XHJcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiK1NBK0ZzQixxTUFBQSJ9
}),
"[project]/app/dashboard/estimates/components/estimate-actions.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EstimateActions",
    ()=>EstimateActions
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-right.js [app-client] (ecmascript) <export default as ArrowRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$dashboard$2f$estimates$2f$data$3a$c65db1__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/app/dashboard/estimates/data:c65db1 [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/dropdown-menu.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ellipsis.js [app-client] (ecmascript) <export default as MoreHorizontal>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
function EstimateActions({ estimate }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const handleConvert = async ()=>{
        if (!confirm("Convert this estimate to an invoice?")) return;
        setLoading(true);
        try {
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$dashboard$2f$estimates$2f$data$3a$c65db1__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["convertEstimateToInvoice"])(estimate.id);
            if (result.error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(result.error);
            } else {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success("Estimate converted to Invoice");
                router.push("/dashboard/billing");
            }
        } catch (e) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("Failed to convert");
        } finally{
            setLoading(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenu"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuTrigger"], {
                asChild: true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                    variant: "ghost",
                    className: "h-8 w-8 p-0",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "sr-only",
                            children: "Open menu"
                        }, void 0, false, {
                            fileName: "[project]/app/dashboard/estimates/components/estimate-actions.tsx",
                            lineNumber: 49,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__["MoreHorizontal"], {
                            className: "h-4 w-4"
                        }, void 0, false, {
                            fileName: "[project]/app/dashboard/estimates/components/estimate-actions.tsx",
                            lineNumber: 50,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/dashboard/estimates/components/estimate-actions.tsx",
                    lineNumber: 48,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/dashboard/estimates/components/estimate-actions.tsx",
                lineNumber: 47,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuContent"], {
                align: "end",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuLabel"], {
                        children: "Actions"
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/estimates/components/estimate-actions.tsx",
                        lineNumber: 54,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                        onClick: ()=>router.push(`/dashboard/estimates/${estimate.id}`),
                        children: "View Details"
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/estimates/components/estimate-actions.tsx",
                        lineNumber: 55,
                        columnNumber: 17
                    }, this),
                    estimate.status !== 'converted' && estimate.status !== 'declined' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                        onClick: handleConvert,
                        disabled: loading,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                className: "mr-2 h-4 w-4"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/estimates/components/estimate-actions.tsx",
                                lineNumber: 60,
                                columnNumber: 25
                            }, this),
                            "Convert to Invoice"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/estimates/components/estimate-actions.tsx",
                        lineNumber: 59,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/estimates/components/estimate-actions.tsx",
                lineNumber: 53,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/dashboard/estimates/components/estimate-actions.tsx",
        lineNumber: 46,
        columnNumber: 9
    }, this);
}
_s(EstimateActions, "OeGW3YQfIEwiDdtbkZtE38+y0P4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = EstimateActions;
var _c;
__turbopack_context__.k.register(_c, "EstimateActions");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/lucide-react/dist/esm/icons/arrow-right.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ArrowRight
]);
/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const ArrowRight = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("ArrowRight", [
    [
        "path",
        {
            d: "M5 12h14",
            key: "1ays0h"
        }
    ],
    [
        "path",
        {
            d: "m12 5 7 7-7 7",
            key: "xquz4c"
        }
    ]
]);
;
 //# sourceMappingURL=arrow-right.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/arrow-right.js [app-client] (ecmascript) <export default as ArrowRight>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ArrowRight",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-right.js [app-client] (ecmascript)");
}),
"[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// This file must be bundled in the app's client layer, it shouldn't be directly
// imported by the server.
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    callServer: null,
    createServerReference: null,
    findSourceMapURL: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    callServer: function() {
        return _appcallserver.callServer;
    },
    createServerReference: function() {
        return _client.createServerReference;
    },
    findSourceMapURL: function() {
        return _appfindsourcemapurl.findSourceMapURL;
    }
});
const _appcallserver = __turbopack_context__.r("[project]/node_modules/next/dist/client/app-call-server.js [app-client] (ecmascript)");
const _appfindsourcemapurl = __turbopack_context__.r("[project]/node_modules/next/dist/client/app-find-source-map-url.js [app-client] (ecmascript)");
const _client = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react-server-dom-turbopack/client.js [app-client] (ecmascript)"); //# sourceMappingURL=action-client-wrapper.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/ellipsis.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Ellipsis
]);
/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const Ellipsis = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("Ellipsis", [
    [
        "circle",
        {
            cx: "12",
            cy: "12",
            r: "1",
            key: "41hilf"
        }
    ],
    [
        "circle",
        {
            cx: "19",
            cy: "12",
            r: "1",
            key: "1wjl8i"
        }
    ],
    [
        "circle",
        {
            cx: "5",
            cy: "12",
            r: "1",
            key: "1pcz8c"
        }
    ]
]);
;
 //# sourceMappingURL=ellipsis.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/ellipsis.js [app-client] (ecmascript) <export default as MoreHorizontal>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MoreHorizontal",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ellipsis.js [app-client] (ecmascript)");
}),
]);

//# sourceMappingURL=_1f3b8b0a._.js.map