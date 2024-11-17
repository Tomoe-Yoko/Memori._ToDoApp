// // import PlusButton from "@/app/_components/PlusButton";
// // import React, { useState } from "react";
// // import { CreatePostRequestBody, CreateTodoItemRequestBody } from "@/app/_type/Todo";

// // const TodoApp: React.FC = () => {
// //   const [items, setItems] = useState<TodoItem[]>([
// //     { id: 1, name: "にんじん", completed: false },
// //   ]);
// //   const [showModal, setShowModal] = useState(false);
// //   const [newItemName, setNewItemName] = useState("");

// //   // 新しい項目を追加する関数
// //   const addItem = () => {
// //     if (newItemName.trim() === "") return;

// //     setItems((prevItems) => [
// //       ...prevItems,
// //       { id: prevItems.length + 1, name: newItemName, completed: false },
// //     ]);
// //     setNewItemName(""); // 入力欄をリセット
// //     setShowModal(false); // モーダルを閉じる
// //   };

// //   // タスクの完了状態を切り替える関数
// //   const toggleCompletion = (id: number) => {
// //     setItems((prevItems) =>
// //       prevItems.map((item) =>
// //         item.id === id ? { ...item, completed: !item.completed } : item
// //       )
// //     );
// //   };

// //   return (
// //     <div className="max-w-md mx-auto bg-white border shadow-md rounded-lg p-4 relative">
// //       {/* ToDo リスト */}
// //       <div className="space-y-4">
// //         {items.map((item) => (
// //           <div
// //             key={item.id}
// //             className="flex items-center space-x-4 p-2 border-b last:border-none"
// //           >
// //             <button
// //               onClick={() => toggleCompletion(item.id)}
// //               className={`w-6 h-6 rounded-full border-2 flex justify-center items-center ${
// //                 item.completed
// //                   ? "bg-gray-600 border-gray-600"
// //                   : "border-gray-300"
// //               }`}
// //             >
// //               {item.completed && (
// //                 <span className="text-white font-bold">✔</span>
// //               )}
// //             </button>
// //             <p
// //               className={`text-lg ${
// //                 item.completed ? "line-through text-gray-400" : "text-black"
// //               }`}
// //             >
// //               {item.name}
// //             </p>
// //           </div>
// //         ))}
// //       </div>

// //       {/* プラスボタン */}

// //       <PlusButton handleAddEvent={() => setShowModal(true)} />

// //       {/* モーダル */}
// //       {showModal && (
// //         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
// //           <div className="bg-white p-6 rounded shadow-md w-80">
// //             <h3 className="text-lg font-semibold mb-4">新しいタスクを追加</h3>
// //             <input
// //               type="text"
// //               value={newItemName}
// //               onChange={(e) => setNewItemName(e.target.value)}
// //               className="w-full px-4 py-2 border rounded mb-4"
// //               placeholder="タスク名を入力"
// //             />
// //             <div className="flex justify-end space-x-2">
// //               <button
// //                 onClick={() => setShowModal(false)}
// //                 className="px-4 py-2 bg-gray-300 rounded"
// //               >
// //                 キャンセル
// //               </button>
// //               <button
// //                 onClick={addItem}
// //                 className="px-4 py-2 bg-pink-500 text-white rounded"
// //               >
// //                 追加
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default TodoApp;

// import React, { useState } from "react";
// import { CreateTodoItemRequestBody } from "@/app/_type/Todo"; // インターフェースをインポート
// import PlusButton from "@/app/_components/PlusButton";

// interface Props {
//   tasks: CreateTodoItemRequestBody[];
//   setTasks: () => void;
//   activeTabId: number | null;
//   AddTask: (taskName: string) => void;
//   onToggleTask: (taskId: number) => void;
//   onDeleteTask: (taskId: number) => void;
// }

// const Items: React.FC<Props> = ({
//   tasks,
//   setTasks,
//   activeTabId,
//   onToggleTask,
//   onDeleteTask,
// }) => {
//   const [showModal, setShowModal] = useState(false);
//   const [newItemName, setNewItemName] = useState("");
//   // const [Items, setItems] = useState([
//   //   { id: 1, name: "にんじん", completed: false },
//   // ]);

//   // 新しい項目を追加する関数
//   const addItem = () => {
//     if (newItemName.trim() === "") return;

//     setTasks((tasks) => [
//       ...prevItems,
//       { id: prevItems.length + 1, name: newItemName, completed: false },
//     ]);
//     setNewItemName(""); // 入力欄をリセット
//     setShowModal(false); // モーダルを閉じる
//   };

//   return (
//     <div>
//       {tasks
//         .filter((task) => task.todoGroupId === activeTabId)
//         .map((task) => (
//           <div
//             key={task.id}
//             className="flex items-center space-x-4 p-2 border-b"
//           >
//             <button
//               onClick={() => onToggleTask(task.id)}
//               className={`w-6 h-6 rounded-full border-2 flex justify-center items-center ${
//                 task.isChecked
//                   ? "bg-gray-600 border-gray-600"
//                   : "border-gray-300"
//               }`}
//             >
//               {task.isChecked && (
//                 <span className="text-white font-bold">✔️</span>
//               )}
//             </button>
//             <p
//               className={`text-lg ${
//                 task.isChecked ? "line-through text-gray-400" : "text-black"
//               }`}
//             >
//               {task.toDoItem}
//             </p>
//             <button
//               onClick={() => onDeleteTask(task.id)}
//               className="text-red-500"
//             >
//               削除
//             </button>
//             <div>test</div>
//           </div>
//         ))}
//       <div className="flex mt-4">
//         {/* プラスボタン */}

//         <PlusButton handleAddEvent={() => setShowModal(true)} />
//       </div>
//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//           <div className="bg-white p-6 rounded shadow-md w-80">
//             <h3 className="text-lg font-semibold mb-4">新しいタスクを追加</h3>
//             <input
//               type="text"
//               value={newItemName}
//               onChange={(e) => setNewItemName(e.target.value)}
//               className="w-full px-4 py-2 border rounded mb-4"
//               placeholder="タスク名を入力"
//             />
//             <div className="flex justify-end space-x-2">
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="px-4 py-2 bg-gray-300 rounded"
//               >
//                 キャンセル
//               </button>
//               <button
//                 onClick={addItem}
//                 className="px-4 py-2 bg-pink-500 text-white rounded"
//               >
//                 追加
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Items;
