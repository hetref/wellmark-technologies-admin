"use client";
import AddButton from "@/components/AddButton";
import DeleteButton from "@/components/DeleteButton";
import { db } from "@/firebase/config";
import { onValue, ref } from "firebase/database";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const ProductPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { categoryId, productId } = useParams();
  const [catData, setCatData] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      if (!categoryId || !productId) {
        console.error("categoryId or productId is not defined");
        setLoading(false);
        return;
      }

      console.log(
        "Fetching data for category:",
        categoryId,
        "product:",
        productId
      );

      const categoryRef = ref(db, `products/${categoryId}`);
      onValue(
        categoryRef,
        (snapshot) => {
          const categoryData = snapshot.val();
          setCatData(categoryData);
          if (categoryData && categoryData.prod) {
            const productData = categoryData.prod.find(
              (product) => product.id === productId
            );
            if (productData) {
              console.log("Product data found:", productData);
              setData(productData);
            } else {
              console.error(
                "No product data found for:",
                categoryId,
                productId
              );
            }
          } else {
            console.error(
              "No category data or products found for:",
              categoryId
            );
          }
          setLoading(false);
        },
        (error) => {
          console.error("Error fetching product data:", error);
          setLoading(false);
        }
      );
    };

    fetchData();
  }, [categoryId, productId]);

  if (loading) return <div>Loading...</div>;
  if (!data) return <div>No data found</div>;
  const router = useRouter();
  return (
    <div className="container mx-auto h-full ">
      <div className="grid md:grid-cols-2 grid-cols-1 gap-10 bg-white p-8 rounded-2xl border-4 border-blue-950  relative ">
        <img
          src={data.image}
          alt={data.title}
          className="rounded-2xl object-cover mt-10 md:mt-0"
        />
        <div className="flex flex-col gap-6 ">
          <h1 className="text-4xl font-bold text-gray-800">{data.title}</h1>
          {/* <p className="border-2 border-blue-950 rounded-lg p-2">
            Category: {catData?.title}
            </p> */}
          <button
            class="animate-border inline-block rounded-md bg-white bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 bg-[length:400%_400%] p-1"
            onClick={() => router.push(`/${categoryId}`)}
          >
            <span class="block rounded-md bg-blue-900 px-5 py-3 font-bold text-white">
              Category:{catData?.title}
            </span>
          </button>
          <p className="text-gray-800">{data.description}</p>
        </div>
        <AddButton
          type="product"
          action="Update"
          categoryId={categoryId}
          productId={productId}
        />
        <DeleteButton
          type="product"
          categoryId={categoryId}
          productId={productId}
        />
      </div>
    </div>
  );
};

export default ProductPage;
