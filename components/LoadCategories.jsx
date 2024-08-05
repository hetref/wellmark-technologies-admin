"use client";

import { getDataFromDatabase } from "@/actions/database";
import { db } from "@/firebase/config";
import { onValue, ref } from "firebase/database";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";

const LoadCategories = () => {
  const [data, setData] = useState(null); // Initialize as null to handle loading state
  const [loading, setLoading] = useState(true); // Loading state to manage UI before data is loaded
  const [error, setError] = useState(null); // Error state for error handling

  useEffect(() => {
    const fetchData = async () => {
      const categoryRef = ref(db, "products");
      onValue(categoryRef, (snapshot) => {
        const valData = snapshot.val();
        setData(valData);
        console.log("DATA", data);
      });
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading || !data) return <div className="">Loading...</div>;
  if (data) console.log(data);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data &&
          Object.keys(data).map((category) => (
            <Link
              href={`/${data[category].id}`}
              key={category}
              className="border-2 border-black/80 rounded"
              onClick={() => redirect(`/${data[category].id}`)}
            >
              <Image
                src={data[category].image}
                alt={data[category].title}
                width={1000}
                height={1000}
                className="w-full h-[200px] object-cover origin-center"
              />
              <div className="p-4">
                <h3 className="mb-2">{data[category].title}</h3>
                <p>{data[category].description}</p>
              </div>
              {/* <div>
                {data[category].prod.map((product) => (
                  <div key={product.id}>
                    <h4>{product.title}</h4>
                    <p>{product.description}</p>
                    <img src={product.image} alt={product.title} />
                    <a href={product.pdf} target="_blank" rel="noreferrer">
                      Download PDF
                    </a>
                  </div>
                ))}
              </div> */}
            </Link>
          ))}
      </div>
    </div>
  );
};

export default LoadCategories;
