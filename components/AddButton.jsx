"use client";

import { Pencil, PlusCircle } from "lucide-react";
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
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { useEffect, useState } from "react";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import { db, storage } from "@/firebase/config";
import { set, ref as databaseRef, update, get } from "firebase/database";
import { revalidatePath } from "next/cache";

const AddButton = ({ type, categoryId, action }) => {
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    description: "",
    image: null,
  });

  useEffect(() => {
    if (action === "Update" && categoryId) {
      const fetchData = async () => {
        const categoryRef = databaseRef(db, `products/${categoryId}`);
        const snapshot = await get(categoryRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          setFormData({
            id: data.id,
            title: data.title,
            description: data.description,
            image: null, // You might want to handle the image differently here
          });
        }
      };
      fetchData();
    }
  }, [action, categoryId]);

  const addHandler = async (e) => {
    e.preventDefault();
    console.log(formData);
    if (
      formData.id === "" ||
      formData.title === "" ||
      formData.description === ""
    ) {
      return;
    }
    let storageReference;
    if (type === "category") {
      storageReference = storageRef(storage, `categories/${formData.id}`);
    } else {
      storageReference = storageRef(storage, `products/${formData.id}`);
    }

    try {
      if (formData.image) {
        await uploadBytes(storageReference, formData.image);
        const url = await getDownloadURL(storageReference);
        console.log("File available at", url);

        const dataToSet = {
          id: formData.id,
          title: formData.title,
          description: formData.description,
          image: url,
        };

        await set(databaseRef(db, `products/${formData.id}`), dataToSet);
      } else {
        const dataToSet = {
          id: formData.id,
          title: formData.title,
          description: formData.description,
        };

        await set(databaseRef(db, `products/${formData.id}`), dataToSet);
      }
    } catch (error) {
      console.error("Error updating data:", error);
    }

    setFormData({
      id: "",
      title: "",
      description: "",
      image: null,
    });
  };

  const updateHandler = async (e) => {
    e.preventDefault();
    console.log(formData);

    let storageReference;
    if (type === "category") {
      storageReference = storageRef(storage, `categories/${formData.id}`);
    } else {
      storageReference = storageRef(storage, `products/${formData.id}`);
    }

    try {
      const updates = {
        id: formData.id,
        title: formData.title,
        description: formData.description,
      };

      if (formData.image) {
        await uploadBytes(storageReference, formData.image);
        const url = await getDownloadURL(storageReference);
        updates.image = url;
      }

      await update(databaseRef(db, `products/${categoryId}`), updates);
    } catch (error) {
      console.error("Error updating data:", error);
    }

    setFormData({
      id: "",
      title: "",
      description: "",
      image: null,
    });

    revalidatePath("/");
  };

  return (
    <Dialog>
      {action === "Add" ? (
        <DialogTrigger className="text-lg font-semibold flex justify-center items-center px-4 py-2 gap-2 border-2 border-[#5eb1af] rounded hover:bg-[rgba(94,177,176,0.7)] transition-all duration-200">
          Add <PlusCircle />
        </DialogTrigger>
      ) : (
        <DialogTrigger className="absolute top-2 right-2 bg-white p-2 rounded-full">
          <Pencil className="w-full" />
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {action === "Add" ? "Add" : "Edit"}{" "}
            {type === "category" ? "Category" : "Product"}
          </DialogTitle>
          <DialogDescription>
            {action === "Add" ? "Add" : "Edit"} {type} in your database.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <div>
              <Label htmlFor="id">ID</Label>
              <Input
                id="id"
                placeholder="Enter ID"
                value={formData.id}
                onChange={(e) =>
                  setFormData({ ...formData, id: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Enter Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="image">Cover Image</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.files[0] })
                }
              />
            </div>
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button
            className="bg-green-800"
            onClick={action === "Add" ? addHandler : updateHandler}
          >
            {action === "Add" ? "Add" : "Update"}{" "}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddButton;
