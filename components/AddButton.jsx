"use client";

import { PlusCircle } from "lucide-react";
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
import { useState } from "react";
import { ref, uploadBytes } from "firebase/storage";
import { db, storage } from "@/firebase/config";
import { set } from "firebase/database";

const AddButton = ({ type, category }) => {
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    description: "",
    image: null,
  });
  const [gernerateIdCheckbox, setGenerateIdCheckbox] = useState(false);

  const addHandler = (e) => {
    e.preventDefault();
    console.log(formData);
    // Handle your form submission logic here
    let storageRef;

    if (type === "category") {
      storageRef = ref(storage, `categories/${formData.id}`);
      // add the formData to the products/ in the firebase realtime database where I want to first upload the image to the storage and then add the link as the image in the database
    } else {
      storageRef = ref(storage, `products/${formData.id}`);
    }

    // 'file' comes from the Blob or File API
    uploadBytes(storageRef, formData.image).then((snapshot) => {
      console.log("Uploaded a blob or file!");
      // get file downloadable url and add data to firebase
      getDownloadURL(
        ref(
          storage,
          type === "category"
            ? `categories/${formData.id}`
            : `products/${formData.id}`
        )
      )
        .then((url) => {
          console.log("File available at", url);

          if (type === "category") {
            set(ref(db, `products/${formData.id}`), {
              id: formData.id,
              title: formData.title,
              description: formData.description,
              image: url,
            });
          }
        })
        .catch((error) => {
          console.log("ERROR GETTING DOWNLOAD URL", error);
          // Handle any errors
        });
    });

    setFormData({
      id: "",
      title: "",
      description: "",
      image: null,
    });
  };

  return (
    <Dialog>
      <DialogTrigger className="text-lg font-semibold flex justify-center items-center px-4 py-2 gap-2 border-2 border-[#5eb1af] rounded hover:bg-[rgba(94,177,176,0.7)] transition-all duration-200">
        Add <PlusCircle />
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Add {type === "category" ? "Category" : "Product"}
          </DialogTitle>
          <DialogDescription>Add {type} in your database.</DialogDescription>
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
                disabled={gernerateIdCheckbox}
              />
            </div>
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter Title"
                value={formData.title}
                onChange={(e) => {
                  if (gernerateIdCheckbox) {
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
              {/* <Input id="generateId" type="checkbox" /> */}
              <Label htmlFor="generateId">Generate ID</Label>
              <input
                type="checkbox"
                id="generateId"
                value={gernerateIdCheckbox}
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
          <Button className="bg-green-800" onClick={addHandler}>
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddButton;
