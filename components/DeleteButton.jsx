"use client";
import { Trash } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { ref, remove, get, update } from "firebase/database";
import { db } from "@/firebase/config";
import toast from "react-hot-toast";

const DeleteButton = ({ type, categoryId, productId }) => {
  const deleteHandler = async () => {
    try {
      if (type === "category") {
        await remove(ref(db, `categories/${categoryId}`));
        toast.success("Category deleted successfully");
      } else {
        const categoryRef = ref(db, `products/${categoryId}`);
        const snapshot = await get(categoryRef);

        if (snapshot.exists()) {
          const categoryData = snapshot.val();
          const updatedProducts = categoryData.prod.filter(
            (prod) => prod.id !== productId
          );

          if (updatedProducts.length > 0) {
            await update(categoryRef, { prod: updatedProducts });
          } else {
            await remove(categoryRef);
          }

          toast.success("Product deleted successfully");
        } else {
          toast.error("Product not found");
        }
      }
    } catch (error) {
      console.error("Error deleting data:", error);
      toast.error("Error deleting data");
    }
  };

  return (
    <Dialog>
      <DialogTrigger
        className={
          type === "product"
            ? "absolute top-1 right-16 bg-red-600 text-white p-2 rounded-full"
            : "absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full"
        }
      >
        <Trash className="w-6 h-6" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete this{" "}
            {type}.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose>Cancel</DialogClose>
          <Button className="bg-red-600" onClick={deleteHandler}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteButton;
