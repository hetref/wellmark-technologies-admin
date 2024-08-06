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
import toast from "react-hot-toast";

const AddButton = ({ type, categoryId, action, productId }) => {
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    description: "",
    image: null,
  });
  const [generateIdCheckbox, setGenerateIdCheckbox] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (action === "Update" && categoryId) {
        let dataRef;

        if (type === "category") {
          dataRef = databaseRef(db, `categories/${categoryId}`);
        } else {
          dataRef = databaseRef(db, `products/${categoryId}`);
        }

        const snapshot = await get(dataRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          if (type === "category") {
            setFormData({
              id: data.id,
              title: data.title,
              description: data.description,
              image: null,
            });
          } else {
            const product = data.prod
              ? data.prod.find((prod) => prod.id === productId)
              : null;
            if (product) {
              setFormData({
                id: product.id,
                title: product.title,
                description: product.description,
                image: null,
              });
            }
          }
        }
      }
    };

    fetchData();
  }, [action, categoryId, type]);

  const addHandler = async (e) => {
    e.preventDefault();
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
      let dataToSet = {
        id: formData.id,
        title: formData.title,
        description: formData.description,
      };

      if (formData.image) {
        await uploadBytes(storageReference, formData.image);
        const url = await getDownloadURL(storageReference);
        dataToSet.image = url;
      }

      if (type === "category") {
        await set(databaseRef(db, `categories/${formData.id}`), dataToSet);
        toast.success("Category added successfully");
      } else {
        const categoryRef = databaseRef(db, `products/${categoryId}`);
        const snapshot = await get(categoryRef);
        let existingProducts = [];
        if (snapshot.exists()) {
          const categoryData = snapshot.val();
          existingProducts = categoryData.prod ? categoryData.prod : [];
        }
        existingProducts.push(dataToSet);

        await update(categoryRef, { prod: existingProducts });
        toast.success("Product added successfully");
      }
    } catch (error) {
      console.error("Error adding data:", error);
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
    if (
      formData.id === "" ||
      formData.title === "" ||
      formData.description === ""
    ) {
      toast.error("Please fill in all fields");
      return;
    }

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
      } else {
        if (type === "category") {
          const existingCategoryRef = databaseRef(
            db,
            `categories/${formData.id}`
          );
          const snapshot = await get(existingCategoryRef);
          if (snapshot.exists()) {
            const existingCategoryData = snapshot.val();
            if (existingCategoryData.image) {
              updates.image = existingCategoryData.image;
            }
          }
        } else {
          const categoryRef = databaseRef(db, `products/${categoryId}`);
          const snapshot = await get(categoryRef);
          if (snapshot.exists()) {
            const categoryData = snapshot.val();
            const existingProduct = categoryData.prod
              ? categoryData.prod.find((prod) => prod.id === formData.id)
              : null;
            if (existingProduct && existingProduct.image) {
              updates.image = existingProduct.image;
            }
          }
        }
      }

      if (type === "category") {
        await update(databaseRef(db, `categories/${formData.id}`), updates);
        toast.success("Category updated successfully");
      } else {
        const categoryRef = databaseRef(db, `products/${categoryId}`);
        const snapshot = await get(categoryRef);
        let existingProducts = [];
        if (snapshot.exists()) {
          const categoryData = snapshot.val();
          existingProducts = categoryData.prod ? categoryData.prod : [];
        }
        const index = existingProducts.findIndex(
          (product) => product.id === formData.id
        );
        if (index !== -1) {
          existingProducts[index] = updates;
          await update(categoryRef, { prod: existingProducts });
          toast.success("Product updated successfully");
        } else {
          toast.error("Product not found");
        }
      }
    } catch (error) {
      console.error("Error updating data:", error);
      toast.error("Error updating data");
    }

    setFormData({
      id: "",
      title: "",
      description: "",
      image: null,
    });
  };

  return (
    <Dialog>
      {action === "Add" ? (
        <DialogTrigger className="text-lg font-semibold flex justify-center items-center px-4 py-2 gap-2 border-2 border-[#5eb1af] rounded hover:bg-[rgba(94,177,176,0.7)] transition-all duration-200">
          Add <PlusCircle />
        </DialogTrigger>
      ) : (
        <DialogTrigger
          className={
            type === "product" && action === "Update"
              ? `absolute top-1 right-2 bg-white p-2 rounded-full`
              : `absolute top-2 right-2 bg-white p-2 rounded-full`
          }
        >
          <Pencil className="" />
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
                disabled={generateIdCheckbox}
              />
            </div>
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter Title"
                value={formData.title}
                onChange={(e) => {
                  if (generateIdCheckbox) {
                    setFormData({
                      ...formData,
                      title: e.target.value,
                      id: e.target.value
                        .trim()
                        .toLowerCase()
                        .replace(/\s/g, "-"),
                    });
                  } else {
                    setFormData({ ...formData, title: e.target.value });
                  }
                }}
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
            <div className="flex items-center gap-3 justify-end">
              <Label htmlFor="generateId">Generate ID</Label>
              <input
                type="checkbox"
                id="generateId"
                checked={generateIdCheckbox}
                onChange={(e) => setGenerateIdCheckbox(e.target.checked)}
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
            {action === "Add" ? "Add" : "Update"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddButton;
