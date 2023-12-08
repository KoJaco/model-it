"use client";

// https://upstash.com/blog/nextjs-replicate

import React, { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const response = await fetch("/api/generate", {
      method: "POST",
      body: JSON.stringify({
        prompt: inputValue,
      }),
    });
    const data = await response.json();
    console.log(data);
    setImage(data?.[0]);
    setLoading(false);
  };

  return (
    <main>
      {!image ? (
        <div className="w-1/2 space-y-2 p-10">
          <form onSubmit={handleSubmit} className="flex flex-col">
            <label className="mb-2 block text-gray-600">
              Enter your prompt
            </label>
            <input
              type="text"
              value={inputValue}
              onChange={handleOnChange}
              className="rounded-md border border-black px-2 py-1"
            />
            <button
              disabled={loading}
              type="submit"
              className="mt-4 w-max rounded-md border border-black px-4 py-1"
            >
              Submit
            </button>
          </form>
        </div>
      ) : (
        <div>
          <Image
            src={image}
            width={600}
            height={600}
            alt="Generated AI Image"
          />
        </div>
      )}
    </main>
  );
}
