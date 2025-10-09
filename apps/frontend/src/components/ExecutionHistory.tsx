// import React from "react"

// interface ExecutionHistoryProps {
//   workflowId: string
// }

// interface Execution {
//   id: string
//   status: "PENDING" | "RUNNING" | "SUCCESS" | "ERROR" | "CANCELLED"
//   mode: string
//   startedAt: string
//   finishedAt?: string
//   createdAt: string
// }

// const statusColors = {
//   PENDING: "bg-yellow-100 text-yellow-800",
//   RUNNING: "bg-blue-100 text-blue-800",
//   SUCCESS: "bg-green-100 text-green-800",
//   ERROR: "bg-red-100 text-red-800",
//   CANCELLED: "bg-gray-100 text-gray-800"
// }

// const statusIcons = {
//   PENDING: "⏳",
//   RUNNING: "🔄",
//   SUCCESS: "✅",
//   ERROR: "❌",
//   CANCELLED: "⏹️"
// }

// export const ExecutionHistory: React.FC<ExecutionHistoryProps> = ({ workflowId }) => {
//   const { data: executions, isLoading, error } = useExecutionHistory(workflowId)
//   const cancelExecution = useCancelExecution()

//   const handleCancelExecution = (executionId: string) => {
//     cancelExecution.mutate(executionId)
//   }

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleString()
//   }

//   const getDuration = (startedAt: string, finishedAt?: string) => {
//     const start = new Date(startedAt)
//     const end = finishedAt ? new Date(finishedAt) : new Date()
//     const duration = Math.round((end.getTime() - start.getTime()) / 1000)
    
//     if (duration < 60) return `${duration}s`
//     if (duration < 3600) return `${Math.round(duration / 60)}m ${duration % 60}s`
//     return `${Math.round(duration / 3600)}h ${Math.round((duration % 3600) / 60)}m`
//   }

//   if (isLoading) {
//     return (
//       <div className="p-4">
//         <div className="animate-pulse space-y-4">
//           {[...Array(3)].map((_, i) => (
//             <div key={i} className="h-16 bg-gray-200 rounded"></div>
//           ))}
//         </div>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="p-4 text-red-600">
//         <p>Error loading execution history</p>
//       </div>
//     )
//   }

//   if (!executions?.data || executions.data.length === 0) {
//     return (
//       <div className="p-4 text-gray-500 text-center">
//         <p>No executions found for this workflow</p>
//       </div>
//     )
//   }

//   return (
//     <div className="p-4">
//       <h3 className="text-lg font-semibold mb-4">Execution History</h3>
//       <div className="space-y-3">
//         {executions.data.map((execution: Execution) => (
//           <div
//             key={execution.id}
//             className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
//           >
//             <div className="flex items-center justify-between">
//               <div className="flex items-center space-x-3">
//                 <span className="text-xl" title={execution.status}>
//                   {statusIcons[execution.status]}
//                 </span>
//                 <div>
//                   <div className="flex items-center space-x-2">
//                     <span
//                       className={`px-2 py-1 rounded-full text-xs font-medium ${
//                         statusColors[execution.status]
//                       }`}
//                     >
//                       {execution.status}
//                     </span>
//                     <span className="text-sm text-gray-500">
//                       {execution.mode}
//                     </span>
//                   </div>
//                   <p className="text-sm text-gray-600 mt-1">
//                     Started: {formatDate(execution.startedAt || execution.createdAt)}
//                   </p>
//                   {execution.finishedAt && (
//                     <p className="text-sm text-gray-600">
//                       Finished: {formatDate(execution.finishedAt)}
//                     </p>
//                   )}
//                   <p className="text-sm text-gray-500">
//                     Duration: {getDuration(execution.startedAt || execution.createdAt, execution.finishedAt)}
//                   </p>
//                 </div>
//               </div>
//               <div className="flex items-center space-x-2">
//                 {execution.status === "RUNNING" && (
//                   <button
//                     onClick={() => handleCancelExecution(execution.id)}
//                     disabled={cancelExecution.isPending}
//                     className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50"
//                   >
//                     {cancelExecution.isPending ? "Cancelling..." : "Cancel"}
//                   </button>
//                 )}
//                 <button
//                   onClick={() => {
//                     // TODO: Open execution details modal
//                     console.log("View details for execution:", execution.id)
//                   }}
//                   className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
//                 >
//                   Details
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

