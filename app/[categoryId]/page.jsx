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
    <div className="container mx-auto h-full ">
      <div className="grid md:grid-cols-2 gap-10 border-4 border-[#5eb1af] p-8 rounded-2xl relative">
        <div className="flex flex-col gap-6">
          <div className="bg-gray-100 rounded-2xl max-h-96 md:h-96 border md: max-w-[100%]">
            <img
              src={data?.image}
              alt={data?.title}
              className="rounded-2xl md:w-full md:h-full text-center text-3xl   font-bold"
            />
          </div>
          <h1 className="text-4xl font-bold text-gray-800">
            {" "}
            Category - {data?.title}
          </h1>
          <p>{data?.description}</p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex justify-between">
            <h2>Products</h2>
            <AddButton type="product" action="Add" categoryId={categoryId} />
          </div>

          <p hidden={data?.prod?.length > 0}>No products found</p>

          <div className="flex flex-col gap-4 relative">
            {data?.prod?.map((product, index) => (
              <ul
                key={index}
                className=" bg-gray-200  border  border-[#5eb1af] rounded-lg px-2 py-3 relative"
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
