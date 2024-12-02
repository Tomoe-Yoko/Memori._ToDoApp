"use client";
import React, { useEffect } from "react";
import Tabs from "./_components/Tabs";
import Navigation from "../_components/Navigation";
import Items from "./_components/Items";
// import Loading from "@/app/loading";
import PlusButton from "../_components/PlusButton";
import { Toaster } from "react-hot-toast";
import { useTodo } from "./_hooks/useControlTodo";

const Page: React.FC = () => {
  const {
    deleteItem,
    saveItem,
    updateItem,
    addEmptyItem,
    toggleCompletion,
    // loading,
    todoGroups,
    inputRef,
    activeTabId,
    setActiveTabId,
    todoItems,
    postItem,
    newItem,
    postTodoTitle,
    setPostTodoTitle,
    addPostNewItem,
  } = useTodo();
  //新しいアイテムが追加されたときにフォーカスを当てる
  useEffect(() => {
    if (newItem) {
      inputRef.current?.focus();
    }
  }, [newItem]);

  // if (loading) {
  //   return <Loading />;
  // }
  return (
    <div>
      <h2 className="text-white text-2xl text-center">ToDo.</h2>
      <Tabs
        todoGroups={todoGroups}
        activeTabId={activeTabId}
        setActiveTabId={setActiveTabId}
      />
      <ul className="bg-white m-auto max-w-md w-[95%] pt-6 pb-16 min-h-svh">
        {todoItems
          .filter((item) => item.todoGroupId === activeTabId)
          .map((item) => (
            <Items
              key={item.id}
              id={item.id}
              toDoItem={item.toDoItem}
              isChecked={item.isChecked}
              toggleCompletion={toggleCompletion}
              inputRef={inputRef}
              updateItem={updateItem}
              saveItem={saveItem}
              todoItems={todoItems}
              deleteItem={deleteItem}
              postItem={postItem}
            />
          ))}
        {newItem && (
          <li className="flex w-[95%] m-auto py-1 text-lg text-text_button">
            <div className="flex items-center justify-center w-[20rem]  ml-4">
              <button
                className={`w-7 h-7 rounded-full border-2 flex justify-center items-center "border-text_button`}
              >
                <span className="text-white ">✓</span>
              </button>
              <input
                placeholder="新しいタスクを入力"
                ref={inputRef} // useRefで作成したrefをここに設定
                type="text"
                value={postTodoTitle}
                onChange={(e) => setPostTodoTitle(e.target.value)}
                onBlur={addPostNewItem}
                className="px-2 py-1 border-b-2 w-[85%] focus:outline-none "
              />
            </div>
          </li>
        )}
      </ul>

      <PlusButton handleAddEvent={addEmptyItem} />
      <Navigation />
      <Toaster position="top-center" />
    </div>
  );
};

export default Page;
