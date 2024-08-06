"use client";

import { db } from "@/firebase/config";
import { onValue, ref } from "firebase/database";
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
        {data?.prod?.map((product, index) => (
          <div key={index}>
            <Link href={`/${categoryId}/${product.id}`}>{product.title}</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
