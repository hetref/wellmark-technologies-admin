"use client";

import AddButton from "@/components/AddButton";
import DeleteButton from "@/components/DeleteButton";
import { db } from "@/firebase/config";
import { onValue, ref } from "firebase/database";
import { Delete, Pencil } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const CategoryPage = () => {
  // Get the [categoryId] from the route
  const { categoryId } = useParams();

  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);

  // Fetch the products and display it on the page
  useEffect(() => {
    const fetchData = async () => {
      const prodRef = ref(db, "products/" + categoryId);
      onValue(prodRef, (snapshot) => {
        const valData = snapshot.val();
        setData(valData);
        // console.log("DATA", data);
      });
      setLoading(false);
    };
    fetchData();
  }, [categoryId]);

  if (loading) return <div>Loading...</div>;
  if (!data) return <div>No data found</div>;

  return (
    <div>
      <img src={data?.image} alt={data?.title} />
      <h1>Category - {data?.title}</h1>
      <p>{data?.description}</p>

      <div>
        <h2>Products</h2>
        <div className="flex flex-col gap-4 relative">
          {data?.prod?.map((product, index) => (
            <ul
              key={index}
              className=" bg-gray-200 border-2 border-gray-400 rounded-lg px-2 py-3 relative"
            >
              <Link href={`/${categoryId}/${product.id}`}>
                <li>{product.title}</li>
              </Link>
              <AddButton
                type="product"
                action="Update"
                categoryId={categoryId}
                productId={product.id}
              />
              <DeleteButton
                type="product"
                categoryId={categoryId}
                productId={product.id}
              />
            </ul>
          ))}

          <AddButton type="product" action="Add" categoryId={categoryId} />
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
