"use client";
import React from "react";
import Tabs from "./_components/Tabs";
import Navigation from "../../_components/Navigation";
import Items from "./_components/Items";
import PlusButton from "../../_components/PlusButton";
import { Toaster } from "react-hot-toast";
import { useTodo } from "./_hooks/useControlTodo";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "./_components/SortableItem";

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
    setNewItem,
    postTodoTitle,
    setPostTodoTitle,
    addPostNewItem,
    updateTodoOrder,
    clickSortMode,
    isSortMode,
  } = useTodo();

  return (
    <>
      <div>
        <h2 className="text-white text-2xl text-center">ToDo.</h2>
        <Tabs
          todoGroups={todoGroups}
          activeTabId={activeTabId}
          setActiveTabId={setActiveTabId}
        />
        <DndContext
          sensors={useSensors(
            useSensor(PointerSensor),
            useSensor(KeyboardSensor, {
              coordinateGetter: sortableKeyboardCoordinates,
            }),
            // useSensorでスマホを使いやすく。
            useSensor(TouchSensor, {
              activationConstraint: {
                delay: 1,
                tolerance: 1,
              },
            })
          )}
          collisionDetection={closestCenter}
          onDragEnd={({ active, over }) => {
            if (!over || active.id === over.id) return;
            const oldIndex = todoItems.findIndex(
              (item) => item.id === active.id
            );
            const newIndex = todoItems.findIndex((item) => item.id === over.id);
            const sorted = arrayMove(todoItems, oldIndex, newIndex);
            updateTodoOrder(
              sorted.map((item, index) => ({
                id: item.id,
                sortOrder: index,
              }))
            ); // useTodo から取得済み
          }}
        >
          <SortableContext
            items={todoItems.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            <ul className="bg-white m-auto max-w-md w-[95%] pt-6 pb-16 min-h-svh">
              {todoItems
                .filter((item) => item.todoGroupId === activeTabId)
                .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
                .map((item) =>
                  isSortMode ? (
                    <SortableItem
                      key={item.id}
                      id={item.id}
                      toDoItem={item.toDoItem}
                      isChecked={item.isChecked}
                    />
                  ) : (
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
                  )
                )}
              {newItem && (
                <li className="flex w-[95%] m-auto py-1 text-lg text-text_button">
                  <div className="flex items-center justify-center w-[20rem]  ml-4">
                    <button
                      className={`w-7 h-7 rounded-full border-2 flex justify-center items-center "border-text_button`}
                    >
                      <span className="text-white ">✓</span>
                    </button>
                    <input
                      placeholder="入力(フォーカスを外すと登録)"
                      ref={inputRef} // useRefで作成したrefをここに設定
                      type="text"
                      value={postTodoTitle}
                      onChange={(e) => setPostTodoTitle(e.target.value)}
                      // onBlur={addPostNewItem}
                      onBlur={() =>
                        postTodoTitle.trim() === ""
                          ? (setNewItem(false), setPostTodoTitle(""))
                          : addPostNewItem()
                      }
                      className="px-2 py-1 border-b-2 w-[85%] focus:outline-none "
                    />
                  </div>
                </li>
              )}
            </ul>
          </SortableContext>
        </DndContext>
        <div className="w-full flex justify-end mr-4">
          <button
            className={` w-[55px] aspect-square fixed bottom-[145px] mr-3 rounded-full text-white text-[11px] ${
              isSortMode ? "bg-trash_bg" : "bg-[#787878]"
            }`}
            // onClick={() => setIsSortMode(!isSortMode)}
            onClick={() => clickSortMode()}
          >
            {isSortMode ? "完了" : "並べ替え"}
          </button>
        </div>
        <PlusButton handleAddEvent={addEmptyItem} />
        <Navigation />
        <Toaster position="top-center" />
      </div>
    </>
  );
};

export default Page;
